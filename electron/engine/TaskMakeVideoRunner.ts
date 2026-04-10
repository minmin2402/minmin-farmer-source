import { ipcMain, IpcMainInvokeEvent } from "electron";
import pLimit from "p-limit";
import { gpmService } from "../services/gpm.service";
import { shopeeService } from "../services/shopee.service";
import { GrokService } from "../services/grok.service";
import { GeminiKeyManager } from "../manager/GeminiKeyManager";
import { GeminiService } from "../gemini.service";
import { GrokProfileManager, ShopeeProfileManager } from "../manager/ProfileManager";

export class TaskRunner {
    private stoppedTaskIds: Set<string> = new Set();
    private event: IpcMainInvokeEvent
    private data: any


    constructor(event: IpcMainInvokeEvent, data: any) {
        this.event = event
        this.data = data
        // Đăng ký lắng nghe sự kiện dừng từ UI
        // Lắng nghe sự kiện dừng một Task cụ thể từ UI
        ipcMain.on('video:stop-single-task', (_event, taskIds: string[]) => {
            taskIds.forEach(id => {
                if (!this.stoppedTaskIds.has(id)) {
                    this.stoppedTaskIds.add(id);
                    this.event.sender.send('video:task-log', {
                        status: 'warning',
                        message: '⚠️ Đang đợi hủy task này...',
                        id
                    });
                }
            });

        });
    }
    private handleCancel(taskId: string, index: number) {
        this.event.sender.send('video:task-log', {
            status: 'error',
            message: `🚫 Task đã được người dùng hủy thành công.`,
            index,
            taskId
        });
        // Xóa khỏi danh sách chờ sau khi đã xử lý xong
        this.stoppedTaskIds.delete(taskId);
        return null;
    }
    async execute() {

        const { tasks, configVideoMKT } = this.data;
        const { prompt_review, profiles_aff, thread, apikey_gemini, delay_between, profiles_grok, prompt_image, output_video, prompt_video } = configVideoMKT;

        // Cho phép chạy tối đa số thread người dùng nhập, không quan tâm có bao nhiêu profile
        const maxThreads = thread || 1;
        const limit = pLimit(maxThreads);

        const keyManager = new GeminiKeyManager(apikey_gemini);
        const shopeeManager = new ShopeeProfileManager(profiles_aff);
        const grokManager = new GrokProfileManager(profiles_grok);


        const gpmClient = new gpmService(configVideoMKT.api_gpm);
        const grokService = new GrokService();

        const checkGPM = await gpmClient.checkConnection(configVideoMKT.api_gpm);
        if (!checkGPM.success)
            return { success: false, message: checkGPM.message };
        if (apikey_gemini.length == 0)
            return { success: false, message: "Api Gemini ít nhất phải có 1" };
        if (profiles_aff.length == 0)
            return { success: false, message: "Profile Shoppe ít nhất phải có 1" };
        if (profiles_grok.length == 0)
            return { success: false, message: "Profile Grok ít nhất phải có 1" };

        const retryStep = async (fn: () => Promise<any>, stepName: string, taskId: string, maxRetries = 3) => {
            for (let i = 1; i <= maxRetries; i++) {
                try {
                    const result = await fn();
                    if (result && (result.success !== false)) return result; // Thành công thì trả về luôn
                    throw new Error(result?.message || `Lỗi tại bước ${stepName}`);
                } catch (error: any) {
                    this.event.sender.send('video:task-log', {
                        status: 'processing',
                        message: `⚠️ ${stepName} lỗi lần ${i}. ${i < maxRetries ? 'Đang thử lại...' : 'Thất bại hoàn toàn!'}`,
                        taskId: taskId
                    });
                    if (i === maxRetries) throw error; // Hết lượt thì ném lỗi ra ngoài
                    await new Promise(res => setTimeout(res, 2000)); // Nghỉ 2s rồi thử lại chặng này
                }
            }
        };

        const promises = tasks.map((task: any, index: number) => {
            return limit(async () => {
                let currentProfileId = "";
                let currentProfileGrokId = "";

                try {
                    // --- CHẶNG 1: LẤY DATA SHOPEE ---
                    const productInfo = await retryStep(async () => {
                        currentProfileId = await shopeeManager.getAvailableProfile();
                        const port = 5000 + (index % 100);

                        if (this.stoppedTaskIds.has(task.id)) throw new Error("CANCELLED");

                        const res = await shopeeService(this.event, gpmClient, currentProfileId, port, delay_between, this.data, task);

                        // Nhả profile ngay sau khi xong chặng Shopee
                        await shopeeManager.releaseProfile(currentProfileId);
                        currentProfileId = "";

                        if (!res.success) throw new Error(res.message || "Lỗi cào Shopee");
                        return res.data;
                    }, "Cào dữ liệu Shopee", task.id);

                    // Checkpoint: Nếu chỉ lấy thông tin thì dừng tại đây
                    if (task.mode === "Chỉ lấy thông tin sản phẩm") {
                        this.event.sender.send('video:task-log', { status: 'success', message: 'Lấy data Shopee thành công!', taskId: task.id });
                        return null;
                    }

                    // --- CHẶNG 2: TẠO PROMPT AI (GEMINI) ---
                    const resultGenPrompt = await retryStep(async () => {
                        if (this.stoppedTaskIds.has(task.id)) throw new Error("CANCELLED");

                        const currentKey = await keyManager.getAvailableKey();
                        const geminiService = new GeminiService(currentKey);
                        const res = await geminiService.generateVideoPrompt(prompt_video, productInfo.productTitle, productInfo.productDesc, prompt_review, task.outputCount);

                        keyManager.releaseKey(currentKey);
                        if (!res.success) throw new Error("Gemini không tạo được prompt");

                        this.event.sender.send('video:task-log', { status: 'processing', message: `✅ Prompt thành công`, data: { prompt: res.data }, taskId: task.id });
                        return res.data;
                    }, "Tạo Prompt AI", task.id);

                    // --- CHẶNG 3: INIT GROK & VẼ ẢNH ---
                    const imageAIPath = await retryStep(async () => {
                        if (this.stoppedTaskIds.has(task.id)) throw new Error("CANCELLED");
                        if (!productInfo?.productPathImage) throw new Error("Không tìm thấy ảnh gốc Shopee");

                        currentProfileGrokId = await grokManager.getAvailableProfile();
                        const port = 5000 + (index % 100);
                        const profileNum = (index % profiles_grok.length) + 1;

                        // Init Header
                        const initRes = await grokService.initHeaderGrok(this.event, profileNum,task.id ,grokService, gpmClient, currentProfileGrokId, port);
                        if (!initRes.success) {
                            await grokManager.releaseProfile(currentProfileGrokId);
                            throw new Error("Init Grok thất bại");
                        }

                        // Gen Image
                        const imgRes = await grokService.generateReviewVideoImage(
                            prompt_image,
                            output_video + "/" + productInfo.productPathImage,
                            profileNum,
                            output_video,
                            task.id
                        );

                        await grokManager.releaseProfile(currentProfileGrokId); // Xong việc là nhả ngay
                        currentProfileGrokId = "";

                        if (!imgRes.success) throw new Error("Grok không vẽ được ảnh");

                        this.event.sender.send('video:task-log', { status: 'processing', message: `🎨 Đã vẽ xong ảnh AI`, data: { imageAIPath: imgRes.filePath },  taskId: task.id });
                        return imgRes.filePath;
                    }, "Khởi tạo & Vẽ ảnh Grok", task.id);

                    // --- CHẶNG 4: RENDER VIDEO (Khâu hay lỗi nhất) ---
                    await retryStep(async () => {
                        if (this.stoppedTaskIds.has(task.id)) throw new Error("CANCELLED");

                        const profileNum = (index % profiles_grok.length) + 1;
                        const resVideo = await grokService.createVideoForPromptCore(
                            this.event,
                            resultGenPrompt,
                            task.id,
                            output_video,
                            profileNum,
                            imageAIPath,
                            task.outputCount
                        );

                        if (!resVideo.success) throw new Error("Render Video thất bại");

                        this.event.sender.send('video:task-log', {
                            status: 'success',
                            message: `✅ DONE! Video: ${resVideo.filename}`,
                            data: { videoAIPath: resVideo.filename },
                            taskId: task.id,
                            index
                        });
                        return resVideo;
                    }, "Render Video Final", task.id);

                } catch (error: any) {
                    // Giải phóng tài nguyên tồn đọng nếu tất cả các lần retry đều fail
                    if (currentProfileId) await shopeeManager.releaseProfile(currentProfileId);
                    if (currentProfileGrokId) await grokManager.releaseProfile(currentProfileGrokId);

                    if (error.message === "CANCELLED") {
                        return this.handleCancel(task.id, index);
                    }

                    this.event.sender.send('video:task-log', {
                        status: 'error',
                        message: `❌ Dừng Task do lỗi nặng: ${error.message}`,
                        taskId: task.id
                    });
                    return null;
                }
            })
        });


        const allResults = await Promise.all(promises);
        ipcMain.removeAllListeners('video:stop-single-task');
        return { success: true, data: allResults.filter(r => r !== null) };


    }


}