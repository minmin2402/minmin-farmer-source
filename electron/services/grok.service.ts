import axios from 'axios';
import { IpcMainInvokeEvent } from 'electron';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { GpmService } from './gpm.service';
import puppeteer from 'puppeteer-core';

export class GrokService {
    private headersDir: string = "C:\\Users\\Admin\\Desktop\\TESTGROK";
    private MIN_IMAGE_SIZE_KB = 50;

    constructor() {
        // Tạo thư mục lưu trữ nếu chưa có
        if (!fs.existsSync(this.headersDir)) {
            fs.mkdirSync(this.headersDir, { recursive: true });
        }
    }

    async initHeaderGrok(_event: IpcMainInvokeEvent, profileNum: number, taskId: string, grokService: GrokService, gpmClient: GpmService, gpmProfileId: string, port: number) {
        try {
            _event.sender.send('video:task-log', {
                status: 'processing',
                message: `🔍 Đang kiểm tra Grok Profile ${profileNum}`,
                taskId: taskId
            });
            let isLive = await grokService.checkHeaderLive(profileNum);
            if (!isLive) {
                _event.sender.send('video:task-log', {
                    status: 'processing',
                    message: `🔄 Header hết hạn hoặc chưa có! Đang mở GPM để lấy lại...`,
                    taskId: taskId
                });
                const startResultGPMGrok = await gpmClient.startProfile(gpmProfileId, port);
                if (!startResultGPMGrok.success) throw new Error(startResultGPMGrok.message);

                if (startResultGPMGrok.data.remote_debugging_port) {
                    const newHeaders = await grokService.refreshGrokHeaderViaGPM(startResultGPMGrok.data.remote_debugging_port);

                    // BƯỚC 3: LƯU LẠI VÀO C:\Users\Admin\Desktop\TESTGROK\profile_X.json
                    grokService.saveNewHeaders(profileNum, newHeaders);
                }

            }
            await gpmClient.stopProfile(gpmProfileId);
            return { success: true, message: "Đã khởi tạo thành công header grok" }
        } catch (error: any) {
            await gpmClient.stopProfile(gpmProfileId);
            return { success: true, message: error?.message ?? "[GrokService]: Khởi tạo header thất bại" }
        }


    }

    async refreshGrokHeaderViaGPM(port: number) {
        let browser: any = null;
        try {
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
            console.log("🚀 Đang truy cập Grok...");
            await page.goto('https://grok.com/', { waitUntil: 'domcontentloaded' });

            console.log("⏳ Chờ trang load và API calls (8 giây)...");
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

            console.log(`✅ Đã trích xuất xong: ${Object.keys(finalProfileHeaders).length} keys`);
            await browser.disconnect();
            return finalProfileHeaders;

        } catch (error: any) {
            console.error("❌ Lỗi trích xuất:", error.message);
            if (browser) await browser.disconnect();
            throw error;
        }
    }

    async checkHeaderLive(profileNum: number): Promise<boolean> {
        try {
            const headers = this.getHeadersFromLocal(profileNum);
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
    getHeadersFromLocal(profileNum: number): any {
        const filePath = path.join(this.headersDir, `profile_${profileNum}.json`);
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
    private buildRequestHeaders(profileNum: number): any {
        // 1. Lấy raw headers từ file JSON (đã lưu từ GPM)
        const rawHeaders = this.getHeadersFromLocal(profileNum);

        if (!rawHeaders) {
            console.warn(`⚠️ Không tìm thấy raw headers cho Profile ${profileNum}, dùng default.`);
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

    saveNewHeaders(profileNum: number, headers: any) {
        const filePath = path.join(this.headersDir, `profile_${profileNum}.json`);
        fs.writeFileSync(filePath, JSON.stringify(headers, null, 2));
        console.log(`✅ Đã lưu Header mới cho Profile ${profileNum}`);
    }

    /**
     * HÀM CHÍNH TẠO ẢNH (DÙNG CHO TASK)
     */
    async generateReviewVideoImage(userPrompt: string, productImagePath: string, profileNum: number, outputFolder: string, taskId: string) {
        try {
            const headers = this.buildRequestHeaders(profileNum);
            if (!headers) throw new Error("Header trống, cần refresh qua GPM");

            // 1. Upload ảnh sản phẩm
            const uploadHeaders = {
                ...headers,
                'x-xai-request-id': uuidv4()
            };
            const uploadRes = await this.uploadImage(productImagePath, uploadHeaders);
            if (!uploadRes?.fileUri) {
                return { success: false, message: "Upload ảnh không thành công" };
            }
            const { fileUri } = uploadRes;

            const postHeaders = {
                ...headers,
                'x-xai-request-id': uuidv4()
            };
            const postId = await this.createMediaPost(userPrompt, fileUri, postHeaders);

            if (!postId) {
                return { success: false, message: "Tạo post thất bại" };
            }


            // 3. Gửi request vẽ ảnh (Imagine Mode)
            const editImgHeaders = {
                ...headers,
                'x-xai-request-id': uuidv4()
            };
            const imageUrls = await this.sendImageEditRequest(userPrompt, [fileUri], postId, editImgHeaders);

            if (!imageUrls || imageUrls.length === 0) return { success: false, message: "Grok Không trả về ảnh" };


            const finalPath = await this.downloadBestImage(imageUrls, taskId, profileNum, outputFolder);
            if (!finalPath) {
                return { success: false, message: "Không tìm thấy image" };
            }

            return { success: true, filePath: finalPath };
        } catch (error: any) {
            console.log(error.message)
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
                    console.log(`✅ Upload thành công! ID: ${fileMetadataId}`);
                    return { fileMetadataId, fileUri };
                }
            }

            return null;
        } catch (error: any) {
            console.error("❌ Lỗi upload_image:", error.response?.data || error.message);
            return null;
        }
    }


    private async createMediaPost(prompt: string, fileUri: string, headers: any): Promise<string | null> {
        try {
            const url = "https://grok.com/rest/media/post/create";

            // 🛡️ ĐÂY LÀ CHỖ QUAN TRỌNG: 
            // Thêm trường "mediaUrl" lấy từ kết quả của bước uploadImage
            const payload = {
                "mediaType": "MEDIA_POST_TYPE_IMAGE",
                "prompt": prompt,
                "mediaUrl": `https://assets.grok.com/${fileUri}` // Ghép đúng format assets của Grok
            };

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
                    console.log(`✅ Đã tạo Media Post thành công với ảnh SP: ${postId}`);
                    return postId;
                }
            }

            return null;
        } catch (error: any) {
            // Log chi tiết lỗi để ông dễ soi
            console.error("❌ Lỗi create_media_post:", error.response?.data || error.message);
            return null;
        }
    }

    private async sendImageEditRequest(prompt: string, fileUris: string[], postId: string, headers: any): Promise<string[]> {
        const url = "https://grok.com/rest/app-chat/conversations/new";

        // Payload giữ nguyên cấu trúc phức tạp của Grok
        const payload = {
            temporary: true,
            modelName: "imagine-image-edit",
            message: prompt,
            enableImageGeneration: true,
            returnImageBytes: false,
            returnRawGrokInXaiRequest: false,
            enableImageStreaming: true,
            imageGenerationCount: 1,
            forceConcise: false,
            toolOverrides: { imageGen: true },
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
            forceSideBySide: false
        };

        const imageUrls: string[] = [];

        try {
            const response = await axios.post(url, payload, {
                headers,
                responseType: 'stream',
                timeout: 180000
            });

            return new Promise((resolve, reject) => {
                let buffer = ''; // 🎯 DÙNG BUFFER ĐỂ CỘNG DỒN DỮ LIỆU LẺ

                response.data.on('data', (chunk: Buffer) => {
                    buffer += chunk.toString('utf-8');
                    let lines = buffer.split('\n');

                    // Giữ lại dòng cuối cùng (có thể là dòng chưa hoàn chỉnh) vào buffer
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                        if (!line.trim()) continue;

                        try {
                            // 1. Cách 1: Parse JSON chính thống
                            const data = JSON.parse(line);

                            // Python: edit_resp["imageUrls"]
                            const imgUrl = data?.result?.response?.imageEditResponse?.imageUrls?.[0];
                            if (imgUrl && !imageUrls.includes(imgUrl)) {
                                imageUrls.push(imgUrl);
                            }

                            // 2. Cách 2: Regex vét cạn (Khớp hoàn toàn re.findall của Python)
                            // Lưu ý: JSON.stringify(data) ở đây là chuẩn bài
                            const rawString = JSON.stringify(data);
                            const matches = rawString.matchAll(/"imageUrl"\s*:\s*"([^"]+)"/g);
                            for (const match of matches) {
                                if (!imageUrls.includes(match[1])) {
                                    imageUrls.push(match[1]);
                                }
                            }
                        } catch (e) {
                            // Dòng lỗi thì bỏ qua, chờ chunk sau
                        }
                    }
                });

                response.data.on('end', () => {
                    // Xử lý nốt phần còn lại trong buffer nếu có
                    if (buffer.trim()) {
                        try {
                            const data = JSON.parse(buffer);
                            const matches = JSON.stringify(data).matchAll(/"imageUrl"\s*:\s*"([^"]+)"/g);
                            for (const match of matches) {
                                if (!imageUrls.includes(match[1])) imageUrls.push(match[1]);
                            }
                        } catch (e) { }
                    }
                    console.log(`🎨 Grok đã vẽ xong ${imageUrls.length} ảnh.`);
                    resolve(imageUrls);
                });

                response.data.on('error', (err: any) => reject(err));
            });

        } catch (error: any) {
            console.error("❌ Lỗi sendImageEditRequest:", error.response?.data || error.message);
            return [];
        }
    }
    private buildDownloadHeaders(profileNum: number): any {
        const cookie = this.parseCookieFromFile(profileNum);
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
    private parseCookieFromFile(profileNum: number): string {
        // Nếu ông lưu dạng JSON (như anh em mình làm ở trên) thì bốc trực tiếp
        const jsonPath = path.join(this.headersDir, `profile_${profileNum}.json`);

        if (fs.existsSync(jsonPath)) {
            const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
            return data.cookie || "";
        }
        return "";
    }

    async downloadBestImage(imageUrls: string[], taskId: number | string, profileNum: number, outputFolder: string): Promise<string | null> {
        if (!imageUrls || imageUrls.length === 0) return null;

        const downloadHeaders = this.buildDownloadHeaders(profileNum);

        // 1. Tạo biến để lưu trữ "ứng cử viên" nặng ký nhất
        let bestContent: Buffer | null = null;
        let maxSizeKb = -1;

        console.log(`🔍 Đang quét ${imageUrls.length} ảnh để tìm tấm chất lượng nhất...`);

        for (const url of imageUrls) {
            try {
                // 2. Check size từng tấm
                const { content, sizeKb } = await this.checkImageSize(url, downloadHeaders);

                if (!content) continue;

                // 3. So sánh: Nếu tấm này nặng hơn tấm nặng nhất hiện tại -> cập nhật
                if (sizeKb > maxSizeKb) {
                    maxSizeKb = sizeKb;
                    bestContent = content;
                    console.log(`📸 Tìm thấy ảnh tốt hơn: ${sizeKb.toFixed(2)} KB`);
                }
            } catch (error) {
                console.error(`❌ Lỗi khi check ảnh ${url}:`, error);
            }
        }

        // 4. Sau khi duyệt hết, nếu tìm được tấm ảnh đạt chuẩn (vượt qua MIN_SIZE nếu cần)
        if (bestContent && maxSizeKb >= this.MIN_IMAGE_SIZE_KB) {
            if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder, { recursive: true });

            const fileName = `grok_best_${taskId}_${Date.now()}.png`;
            const finalPath = path.join(outputFolder, fileName);

            // 5. Lúc này mới thực sự ghi file tấm xịn nhất xuống ổ cứng
            fs.writeFileSync(finalPath, bestContent);
            console.log(`✅ Đã chọn tấm ảnh "khủng" nhất: ${finalPath} (${maxSizeKb.toFixed(2)} KB)`);

            return finalPath;
        }

        console.log("⚠️ Không tìm thấy ảnh nào đủ chất lượng.");
        return null;
    }

    async downloadImageForPrompt(imageUrls: string[], taskId: number | string, profileNum: number, outputFolder: string): Promise<string | null> {
        if (!imageUrls || imageUrls.length === 0) return null;

        // 1. Build bộ header tải ảnh (Có Cookie từ GPM để tránh 403)
        const downloadHeaders = this.buildDownloadHeaders(profileNum);

        for (const url of imageUrls) {
            // 2. Kiểm tra chất lượng ảnh (Học theo check_image_size)
            const { content, sizeKb } = await this.checkImageSize(url, downloadHeaders);

            // 3. Nếu không có nội dung -> bỏ qua (if content is None)
            if (!content) {
                continue;
            }

            // 4. Nếu ảnh quá bé -> bỏ qua (if size_kb < MIN_IMAGE_SIZE_KB)
            if (sizeKb < this.MIN_IMAGE_SIZE_KB) { // Giả sử MIN_IMAGE_SIZE_KB = 50
                console.log(`⚠️ Bỏ qua ảnh chất lượng thấp: ${sizeKb.toFixed(2)} KB`);
                continue;
            }

            // 5. Lưu ảnh (Học theo save_image_by_prompt_id)
            if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder, { recursive: true });

            const fileName = `grok_res_${taskId}_${Date.now()}.png`;
            const finalPath = path.join(outputFolder, fileName);

            fs.writeFileSync(finalPath, content);
            console.log(`✅ Đã tải và lưu ảnh thành công: ${finalPath} (${sizeKb.toFixed(2)} KB)`);

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
        prompt_video:string,
        outputDir: string,
        profileNum: number = 1,
        imagePath: string | null = null,
        outputCount: number,
        logCallback?: (msg: string) => void
    ) {
        const log = (msg: string) => {
            if (logCallback) logCallback(msg);
            console.log(msg);
        };
        const headers = this.buildRequestHeaders(profileNum);

        const result: any = {
            prompt, taskId: taskId, profile: profileNum,
            success: false, error: null, filename: null,
            post_id: null, video_url: null, is_429: false
        };

        log(`[P${profileNum}] VIDEO ${taskId}: ...`);

        try {
            let fileMetadataId = null;
            let fileUri = null;
            const uploadheader = {
                ...headers,
                "x-xai-request-id": uuidv4() // Ép cái ID mới toanh ở đây
            };
            // BƯỚC 0: Xử lý và Upload ảnh (Nếu có)
            // Lưu ý: Bước adjust_image_aspect_ratio ông đã làm bằng Sharp ở trên
            if (imagePath && fs.existsSync(imagePath)) {
                log(`[P${profileNum}] Bước 0: Upload ảnh làm gốc...`);
                // Sử dụng hàm uploadImage anh em mình đã viết ở trên
                // Giả định hàm uploadImage trả về { fileMetadataId, fileUri }
                console.log(imagePath)
                const uploadRes = await this.uploadImage(imagePath, uploadheader);
                if (uploadRes) {
                    fileUri = uploadRes.fileUri; // Grok-3 thường dùng fileUri trực tiếp
                    fileMetadataId = uploadRes.fileMetadataId;
                } else {
                    result.error = "Lỗi upload ảnh";
                    return result;
                }
            }

            // BƯỚC 1: Tạo media post (Học theo logic Python)
            // BƯỚC 1: Tạo media post
            const postHeaders = {
                ...headers,
                "x-xai-request-id": uuidv4()
            };

            log(`[P${profileNum}] Bước 1: Tạo media post...`);
            const url1 = "https://grok.com/rest/media/post/create";



            const promptGenVideo1 = `${prompt_video} \n ${prompt[0]?.visual_prompt ?? ""} `
            const payload1 = fileUri
                ? { "mediaType": "MEDIA_POST_TYPE_IMAGE", "mediaUrl": `https://assets.grok.com/${fileUri}` }
                : { "mediaType": "MEDIA_POST_TYPE_VIDEO", "prompt": promptGenVideo1 };

            const res1 = await axios.post(url1, payload1, {
                headers: postHeaders,
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
                console.log("❌ Nội dung phản hồi thực tế:", res1.data);
                throw new Error("Không tìm thấy post_id trong phản hồi từ Grok");
            }

            result.post_id = postId;
            log(`✅ [P${profileNum}] Post ID thành công: ${postId}`);

            // BƯỚC 2: Tạo video (Sử dụng Stream để bóc Url)
            log(`[P${profileNum}] Bước 2: Tạo video (đợi render)...`);
            const url2 = "https://grok.com/rest/app-chat/conversations/new";

            // Payload Grok-3 đặc chủng của ông
            const payload2 = {
                "temporary": true,
                "modelName": "grok-3",
                "message": fileUri ? `https://assets.grok.com/${fileUri} ${promptGenVideo1} --mode=custom` : `${promptGenVideo1} --mode=custom`,
                "fileAttachments": fileMetadataId ? [fileMetadataId] : [],
                "toolOverrides": { "videoGen": true },
                "enableSideBySide": true,
                "responseMetadata": {
                    "modelConfigOverride": {
                        "modelMap": {
                            "videoGenModelConfig": {
                                "parentPostId": fileMetadataId || postId,
                                "aspectRatio": "9:16",
                                "videoLength": 10,
                                "resolutionName": "720p"
                            }
                        }
                    }
                }
            };

            const videoHeaders = {
                ...headers,
                "x-xai-request-id": uuidv4() // Ép cái ID mới toanh ở đây
            };

            _event.sender.send('video:task-log', {
                status: 'processing',
                message: `Tạo 0-10 giây đầu video`,
                taskId
            });
            const res2 = await axios.post(url2, payload2, { headers: videoHeaders, responseType: 'stream', timeout: 180000 });

            let videoUrlPath: string | null = null;
            let videoId: string | null = null;

            // Bóc tách videoUrl từ stream
            // Bóc tách cả videoUrl và videoId từ stream
            await new Promise((resolve, reject) => {
                res2.data.on('data', (chunk: Buffer) => {
                    const line = chunk.toString();

                    // 1. Tìm videoUrl (như cũ)
                    const matchUrl = line.match(/"videoUrl"\s*:\s*"([^"]+)"/);
                    if (matchUrl) videoUrlPath = matchUrl[1];

                    // 2. Tìm videoId (Cái này dùng để làm Parent cho bước Extend)
                    const matchId = line.match(/"videoId"\s*:\s*"([^"]+)"/);
                    if (matchId) videoId = matchId[1];

                    // Mẹo: Nếu Grok trả về dạng JSON "id" bên trong object video, 
                    // ta có thể dùng regex rộng hơn một chút
                    if (!videoId) {
                        const matchAlternativeId = line.match(/"id"\s*:\s*"([a-f0-9\-]{36})"/);
                        if (matchAlternativeId) videoId = matchAlternativeId[1];
                    }
                });
                res2.data.on('end', () => {
                    console.log(`✅ Đã bóc tách xong - URL: ${videoUrlPath}, ID: ${videoId}`);
                    resolve({ videoUrlPath, videoId });
                });
                res2.data.on('error', reject);
            });

            if (!videoUrlPath) throw new Error("Không tìm thấy videoUrl trong stream");
            result.video_url = videoUrlPath;
            if (!videoId) throw new Error("Không tìm thấy videoId trong stream");

            result.video_id = videoId;
            _event.sender.send('video:task-log', {
                status: 'processing',
                message: `Tạo xong 10s`,
                data: { resultVideoCount: 1 },
                taskId
            });

            if (outputCount > 1) {
                // BƯỚC 3: EXTEND VIDEO
                _event.sender.send('video:task-log', {
                    status: 'processing',
                    message: `Tạo đoạn 10-20 giây của video`,
                    taskId
                });
                const videoHeaders2 = {
                    ...headers,
                    "x-xai-request-id": uuidv4() // Ép cái ID mới toanh ở đây
                };
                const promptvideo2 = prompt[1].visual_prompt;
                const payload2video = {
                    ...payload2,
                    "message": promptvideo2,
                    "responseMetadata": {
                        "modelConfigOverride": {
                            "modelMap": {
                                "videoGenModelConfig": {
                                    "aspectRatio": "9:16",
                                    "videoLength": 10,
                                    "resolutionName": "720p",
                                    "extendPostId": videoId,
                                    "isVideoEdit": false,
                                    "isVideoExtension": true,
                                    "mode": "custom",
                                    "originalPostId": videoId,
                                    "originalPrompt": promptvideo2,
                                    "originalRefType": "ORIGINAL_REF_TYPE_VIDEO_EXTENSION",
                                    "parentPostId": videoId,
                                    "stitchWithExtendPostId": true,
                                    "videoExtensionStartTime": 10.031667


                                }
                            }
                        }
                    }

                }
                const res2video = await axios.post(url2, payload2video, { headers: videoHeaders2, responseType: 'stream', timeout: 180000 });

                await new Promise((resolve, reject) => {
                    res2video.data.on('data', (chunk: Buffer) => {
                        const line = chunk.toString();

                        // 1. Tìm videoUrl (như cũ)
                        const matchUrl = line.match(/"videoUrl"\s*:\s*"([^"]+)"/);
                        if (matchUrl) videoUrlPath = matchUrl[1];

                        // 2. Tìm videoId (Cái này dùng để làm Parent cho bước Extend)
                        const matchId = line.match(/"videoId"\s*:\s*"([^"]+)"/);
                        if (matchId) videoId = matchId[1];

                        // Mẹo: Nếu Grok trả về dạng JSON "id" bên trong object video, 
                        // ta có thể dùng regex rộng hơn một chút
                        if (!videoId) {
                            const matchAlternativeId = line.match(/"id"\s*:\s*"([a-f0-9\-]{36})"/);
                            if (matchAlternativeId) videoId = matchAlternativeId[1];
                        }
                    });
                    res2video.data.on('end', () => {
                        console.log(`✅ Đã bóc tách xong - URL: ${videoUrlPath}, ID: ${videoId}`);
                        _event.sender.send('video:task-log', {
                            status: 'processing',
                            message: `Tạo xong 20s`,
                            data: { resultVideoCount: 2 },
                            taskId
                        });
                        resolve({ videoUrlPath, videoId });
                    });
                    res2video.data.on('error', reject);
                });
            }
            if (outputCount > 2) {
                _event.sender.send('video:task-log', {
                    status: 'processing',
                    message: `Tạo đoạn 20-30 giây của video`,
                    taskId
                });
                const videoHeaders3 = {
                    ...headers,
                    "x-xai-request-id": uuidv4() // Ép cái ID mới toanh ở đây
                };
                const promptvideo3 = prompt[2].visual_prompt
                const payload3video = {
                    ...payload2,
                    "message": promptvideo3,
                    "responseMetadata": {
                        "modelConfigOverride": {
                            "modelMap": {
                                "videoGenModelConfig": {
                                    "aspectRatio": "9:16",
                                    "videoLength": 10,
                                    "resolutionName": "720p",
                                    "extendPostId": videoId,
                                    "isVideoEdit": false,
                                    "isVideoExtension": true,
                                    "mode": "custom",
                                    "originalPostId": videoId,
                                    "originalPrompt": promptvideo3,
                                    "originalRefType": "ORIGINAL_REF_TYPE_VIDEO_EXTENSION",
                                    "parentPostId": videoId,
                                    "stitchWithExtendPostId": true,
                                    "videoExtensionStartTime": 20


                                }
                            }
                        }
                    }

                }
                const res2video = await axios.post(url2, payload3video, { headers: videoHeaders3, responseType: 'stream', timeout: 180000 });

                await new Promise((resolve, reject) => {
                    res2video.data.on('data', (chunk: Buffer) => {
                        const line = chunk.toString();

                        // 1. Tìm videoUrl (như cũ)
                        const matchUrl = line.match(/"videoUrl"\s*:\s*"([^"]+)"/);
                        if (matchUrl) videoUrlPath = matchUrl[1];

                        // 2. Tìm videoId (Cái này dùng để làm Parent cho bước Extend)
                        const matchId = line.match(/"videoId"\s*:\s*"([^"]+)"/);
                        if (matchId) videoId = matchId[1];

                        // Mẹo: Nếu Grok trả về dạng JSON "id" bên trong object video, 
                        // ta có thể dùng regex rộng hơn một chút
                        if (!videoId) {
                            const matchAlternativeId = line.match(/"id"\s*:\s*"([a-f0-9\-]{36})"/);
                            if (matchAlternativeId) videoId = matchAlternativeId[1];
                        }
                    });
                    res2video.data.on('end', () => {
                        console.log(`✅ Đã bóc tách xong - URL: ${videoUrlPath}, ID: ${videoId}`);
                        _event.sender.send('video:task-log', {
                            status: 'processing',
                            message: `Tạo xong video thứ 3`,
                            data: { resultVideoCount: 3 },
                            taskId
                        });
                        resolve({ videoUrlPath, videoId });
                    });
                    res2video.data.on('error', reject);
                });
            }






            // BƯỚC 4: Download video
            const downloadHeaders = this.buildDownloadHeaders(profileNum);
            log(`[P${profileNum}] Bước 3: Download video...`);
            const downloadUrl = `https://assets.grok.com/${videoUrlPath}?cache=1&dl=1`;
            const finalFilename = path.join(outputDir, `video_${taskId}_${Date.now()}.mp4`);

            const res3 = await axios.get(downloadUrl, {
                headers: downloadHeaders,
                responseType: 'arraybuffer',
                timeout: 120000
            });

            fs.writeFileSync(finalFilename, res3.data);
            log(`✅ [P${profileNum}] Tải xong video: ${path.basename(finalFilename)}`);

            result.success = true;
            result.filename = finalFilename;

        } catch (error: any) {
            result.error = error.response?.status === 429 ? "Rate Limit 429" : error.message;
            result.is_429 = error.response?.status === 429;
            log(`❌ [P${profileNum}] Lỗi: ${result.error}`);
        }

        return result;
    }


}