import puppeteer from "puppeteer-core";
import { logger } from "../utils/logger";
import { GpmService } from "./gpm.service";
import { sleep } from "./shopee.service";
import { downloadImage } from "./download.service";
import { processImageTo916 } from "./image.service";
import path from "path"
import fs from "fs"

export class TiktokService {
    static async getInfoProduct(_event: Electron.IpcMainInvokeEvent, gpmClient: GpmService, port: number, delay_between: any, data: any, task: any): Promise<any> {
        let newProfile = null;
        let productInfo = null;
        let result : {success:boolean, message:string,data: any} = {success: false,message:"[TIKTOK] Lỗi không xác định",data:null} ;
        try {
            _event.sender.send('video:task-log', { status: 'processing', message: `[TIKTOK] Tạo profile`, taskId: task.id });
            newProfile = await gpmClient.createProfile()
            logger.info(newProfile)
            if (!newProfile) throw new Error("[TIKTOK] Không tạo được profile");

            _event.sender.send('video:task-log', { status: 'processing', message: `[TIKTOK] Mở profile`, taskId: task.id });
            const startResult = await gpmClient.startProfile(newProfile.id, port);
            if (!startResult.success) throw new Error(startResult.message);

            if (startResult.data.remote_debugging_port) {
                productInfo = await TiktokService.puppeteerCollect(startResult.data.remote_debugging_port, { ...data, task });

                _event.sender.send('video:task-log', {
                    status: 'processing',
                    message: `✅ Lấy Info thành công`,
                    data: productInfo,
                    taskId: task.id
                });

                result.success = true
                result.message = "Lấy data thành công"
                result.data = productInfo;

            }

        } catch (error:any) {
            result.success = false
            result.message = error?.message ?? "[TIKTOK] Lỗi không xác định"

        } finally {
            if (newProfile) {
                try {
                    await gpmClient.stopProfile(newProfile.id);
                    await sleep(delay_between * 1000)
                } catch (error) {

                }
                await gpmClient.deleteProfile(newProfile.id, 'hard');
            }
            return result

        }
    }
    static async puppeteerCollect(port: number, data: any) {
    try {
        // 1. Kết nối vào trình duyệt GPM đang mở qua Port
        await sleep(3000);
        const browser = await puppeteer.connect({
            browserURL: `http://127.0.0.1:${port}`,
            defaultViewport: null // Giữ nguyên kích thước cửa sổ của GPM
        });

        logger.info("🔗 Đã kết nối thành công vào trình duyệt GPM!");

        // 2. Lấy danh sách các Tab (Pages)
        const pages = await browser.pages();
        const page = pages.length > 0 ? pages[0] : await browser.newPage();

        // Khai báo sẵn các XPath cần thiết
        const xpathTitle = '//span[@class="mt-8 H4-Semibold text-color-UIText1Display"]';
        const xpathDesc = '//div[contains(@class, "sectionContent")]';
        const xpathImage = '//div[contains(@class, "slick-slide slick-active")]//img';

        // 3. Mồi trang chủ lấy Trust (Nên có)
        logger.info("🚚Set api omocaptcha");
        if (!data.configVideoMKT?.omo_api_key){
            throw new Error("Không tìm thấy api omocaptcha");
        }
        await page.goto(`https://omocaptcha.com/set-key?api_key=${data.configVideoMKT.omo_api_key}`, {
            waitUntil: data.configVideoMKT?.method_load_page ?? "load",
            timeout: data.configVideoMKT?.time_loading_page ?? 25000
        }).catch(() => {});

        logger.info("🚚 Đang mồi trang chủ tiktok...");
        await page.goto('https://www.tiktok.com/', {
            waitUntil: data.configVideoMKT?.method_load_page ?? "load",
            timeout: data.configVideoMKT?.time_loading_page ?? 25000
        }).catch(() => {});

        // 4. Vít ga "Cướp cò" link sản phẩm
        logger.info("⚡ Đang phi thẳng vào trang sản phẩm (Chế độ Cướp Cò)...");
        
        // Sửa 'commit' thành 'domcontentloaded'
        await page.goto(data.task.productUrl, {
            waitUntil: data.configVideoMKT?.method_load_page ?? "load", 
            timeout: 15000
        }).catch(() => {});

        let productTitle = null;
        let productDesc = null;
        let productPathImage = null;

        try {
            // 5. Đợi khoảnh khắc thẻ H1 vừa hiện lên DOM
            await page.waitForSelector(`xpath/${xpathTitle}`, {
                timeout: data.configVideoMKT?.time_wait_getdata ?? 15000
            });

            // 🛑 6. NGAY LẬP TỨC: CHẶN ĐỨNG TRÌNH DUYỆT!
            // Cắt đứt mọi JS đang chạy ngầm để Shopee không thể redirect sang trang tracking
            await page.evaluate(() => window.stop());
            logger.info("🛑 Đã chặn thành công Shopee JS Redirect!");

            // 7. Lấy toàn bộ Data trong 1 lần duy nhất (Title, Desc, Image)
            /* javascript-obfuscator:disable */
            const evaluateScript = `
                (() => {
                    const getByXpath = (xpath) => document.evaluate(xpath, document, null, 9, null).singleNodeValue;
                    
                    const titleEl = getByXpath('${xpathTitle}');
                    const descEl = getByXpath('${xpathDesc}');
                    const imgEl = getByXpath('${xpathImage}');

                    return {
                        title: titleEl ? titleEl.textContent.trim() : "Không tìm thấy tiêu đề",
                        desc: descEl ? descEl.innerText : "Không tìm thấy mô tả",
                        imgSrcset: imgEl && imgEl.src ? imgEl.src : null
                    };
                })();
            `;

            const productData = await page.evaluate(evaluateScript) as {
                title: string;
                desc: string;
                imgSrcset: string | null;
            };

            // Gán data (Lúc này TypeScript đã hiểu và hết báo lỗi)
            productTitle = productData.title;
            productDesc = productData.desc;
            
            logger.info(`💎 Tiêu đề: ${productTitle}`);
            logger.info(`💎 Mô tả: ${productDesc}`);

            // 8. Xử lý ảnh và crop 9:16
            if (productData.imgSrcset) {
                logger.info(`🔗 Link ảnh gốc: ${productData.imgSrcset}`);
                
                // Tiến hành tải ảnh
                const resultSaveImage = await downloadImage(productData.imgSrcset, data.task.save_path_project);
                
                if (resultSaveImage.success) {
                    try {
                        let oldImg = path.join(data.task.save_path_project, resultSaveImage.name);
                        
                        // Xử lý ảnh 9:16
                        const imagePathFinally = await processImageTo916(oldImg);
                        if (imagePathFinally) {
                            productPathImage = path.join(data.task.save_path_project, imagePathFinally);
                        }
                        
                        // Dọn dẹp ảnh cũ
                        try {
                            if (fs.existsSync(oldImg)) {
                                fs.unlinkSync(oldImg);
                                logger.info(`🗑️ Đã dọn dẹp file cũ: ${oldImg}`);
                            }
                        } catch (err) {
                            logger.error("❌ Không xóa được file cũ:", err);
                        }
                    } catch (err) {
                        logger.error("❌ Lỗi xử lý ảnh 9:16:", err);
                    }
                } else {
                    throw new Error("Tải ảnh thất bại");
                }
            } else {
                throw new Error("Không tìm thấy link ảnh trong DOM");
            }

        } catch (error: any) {
            await browser.disconnect();
            logger.error(error);
            throw new Error(error?.message ?? "Lỗi bóc tách dữ liệu Tiktok");
        }

        // 9. Ngắt kết nối (Chỉ ngắt kết nối điều khiển, KHÔNG ĐÓNG trình duyệt)
        await browser.disconnect();
        logger.info("✅ Hoàn tất lấy Info Product!");
        
        return { taskId: data.task.id, productTitle, productDesc, productPathImage };

    } catch (error: any) {
        throw new Error(error?.message ?? "Lỗi Tiktok Service KXD");
    }
}



}