import puppeteer from 'puppeteer-core';
import { GpmService } from './gpm.service';
import { IpcMainInvokeEvent } from "electron";
import { downloadImage } from './download.service';
import { processImageTo916 } from './image.service';
import path from 'path';
import fs from 'fs';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface ShopeeProductIds {
    shopId: string;
    productId: string;
}

export const getShopeeIds = (url: string): ShopeeProductIds | null => {
    if (!url) return null;

    try {
        // Regex 1: Định dạng tên-sản-phẩm-i.60034313.24800471037
        const type1Regex = /i\.(\d+)\.(\d+)/;
        
        // Regex 2: Định dạng /product/60034313/43363406360
        const type2Regex = /product\/(\d+)\/(\d+)/;

        const match = url.match(type1Regex) || url.match(type2Regex);

        if (match && match.length >= 3) {
            return {
                shopId: match[1],
                productId: match[2]
            };
        }

        return null;
    } catch (error) {
        console.error("❌ Lỗi parse Shopee URL:", error);
        return null;
    }
};

async function getInfoProduct(port: number, data: any) {
    try {
        // 1. Kết nối vào trình duyệt GPM đang mở qua Port
        // GPM chạy ở local nên mình dùng 127.0.0.1
        await sleep(3000);
        const browser = await puppeteer.connect({
            browserURL: `http://127.0.0.1:${port}`,
            defaultViewport: null // Giữ nguyên kích thước cửa sổ của GPM
        });

        console.log("🔗 Đã kết nối thành công vào trình duyệt GPM!");

        // 2. Lấy danh sách các Tab (Pages)
        const pages = await browser.pages();
        // Nếu có tab đang mở thì dùng luôn, không thì tạo tab mới
        const page = pages.length > 0 ? pages[0] : await browser.newPage();

        // 3. Thực hiện lệnh "Vít ga" điều hướng
        console.log("🚚 Đang đi đến Shopee để cào dữ liệu...");
        await page.goto('https://shopee.vn', {
            waitUntil: data.configVideoMKT?.method_load_page ?? "load", // Đợi mạng ổn định mới làm tiếp
            timeout: data.configVideoMKT?.time_loading_page ?? 60            // Chờ tối đa 60s
        });

        await page.goto(data.task.productUrl, {
            waitUntil: data.configVideoMKT?.method_load_page ?? "load", // Đợi mạng ổn định mới làm tiếp
            timeout: data.configVideoMKT?.time_loading_page ?? 60            // Chờ tối đa 60s
        });
        // 1. Chờ cho đến khi cái Selector tương ứng với XPath hiện ra
        // Lưu ý: Puppeteer hiện đại hỗ trợ cú pháp ::xpath trực tiếp trong waitForSelector
        
        const xpathSelectorTitle = 'xpath///div[@role="main"]/section/section[2]/div/div/h1';

        let productTitle = null
        try {
            // Đợi cái thẻ H1 xuất hiện (timeout theo config của MinMin)
            await page.waitForSelector(xpathSelectorTitle, {
                timeout: data.configVideoMKT?.time_wait_getdata ?? 15000
            });
            /* javascript-obfuscator:disable */
            // 2. Lấy Text Content ra "vít ga"
            productTitle = await page.evaluate((targetXpath) => {
                const result = document.evaluate(
                    targetXpath,
                    document,
                    null,
                    9,
                    null
                ).singleNodeValue;

                return result ? result.textContent?.trim() : "Không tìm thấy tiêu đề";
            }, "//div[@role='main']/section/section[2]/div/div/h1");
            /* javascript-obfuscator:enable */
            console.log("💎 Tiêu đề sản phẩm lấy được:", productTitle);

        } catch (error) {
            console.error("❌ Lỗi: Chờ quá lâu mà không thấy tiêu đề đâu!", error);
        }


        const xpathSelectorDesc = 'xpath///div[@class="product-detail page-product__detail"]/section[2]//p[1]';
        let productDesc = null
        try {
            // Đợi cái thẻ H1 xuất hiện (timeout theo config của MinMin)
            await page.waitForSelector(xpathSelectorDesc, {
                timeout: data.configVideoMKT?.time_wait_getdata ?? 15000
            });
             /* javascript-obfuscator:disable */
            // 2. Lấy Text Content ra "vít ga"
            productDesc = await page.evaluate((xpath) => {
                const element = document.evaluate(
                    xpath,
                    document,
                    null,
                    9,
                    null
                ).singleNodeValue;
                return element ? element.textContent?.trim() : "Không tìm thấy mô tả";
            }, "//div[@class='product-detail page-product__detail']/section[2]//p[1]");
            /* javascript-obfuscator:enable */
            console.log("💎 mô tả sản phẩm lấy được:", productDesc);

        } catch (error) {
            console.error("❌ Lỗi: Chờ quá lâu mà không thấy mô tả đâu!", error);
        }


        console.log("✅ Đã tìm kiếm xong!");

        const xpathSource = '//div[not(.//img[@alt="icon video play"])]/div/picture/source[@type="image/webp"]/following-sibling::img[1]';
        const xpathSelectorSource = `xpath/${xpathSource}`;
        let productPathImage = null
        try {
            // 1. Đợi thẻ source xuất hiện
            await page.waitForSelector(xpathSelectorSource, {
                timeout: data.configVideoMKT?.time_wait_getdata ?? 15000
            });
            /* javascript-obfuscator:disable */
            // 2. Lấy giá trị srcset
            const rawSrcset = await page.evaluate((xpath) => {
                const element = document.evaluate(
                    xpath,
                    document,
                    null,
                    9,
                    null
                ).singleNodeValue as HTMLSourceElement;

                if (!element) return null;
                // srcset có thể là "link1 1x, link2 2x" -> lấy cái đầu tiên
                return element.srcset.split(' ')[0];
            }, xpathSource);
            /* javascript-obfuscator:enable */
            if (rawSrcset) {
                console.log("🔗 Link ảnh lấy được:", rawSrcset);
                const highRawSrcset = rawSrcset.replace("resize_w82", "resize_w780")
                // Tiến hành tải ảnh (Bước 2 bên dưới)
                const resultSaveImage = await downloadImage(highRawSrcset, data.task.save_path_project);
  
                
                if (resultSaveImage.success) {
                    try {
                        let oldImg = path.join(data.task.save_path_project, resultSaveImage.name);
    
                        const imagePathFinally = await processImageTo916(oldImg)
                        if (imagePathFinally) {
                            productPathImage = path.join(data.task.save_path_project,imagePathFinally)

                        }
                        try {
                            if (fs.existsSync(oldImg)) {
                                fs.unlinkSync(oldImg);
                                console.log(`🗑️ Đã dọn dẹp file cũ: ${oldImg}`);
                            }
                        } catch (err) {
                            console.error("❌ Không xóa được file:", err);
                        }
                    } catch (err) {
                        console.error("❌ Lỗi xử lý ảnh 9:16:", err);
                        
                    }


                }
            }else{
                throw new Error("Không tìm thấy ảnh")
            }

        } catch (error:any) {
            await browser.disconnect();
            throw new Error(error?.message ?? "Lỗi shopee service kxd")
        }

        // 5. Ngắt kết nối (Chỉ ngắt kết nối điều khiển, KHÔNG ĐÓNG trình duyệt)
        await browser.disconnect();
        
        return { taskId: data.task.id, productTitle, productDesc, productPathImage }

    } catch (error: any) {
        throw new Error(error?.message ?? "Lỗi shopee service kxd")
    }
}

export async function shopeeService(_event: IpcMainInvokeEvent,gpmClient: GpmService,profileId:string,port:number,delay_between:number,data:any,task:any) {
    let productInfo=null
    let result : {success:boolean, message:string,data: any} = {success: false,message:"[ShopeeService] Lỗi không xác định",data:null} ;
    try {
        _event.sender.send('video:task-log', { status: 'processing', message: `🚀 Mở trình duyệt lấy Info`, taskId: task.id });

        const startResult = await gpmClient.startProfile(profileId, port);
        if (!startResult.success) throw new Error(startResult.message);

     
  
        if (startResult.data.remote_debugging_port) {
            productInfo = await getInfoProduct(startResult.data.remote_debugging_port, { ...data, task });

            _event.sender.send('video:task-log', {
                status: 'processing',
                message: `✅ Lấy Info thành công`,
                data: productInfo,
                taskId: task.id
            });

            result.success=true
            result.message = "Lấy data thành công"
            result.data = productInfo;

        }
    } catch (err:any) {
        _event.sender.send('video:task-log', { status: 'error', message: `Lỗi cào dữ liệu: ${err}`, taskId: task.id });
        result.success = false
        result.message = err?.message ?? "[ShopeeService] Lỗi không xác định"

    } finally {
        // QUAN TRỌNG: Xong việc với Browser là ĐÓNG NGAY để nhả Profile cho task tiếp theo
        await gpmClient.stopProfile(profileId);
        await sleep(delay_between * 1000);
        console.log(`🔓 Nhả Profile ${profileId} cho luồng khác.`);
        return result
    }

}