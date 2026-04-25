import puppeteer from "puppeteer-core";

import { logger } from "../utils/logger";
import { GpmService } from "./gpm.service";
import axios from "axios";
//"6LdsFiUsAAAAAIjVDZcuLhaHiDn5nnHVXVRQGeMV", "IMAGE_GENERATION"
export class VeoCaptchaService {
    

    public static async openProfileCaptcha(profileId: string = "fb9c8c01-5cc4-4809-b613-955745804527", gpmClient: GpmService) {
        const startProfile = await gpmClient.startProfile(profileId, 7891, "800,800");

        // Chờ GPM khởi động
        await new Promise(r => setTimeout(r, 5000));

        const browser = await puppeteer.connect({
            browserURL: `http://127.0.0.1:${startProfile.data.remote_debugging_port}`,
            defaultViewport: null
        });

        const page = (await browser.pages())[0];

        logger.info("🌐 Đang truy cập Google Labs...");
        // Chỉ cần domcontentloaded là đủ, không cần đợi networkidle2 lằng nhằng
        await page.goto('https://labs.google/fx/vi/tools/flow/project/ac3afde6-d576-427a-a22b-c6cafdaaf8c5', {
            waitUntil: 'domcontentloaded',
            timeout: 120000
        });

        // 🚀 THẦN CHÚ SỐNG CÒN: Ngủ đông 5 giây để Google load xong Script Captcha và chống Redirect
        logger.info("⏳ Chờ 5 giây cho web load xong hoàn toàn...");
        await new Promise(r => setTimeout(r, 5000));

        return page;
    }
    public static async warmUpBrowser(page: any) {
        try {
            logger.info("🔥 [VeoCaptchaService] Đang làm nóng trình duyệt (Giả lập chuột/Scroll)...");

            // Lăn chuột ngẫu nhiên 2-3 lần
            for (let i = 0; i < 3; i++) {
                const scrollAmount = (Math.random() > 0.5 ? 1 : -1) * (100 + Math.random() * 300);
                await page.evaluate((y: number) => { window.scrollBy({ top: y, behavior: 'smooth' }); }, scrollAmount);
                await new Promise(r => setTimeout(r, 500 + Math.random() * 1000));
            }

            // Mute toàn bộ âm thanh để tàng hình
            await page.evaluate(() => {
                document.querySelectorAll('video, audio').forEach((el: any) => { el.muted = true; el.volume = 0; });
            });

        } catch (error) {
            logger.warn("⚠️ [VeoCaptchaService] Lỗi làm nóng, kệ đi tiếp...");
        }
    }
    public static async forceRefreshCaptcha(): Promise<void> {
        try {
            const resp = await axios.post("http://localhost:3000/captcha/force-refresh", {}, {
                timeout: 5000 // 5 giây (5000ms)
            });
            logger.info(`  🔄 force-refresh captcha: HTTP ${resp.status}`);
        } catch (error: any) {
            logger.warn(`  ⚠️ Không gọi được force-refresh: ${error.message}`);
        }
    }
    public static async getGoogleRecaptchaToken(): Promise<string | null> {
        try {
            const response = await axios.get("http://localhost:3000/captcha", {
                timeout: 8000 // Ép timeout 8 giây giống python
            });

            const token = response.data.captcha;
            logger.info(` ✅ reCAPTCHA token OK (${token})`);
            if (token) {
                logger.info(` ✅ reCAPTCHA token OK (${token.length} chars)`);


                return token;
            }

            return null;
        } catch (error: any) {
            // Bắt lỗi timeout hoặc server sập
            logger.error(` ❌ reCAPTCHA error: ${error.message}`);
            return null;
        }
    }
    public static async getRealToken(page: any): Promise<string | null> {
        return new Promise(async (resolve) => {
            let client: any = null;

            try {
                logger.info("🕵️ [VeoCaptchaService] Đang giăng lưới Fetch CDP...");

                // 1. Tạo session CDP kết nối thẳng vào DevTools
                client = await page.target().createCDPSession();

                // 🚀 BẬT LƯỚI FETCH: Chỉ chặn những gói tin có chữ batchGenerateImages
                await client.send('Fetch.enable', {
                    patterns: [{ requestStage: 'Request', urlPattern: '*batchGenerateImages*' }]
                });

                // 2. Lắng nghe gói tin bị sa lưới (requestPaused)
                client.on('Fetch.requestPaused', async (event: any) => {
                    const request = event.request;
                    const requestId = event.requestId;

                    if (request.method === 'POST') {
                        try {
                            if (request.postData) {
                                const body = JSON.parse(request.postData);

                                // Moi móc lấy cái Token reCAPTCHA ra
                                const token = body?.clientContext?.recaptchaContext?.token ||
                                    body?.requests?.[0]?.clientContext?.recaptchaContext?.token;

                                if (token) {
                                    logger.info(`✅ [VeoCaptchaService] Chộp được Token: ${token.substring(0, 30)}...`);

                                    // 🚀 TUYỆT KỸ: Hủy ngay gói tin này để Google không xé mất Token
                                    await client.send('Fetch.failRequest', {
                                        requestId: requestId,
                                        errorReason: 'Aborted'
                                    }).catch(() => { });

                                    // Ngắt kết nối CDP và trả về Token xịn
                                    if (client) await client.detach().catch(() => { });
                                    resolve(token);
                                    return; // Kết thúc tại đây
                                }
                            }
                        } catch (e) {
                            // Kệ lỗi parse
                        }
                    }

                    // Nếu không phải gói tin mình cần tìm, thả cho nó đi tiếp
                    await client.send('Fetch.continueRequest', { requestId: requestId }).catch(() => { });
                });

                // 3. GIẢ LẬP HÀNH VI NGƯỜI DÙNG: ÉP WEB NHẢ TOKEN (CHUẨN HUMAN 100%)
                logger.info("👉 Tìm ô nhập Prompt và gõ chữ mồi...");

                const inputSelector = '[contenteditable="true"]';
                await page.waitForSelector(inputSelector, { timeout: 10000 });

                // Click vào ô nhập cho nó hiện con trỏ chuột nhấp nháy
                await page.click(inputSelector);
                await new Promise(r => setTimeout(r, 200));

                // Bôi đen toàn bộ (Ctrl+A) và xóa (Backspace) y như người thật
                await page.keyboard.down('Control');
                await page.keyboard.press('A');
                await page.keyboard.up('Control');
                await new Promise(r => setTimeout(r, 100));
                await page.keyboard.press('Backspace');
                await new Promise(r => setTimeout(r, 200));

                // Gõ chữ mồi (delay 50ms cho giống người gõ)
                await page.type(inputSelector, `test prompt ${Date.now()}`, { delay: 50 });
                await new Promise(r => setTimeout(r, 500));

                // Bấm phím Enter để kích hoạt lệnh vẽ
                await page.keyboard.press('Enter');

                // 4. TIMEOUT 15s nếu Google không chịu nhả
                setTimeout(async () => {
                    logger.warn("⚠️ [VeoCaptchaService] Hết 15 giây không bắt được Token, thoát!");
                    if (client) await client.detach().catch(() => { });
                    resolve(null);
                }, 15000);

            } catch (error: any) {
                logger.error(`❌ [VeoCaptchaService] Lỗi hệ thống CDP: ${error.message}`);
                if (client) await client.detach().catch(() => { });
                resolve(null);
            }
        });
    }

    


}