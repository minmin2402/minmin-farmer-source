
import { ipcMain, IpcMainInvokeEvent } from "electron";
import pLimit from "p-limit";
import { gpmService } from "../services/gpm.service";
import { getShopeeIds, shopeeService } from "../services/shopee.service";
import { GrokService } from "../services/grok.service";
import { GeminiKeyManager } from "../manager/GeminiKeyManager";
import { GeminiService } from "../services/gemini.service";
import { GrokProfileManager, ShopeeProfileManager } from "../manager/ProfileManager";
import fs from 'fs';
import path from "path";
import { VbeeService } from "../services/vbee.service";
import { addLogoToVideo, mergeAudioToVideo } from "../services/ffmpeg.service";
import { logger } from "../utils/logger";
import { deletePath } from "../utils/file";

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
        const { prompt_review, voice_code, vbee_app_token, isEnabledLogo, logoPath, vbee_app_id, save_shopid_productid, profiles_aff, thread, apikey_gemini, delay_between, profiles_grok, prompt_image, output_video, prompt_video } = configVideoMKT;

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
        if (!fs.existsSync(output_video)) {
            return {
                success: false,
                message: "Vui lòng chọn lại đường dẫn lưu video trong cấu hình."
            };
        }
        if (apikey_gemini.length == 0)
            return { success: false, message: "Api Gemini ít nhất phải có 1" };
        if (profiles_aff.length == 0)
            return { success: false, message: "Profile Shoppe ít nhất phải có 1" };
        if (profiles_grok.length == 0)
            return { success: false, message: "Profile Grok ít nhất phải có 1" };
        if (!vbee_app_id || !vbee_app_token)
            return { success: false, message: "Sai cấu hình Vbee AI" };


        const retryStep = async (fn: () => Promise<any>, stepName: string, taskId: string, maxRetries = 3) => {
            for (let i = 1; i <= maxRetries; i++) {
                if (this.stoppedTaskIds.has(taskId)) throw new Error("CANCELLED");
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
                let save_path_project = output_video;
                if (save_shopid_productid) {
                    const infoS = await getShopeeIds(task.productUrl)
                    if (infoS?.shopId) {
                        save_path_project = path.join(output_video, infoS?.shopId, infoS?.productId)
                    }

                }
                task.save_path_project = save_path_project

                let currentProfileId = "";
                let currentProfileGrokId = "";

                try {
                    // --- CHẶNG 1: LẤY DATA SHOPEE ---
                   
                    const productInfo = await retryStep(async () => {
                        if (!(task.mode === "Chỉ lấy thông tin sản phẩm" || task.mode.includes("TT"))){
                            return {
                                productTitle: task.productName,
                                productDesc:  task.productDesc,
                                productPathImage: task.productPathImg
                            }
                        }
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

                    

                    if (!productInfo.productTitle || !productInfo.productDesc || !productInfo.productPathImage || !fs.existsSync(productInfo.productPathImage)){
                        this.event.sender.send('video:task-log', { status: 'error', message: 'Thiếu dữ liệu sản phẩm, hãy thử lại!', taskId: task.id });
                        return null;
                    }

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
                        const res = await geminiService.generateVideoPrompt(productInfo.productTitle, productInfo.productDesc, prompt_review, task.outputCount);

                        keyManager.releaseKey(currentKey);
                        if (!res.success) throw new Error("Gemini không tạo được prompt");

                        this.event.sender.send('video:task-log', { status: 'processing', message: `✅ Prompt thành công`, data: { prompt: prompt_video }, taskId: task.id });
                        return res.data;
                    }, "Tạo Prompt AI", task.id);

                    if (resultGenPrompt.length < task.outputCount) {
                        throw new Error("Số phân cảnh tạo không đủ")
                    }

                    // --- CHẶNG 3: INIT GROK & VẼ ẢNH ---
                    const imageAIPath = await retryStep(async () => {
                        if (this.stoppedTaskIds.has(task.id)) throw new Error("CANCELLED");

                        if (!task.mode.includes('Ảnh AI')){
                            return task.aiImagePath
                        }

                        // --- KHỐI 1: LẤY HEADER (CẦN PROFILE) ---
                        let profileIdForInit = "";
                        try {
                            profileIdForInit = await grokManager.getAvailableProfile();
                            const port = 5000 + (index % 100);
                            const profileNum = (index % profiles_grok.length) + 1;

                            const initRes = await grokService.initHeaderGrok(
                                this.event, profileNum, task.id, grokService,
                                gpmClient, profileIdForInit, port, delay_between
                            );

                            if (!initRes.success) throw new Error("Init Grok thất bại");

                            logger.info(`✅ Đã bốc được Header cho Task ${task.id}, chuẩn bị nhả Profile ${profileIdForInit}`);

                        } catch (err) {
                            throw err; // Ném lỗi để retryStep bắt được
                        } finally {
                            // 🔓 GIẢI PHÓNG SỚM TẠI ĐÂY: Dù init thành công hay lỗi đều nhả Profile
                            if (profileIdForInit) {
                                await grokManager.releaseProfile(profileIdForInit);
                                logger.info(`🔓 Profile ${profileIdForInit} đã trống cho task khác.`);
                            }
                        }

                        // --- KHỐI 2: VẼ ẢNH (CHỈ DÙNG HTTP REQUEST, KHÔNG CẦN PROFILE) ---
                        if (this.stoppedTaskIds.has(task.id)) throw new Error("CANCELLED");

                        let genderPrompt = voice_code.includes("female") ? "realistic female host" : "realistic male host";
                       

                        const imgRes = await grokService.generateReviewVideoImage(
                            prompt_image + `\n ${genderPrompt}`,
                            productInfo.productPathImage,
                            (index % profiles_grok.length) + 1, // Vẫn truyền profileNum để lấy đúng Header đã lưu
                            save_path_project,
                            task.id
                        );

                        if (!imgRes.success) throw new Error("Grok không vẽ được ảnh");

                        return imgRes.filePath;

                    }, "Khởi tạo & Vẽ ảnh Grok", task.id);

                    if (!imageAIPath || !fs.existsSync(imageAIPath)){
                        this.event.sender.send('video:task-log', { status: 'error', message: 'Thiếu dữ liệu ảnh AI thử lại', taskId: task.id });
                        return null;
                    }

                    // --- CHẶNG 4: RENDER VIDEO (Khâu hay lỗi nhất) ---
                    const finalVideoPath = await retryStep(async () => {
                        if (this.stoppedTaskIds.has(task.id)) throw new Error("CANCELLED");

                        const profileNum = (index % profiles_grok.length) + 1;
                        const resVideo = await grokService.createVideoForPromptCore(
                            this.event,
                            resultGenPrompt,
                            task.id,
                            prompt_video,
                            save_path_project,
                            profileNum,
                            imageAIPath,
                            task.outputCount
                        );

                        if (!resVideo.success) throw new Error("Render Video thất bại");

                        this.event.sender.send('video:task-log', {
                            status: 'proccessing',
                            message: `✅Tạo AI Video: ${resVideo.filename}`,
                            data: { videoAIPath: resVideo.filename },
                            taskId: task.id,
                            index
                        });
                        return resVideo.filename;
                    }, "Render Video Final", task.id);
                    // --- CHẶNG 2.5: TẠO ÂM THANH, GIỌNG ĐỌC ---
                    const audioFiles = await retryStep(async () => {
                        if (this.stoppedTaskIds.has(task.id)) throw new Error("CANCELLED");

                        this.event.sender.send('video:task-log', {
                            status: 'processing',
                            message: `🎙️ Đang tạo giọng đọc AI cho ${resultGenPrompt.length} phân cảnh...`,
                            taskId: task.id
                        });

                        // 1. Khởi tạo Service (UserID và AppID lấy từ config của bạn)
                        const vbeeService = new VbeeService(vbee_app_token, vbee_app_id);

                        // 2. Tạo thư mục tạm để chứa voice cho task này
                        const tempAudioFolder = path.join(save_path_project, `temp_audio_${task.id}`);
                        if (!fs.existsSync(tempAudioFolder)) fs.mkdirSync(tempAudioFolder, { recursive: true });

                        const voiceResults = [];

                        // 3. Duyệt mảng JSON từ Gemini để tải từng file voice
                        for (let i = 0; i < resultGenPrompt.length; i++) {
                            const scene = resultGenPrompt[i];

                            // Gọi Vbee tải giọng đọc
                            // Bạn có thể lấy voiceName từ config: config.vbee_voice || "hn_female_xuananh_news_48k-h"
                            const filePath = await vbeeService.downloadAudio(
                                scene.voice_content,
                                tempAudioFolder,
                                voice_code
                            );

                            if (!filePath) throw new Error(`Lỗi tải giọng đọc ở phân cảnh ${i + 1}`);

                            voiceResults.push(

                                filePath,

                            );
                        }

                        this.event.sender.send('video:task-log', {
                            status: 'processing',
                            message: `✅ Đã tạo xong ${voiceResults.length} file giọng đọc`,
                            taskId: task.id
                        });

                        return voiceResults; // Mảng này sẽ chứa đầy đủ: visual_prompt, voice_content và audioPath
                    }, "Tạo giọng đọc AI", task.id);


                    const finalScenes = audioFiles;
                    // --- CHẶNG 5: EDIT VIDEO ----
                    this.event.sender.send('video:task-log', { status: 'processing', message: '🎙️ Đang lồng tiếng...', taskId: task.id });
                    const GoodVideo = await mergeAudioToVideo(finalVideoPath, finalScenes, path.join(save_path_project, `video_good_${task.id}_${Date.now()}.mp4`))
                    await deletePath(path.dirname(finalScenes[0]));
                    await deletePath(finalVideoPath);
                    let finalFile = ""
                    if (isEnabledLogo && fs.existsSync(logoPath)) {
                        this.event.sender.send('video:task-log', { status: 'processing', message: '🎨 Đang chèn Logo bản quyền...', taskId: task.id });

                        const brandedVideo = path.join(save_path_project, `video_good_${task.id}_${Date.now()}.mp4`);

                        await addLogoToVideo(GoodVideo, logoPath, brandedVideo);

                        // Xóa file tạm sau khi đã có video dán logo
                        if (fs.existsSync(GoodVideo)) fs.unlinkSync(GoodVideo);

                        finalFile = brandedVideo;
                    } else {
                        // Nếu không có logo, đổi tên file temp thành file chính thức
                        const finalPath = path.join(save_path_project, `video_good_${task.id}_${Date.now()}.mp4`);
                        fs.renameSync(GoodVideo, finalPath);
                        finalFile = finalPath;
                    }

                    this.event.sender.send('video:task-log', {
                        status: 'success',
                        message: `Hoàn thiện video`,
                        data: { videoAIPath: finalFile },
                        taskId: task.id,
                        index
                    });


                } catch (error: any) {
                    // Giải phóng tài nguyên tồn đọng nếu tất cả các lần retry đều fail
                    if (currentProfileId) await shopeeManager.releaseProfile(currentProfileId);
                    if (currentProfileGrokId) await grokManager.releaseProfile(currentProfileGrokId);

                    if (error.message === "CANCELLED") {
                        return this.handleCancel(task.id, index);
                    }

                    this.event.sender.send('video:task-log', {
                        status: 'error',
                        message: `❌ Fail: ${error.message}`,
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