import { logger } from './../utils/logger';
import axios from 'axios';
import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { GpmService } from './gpm.service';
import puppeteer from 'puppeteer-core';
import { v4 as uuidv4 } from 'uuid';
import { VeoCaptchaService } from './veo-captcha.service';
import { sleep } from './shopee.service';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class VeoService {
    public recoveryPromise: Promise<void> | null = null;
    private configDir: string;
    private headersDir: string;
    private baseUrl = "https://aisandbox-pa.googleapis.com/v1";

    constructor() {
        const userDataPath = app.getPath('userData');
        this.configDir = path.join(userDataPath, "configs");
        this.headersDir = path.join(this.configDir, "veo_headers");

        if (!fs.existsSync(this.headersDir)) {
            fs.mkdirSync(this.headersDir, { recursive: true });
        }
    }

    // --- CÁC HÀM UTILS (TOKEN, PROJECTID, WARP) ---
    /**
     * Lấy Token của chính xác Profile đang chạy
     */
    public getToken(profileId: string): string | null {
        try {
            const filePath = path.join(this.headersDir, `profile_${profileId}.json`);
            if (!fs.existsSync(filePath)) return null;

            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            return data.token || null;
        } catch {
            return null;
        }
    }

    /**
     * Lấy Project ID của chính xác Profile đang chạy
     */
    public getProjectId(profileId: string): string {
        // ID dự phòng của ông, nếu trắng thì nó lấy cái này
        const fallbackId = "";
        try {
            const filePath = path.join(this.headersDir, `profile_${profileId}.json`);
            if (!fs.existsSync(filePath)) return fallbackId;

            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            return data.projectId || fallbackId;
        } catch {
            return fallbackId;
        }
    }

    public async buildApiHeaders(token: string) {
        return {
            "accept": "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "vi,en-US;q=0.9,en;q=0.8",
            "authorization": `Bearer ${token}`,
            "content-type": "text/plain;charset=UTF-8",
            "origin": "https://labs.google",
            "referer": "https://labs.google/",
            "sec-ch-ua": '"Not(A:Brand";v="8", "Chromium";v="144", "Google Chrome";v="144"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36"
        }
    }

    public async uploadImageToLabs(imagePath: string, projectId: string, token: string) {
        try {
            // 1. Kiểm tra ảnh có tồn tại không
            if (!fs.existsSync(imagePath)) {
                return { success: false, message: "Không tìm thấy file ảnh gốc trên máy!" };
            }

            // 2. Chuyển ảnh sang Base64 và lấy định dạng
            const base64Image = fs.readFileSync(imagePath, { encoding: 'base64' });
            const fileName = path.basename(imagePath);
            const ext = fileName.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';

            // 3. Chuẩn bị Header (Bơm Token ya29)
            const headers = await this.buildApiHeaders(token)

            // 4. Build Payload (Khớp 100% với cấu trúc API)
            const payload = {
                clientContext: {
                    projectId: projectId,
                    tool: "PINHOLE"
                },
                fileName: fileName,
                imageBytes: base64Image,
                isHidden: false,
                isUserUploaded: true,
                mimeType: ext
            };

            // 5. Vít ga bắn API (Chỗ này URL cứng hoặc nối từ this.baseUrl tùy ông)
            const url = 'https://aisandbox-pa.googleapis.com/v1/flow/uploadImage';
            const uploadRes = await axios.post(url, payload, { headers, timeout: 60000 });

            // 6. Trích xuất cái Media ID
            if (uploadRes.data && uploadRes.data.media && uploadRes.data.media.name) {
                const mediaId = uploadRes.data.media.name;
                logger.info(`✅ Upload ảnh lên Labs thành công! Media ID: ${mediaId}`);
                return { success: true, mediaId: mediaId };
            }

            return { success: false, message: "API trả về 200 nhưng không tìm thấy media.name" };

        } catch (error: any) {
            // Bắt riêng lỗi 403 để dễ nhận biết Token tạch
            if (error.response?.status === 403) {
                logger.error(`🚫 Lỗi 403: Bị từ chối (Token ya29 có thể đã chết hoặc sai Project ID)`);
                return { success: false, message: "Lỗi 403 Forbidden" };
            }
            logger.error(`❌ Lỗi upload ảnh: ${error.message}`);
            return { success: false, message: error.message };
        }
    }


    public async handle403Recovery(USE_WARP: boolean = false): Promise<void> {
        // Nếu đang có tiến trình phục hồi chạy rồi, thì bắt các luồng khác ĐỨNG ĐỢI
        if (this.recoveryPromise) {
            logger.warn("⏳ Tiến trình xử lý 403 đang chạy, luồng này sẽ đợi...");
            return this.recoveryPromise;
        }

        // Tạo Promise chặn cửa để xử lý 403
        this.recoveryPromise = (async () => {
            try {
                logger.warn("\n⚠️ Đang xử lý lỗi 403...");

                // Xóa cookie (Ông tự gọi cái hàm thao tác file/folder của ông vào đây)
                await this.clearCookiesDir();

                if (USE_WARP) {
                    // Đổi IP và bật lại Browser
                    await this.changeIp();
                    await this.openBrowserProfiles("https://labs.google/fx/tools/flow");
                    await this.warpOff();
                } else {
                    logger.info("⏭️ Bỏ qua đổi IP & mở browser (USE_WARP đang tắt)");
                }

                // Gọi Tổng đài NestJS để F5 lại Client
                await VeoCaptchaService.forceRefreshCaptcha();

                logger.info("✅ Xử lý 403 xong, tiếp tục...");

                // Ngủ 3 giây (tương đương time.sleep(3))
                await new Promise(resolve => setTimeout(resolve, 3000));

            } finally {
                // 🚀 QUAN TRỌNG: Chạy xong xuôi thì XÓA LOCK để lần sau còn chạy tiếp được
                this.recoveryPromise = null;
            }
        })();

        return this.recoveryPromise;
    }
    private async warpDisconnect(): Promise<void> {
        try {
            // Chạy lệnh ngầm
            await execAsync("warp-cli disconnect");
        } catch (error) {
            // Tương đương check=False bên Python: Nếu lỗi thì ngậm miệng đi tiếp, không crash tool
        }
    }
    private async warpConnect(): Promise<void> {
        try {
            await execAsync("warp-cli connect");
        } catch (error) {
            // Bỏ qua lỗi
        }
    }
    private async warpOff(USE_WARP: boolean = false): Promise<void> {
        // Giả sử USE_WARP là biến môi trường hoặc config ông đã định nghĩa
        if (!USE_WARP) {
            console.log("⏭️ Bỏ qua tắt WARP (1111 đang tắt)");
            return;
        }

        console.log("🔌 Tắt WARP (fake IP 1111)...");
        await this.warpDisconnect(); // Cái hàm mình vừa viết ở trên

        await sleep(3000); // time.sleep(3) -> 3000ms

        let lastNotify = Date.now();

        // Vòng lặp chờ đến khi WARP báo tắt hẳn
        // Giả sử isWarpActive() là một hàm async trả về boolean
        while (await this.isWarpActive()) {
            const now = Date.now();

            // now - lastNotify tính bằng mili-giây, nên 15 giây = 15000 ms
            if (now - lastNotify >= 15000) {
                console.log("  ⏳ Vẫn đang chờ WARP tắt hẳn...");
                lastNotify = now;
            }

            await sleep(2000); // time.sleep(2) -> 2000ms
        }

        console.log("  ✅ WARP đã tắt hẳn, tiếp tục.");
    }
    public async clearCookiesDir() {
        logger.info("  🧹 Đang clear thư mục cookies...");
    }
    public async changeIp() {
        logger.info("  🌐 Đang đổi IP...");
        await this.warpDisconnect()
        await sleep(5000)
        await this.warpConnect()
        await sleep(10000)
    }
    public async openBrowserProfiles(_url: string) {
        logger.info("  🪟 Đang mở lại browser profiles...");
    }
    private async isWarpActive(): Promise<boolean> {
        try {
            // Chạy lệnh với timeout 5 giây (5000ms)
            const { stdout, stderr } = await execAsync("warp-cli status", { timeout: 5000 });
            const output = (stdout + stderr).toLowerCase();

            if (output.includes("disconnected") && !output.includes("connecting")) {
                return false;
            }
            return true;

        } catch (error: any) {
            // BẪY NODE.JS: Nếu lệnh chạy ra exit code khác 0, nó nhảy vào đây.
            // Nhưng ta vẫn có thể lấy được chữ in ra màn hình từ error.stdout

            if (error.stdout !== undefined || error.stderr !== undefined) {
                const output = ((error.stdout || "") + (error.stderr || "")).toLowerCase();

                if (output.includes("disconnected") && !output.includes("connecting")) {
                    return false;
                }

                // Nếu bị Node.js "chém" do chạy quá 5 giây (timeout)
                if (error.killed) {
                    return false;
                }

                return true;
            }

            // Rơi vào đây tức là lỗi hệ thống nặng (VD: Chưa cài warp-cli, không nhận lệnh)
            return false;
        }
    }


    // --- CORE VEO 3.1 ENGINE ---

    public async generateImageLabs(
        _prompt: string,
        _mediaIds: string[], // Mảng chứa ID ảnh đã upload (truyền mảng rỗng [] nếu chỉ vẽ chữ)
        profileId: string,
        outputFolder: string,
        taskId: string,
        aspectRatio: string = "IMAGE_ASPECT_RATIO_PORTRAIT", // 9:16
        modelCode: string = "GEM_PIX_2" // Hoặc GEM_PIX cho model cũ
    ) {
        const projectId = "de85a0ea-1a05-435a-bb5e-f35626ebe425"
        const captchaToken = await VeoCaptchaService.getGoogleRecaptchaToken();
        logger.info(`[generateImageLabs] captchaToken= `, captchaToken)
        if (!captchaToken || (Object.keys(captchaToken).length === 0)) {
            return { success: false, message: "Không cướp được Captcha Token!" };

        }
        const sessionId = `;${Date.now()}`;
        const batchId = uuidv4();
        const seed = Math.floor(Math.random() * 1000000);

        const recaptcha_context = {
            token: captchaToken,
            applicationType: "RECAPTCHA_APPLICATION_TYPE_WEB"
        }
        const client_context = {
            recaptchaContext: recaptcha_context,
            projectId: projectId,
            tool: "PINHOLE",
            sessionId: sessionId
        }

        const innerRequest: any = {
            clientContext: client_context,
            imageModelName: modelCode,
            imageAspectRatio: aspectRatio,
            structuredPrompt: { parts: [{ text: "tạo cho tôi nhân vật châu á" }] },
            seed: seed
        };
        // Nhét ảnh đã upload (nếu có) vào làm mồi
        /* if (mediaIds && mediaIds.length > 0) {
            innerRequest.imageInputs = mediaIds.map((id) => ({
                imageInputType: "IMAGE_INPUT_TYPE_REFERENCE",
                name: id
            }));
        } */

        const payload = {
            clientContext: client_context,
            mediaGenerationContext: { batchId: batchId },
            useNewMedia: true,
            requests: [innerRequest]
        };

        const MAX_403_RETRY = 2;
        const url = `https://aisandbox-pa.googleapis.com/v1/projects/${projectId}/flowMedia:batchGenerateImages`;

        for (let attempt = 1; attempt <= MAX_403_RETRY + 1; attempt++) {
            try {

                const headers = await this.buildApiHeaders("")
                logger.info(url)

                logger.info(JSON.stringify(headers))
                logger.info(JSON.stringify(payload))


                logger.info(`🚀 Gửi lệnh vẽ ảnh lên Labs (Batch: ${batchId})...`);

                const response = await axios.post(url, payload, {
                    headers, timeout: 120000, validateStatus: function () {
                        return true; // Trả về true với mọi status code (200, 403, 500,...)
                    }
                });
                logger.info(`[generateImageLabs] response = `, response.status)



                if (response?.status === 200) {
                    logger.info(`✅ Labs đã trả kết quả 200! Đang bóc tách hình ảnh...`);
                    const responseData = response.data;
                    const finalPath = path.join(outputFolder, `veo_img_${taskId}.png`);

                    // 1. Cố gắng quét đệ quy tìm fifeUrl (Link ảnh trực tiếp)
                    const fifeUrls = this.extractFifeUrls(responseData);
                    logger.info(`[generateImageLabs] fileUrls = `, fifeUrls)

                    if (fifeUrls && fifeUrls.length > 0) {
                        logger.info(`📥 Tìm thấy link ảnh (Fife URL), đang tải về...`);
                        const resultDownloadImg = await this.downloadMedia(fifeUrls[0], finalPath, this.getToken(profileId) ?? "");
                        if (!resultDownloadImg) {
                            throw new Error("Lỗi tải ảnh")
                        } else {
                            return { success: true, filePath: finalPath };
                        }

                    }

                    // 2. Nếu không có link fifeUrl, quét tìm ảnh dạng mã hóa Base64 (encodedImage)
                    const encodedBytes = this.extractEncodedImage(responseData);
                    if (encodedBytes) {
                        logger.info(`💾 Tìm thấy ảnh dạng Base64, đang lưu thẳng vào file...`);
                        fs.writeFileSync(finalPath, Buffer.from(encodedBytes, 'base64'));
                        return { success: true, filePath: finalPath };
                    }

                    // 3. Xui tận mạng không tìm thấy gì (Bắt buộc phải lưu Debug để soi)
                    fs.writeFileSync(path.join(outputFolder, `debug_${taskId}.json`), JSON.stringify(responseData, null, 2));
                    throw new Error("Không tìm thấy link ảnh hay Base64 trong response. Đã xuất file debug!");
                } else if (response?.status === 403) {
                    logger.warn(`🚫 Lỗi 403 (Lần ${attempt}/${MAX_403_RETRY}). Captcha hoặc Token đã chết.`);
                    if (attempt <= MAX_403_RETRY) {
                        await this.handle403Recovery(true)
                        const new_token = await VeoCaptchaService.getGoogleRecaptchaToken();
                        if (new_token) {
                            client_context.recaptchaContext.token = new_token
                            innerRequest.clientContext.recaptchaContext.token = new_token
                            payload.clientContext.recaptchaContext.token = new_token
                        }

                        continue
                    } else {
                        logger.error(`🚫 Upload: đã thử tối đa lần xử lý 403.`);
                        return { success: false, message: "Upload: đã thử tối đa lần xử lý 403." };
                    }


                } else {
                    logger.error(`🚫 Upload fail: ${response.status}`);
                    return { success: false, message: "Upload fail" };

                }

            } catch (error: any) {
                logger.error(`[generateImageLabs] Error = `, error)
                return { success: false, message: error.message };
            }
        }
        return { success: false, message: "Vượt quá số lần thử lại tối đa" };
    }



    private extractEncodedImage(obj: any): string | null {
        let encoded: string | null = null;

        const findEncoded = (current: any) => {
            if (encoded) return; // Tìm thấy rồi thì ngưng luôn cho nhẹ máy

            if (current !== null && typeof current === 'object') {
                if (!Array.isArray(current)) {
                    for (const key of ['encodedImage', 'imageBytes']) {
                        if (current[key] && typeof current[key] === 'string' && current[key].length > 100) {
                            encoded = current[key];
                            return;
                        }
                    }
                    for (const key in current) {
                        findEncoded(current[key]);
                    }
                } else {
                    for (const item of current) {
                        findEncoded(item);
                    }
                }
            }
        };

        findEncoded(obj);
        return encoded;
    }
    private extractFifeUrls(obj: any): string[] {
        let urls: string[] = [];

        const findUrls = (current: any) => {
            if (current !== null && typeof current === 'object') {
                if (!Array.isArray(current)) {
                    for (const key in current) {
                        if (key === 'fifeUrl' && typeof current[key] === 'string') {
                            urls.push(current[key]);
                        } else {
                            findUrls(current[key]);
                        }
                    }
                } else {
                    for (const item of current) {
                        findUrls(item);
                    }
                }
            }
        };

        findUrls(obj);
        return urls;
    }
    /**
     * Tạo video từ ảnh (Image-to-Video)
     */
    public async generateVideoFromImage(imagePath: string, prompt: string, token: string): Promise<any> {
        const projectId = this.getProjectId("ssssss");
        const headers = { "authorization": `Bearer ${token}` };

        // 1. Upload ảnh
        const base64Image = fs.readFileSync(imagePath, { encoding: 'base64' });
        const uploadRes = await axios.post(`${this.baseUrl}:uploadUserImage`, {
            imageInput: { rawImageBytes: base64Image, mimeType: "image/jpeg", isUserUploaded: true, aspectRatio: "IMAGE_ASPECT_RATIO_PORTRAIT" },
            clientContext: { sessionId: `;${Date.now()}`, tool: "ASSET_MANAGER" }
        }, { headers });

        const mediaId = uploadRes.data.mediaGenerationId.mediaGenerationId;

        // 2. Bắn lệnh tạo Video
        const genRes = await axios.post(`${this.baseUrl}/video:batchAsyncGenerateVideoStartImage`, {
            clientContext: { projectId, tool: "PINHOLE", sessionId: `;${Date.now()}`, userPaygateTier: "PAYGATE_TIER_TWO" },
            requests: [{
                aspectRatio: "VIDEO_ASPECT_RATIO_PORTRAIT",
                textInput: { prompt },
                videoModelKey: "veo_3_1_i2v_s_fast_portrait_ultra_relaxed",
                startImage: { mediaId },
                metadata: { sceneId: uuidv4() }
            }]
        }, { headers });

        return genRes.data.operations[0];
    }

    /**
     * Check trạng thái Job (Dùng chung cho cả ảnh và video)
     */
    public async checkJobStatus(operationName: string, sceneId: string, token: string) {
        const payload = {
            operations: [{ operation: { name: operationName }, sceneId, status: "MEDIA_GENERATION_STATUS_PENDING" }]
        };
        const res = await axios.post(`${this.baseUrl}/video:batchCheckAsyncVideoGenerationStatus`, payload, {
            headers: { "authorization": `Bearer ${token}` }
        });
        return res.data.operations[0];
    }


    public async downloadMedia(url: string, savePath: string, token: string) {
        try {
            const res = await axios.get(url, {
                headers: { "authorization": `Bearer ${token}` },
                responseType: 'arraybuffer'
            });
            fs.writeFileSync(savePath, res.data);
            logger.info(`[downloadMedia] tải ảnh thành công `, savePath)
            return true
        } catch (error) {
            logger.error(`[downloadMedia] tải ảnh lỗi `, error)

            return false
        }

    }
    async initHeaderVeo(
        sendLog: (a: string, b: string, c: string) => {},
        taskId: string,
        gpmClient: GpmService,
        gpmProfileId: string,
        port: number,
        delay_between: number
    ) {
        try {
            sendLog(taskId, 'processing', `🔍 Kiểm tra dữ liệu Google Labs (Veo 3.1) cho Profile...`)


            // 1. Lấy Token (string) và ProjectID ra
            const savedData = this.getProfileData(gpmProfileId);
            const currentToken = savedData?.token || "";
            const currentProjectId = savedData?.projectId || null;

            let isLive = false;

            // 2. Check thẳng cái token đó
            if (currentToken) {
                isLive = await this.checkTokenLive(currentToken);
            }

            logger.info(`[initHeaderVeo] Token Veo3 Is Live: ${isLive} | Project ID: ${currentProjectId || 'CHƯA CÓ'}`);

            // 3. Nếu Token chết HOẶC chưa có Project ID -> Cào lại
            if (!isLive || !currentProjectId) {
                sendLog(taskId, 'processing', `🔄 ${!isLive ? 'Token Veo hết hạn' : 'Chưa có Project ID'}! Đang mở GPM để xử lý...`)



                const startResult = await gpmClient.startProfile(gpmProfileId, port);
                if (!startResult.success) throw new Error(startResult.message);

                if (startResult.data.remote_debugging_port) {
                    // Cào data mới
                    const result = await this.refreshVeoTokenViaGPM(
                        startResult.data.remote_debugging_port,
                        currentProjectId
                    );

                    // 🚀 Giờ result.token của ông là 1 chuỗi string
                    const newToken = result.token;
                    const finalProjectId = result.projectId || currentProjectId;

                    if (!newToken) throw new Error("Mở GPM cào rồi mà vẫn không bắt được Token ya29!");
                    if (!finalProjectId) throw new Error("Không có Project ID!");

                    // Lưu đè lại data mới
                    this.saveProfileData(gpmProfileId, newToken, finalProjectId);
                }

                await gpmClient.stopProfile(gpmProfileId);
                await new Promise(r => setTimeout(r, delay_between * 1000));
            } else {
                sendLog(taskId, 'processing', `✅ Tái sử dụng Token và Project ID hiện tại, Vít ga!`)


            }

            return { success: true, message: "Veo Token & Project ID đã sẵn sàng" };
        } catch (error: any) {
            logger.error(`[VeoInit Error]: ${error.message}`);
            return { success: false, message: error.message };
        }
    }

    private async checkTokenLive(token: string): Promise<boolean> {
        try {
            // Gọi thử một API nhẹ của Google Labs để check 
            const res = await axios.get(`${this.baseUrl}/user:getSettings`, {
                headers: { "authorization": `Bearer ${token}` },
                timeout: 5000
            });
            return res.status === 200;
        } catch {
            return false;
        }
    }

    private async refreshVeoTokenViaGPM(port: number, currentProjectId: string | null): Promise<{ token: string, projectId: string | null }> {
        let browser: any = null;
        let foundToken: string = ""; // 🚀 Đổi thành string đơn giản
        let foundProjectId: string | null = null;

        try {
            await new Promise(r => setTimeout(r, 5000));
            browser = await puppeteer.connect({ browserURL: `http://127.0.0.1:${port}`, defaultViewport: null });
            const page = (await browser.pages())[0] || await browser.newPage();

            const client = await page.target().createCDPSession();
            await client.send('Network.enable');

            // 🚀 BẮT GÓI TIN CHUẨN MỰC
            client.on('Network.requestWillBeSent', (params: any) => {
                const request = params.request;

                // 1. "Hút" 1 Token ya29 duy nhất (Có rồi thì không thèm bắt nữa)
                const auth = request.headers['Authorization'] || request.headers['authorization'];
                if (auth && auth.includes('Bearer ya29.') && !foundToken) {
                    foundToken = auth.replace('Bearer ', '');
                    logger.info(`✅ Đã bắt được Token ya29.`);
                }

                // 2. "Hút" Project ID bằng Regex vét cạn UUID (Chỉ bắt khi file JSON chưa có)
                if (!currentProjectId && !foundProjectId && request.url.includes('labs.google')) {
                    const uuidRegex = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;
                    const urlMatch = request.url.match(uuidRegex);
                    if (urlMatch) {
                        foundProjectId = urlMatch[1];
                        logger.info(`✅ Vừa đẻ ra Project ID mới từ gói tin: ${foundProjectId}`);
                    }
                }
            });

            // Vào trang Google Labs Flow
            await page.goto('https://labs.google/fx/tools/flow', { waitUntil: 'networkidle2' });

            // =========================================================
            // 🚀 KỊCH BẢN 1: CHƯA CÓ PROJECT ID -> ÉP CLICK TẠO MỚI
            // =========================================================
            if (!currentProjectId) {
                try {
                    // Chờ tối đa 5s cho nút xuất hiện. Quét rộng cả button, span, div
                    await page.waitForFunction(() => {
                        const elements = Array.from(document.querySelectorAll('button, span, div'));
                        return elements.some(el => {
                            const text = el.textContent || '';
                            // Bao cả tiếng Việt và tiếng Anh cho chắc cú
                            return text.includes('Dự án mới') || text.includes('Create with Flow') || text.includes('New project');
                        });
                    }, { timeout: 5000 });

                    // Tiêm JS trực tiếp để xuyên thủng Obfuscator
                    const isClicked = await page.evaluate(() => {
                        const elements = Array.from(document.querySelectorAll('button, span, div'));
                        const target = elements.find(el => {
                            const text = el.textContent || '';
                            // Dùng includes vì HTML của Google lồng cả icon <i> vào trước chữ
                            return text.includes('Dự án mới') || text.includes('Create with Flow') || text.includes('New project');
                        });

                        if (target) {
                            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            // Bấm xuyên mọi lớp đè bọc
                            (target as HTMLElement).click();
                            return true;
                        }
                        return false;
                    });

                    if (isClicked) {
                        logger.info("👉 Đã phát hiện và ép click tạo Project mới! Đang đợi nhả ID...");
                    }
                } catch (error) {
                    logger.warn("⏩ Không thấy nút tạo Project, có thể đã bị chặn hoặc web đổi giao diện...");
                }

                // Đợi tối đa 15s để nó load trang mới và bắn request chứa ID
                let waitTime = 0;
                while (!foundProjectId && waitTime < 15000) {
                    await new Promise(r => setTimeout(r, 1000));
                    waitTime += 1000;
                }
            }
            // =========================================================
            // 🚀 KỊCH BẢN 2: ĐÃ CÓ PROJECT ID -> NGỒI CHỜ NHẢ TOKEN
            // =========================================================
            else {
                logger.info("⏩ Đã có Project ID từ file, chỉ vào web hứng Token ya29 rồi cút!");
                // Đợi tối đa 10s để nó nhả Token ở background
                let waitTime = 0;
                while (!foundToken && waitTime < 10000) {
                    await new Promise(r => setTimeout(r, 1000));
                    waitTime += 1000;
                }
            }

            await browser.disconnect();

            // Chốt hạ kiểm tra lỗi
            if (!foundToken) throw new Error("Vào trang rách việc rồi mà không bắt được token ya29 nào!");
            if (!currentProjectId && !foundProjectId) throw new Error("Ép tạo mới rồi mà vẫn không tóm được Project ID!");

            // Trả về Token chuỗi và Project ID (ưu tiên ID mới cào được, không thì dùng cái cũ)
            return {
                token: foundToken,
                projectId: foundProjectId || currentProjectId
            };

        } catch (error) {
            if (browser) await browser.disconnect();
            throw error;
        }
    }

    /**
     * LƯU CHUNG 1 TOKEN VÀ PROJECT ID VÀO JSON
     */
    private saveProfileData(profile_id: string, token: string, projectId: string) {
        const filePath = path.join(this.headersDir, `profile_${profile_id}.json`);
        let data: any = {};

        if (fs.existsSync(filePath)) {
            try {
                data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            } catch (e) {
                logger.warn(`Lỗi format JSON profile ${profile_id}, tạo mới.`);
            }
        }

        // 🚀 Chỉ lưu đúng 1 biến chuỗi
        data.token = token;
        data.projectId = projectId;

        fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf-8');
        logger.info(`✅ Đã lưu Token và Project ID [${projectId}] vào file json.`);
    }

    /**
     * ĐỌC DATA TỪ JSON
     */
    private getProfileData(profile_id: string) {
        const filePath = path.join(this.headersDir, `profile_${profile_id}.json`);
        if (!fs.existsSync(filePath)) return null;

        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            return {
                token: data.token || "", // 🚀 Trả về string rỗng nếu không có
                projectId: data.projectId || null
            };
        } catch (e) {
            return null;
        }
    }
}