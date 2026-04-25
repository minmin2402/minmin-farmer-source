import { ipcMain, IpcMainInvokeEvent } from "electron";
import pLimit from "p-limit";
import { GrokProfileManager } from "../manager/ProfileManager";
import { gpmService } from "../services/gpm.service";
import { GrokService } from "../services/grok.service";
import fs from 'fs';

import { logger } from "../utils/logger";
import { VeoService } from "../services/veo.service";
import { checkPathExists } from "../utils/file";

export class TaskRunnerImage {
    private stoppedFlag: boolean = false;
    private event: IpcMainInvokeEvent
    private data: any


    constructor(event: IpcMainInvokeEvent, data: any) {
        this.event = event
        this.data = data
        // Đăng ký lắng nghe sự kiện dừng từ UI
        // Lắng nghe sự kiện dừng một Task cụ thể từ UI
        ipcMain.on('image:stop-task', (_event) => {
            this.stoppedFlag = true

        });

    }
    private handleCancel(taskId: string, index: number) {
        this.event.sender.send('image:task-log', {
            status: 'error',
            message: `🚫 Task đã được người dùng hủy thành công.`,
            index,
            taskId
        });
        return null;
    }

    async execute() {

        const { tasks, selectedProfiles, aspectRatio, threads, gpm_api_key, output_folder, engine = 'grok' } = this.data;
        let aspectRatioArg = "--ar 16:9"
        if (aspectRatio == "IMAGE_ASPECT_RATIO_LANDSCAPE"){
            aspectRatioArg = "--ar 16:9"
        }else if (aspectRatio == "IMAGE_ASPECT_RATIO_PORTRAIT"){
            aspectRatioArg = "--ar 9:16"

        }

        for (const task of tasks) {
            this.event.sender.send('video:task-log', {
                status: 'processing',
                message: `⏳ Đang chuẩn bị xử lý...`, // Đổi lại lời nhắn cho hợp lý
                taskId: task.id // Nhớ trỏ đúng thuộc tính id của task (task.id hoặc task.taskId)
            });
        }
        const maxThreads = threads || 1;
        const limit = pLimit(maxThreads);

        const grokManager = new GrokProfileManager(selectedProfiles);

        const gpmClient = new gpmService(gpm_api_key);
        const grokService = new GrokService();
        const veoService = new VeoService();


        const checkGPM = await gpmClient.checkConnection(gpm_api_key);
        if (!checkGPM.success)
            return { success: false, message: checkGPM.message };
        if (!fs.existsSync(output_folder)) {
            return {
                success: false,
                message: "Thư mục lưu video không tồn tại."
            };
        }
        if (selectedProfiles.length == 0)
            return { success: false, message: "Profile Grok ít nhất phải có 1" };

        const retryStep = async (fn: () => Promise<any>, stepName: string, taskId: string, maxRetries = 3) => {
            for (let i = 1; i <= maxRetries; i++) {
                if (this.stoppedFlag) throw new Error("CANCELLED");
                try {
                    const result = await fn();
                    // Nếu hàm fn() không return gì (void) thì vẫn coi là xong, 
                    // trừ khi result có thuộc tính success === false
                    if (result && result.success === false) {
                        throw new Error(result?.message || `Lỗi logic tại ${stepName}`);
                    }
                    return result;
                } catch (error: any) {
                    // CHIÊU THỨ NHẤT: In chi tiết lỗi ra console của Node/Electron để soi
                    const errorMessage = error.response?.data?.message || error.message || "Unknown Error";
                    logger.error(`❌ [${stepName}] Lần ${i} thất bại: ${errorMessage}`);

                    // Gửi cả nội dung lỗi chi tiết lên UI để ông nhìn thấy ngay trên bảng log
                    this.event.sender.send('image:task-log', {
                        status: 'processing',
                        message: `⚠️ ${stepName} lỗi (Lần ${i}): ${errorMessage.substring(0, 50)}...`,
                        taskId: taskId
                    });

                    if (i === maxRetries) throw error;
                    await new Promise(res => setTimeout(res, 3000)); // Tăng lên 3s cho an toàn
                }
            }
        };
        const sendLog = async (taskId: string, status: string = 'processing', log: string = "") => {
            this.event.sender.send('image:task-log', {
                status: status,
                message: log,
                taskId: taskId
            });
        }
        const promises = tasks.map((task: any, index: number) => {
            return limit(async () => {
                try {
                    const imageAIPath = await retryStep(async () => {
                        if (this.stoppedFlag) throw new Error("CANCELLED");

                        await sendLog(task.id,'processing',`Chuẩn bị tạo ảnh ${engine}`)
                        

                        if (task.resultImagePath && await checkPathExists(task.resultImagePath)) {
                            await sendLog(task.id,'processing',`Task đã có ảnh`)
                            return null
                        }

                        const port = 5000 + (index % 100);

                        const profileNum = index % selectedProfiles.length

                        const finalImagePrompt = task.prompt;

                        if (engine == "veo3") {

                            await veoService.initHeaderVeo(
                                sendLog,
                                task.id,
                                gpmClient,
                                selectedProfiles[profileNum], // Dùng profile đầu tiên trong list Veo3 để lấy token
                                5000 + (index % 100),
                                5000
                            );
                            /* const token = veoService.getToken(profiles_veo3[0]);
                            if (!token) throw new Error("Veo3 Token (ya29) không khả dụng");
                            const projectId = veoService.getProjectId(profiles_veo3[0])

                            const uploadRes = await veoService.uploadImageToLabs(productInfo.productPathImage, projectId, token)
                            logger.info(`[DRAW IMG]: `, uploadRes)
                            // Gọi hàm vẽ ảnh từ VeoService (Ông cần thêm hàm generateImage vào veo.service.ts nhé)
                            const imgRes = await veoService.generateImageLabs(
                                finalImagePrompt,
                                [uploadRes.mediaId],
                                profiles_veo3[0],
                                save_path_project,
                                task.id,

                            );
                            return imgRes.filePath; */
                        } else {
                            // LUỒNG GROK VẼ ẢNH CŨ
                            if (this.stoppedFlag) throw new Error("CANCELLED");

                            const initRes = await grokService.initHeaderGrok(sendLog, task.id, grokService, grokManager, gpmClient, selectedProfiles[profileNum], port, 5000);
                            if (!initRes.success) throw new Error("Init Grok thất bại");
                            if (this.stoppedFlag) throw new Error("CANCELLED");

                            const imgRes = await grokService.generateReviewVideoImage(
                                sendLog,
                                `${aspectRatioArg} ${finalImagePrompt}`,
                                task.inputImagePath,
                                selectedProfiles[profileNum],
                                output_folder,
                                false,
                                "",
                                aspectRatioArg,
                                
                            );
                            if (!imgRes.success) throw new Error(`Grok không vẽ được ảnh: ${imgRes?.message ?? "KXD"}`);
                            return imgRes.filePath;
                        }

                    }, "Khởi tạo & Vẽ ảnh", task.id, 4);

                    if (!imageAIPath || !fs.existsSync(imageAIPath)) {
                        this.event.sender.send('image:task-log', { status: 'error', taskId: task.id });
                        return null;
                    } else {

                        this.event.sender.send('image:task-log', {
                            status: 'processing',
                            message: `Cập nhật ảnh AI`,
                            taskId: task.id,
                            data: {
                                resultImagePath: imageAIPath
                            }
                        });
                    }
                } catch (error: any) {
                    if (error.message === "CANCELLED") {
                        return this.handleCancel(task.id, index);
                    }

                    this.event.sender.send('image:task-log', {
                        status: 'error',
                        message: `❌ Fail: ${error.message}`,
                        taskId: task.id
                    });
                    return null;
                }
            })
        })

        const allResults = await Promise.all(promises);
        ipcMain.removeAllListeners('image:stop-tasks');
        return { success: true, data: allResults.filter(r => r !== null) };
    }

}