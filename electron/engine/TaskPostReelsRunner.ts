import { ipcMain, IpcMainInvokeEvent } from "electron";
import pLimit from "p-limit";
import { GpmService } from "../services/gpm.service";

import puppeteer from "puppeteer-core";
import { logger } from "../utils/logger";

// Interface cho dữ liệu đầu vào
interface PostReelsTask {
    id: string;
    profile_id: string;
    link_page: string;
    videoPath: string;
    description: string;
    affiliate: string;
}

export class TaskPostReelsRunner {
    private stoppedTaskIds: Set<string> = new Set();
    private event: IpcMainInvokeEvent;
    private data: any;

    // 🔥 Quản lý khóa Profile: Profile nào đang chạy thì Profile sau phải đợi
    private profileLocks: Map<string, Promise<void>> = new Map();

    constructor(event: IpcMainInvokeEvent, data: any) {
        this.event = event;
        this.data = data;

        ipcMain.on("reels:stop-single-task", (_event, taskIds: string[]) => {
            taskIds.forEach((id) => this.stoppedTaskIds.add(id));
        });
    }

    // 🔥 Hàm quản lý khóa để tránh trùng Profile ID
    private async waitAndLockProfile(profileId: string) {
        while (this.profileLocks.has(profileId)) {
            await this.profileLocks.get(profileId);
        }
        let unlock: () => void;
        const lockPromise = new Promise<void>((resolve) => {
            unlock = resolve;
        });
        this.profileLocks.set(profileId, lockPromise);
        return unlock!;
    }

    private sendLog(taskId: string, message: string, status: "pending" | "error" | "done" | "running" = "running") {
        this.event.sender.send("reels:task-log", { id: taskId, message, status });
    }

    async execute() {
        const { tasks, api_gpm, thread, delay_between } = this.data as {
            tasks: PostReelsTask[];
            api_gpm: string;
            thread: number;
            delay_between: number;
        };
        logger.info(String(thread))
        const limit = pLimit(thread);

        const taskPromises = tasks.map((task, index) =>
            limit(async () => {
                if (this.stoppedTaskIds.has(task.id)) return this.handleCancel(task.id);


                // 1. Đợi nếu Profile ID đang bị chiếm dụng
                this.sendLog(task.id, `⏳ Đang đợi Profile ${task.profile_id} rảnh...`, "running");
                const unlock = await this.waitAndLockProfile(task.profile_id);

                try {
                    const port = 5000 + (index % 100);
                    const posData = this.getWindowPosition(index);
                    await this.processSingleTask(task, api_gpm, port, posData.sizeStr,
                        posData.posStr,
                        posData.scale);
                    this.sendLog(task.id, `✅ Hoàn thành Task!`, "done");
                } catch (error: any) {
                    this.sendLog(task.id, `❌ Lỗi: ${error.message}`, "error");
                } finally {
                    // 2. Giải phóng khóa cho Profile ID này
                    unlock();
                    this.profileLocks.delete(task.profile_id);
                    // Delay giữa các task
                    await new Promise((r) => setTimeout(r, delay_between * 1000));
                }
            })
        );

        await Promise.all(taskPromises);
    }
    private getWindowPosition(index: number) {
        const width = 800;  // Tăng lên 800 để FB hiện giao diện Desktop
        const height = 900; // Tăng chiều cao để thấy nút "Đăng"
        const cols = 5;     // Tùy theo màn hình khách hàng mà chỉnh số cột
        const scale = "0.7"; // Scale nhỏ lại để vừa mắt nhưng vẫn là Desktop Mode

        // Tính toán tọa độ x, y
        const x = (index % cols) * (width * parseFloat(scale));
        const y = Math.floor(index / cols) * (height * parseFloat(scale));

        return {
            x: Math.floor(x),
            y: Math.floor(y),
            width,
            height,
            scale,
            // Trả về sẵn format string để ném thẳng vào service
            sizeStr: `${width},${height}`,
            posStr: `${Math.floor(x)},${Math.floor(y)}`
        };
    }
    private async processSingleTask(task: PostReelsTask, api_gpm: string, port: number, windowSize: string, // Mặc định size
        windowPos: string,      // Mặc định tọa độ 0,0
        windowScale: string) {
        this.sendLog(task.id, `🚀 Đang mở trình duyệt GPM...`);

        // Mở GPM Browser
        const gpmClient = new GpmService(api_gpm);

        if (!await gpmClient.checkConnection(api_gpm)) {

        }
        const profile = await gpmClient.startProfile(task.profile_id, port, windowSize, windowPos, windowScale);
        if (!profile.success) throw new Error(profile.message);

        if (!profile.data.remote_debugging_port) {

        }

        const browser = await puppeteer.connect({
            browserURL: `http://127.0.0.1:${profile.data.remote_debugging_port}`,
            defaultViewport: null // Giữ nguyên kích thước cửa sổ của GPM
        });

        try {
            const pages = await browser.pages();
            const page = pages.length > 0 ? pages[0] : await browser.newPage();


            // Bước 1: Truy cập Link Page & Chuyển Page
            await page.goto(task.link_page, { waitUntil: "networkidle2" });
            this.sendLog(task.id, `🔍 Kiểm tra nút Chuyển ngay...`);
            if (this.stoppedTaskIds.has(task.id)) { this.handleCancel(task.id); throw new Error("Task đã dừng"); };

            // Sửa lại như thế này:
            const switchBtn = await page.$("xpath///span[text()='Chuyển ngay' or text()='Switch Now']");
            if (switchBtn) {
                await switchBtn.click();
                await page.waitForNavigation({ waitUntil: "networkidle2" });
                this.sendLog(task.id, `🔄 Đã chuyển sang Page.`);
            }
            if (this.stoppedTaskIds.has(task.id)) { this.handleCancel(task.id); throw new Error("Task đã dừng"); };

            // Bước 2: Vào Feed để đăng
            await page.goto("https://www.facebook.com/reels/create", { waitUntil: "networkidle2" });
            this.sendLog(task.id, `Vào đăng reels`);

            this.sendLog(task.id, `Up video`);
            // Chọn file video (Selector này thường thay đổi, Hoàng cần check lại XPath/Selector thực tế)
            const inputs = await page.$$('input[type="file"]');
            let videoInput;
            for (const input of inputs) {
                const accept = await page.evaluate(el => el.getAttribute('accept'), input);
                if (accept && accept.includes('video')) {
                    videoInput = input;
                    break;
                }
            }
            if (videoInput) {
                await videoInput.uploadFile(task.videoPath);
                this.sendLog(task.id, `✅ Đã đẩy video vào input thành công!`);
            }
            if (this.stoppedTaskIds.has(task.id)) { this.handleCancel(task.id); throw new Error("Task đã dừng"); };

            const postBtnW = "xpath///span[text()='Tiếp' or text()='Next']";
            const postBtn = await page.waitForSelector(postBtnW, { visible: true, timeout: 30000 });
            if (postBtn) {
                await postBtn.click();
                this.sendLog(task.id, `Đã tiếp`);

            }
            if (this.stoppedTaskIds.has(task.id)) { this.handleCancel(task.id); throw new Error("Task đã dừng"); };

            await new Promise(resolve => setTimeout(resolve, 5000));
            if (this.stoppedTaskIds.has(task.id)) { this.handleCancel(task.id); throw new Error("Task đã dừng"); };



            // Bước 3: Nhập title
            if (this.stoppedTaskIds.has(task.id)) { this.handleCancel(task.id); throw new Error("Task đã dừng"); };

            this.sendLog(task.id, `Nhập title`);

            const postAreaBtnModal = 'xpath///div[@contenteditable="true" and @role="textbox" and (contains(@aria-placeholder, "Mô tả thước phim của bạn...") or contains(@aria-placeholder, "Describe your reel...") )]';
            await page.waitForSelector(postAreaBtnModal, { visible: true, timeout: 30000 });
            await page.click(postAreaBtnModal);
            await page.keyboard.type(task.description, { delay: 50 });

            if (this.stoppedTaskIds.has(task.id)) { this.handleCancel(task.id); throw new Error("Task đã dừng"); };

            const postBtnW2 = "xpath///span[text()='Tiếp' or text()='Next']";
            const postBtn2 = await page.waitForSelector(postBtnW2, { visible: true, timeout: 30000 });
            if (postBtn2) {
                await postBtn2.click();
                this.sendLog(task.id, `Đã tiếp`);

            }
            await new Promise(resolve => setTimeout(resolve, 10000));
            if (this.stoppedTaskIds.has(task.id)) { this.handleCancel(task.id); throw new Error("Task đã dừng"); };

            const postBtnW3 = "xpath///span[text()='Đăng' or text()='Post']";
            const postBtn3 = await page.waitForSelector(postBtnW3, { visible: true, timeout: 30000 });
            if (postBtn3) {
                await postBtn3.click();
                this.sendLog(task.id, `Đã tiếp`);

            }


            // Bước 3: Comment (Lấy link bài vừa đăng hoặc bài mới nhất trên profile)
            /* this.sendLog(task.id, `💬 Đang viết bình luận...`);
            await page.goto(task.link_page, { waitUntil: "networkidle2" }); */
            // Logic tìm bài viết đầu tiên và cmt...
            // (Phần này Hoàng cần soi Selector chính xác của FB tại thời điểm đó)
            this.sendLog(task.id, `💬 Bắt đầu quy trình bình luận bài viết...`);
            if (this.stoppedTaskIds.has(task.id)) { this.handleCancel(task.id); throw new Error("Task đã dừng"); };

            // 1. Đợi một chút để Facebook xử lý video (Reels thường mất 15-30s để hiện lên wall)
            this.sendLog(task.id, `⏳ Đợi 20s cho Facebook xử lý video...`);
            await new Promise(r => setTimeout(r, 20000));
            if (this.stoppedTaskIds.has(task.id)) { this.handleCancel(task.id); throw new Error("Task đã dừng"); };

            // 2. Quay lại trang Page/Profile để tìm bài
            await page.goto(task.link_page, { waitUntil: "networkidle2" });
            this.sendLog(task.id, `🔍 Đang tìm bài viết mới nhất...`);
            if (this.stoppedTaskIds.has(task.id)) { this.handleCancel(task.id); throw new Error("Task đã dừng"); };

            try {
                // 3. Cuộn xuống một chút để kích hoạt load bài viết
                await page.evaluate(() => window.scrollBy(0, 500));
                await new Promise(r => setTimeout(r, 2000));
                if (this.stoppedTaskIds.has(task.id)) { this.handleCancel(task.id); throw new Error("Task đã dừng"); };

                // 4. Tìm ô "Viết bình luận" (Cái đầu tiên thường là bài mới nhất)
                // Selector này bắt ô comment của Facebook mới nhất
                const commentBoxSelector = 'xpath///div[contains(text(), "Bình luận dưới tên") or contains(text(), "Viết bình luận") or contains(text(), "Comment as") or contains(text(), "Comment")]';

                await page.waitForSelector(commentBoxSelector, { visible: true, timeout: 15000 });
                const commentBoxes = await page.$$(commentBoxSelector);

                if (commentBoxes.length > 0) {
                    // Click vào ô comment đầu tiên tìm thấy
                    await commentBoxes[0].click();

                    // 5. Nhập nội dung comment từ task
                    // delay 50-100ms để giống người thật, tránh bị FB quét spam comment
                    await page.keyboard.type(`Mua ở đây nè ${task.affiliate}`, { delay: 100 });

                    // 6. Nhấn Enter để gửi
                    await page.keyboard.press('Enter');

                    this.sendLog(task.id, `✅ Đã gửi bình luận: "${task.affiliate}"`, "done");
                    if (this.stoppedTaskIds.has(task.id)) { this.handleCancel(task.id); throw new Error("Task đã dừng"); };

                    // Đợi 2s xác nhận cmt đã bay đi
                    await new Promise(r => setTimeout(r, 10000));
                } else {
                    this.sendLog(task.id, `⚠️ Không tìm thấy ô bình luận nào trên trang.`, "running");
                }

            } catch (error) {
                this.sendLog(task.id, `❌ Lỗi khi comment: Bài viết chưa hiện hoặc Selector thay đổi.`, "error");
                // Chụp cái ảnh màn hình để debug nếu lỗi (tùy chọn)
                // await page.screenshot({ path: `debug_comment_${task.id}.png` });
            }
        } finally {
            await browser.disconnect();
            await gpmClient.stopProfile(task.profile_id);
        }
    }

    private handleCancel(taskId: string) {
        this.sendLog(taskId, `🚫 Task đã bị hủy.`, "error");
        this.stoppedTaskIds.delete(taskId);
        return null;
    }
}