import { logger } from './../utils/logger';
import axios from 'axios';
import { app } from 'electron';
import { IpcMainInvokeEvent } from 'electron';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { GpmService } from './gpm.service';
import puppeteer from 'puppeteer-core';

import { sleep } from './shopee.service';
import { GrokProfileManager } from '../manager/ProfileManager';

export class GrokService {
    private MIN_IMAGE_SIZE_KB = 50;
    private configDir: string;
    private headersDir: string;

    constructor() {
        // 1. Lấy đường dẫn AppData/Roaming/Tên-App-Của-Hoàng
        // Nếu chạy ở môi trường Dev, nó sẽ tạo folder theo tên app trong package.json
        const userDataPath = app.getPath('userData');

        // 2. Tạo folder cấu hình chung (Ví dụ: MinMinConfig)
        this.configDir = path.join(userDataPath, "configs");

        // 3. Folder riêng cho Grok Headers
        this.headersDir = path.join(this.configDir, "grok_headers");

        // Tự động tạo cây thư mục
        if (!fs.existsSync(this.headersDir)) {
            fs.mkdirSync(this.headersDir, { recursive: true });
        }

        logger.info("📂 Thư mục cấu hình tại:", this.headersDir);
    }

    async initHeaderGrok(fn: (a: string, b: string, c: string) => {}, taskId: string, grokService: GrokService, grokManager: GrokProfileManager, gpmClient: GpmService, gpmProfileId: string, port: number, delay_between: number) {
        try {

            fn(taskId, 'processing', `🔍 Đang kiểm tra Grok Profile ${gpmProfileId}`)
            let isLive = await grokService.checkHeaderLive(gpmProfileId);
            logger.info(`[initHeaderGrok] Header Live: ${isLive}`)
            if (!isLive) {
                try {
                    fn(taskId, 'processing', `🔄 Header hết hạn hoặc chưa có! Đang mở GPM để lấy lại...`)


                    await grokManager.lockProfile(gpmProfileId)
                    const startResultGPMGrok = await gpmClient.startProfile(gpmProfileId, port);

                    logger.info(`[initHeaderGrok] Kết quả bật GPM: ${JSON.stringify(startResultGPMGrok)}`)

                    if (!startResultGPMGrok.success) throw new Error(startResultGPMGrok.message);
                    if (!startResultGPMGrok?.data?.remote_debugging_port) throw new Error("Lỗi không xác định khi mở profile GPM");


                    if (startResultGPMGrok.data.remote_debugging_port) {
                        const newHeaders = await grokService.refreshGrokHeaderViaGPM(startResultGPMGrok.data.remote_debugging_port);

                        // BƯỚC 3: LƯU LẠI VÀO C:\Users\Admin\Desktop\TESTGROK\profile_X.json
                        grokService.saveNewHeaders(gpmProfileId, newHeaders);
                    }
                } catch (error) {
                }
                finally {
                    try {
                        await gpmClient.stopProfile(gpmProfileId);
                        await sleep(delay_between * 1000);
                    } catch (error) {

                    }

                    await grokManager.releaseProfile(gpmProfileId)
                }

            }
            const limitCheck = await this.checkRateLimit(gpmProfileId);
            if (limitCheck.success) {
                logger.info(`📊 Profile [${gpmProfileId}] còn ${limitCheck.remaining}/${limitCheck.total} lượt Grok.`);

                // Nếu hết lượt -> Đẩy lỗi ra ngoài luôn, không chạy nữa
                if (limitCheck.remaining <= 0) {
                    return {
                        success: false,
                        message: `Profile này đã hết lượt Grok (${limitCheck.total}/${limitCheck.total}). Vui lòng đổi Profile khác!`
                    };
                }
            } else {
                logger.warn(`⚠️ Không lấy được thông tin Rate Limit Profile [${gpmProfileId}]: ${limitCheck.message}`);
                // Vẫn cho chạy tiếp lỡ API nó dở chứng, để xuống dưới bắt lỗi 429 sau
            }



            return { success: true, message: "Đã khởi tạo thành công header grok" }
        } catch (error: any) {
            logger.error(error.message)
            return { success: false, message: error?.message ?? "[GrokService]: Khởi tạo header thất bại" }
        }


    }

    async refreshGrokHeaderViaGPM(port: number) {
        let browser: any = null;
        try {
            await new Promise(r => setTimeout(r, 5000));
            browser = await puppeteer.connect({
                browserURL: `http://127.0.0.1:${port}`,
                defaultViewport: null
            });

            const pages = await browser.pages();
            const page = pages.length > 0 ? pages[0] : await browser.newPage();

            // 1. Kích hoạt Network để trình duyệt bắt đầu ghi log (giống loggingPrefs bên Python)
            const client = await page.target().createCDPSession();
            await client.send('Network.enable');

            // 2. Tạo "Kho chứa" để gom dữ liệu (tương đương requests_data và extra_headers bên Python)
            const requestsData: any = {};
            const extraHeadersData: any = {};

            client.on('Network.requestWillBeSent', (params: { requestId: string | number; request: { url: any; method: any; headers: any; }; }) => {
                requestsData[params.requestId] = {
                    url: params.request.url,
                    method: params.request.method,
                    headers: params.request.headers
                };
            });

            client.on('Network.requestWillBeSentExtraInfo', (params: { requestId: string | number; headers: any; }) => {
                extraHeadersData[params.requestId] = params.headers;
            });

            // 3. Điều hướng và đợi (Y hệt driver.get + time.sleep(8))
            logger.info("🚀 Đang truy cập Grok...");
            await page.goto('https://grok.com/', { waitUntil: 'domcontentloaded' });

            logger.info("⏳ Chờ trang load và API calls (8 giây)...");
            await new Promise(r => setTimeout(r, 8000));

            // 4. Hàm Merge Header (Copy y xì logic merge_headers của Python)
            const mergeHeaders = (mainH: any, extraH: any) => {
                const merged: any = {};
                // Ưu tiên Extra Info trước (chứa Cookie/Auth xịn)
                if (extraH) {
                    for (const [k, v] of Object.entries(extraH)) {
                        merged[k.toLowerCase()] = v;
                    }
                }
                // Đè Main Headers lên (nếu key chưa tồn tại)
                if (mainH) {
                    for (const [k, v] of Object.entries(mainH)) {
                        const lowerK = k.toLowerCase();
                        if (!merged[lowerK]) {
                            merged[lowerK] = v;
                        }
                    }
                }
                return merged;
            };

            // 5. Duyệt kho dữ liệu để tìm đúng API "suggestions/profile"
            let finalProfileHeaders: any = null;

            for (const rid in requestsData) {
                const data = requestsData[rid];
                if (data.url.includes("suggestions/profile")) {
                    const mainH = data.headers;
                    const extraH = extraHeadersData[rid]; // Lấy extra info theo đúng requestId

                    finalProfileHeaders = mergeHeaders(mainH, extraH);

                    // Nếu tìm thấy cái có Cookie thì hốt luôn
                    if (finalProfileHeaders['cookie']) break;
                }
            }

            if (!finalProfileHeaders || Object.keys(finalProfileHeaders).length === 0) {
                throw new Error("❌ Không tìm thấy API suggestions/profile trong logs.");
            }

            logger.info(`✅ Đã trích xuất xong: ${Object.keys(finalProfileHeaders).length} keys`);
            await browser.disconnect();
            return finalProfileHeaders;

        } catch (error: any) {
            logger.error("❌ Lỗi trích xuất:", error.message);
            if (browser) await browser.disconnect();
            throw error;
        }
    }

    async checkHeaderLive(profileId: string): Promise<boolean> {
        try {
            const headers = this.getHeadersFromLocal(profileId);
            if (!headers) return false;

            const res = await axios.get("https://grok.com/rest/suggestions/profile", {
                headers,
                timeout: 5000
            });
            return res.status === 200;
        } catch (error) {
            return false;
        }
    }

    /**
     * LẤY HEADERS TỪ FILE LOCAL
     */
    getHeadersFromLocal(profileId: string): any {
        const filePath = path.join(this.headersDir, `profile_${profileId}.json`);
        if (!fs.existsSync(filePath)) return null;
        try {
            const rawHeaders = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            const cleanHeaders: any = {};

            for (const key in rawHeaders) {
                // 🛡️ CHỖ NÀY QUAN TRỌNG: 
                // Nếu key bắt đầu bằng ":" thì bỏ qua, axios sẽ tự điền lại (authority, method, path...)
                if (!key.startsWith(':')) {
                    cleanHeaders[key.toLowerCase()] = rawHeaders[key];
                }
            }

            // Đảm bảo có x-xai-request-id mới cho mỗi lần gọi
            cleanHeaders['x-xai-request-id'] = uuidv4();


            return cleanHeaders;
        } catch {
            return null;
        }
    }
    private getDefaultHeaders(): any {
        return {
            "accept": "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            "origin": "https://grok.com",
            "referer": "https://grok.com/",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
            "x-xai-request-id": uuidv4()
        };
    }
    private buildRequestHeaders(profileId: string): any {
        // 1. Lấy raw headers từ file JSON (đã lưu từ GPM)
        const rawHeaders = this.getHeadersFromLocal(profileId);

        if (!rawHeaders) {
            logger.warn(`⚠️ Không tìm thấy raw headers cho Profile ${profileId}, dùng default.`);
            return this.getDefaultHeaders();
        }

        const requestHeaders: any = {};

        // 2. Vòng lặp lọc Key (Giống đoạn: for key, value in raw_headers.items())
        for (const key in rawHeaders) {
            // Bỏ qua các pseudo-headers bắt đầu bằng dấu ":" (Giống: if key.startswith(':'))
            if (key.startsWith(':')) {
                continue;
            }
            // Ép key về chữ thường (Giống: request_headers[key.lower()] = value)
            requestHeaders[key.toLowerCase()] = rawHeaders[key];
        }

        // 3. Ép thêm các headers bắt buộc (Giống các block if '...' not in request_headers)
        if (!requestHeaders['content-type']) {
            requestHeaders['content-type'] = 'application/json';
        }

        if (!requestHeaders['origin']) {
            requestHeaders['origin'] = 'https://grok.com';
        }

        // 4. Tạo ID request mới (Giống: request_headers['x-xai-request-id'] = str(uuid.uuid4()))
        requestHeaders['x-xai-request-id'] = uuidv4();

        return requestHeaders;
    }

    saveNewHeaders(profileId: string, headers: any) {
        const filePath = path.join(this.headersDir, `profile_${profileId}.json`);
        fs.writeFileSync(filePath, JSON.stringify(headers, null, 2));
        logger.info(`✅ Đã lưu Header mới cho Profile ${profileId}`);
    }

    /**
     * HÀM CHÍNH TẠO ẢNH (DÙNG CHO TASK)
     */
    /**
     * HÀM CHÍNH TẠO ẢNH (DÙNG CHO TASK VÀ TẠO NHÂN VẬT)
     * Hỗ trợ 2 Mode:
     * - Mode 1: Truyền productImagePath -> Image-to-Image (Vẽ dựa trên ảnh gốc)
     * - Mode 2: Truyền productImagePath = "" -> Text-to-Image (Chỉ vẽ từ Prompt)
     */
    async generateReviewVideoImage(_fn: (a: string, b: string, c: string) => {}, userPrompt: string, productImagePath: string | null, profileId: string, outputFolder: string, isUseCharacter: boolean, imgPathCharacter: string, taskId: string) {
        try {
            const headers = this.buildRequestHeaders(profileId);
            if (!headers) throw new Error("Header trống, cần refresh qua GPM");

            let fileUris: string[] = [];


            let postId: string | null = null;

            if (isUseCharacter && fs.existsSync(imgPathCharacter)) {
                const uploadHeaders = { ...headers, 'x-xai-request-id': uuidv4() };
                logger.info(`[generateReviewVideoImage]: Upload ảnh ${imgPathCharacter}`)
                const uploadRes = await this.uploadImage(imgPathCharacter, uploadHeaders);
                if (!uploadRes?.fileUri) {
                    return { success: false, message: "Upload ảnh không thành công" };
                }

                fileUris.push(uploadRes.fileUri);
            }
            // ==========================================
            // KỊCH BẢN 1: CÓ ẢNH SẢN PHẨM (Upload trước)
            // ==========================================
            if (productImagePath && productImagePath.trim() !== "") {
                const uploadHeaders = { ...headers, 'x-xai-request-id': uuidv4() };
                logger.info(`[generateReviewVideoImage]: Upload ảnh ${productImagePath}`)
                const uploadRes = await this.uploadImage(productImagePath, uploadHeaders);

                if (!uploadRes?.fileUri) {
                    return { success: false, message: "Upload ảnh không thành công" };
                }

                fileUris.push(uploadRes.fileUri);



            }

            
            const postHeaders = { ...headers, 'x-xai-request-id': uuidv4() };
            // Tạo post kèm ảnh
            postId = await this.createMediaPost(userPrompt, "", postHeaders);
            if (!postId) return { success: false, message: "Tạo post thất bại" };

            // 3. Gửi request vẽ ảnh (Imagine Mode)
            const editImgHeaders = { ...headers, 'x-xai-request-id': uuidv4() };
            // Bắn list fileUris (có thể chứa 1 ảnh, hoặc là mảng rỗng [])
            logger.info(`[generateReviewVideoImage]: Prompt ảnh ${userPrompt}`)

            const responseImg = await this.sendImageEditRequest(userPrompt, fileUris, postId, editImgHeaders);

            if (!responseImg.success) {
                if (responseImg?.error == 429) {
                    return { success: false, message: "Rate limit grok" };
                } else {
                    return { success: false, message: "Lỗi KXD" };
                }
            }

            const imageUrls = responseImg?.data || [];
            if (!imageUrls || imageUrls.length === 0) return { success: false, message: "Grok Không trả về ảnh" };

            // 4. Tải ảnh tốt nhất
            logger.info(`[generateReviewVideoImage] Ảnh grok đã vẽ`, imageUrls)
            const finalPath = await this.downloadBestImage(imageUrls, taskId, profileId, outputFolder);
            if (!finalPath) {
                return { success: false, message: "Không tìm thấy image" };
            }

            return { success: true, filePath: finalPath };

        } catch (error: any) {
            logger.info(error.message);
            return { success: false, message: error.message };
        }
    }


    private async uploadImage(filePath: string, headers: any): Promise<{ fileMetadataId: string, fileUri: string } | null> {
        try {
            const fileName = path.basename(filePath);
            const extension = path.extname(filePath).toLowerCase();

            const mimeMap: { [key: string]: string } = {
                ".jpg": "image/jpeg",
                ".jpeg": "image/jpeg",
                ".png": "image/png",
                ".webp": "image/webp"
            };
            const mimeType = mimeMap[extension] || "image/jpeg";

            // 1. Encode sang Base64
            const b64Content = fs.readFileSync(filePath, { encoding: 'base64' });

            // 2. Payload (Thêm trường fileSource cho chắc bài)
            const payload = {
                "fileName": fileName,
                "fileMimeType": mimeType,
                "content": b64Content,
                "fileSource": "IMAGINE_SELF_UPLOAD_FILE_SOURCE"
            };

            const url = "https://grok.com/rest/app-chat/upload-file";

            const resp = await axios.post(url, payload, {
                headers: headers,
                timeout: 60000 // Tăng timeout lên 1 phút cho ảnh nặng
            });

            if (resp.status === 200) {
                const { fileMetadataId, fileUri } = resp.data;

                if (fileMetadataId && fileUri) {
                    logger.info(`✅ Upload thành công! ID: ${fileMetadataId}`);
                    return { fileMetadataId, fileUri };
                }
            }

            return null;
        } catch (error: any) {
            logger.error("❌ Lỗi upload_image:", error.response?.data || error.message);
            return null;
        }
    }


    private async createMediaPost(prompt: string, fileUri: string, headers: any): Promise<string | null> {
        try {
            const url = "https://grok.com/rest/media/post/create";

            // 🛡️ ĐÂY LÀ CHỖ QUAN TRỌNG: 
            // Thêm trường "mediaUrl" lấy từ kết quả của bước uploadImage
            let payload = null
            if (fileUri && fileUri != "") {
                payload = {
                    "mediaType": "MEDIA_POST_TYPE_IMAGE",
                    "prompt": prompt,
                    "mediaUrl": `https://assets.grok.com/${fileUri}` // Ghép đúng format assets của Grok
                }
            } else {
                payload = {
                    "mediaType": "MEDIA_POST_TYPE_IMAGE",
                    "prompt": prompt,

                };
            }




            const resp = await axios.post(url, payload, {
                headers: headers,
                timeout: 25000
            });

            if (resp.status === 200 || resp.status === 201) {
                const data = resp.data;
                let postId: string | null = null;

                if (data && typeof data === 'object') {
                    if (data.id) {
                        postId = data.id;
                    } else if (data.post && typeof data.post === 'object') {
                        postId = data.post.id;
                    }
                }

                if (postId) {
                    logger.info(`✅ Đã tạo Media Post thành công với ảnh SP: ${postId}`);
                    return postId;
                }
            }

            return null;
        } catch (error: any) {
            // Log chi tiết lỗi để ông dễ soi
            logger.error("❌ Lỗi create_media_post:", error.response?.data || error.message);
            return null;
        }
    }

    async checkRateLimit(profileId: string, modelName: "auto" | "fast" | "grok-3" | string = 'auto') {
        try {
            const headers = this.buildRequestHeaders(profileId);
            if (!headers) return { success: false, message: "Header trống" };

            // Thêm header cần thiết cho request này
            const reqHeaders = {
                ...headers,
                'accept': '*/*',
                'content-type': 'text/plain;charset=UTF-8',
            };

            const payload = { modelName };

            const response = await axios.post('https://grok.com/rest/rate-limits', payload, {
                headers: reqHeaders,
                timeout: 10000 // Chờ tối đa 10s
            });

            if (response.data && typeof response.data.remainingQueries !== 'undefined') {
                return {
                    success: true,
                    remaining: response.data.remainingQueries,
                    total: response.data.totalQueries,
                    window: response.data.windowSizeSeconds
                };
            }
            return { success: false, message: "Cấu trúc trả về không đúng" };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

    private async sendImageEditRequest(prompt: string, fileUris: string[], postId: string, headers: any): Promise<any> {
        logger.info(`[sendImageEditRequest] Tạo ảnh từ ${fileUris.length} ảnh sau`, fileUris)
        const url = "https://grok.com/rest/app-chat/conversations/new";
        let payload = null
        if (fileUris.length > 0) {
            payload = {
                temporary: true,
                message: prompt,
                modelName: "imagine-image-edit",
                enableImageGeneration: true,
                returnImageBytes: false,
                returnRawGrokInXaiRequest: false,
                enableImageStreaming: true,
                imageGenerationCount: 2,
                forceConcise: false,
                enableSideBySide: true,
                sendFinalMetadata: true,
                isReasoning: false,
                disableTextFollowUps: true,
                responseMetadata: {
                    modelConfigOverride: {
                        modelMap: {
                            imageEditModelConfig: {
                                imageReferences: fileUris.map(uri => `https://assets.grok.com/${uri}`),
                                parentPostId: postId
                            },
                            imageEditModel: "imagine"
                        }
                    }
                },
                disableMemory: false,

            };
        } else {
            payload = {
                temporary: true, // Nhớ để true cho bot chạy, đỡ lưu rác vào acc
                message: prompt,
                fileAttachments: [],
                imageAttachments: [],
                disableSearch: true,
                toolOverrides: {
                    imageGen: true,
                    search: false,
                    imageSearch: false,
                    xSearch: false
                },
                enableImageGeneration: true,
                returnImageBytes: false,
                returnRawGrokInXaiRequest: false,
                enableImageStreaming: true,
                imageGenerationCount: 1, // Muốn tạo 2 ảnh 1 lúc thì sửa thành 2
                forceConcise: false,
                enableSideBySide: true,
                sendFinalMetadata: true,
                disableTextFollowUps: true, // Để true cho API nhẹ
                responseMetadata: {},
                disableMemory: false,
                forceSideBySide: false,
                isAsyncChat: false,
                disableSelfHarmShortCircuit: false,
                collectionIds: [],
                connectors: [],
                deviceEnvInfo: {
                    darkModeEnabled: true,
                    devicePixelRatio: 1,
                    screenWidth: 1920,
                    screenHeight: 1080,
                    viewportWidth: 1209,
                    viewportHeight: 953
                },
                modeId: "auto" // 🎯 CHÌA KHÓA SỐNG CÒN LÀ ĐÂY
            };
        }





        try {
            const response = await axios.post(url, payload, {
                headers,
                responseType: 'stream',
                timeout: 180000
            });

            const ImageUrls = new Promise<string[]>((resolve, reject) => {
                let buffer = '';
                let rawStreamData = ''; // 🎯 TẠO BIẾN NÀY ĐỂ GHI LẠI TOÀN BỘ LOG TỪ ĐẦU ĐẾN CUỐI
                const imageUrls: string[] = [];

                response.data.on('data', (chunk: Buffer) => {
                    const chunkStr = chunk.toString('utf-8');
                    buffer += chunkStr;
                    rawStreamData += chunkStr; // Chép y nguyên data thô vào đây để dành

                    let lines = buffer.split('\n');
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        if (!line.trim()) continue;

                        // 🎯 VÉT CẠN BẰNG REGEX
                        const matches = line.matchAll(/\\?"imageUrl\\?"\s*:\s*\\?"([^"\\]+)/g);
                        for (const match of matches) {
                            let imgUrl = match[1];
                            if (!imgUrl.startsWith('http')) imgUrl = `https://assets.grok.com/${imgUrl}`;
                            if (!imageUrls.includes(imgUrl)) imageUrls.push(imgUrl);
                        }

                        // 🎯 BẮT TRƯỜNG HỢP ARRAY TRUYỀN THỐNG
                        try {
                            const data = JSON.parse(line);
                            const responseData = data?.result?.response;
                            if (!responseData) continue;

                            const extraUrls = responseData.imageEditResponse?.imageUrls || responseData.generatedImageUrls || [];
                            extraUrls.forEach((url: string) => {
                                if (url && !imageUrls.includes(url)) imageUrls.push(url);
                            });
                        } catch (e) {
                            // Kệ JSON rách
                        }
                    }
                });

                response.data.on('end', () => {
                    if (buffer.trim()) {
                        const matches = buffer.matchAll(/\\?"imageUrl\\?"\s*:\s*\\?"([^"\\]+)/g);
                        for (const match of matches) {
                            let imgUrl = match[1];
                            if (!imgUrl.startsWith('http')) imgUrl = `https://assets.grok.com/${imgUrl}`;
                            if (!imageUrls.includes(imgUrl)) imageUrls.push(imgUrl);
                        }
                    }

                    /* // ==========================================
                    // 🎯 LƯU LOG NẾU LỖI (KHÔNG TÌM THẤY LINK NÀO)
                    // ==========================================
                    if (imageUrls.length === 0) {
                        try {
                            // Tạo tên file đính kèm timestamp để không bị trùng
                            const errorFileName = `grok_missed_url_${Date.now()}.txt`;

                            // Lưu thẳng ra thư mục của project (hoặc nhét vào output_folder tùy ông)
                            const errorFilePath = path.join("C:\\Users\\Admin\\Desktop", errorFileName);

                            // Ghi toàn bộ raw data ra file
                            import('fs').then(fs => {
                                fs.writeFileSync(errorFilePath, rawStreamData, 'utf-8');
                            });

                            logger.error(`🚨 Báo động: Không tìm thấy link ảnh nào! Đã lưu log tại: ${errorFilePath}`);
                        } catch (err) {
                            logger.error(`❌ Lỗi khi ghi file log:`, err);
                        }
                    } else {
                        logger.info(`🎨 Vét cạn được tổng cộng ${imageUrls.length} link ảnh.`);
                    } */

                    resolve(imageUrls);
                });

                response.data.on('error', (err: any) => reject(err));
            });

            return { success: true, data: await ImageUrls }
        } catch (error: any) {
            const errData = (typeof error.response?.data === 'string'
                ? error.response.data
                : JSON.stringify(error.response?.data || "")).toLowerCase();

            const errMsg = (error.message || "").toLowerCase();
            const isRateLimit = error.response?.status === 429 ||
                errData.includes("too many request") ||
                errMsg.includes("too many request");

            if (isRateLimit) {
                logger.warn("🛑 Quá tải request (Too many requests) - Đang xử lý...");

                return { success: false, data: [], error: 429 };
            }
            logger.error("❌ Lỗi sendImageEditRequest:", error.response?.data || error.message);
            return { success: false, data: [], error: 500 };


        }
    }
    private buildDownloadHeaders(profileId: string): any {
        const cookie = this.parseCookieFromFile(profileId);
        const headers: any = {
            "accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "vi,en-US;q=0.9,en;q=0.8",
            "priority": "u=1, i",
            "referer": "https://grok.com/",
            "sec-ch-ua": '"Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "image",
            "sec-fetch-mode": "no-cors",
            "sec-fetch-site": "same-site",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36"
        };

        if (cookie) {
            headers["cookie"] = cookie;
        }
        return headers;
    }
    private parseCookieFromFile(profileId: string): string {
        // Nếu ông lưu dạng JSON (như anh em mình làm ở trên) thì bốc trực tiếp
        const jsonPath = path.join(this.headersDir, `profile_${profileId}.json`);

        if (fs.existsSync(jsonPath)) {
            const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
            return data.cookie || "";
        }
        return "";
    }

    async downloadBestImage(imageUrls: string[], taskId: number | string, profileId: string, outputFolder: string): Promise<string | null> {
        if (!imageUrls || imageUrls.length === 0) return null;

        const downloadHeaders = this.buildDownloadHeaders(profileId);

        // 1. Tạo biến để lưu trữ "ứng cử viên" nặng ký nhất
        let bestContent: Buffer | null = null;
        let maxSizeKb = -1;

        logger.info(`🔍 Đang quét ${imageUrls.length} ảnh để tìm tấm chất lượng nhất...`);

        for (const url of imageUrls) {
            try {
                // 2. Check size từng tấm
                const { content, sizeKb } = await this.checkImageSize(url, downloadHeaders);

                if (!content) continue;

                // 3. So sánh: Nếu tấm này nặng hơn tấm nặng nhất hiện tại -> cập nhật
                if (sizeKb > maxSizeKb) {
                    maxSizeKb = sizeKb;
                    bestContent = content;
                    logger.info(`📸 Tìm thấy ảnh tốt hơn: ${sizeKb.toFixed(2)} KB`);
                }
            } catch (error) {
                logger.error(`❌ Lỗi khi check ảnh ${url}:`, error);
            }
        }

        // 4. Sau khi duyệt hết, nếu tìm được tấm ảnh đạt chuẩn (vượt qua MIN_SIZE nếu cần)
        if (bestContent && maxSizeKb >= this.MIN_IMAGE_SIZE_KB) {
            if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder, { recursive: true });

            const fileName = `grok_best_${taskId}_${Date.now()}.png`;
            const finalPath = path.join(outputFolder, fileName);

            // 5. Lúc này mới thực sự ghi file tấm xịn nhất xuống ổ cứng
            fs.writeFileSync(finalPath, bestContent);
            logger.info(`✅ Đã chọn tấm ảnh "khủng" nhất: ${finalPath} (${maxSizeKb.toFixed(2)} KB)`);

            return finalPath;
        }

        logger.info("⚠️ Không tìm thấy ảnh nào đủ chất lượng.");
        return null;
    }

    async downloadImageForPrompt(imageUrls: string[], taskId: number | string, profileId: string, outputFolder: string): Promise<string | null> {
        if (!imageUrls || imageUrls.length === 0) return null;

        // 1. Build bộ header tải ảnh (Có Cookie từ GPM để tránh 403)
        const downloadHeaders = this.buildDownloadHeaders(profileId);

        for (const url of imageUrls) {
            // 2. Kiểm tra chất lượng ảnh (Học theo check_image_size)
            const { content, sizeKb } = await this.checkImageSize(url, downloadHeaders);

            // 3. Nếu không có nội dung -> bỏ qua (if content is None)
            if (!content) {
                continue;
            }

            // 4. Nếu ảnh quá bé -> bỏ qua (if size_kb < MIN_IMAGE_SIZE_KB)
            if (sizeKb < this.MIN_IMAGE_SIZE_KB) { // Giả sử MIN_IMAGE_SIZE_KB = 50
                logger.info(`⚠️ Bỏ qua ảnh chất lượng thấp: ${sizeKb.toFixed(2)} KB`);
                continue;
            }

            // 5. Lưu ảnh (Học theo save_image_by_prompt_id)
            if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder, { recursive: true });

            const fileName = `grok_res_${taskId}_${Date.now()}.png`;
            const finalPath = path.join(outputFolder, fileName);

            fs.writeFileSync(finalPath, content);
            logger.info(`✅ Đã tải và lưu ảnh thành công: ${finalPath} (${sizeKb.toFixed(2)} KB)`);

            return finalPath; // Trả về đường dẫn ngay khi tải được 1 tấm ngon
        }

        return null;
    }
    private async checkImageSize(url: string, headers: any): Promise<{ content: Buffer | null, sizeKb: number }> {
        const fullUrl = url.startsWith("http") ? url : `https://assets.grok.com/${url}`;
        try {
            const response = await axios.get(fullUrl, {
                headers: headers,
                responseType: 'arraybuffer', // Lấy dữ liệu thô (Buffer)
                timeout: 60000
            });

            if (response.status === 200) {
                const contentType = (response.headers['content-type'] || '').toLowerCase();
                const content = Buffer.from(response.data);
                const sizeKb = content.length / 1024;

                // Logic giống Python: Nếu không phải image và dung lượng quá nhỏ (< 1000 bytes) -> File rác
                if (!contentType.includes('image') && content.length < 1000) {
                    return { content: null, sizeKb: 0 };
                }

                return { content, sizeKb };
            } else {
                return { content: null, sizeKb: 0 };
            }
        } catch (error) {
            return { content: null, sizeKb: 0 };
        }
    }


    async createVideoForPromptCore(
        _event: IpcMainInvokeEvent,
        prompt: any,
        taskId: string,
        prompt_video: string,
        outputDir: string,
        profileNum: number = 1,
        profileId: string,
        imagePath: string | null = null,
        outputCount: number,
        isUseVbee: boolean = false,
        isUseVoice: boolean,
        retryStep: any
    ) {
        const sendLog = (msg: string) => {
            logger.info(`[P${profileId}] ${msg}`);
            _event.sender.send('video:task-log', { status: 'processing', message: msg, taskId });
        };
        const headers = this.buildRequestHeaders(profileId);

        const result: any = {
            prompt, taskId: taskId, profile: profileNum,
            success: false, error: null, filename: null,
            post_id: null, video_url: null, is_429: false
        };

        sendLog(`[P${profileId}] VIDEO ${taskId}: ...`);

        try {
            let fileMetadataId = null;
            let fileUri = null;



            // BƯỚC 0: Xử lý và Upload ảnh (Nếu có)
            if (imagePath && fs.existsSync(imagePath)) {
                sendLog(`[P${profileId}] Bước 0: Upload ảnh AI đã tạo`);
                const uploadRes = await this.uploadImage(imagePath, { ...headers, "x-xai-request-id": uuidv4() });
                if (uploadRes) {
                    fileUri = uploadRes.fileUri;
                    fileMetadataId = uploadRes.fileMetadataId;
                }
            }

            // BƯỚC 1: Tạo media post (Học theo logic Python)


            sendLog(`[P${profileId}] Tạo media post...`);



            const visualPart1 = prompt[0]?.visual_prompt ?? "";
            const voicePart1 = (!isUseVoice || isUseVbee) ? "Video hoặc Nhân vật không cần nói chuyện tôi sẽ lồng tiếng sau" : ` \n Voice_content: ${prompt[0]?.voice_content ?? ""}`;
            const promptGenVideo1 = `${prompt_video} \n Visual: ${visualPart1}${voicePart1}`;

            const payload1 = fileUri
                ? { "mediaType": "MEDIA_POST_TYPE_IMAGE", "mediaUrl": `https://assets.grok.com/${fileUri}` }
                : { "mediaType": "MEDIA_POST_TYPE_VIDEO", "prompt": promptGenVideo1 };

            const res1 = await axios.post("https://grok.com/rest/media/post/create", payload1, {
                headers: { ...headers, "x-xai-request-id": uuidv4() },
                timeout: 30000,
                // Ép trả về text nếu JSON parse lỗi
                responseType: 'text'
            });

            let postId = null;

            try {
                // Ép kiểu về JSON nếu res1.data là string
                const responseData = typeof res1.data === 'string' ? JSON.parse(res1.data) : res1.data;

                // 🎯 CHIÊU QUYẾT ĐỊNH: Soi đúng chỗ Grok giấu ID
                if (responseData.post && responseData.post.id) {
                    postId = responseData.post.id;
                } else if (responseData.id) {
                    postId = responseData.id;
                }
            } catch (e) {
                // 🛡️ Dùng Regex dự phòng (Regex này tôi đã sửa để bắt được "post":{"id":"...")
                const match = res1.data.match(/"id"\s*:\s*"([a-f0-9\-]{36})"/);
                if (match) {
                    postId = match[1];
                }
            }

            if (!postId) {
                sendLog("Không tìm thấy postId");
                throw new Error("Không tìm thấy post_id trong phản hồi từ Grok");
            }

            result.post_id = postId;
            // BƯỚC 2: Tạo video (Sử dụng Stream để bóc Url)
            sendLog(`[P${profileId}] Bước 2: Tạo video (đợi render)...`);

            let currentVideoUrl = "";
            let currentVideoId = "";
            const payloadVideoPart1 = {
                "temporary": true, "modelName": "grok-3",
                "message": fileUri ? `https://assets.grok.com/${fileUri} ${promptGenVideo1} --mode=custom` : `${promptGenVideo1} --mode=custom`,
                "fileAttachments": fileMetadataId ? [fileMetadataId] : [],
                "toolOverrides": { "videoGen": true },
                "enableSideBySide": true,
                "responseMetadata": {
                    "modelConfigOverride": { "modelMap": { "videoGenModelConfig": { "parentPostId": fileMetadataId || postId, "aspectRatio": "9:16", "videoLength": 10, "resolutionName": "720p" } } }
                }
            }
            await retryStep(async () => {

                _event.sender.send('video:task-log', { status: 'processing', message: `Tạo 0-10s đầu`, taskId });
                const res = await axios.post("https://grok.com/rest/app-chat/conversations/new", payloadVideoPart1, { headers: { ...headers, "x-xai-request-id": uuidv4() }, responseType: 'stream', timeout: 180000 });

                const info = await this.parseVideoInfo(res, logger);

                currentVideoUrl = info.videoUrlPath;
                currentVideoId = info.videoId;
                if (!currentVideoUrl) throw new Error("Đoạn 1 lỗi: Không có URL");
                _event.sender.send('video:task-log', {
                    status: 'processing',
                    message: `Tạo xong 10s`,
                    data: { resultVideoCount: 1 },
                    taskId
                });


            }, "Đoạn 1", taskId, 3);



            if (outputCount > 1) {
                const visualPart2 = prompt[1]?.visual_prompt ?? "";
                const voicePart2 = !isUseVbee ? ` \n Voice_content: ${prompt[1]?.voice_content ?? ""}` : "Nhân vật không cần nói chuyện tôi sẽ lồng tiếng sau";
                const promptGenVideo2 = `${prompt_video} \n Visual: ${visualPart2}${voicePart2}`;
                const payloadVideoPart2 = {
                    ...payloadVideoPart1,
                    "message": promptGenVideo2,
                    "responseMetadata": {
                        "modelConfigOverride": {
                            "modelMap": {
                                "videoGenModelConfig": {
                                    "aspectRatio": "9:16",
                                    "videoLength": 10,
                                    "resolutionName": "720p",
                                    "extendPostId": currentVideoId,
                                    "isVideoEdit": false,
                                    "isVideoExtension": true,
                                    "mode": "custom",
                                    "originalPostId": currentVideoId,
                                    "originalPrompt": promptGenVideo2,
                                    "originalRefType": "ORIGINAL_REF_TYPE_VIDEO_EXTENSION",
                                    "parentPostId": currentVideoId,
                                    "stitchWithExtendPostId": true,
                                    "videoExtensionStartTime": 10.031667


                                }
                            }
                        }
                    }

                }
                // BƯỚC 3: EXTEND VIDEO
                try {

                    await retryStep(async () => {
                        _event.sender.send('video:task-log', {
                            status: 'processing',
                            message: `Tạo đoạn 10-20 giây của video`,
                            taskId
                        });
                        const res = await axios.post("https://grok.com/rest/app-chat/conversations/new", payloadVideoPart2, { headers: { ...headers, "x-xai-request-id": uuidv4() }, responseType: 'stream', timeout: 180000 });

                        const info = await this.parseVideoInfo(res, logger);
                        currentVideoUrl = info.videoUrlPath; // Cập nhật URL mới nếu thành công
                        currentVideoId = info.videoId;
                        _event.sender.send('video:task-log', {
                            status: 'processing',
                            message: `Tạo xong 20s`,
                            data: { resultVideoCount: 2 },
                            taskId
                        });

                    }, "Đoạn 2", taskId, 3);

                    if (outputCount > 2) {
                        try {
                            const visualPart3 = prompt[2]?.visual_prompt ?? "";
                            const voicePart3 = !isUseVbee ? ` \n Voice_content: ${prompt[2]?.voice_content ?? ""}` : "Nhân vật không cần nói chuyện tôi sẽ lồng tiếng sau";
                            const promptGenVideo2 = `${prompt_video} \n Visual: ${visualPart3}${voicePart3}`;
                            const payloadVideoPart3 = {
                                ...payloadVideoPart2,
                                "message": promptGenVideo2,
                                "responseMetadata": {
                                    "modelConfigOverride": {
                                        "modelMap": {
                                            "videoGenModelConfig": {
                                                "aspectRatio": "9:16",
                                                "videoLength": 10,
                                                "resolutionName": "720p",
                                                "extendPostId": currentVideoId,
                                                "isVideoEdit": false,
                                                "isVideoExtension": true,
                                                "mode": "custom",
                                                "originalPostId": currentVideoId,
                                                "originalPrompt": promptGenVideo2,
                                                "originalRefType": "ORIGINAL_REF_TYPE_VIDEO_EXTENSION",
                                                "parentPostId": currentVideoId,
                                                "stitchWithExtendPostId": true,
                                                "videoExtensionStartTime": 20


                                            }
                                        }
                                    }
                                }

                            }
                            await retryStep(async () => {
                                _event.sender.send('video:task-log', { status: 'processing', message: `Tạo 20-30s`, taskId });
                                const res = await axios.post("https://grok.com/rest/app-chat/conversations/new", payloadVideoPart3, { headers: { ...headers, "x-xai-request-id": uuidv4() }, responseType: 'stream', timeout: 180000 });

                                const info = await this.parseVideoInfo(res, logger);
                                currentVideoUrl = info.videoUrlPath;
                                currentVideoId = info.videoId;
                                _event.sender.send('video:task-log', {
                                    status: 'processing',
                                    message: `Tạo xong 30s`,
                                    data: { resultVideoCount: 3 },
                                    taskId
                                });
                            }, "Đoạn 3", taskId, 3);
                        } catch (e) {
                            logger.error("⚠️ Đoạn 3 lỗi sau 3 lần thử, lấy kết quả đoạn 2");
                        }
                    }



                } catch (error) {
                    logger.error("⚠️ Đoạn 2 lỗi sau 3 lần thử, lấy kết quả đoạn 1");
                }
            }

            // BƯỚC 4: Download video
            const downloadHeaders = this.buildDownloadHeaders(profileId);
            sendLog(`[P${profileId}] Bước 3: Download video...`);
            const downloadUrl = `https://assets.grok.com/${currentVideoUrl}?cache=1&dl=1`;
            const finalFilePathVideo = path.join(outputDir, `video_${taskId}_${Date.now()}.mp4`);

            const res3 = await axios.get(downloadUrl, {
                headers: downloadHeaders,
                responseType: 'arraybuffer',
                timeout: 120000
            });

            fs.writeFileSync(finalFilePathVideo, res3.data);
            sendLog(`✅ [P${profileId}] Tải xong video: ${path.basename(finalFilePathVideo)}`);

            result.success = true;
            result.filePathVideo = finalFilePathVideo;

        } catch (error: any) {
            logger.error(error.message)
            result.error = error.response?.status === 429 ? "Rate Limit 429" : error.message;
            result.is_429 = error.response?.status === 429;
            logger.error(`❌ [P${profileId}] Lỗi: ${result.error}`);
        }

        return result;
    }

    private async parseVideoInfo(res: any, logger: any): Promise<{ videoUrlPath: string; videoId: string }> {
        let videoUrlPath = "";
        let videoId = "";
        logger.info("parseVideoInfo")
        return new Promise((resolve, reject) => {
            res.data.on('data', (chunk: Buffer) => {
                const line = chunk.toString();
                const matchUrl = line.match(/"videoUrl"\s*:\s*"([^"]+)"/);
                if (matchUrl) videoUrlPath = matchUrl[1];

                const matchId = line.match(/"videoId"\s*:\s*"([^"]+)"/);
                if (matchId) videoId = matchId[1];

                if (!videoId) {
                    const matchAlt = line.match(/"id"\s*:\s*"([a-f0-9\-]{36})"/);
                    if (matchAlt) videoId = matchAlt[1];
                }
            });
            res.data.on('end', () => resolve({ videoUrlPath, videoId }));
            res.data.on('error', reject);
        });
    }


}


