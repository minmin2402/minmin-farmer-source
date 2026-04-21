
import { ipcMain, IpcMainInvokeEvent } from "electron";
import pLimit from "p-limit";
import { gpmService } from "../services/gpm.service";
import { getShopeeIds, shopeeService } from "../services/shopee.service";
import { GrokService } from "../services/grok.service";

import { GeminiService } from "../services/gemini.service";
import { GrokProfileManager, ShopeeProfileManager } from "../manager/ProfileManager";
import fs from 'fs';
import path from "path";
import { VbeeService } from "../services/vbee.service";
import { addLogoAndMusic, mergeAudioToVideo } from "../services/ffmpeg.service";
import { logger } from "../utils/logger";
import { deletePath } from "../utils/file";
import { isLinkShopee, isLinkTiktok } from "../utils/tool";
import { TiktokService } from "../services/tiktok.service";

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
        const { prompt_review, voice_code, vbee_app_token,useProfileAff, isUseVbee, isEnabledLogo, isEnabledMusic, musicPath, logoPath, vbee_app_id, save_shopid_productid, profiles_aff, thread, apikey_gemini, delay_between, profiles_grok, prompt_image, output_video, prompt_video, speed_voice } = configVideoMKT;

        // Cho phép chạy tối đa số thread người dùng nhập, không quan tâm có bao nhiêu profile
        const maxThreads = thread || 1;
        const limit = pLimit(maxThreads);

        //const keyManager = new GeminiKeyManager(apikey_gemini);
        const geminiService = new GeminiService(apikey_gemini);
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
        if (isUseVbee && (!vbee_app_id || !vbee_app_token))
            return { success: false, message: "Sai cấu hình Vbee AI" };


        const retryStep = async (fn: () => Promise<any>, stepName: string, taskId: string, maxRetries = 3) => {
            for (let i = 1; i <= maxRetries; i++) {
                if (this.stoppedTaskIds.has(taskId)) throw new Error("CANCELLED");
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
                    this.event.sender.send('video:task-log', {
                        status: 'processing',
                        message: `⚠️ ${stepName} lỗi (Lần ${i}): ${errorMessage.substring(0, 50)}...`,
                        taskId: taskId
                    });

                    if (i === maxRetries) throw error;
                    await new Promise(res => setTimeout(res, 3000)); // Tăng lên 3s cho an toàn
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
                const profileNum = index % profiles_grok.length
                try {
                    // --- CHẶNG 1: LẤY DATA SHOPEE ---
                    this.event.sender.send('video:task-log', {
                        status: 'processing',
                        message: `Bắt đầu`,
                        taskId: task.id
                    });

                    const productInfo = await retryStep(async () => {
                        if (!(task.mode === "Chỉ lấy thông tin sản phẩm" || task.mode.includes("TT"))) {
                            return {
                                productTitle: task.productName,
                                productDesc: task.productDesc,
                                productPathImage: task.productPathImg
                            }
                        }

                        const port = 5000 + (index % 100);

                        if (this.stoppedTaskIds.has(task.id)) throw new Error("CANCELLED");

                        let res = null;
                        if (await isLinkShopee(task.productUrl)) {
                            if (useProfileAff){
                                currentProfileId = await shopeeManager.getAvailableProfile();
                            }
                            
                            res = await shopeeService(this.event, gpmClient,currentProfileId,useProfileAff, port, delay_between, this.data, task);
                            try {
                                await shopeeManager.releaseProfile(currentProfileId);
                            } catch (error) {
                                
                            }
                            

                        } else if (await isLinkTiktok(task.productUrl)) {

                            res = await TiktokService.getInfoProduct(this.event, gpmClient, port, delay_between, this.data, task);
                        } else {
                            this.event.sender.send('video:task-log', { status: 'error', message: 'Sai link sản phẩm', taskId: task.id });
                            return null
                        }


                        currentProfileId = "";

                        if (!res.success) throw new Error(res.message || "Lỗi cào");
                        return res.data;
                    }, "Cào dữ liệu", task.id);



                    if (!productInfo.productTitle || !productInfo.productPathImage || !fs.existsSync(productInfo.productPathImage)) {
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


                        const res = await geminiService.generateVideoPrompt(productInfo.productTitle, productInfo.productDesc, prompt_review, task.outputCount);


                        if (!res.success) {
                            if (res.ratelimit) {

                                this.event.sender.send('video:task-log', {
                                    status: 'processing',
                                    message: `Gemini bị rate limit`,
                                    taskId: task.id,

                                });
                                return null
                            }

                            throw new Error(res.error);
                        }

                        this.event.sender.send('video:task-log', { status: 'processing', message: `✅ Prompt thành công`, data: { prompt: prompt_video }, taskId: task.id });
                        return res.data;
                    }, "Tạo Prompt AI", task.id);

                    if (!resultGenPrompt) {
                        return null
                    }
                    if (resultGenPrompt.length < task.outputCount) {
                        throw new Error("Số phân cảnh tạo không đủ")
                    }

                    // --- CHẶNG 3: INIT GROK & VẼ ẢNH ---
                    const imageAIPath = await retryStep(async () => {
                        if (this.stoppedTaskIds.has(task.id)) throw new Error("CANCELLED");

                        if (!task.mode.includes('Ảnh AI')) {
                            return task.aiImagePath
                        }


                        this.event.sender.send('video:task-log', {
                            status: 'processing',
                            message: `Chuẩn bị tạo ảnh từ grok ${profiles_grok[profileNum]}`,
                            taskId: task.id,

                        });

                        const port = 5000 + (index % 100);


                        const initRes = await grokService.initHeaderGrok(
                            this.event, task.id, grokService,
                            grokManager, gpmClient, profiles_grok[profileNum], port, delay_between
                        );

                        if (!initRes.success) throw new Error("Init Grok thất bại");

                        logger.info(`✅ Đã bốc được Header cho Task ${task.id}, chuẩn bị nhả Profile ${profiles_grok[profileNum]}`);
                        let genderPrompt = voice_code.includes("female") ? "realistic female host" : "realistic male host";


                        const imgRes = await grokService.generateReviewVideoImage(
                            prompt_image + `\n ${genderPrompt}`,
                            productInfo.productPathImage,
                            profiles_grok[profileNum], // Vẫn truyền profileNum để lấy đúng Header đã lưu
                            save_path_project,
                            task.id
                        );

                        if (!imgRes.success) throw new Error("Grok không vẽ được ảnh");

                        return imgRes.filePath;

                    }, "Khởi tạo & Vẽ ảnh Grok", task.id);

                    if (!imageAIPath || !fs.existsSync(imageAIPath)) {
                        this.event.sender.send('video:task-log', { status: 'error', message: 'Thiếu dữ liệu ảnh AI thử lại', taskId: task.id });
                        return null;
                    } else {
                        this.event.sender.send('video:task-log', {
                            status: 'processing',
                            message: `Cập nhật ảnh AI`,
                            taskId: task.id,
                            data: {
                                imageAIPath: imageAIPath
                            }
                        });
                    }

                    // --- CHẶNG 4: RENDER VIDEO (Khâu hay lỗi nhất) ---
                    const finalVideoPath = await retryStep(async () => {
                        if (this.stoppedTaskIds.has(task.id)) throw new Error("CANCELLED");



                        this.event.sender.send('video:task-log', {
                            status: 'processing',
                            message: `Chuẩn bị tạo video từ grok ${profiles_grok[profileNum]}`,
                            taskId: task.id,

                        });

                        const port = 5000 + (index % 100);


                        const initRes = await grokService.initHeaderGrok(
                            this.event, task.id, grokService,
                            grokManager, gpmClient, profiles_grok[profileNum], port, delay_between
                        );

                        if (!initRes.success) throw new Error("Init Grok thất bại");

                        logger.info(`✅ Đã bốc được Header cho Task ${task.id}, chuẩn bị nhả Profile ${profiles_grok[profileNum]}`);


                        const resVideo = await grokService.createVideoForPromptCore(
                            this.event,
                            resultGenPrompt,
                            task.id,
                            prompt_video,
                            save_path_project,
                            profileNum,
                            profiles_grok[profileNum],
                            imageAIPath,
                            task.outputCount,
                            isUseVbee,
                            retryStep

                        );

                        logger.info(resVideo)

                        if (resVideo.error == "Rate Limit 429") {
                            this.event.sender.send('video:task-log', {
                                status: 'error',
                                message: `Profile ${profiles_grok[profileNum]} grok đã bị rate limit`,
                                taskId: task.id,
                                index
                            });
                            return null
                        }

                        if (!resVideo.success) throw new Error("Render Video thất bại");

                        this.event.sender.send('video:task-log', {
                            status: 'proccessing',
                            message: `✅Tạo AI Video: ${resVideo.filename}`,
                            data: { videoAIPath: resVideo.filename },
                            taskId: task.id,
                            index
                        });
                        return resVideo.filename;
                    }, "Render Video Final", task.id, 1);


                    if (!finalVideoPath) {
                        return null;
                    }
                    // --- CHẶNG 2.5: TẠO ÂM THANH, GIỌNG ĐỌC ---

                    if (isUseVbee) {
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
                                    voice_code,
                                    speed_voice
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
                        if (!audioFiles) {
                            this.event.sender.send('video:task-log', { status: 'error', message: "Tạo giọng vbee thất bại", taskId: task.id });
                            return null
                        }
                        // --- CHẶNG 5: EDIT VIDEO ----
                        this.event.sender.send('video:task-log', { status: 'processing', message: '🎙️ Đang lồng tiếng...', taskId: task.id });

                        const GoodVideo = await mergeAudioToVideo(finalVideoPath, audioFiles, path.join(save_path_project, `temp_voice_${task.id}.mp4`));

                        try {
                            await deletePath(path.dirname(audioFiles[0]));
                            await deletePath(finalVideoPath);
                            fs.renameSync(GoodVideo, finalVideoPath);
                        } catch (error) {
                            fs.renameSync(GoodVideo, finalVideoPath);
                        }

                    }



                    // --- CHẶNG 6: HOÀN THIỆN (LOGO & BGM) ----


                    // Giả sử các biến isEnabledLogo, isEnabledMusic, logoPath, backgroundMusicPath đã có sẵn
                    if (isEnabledLogo || isEnabledMusic) {
                        const msg = (isEnabledLogo && isEnabledMusic) ? '🎨 Đang chèn Logo và Nhạc nền...' : (isEnabledLogo ? '🎨 Đang chèn Logo...' : '🎵 Đang trộn nhạc nền...');
                        this.event.sender.send('video:task-log', { status: 'processing', message: msg, taskId: task.id });


                        await addLogoAndMusic(
                            finalVideoPath,
                            logoPath,
                            musicPath,
                            isEnabledLogo,
                            isEnabledMusic
                        );



                    }
                    this.event.sender.send('video:task-log', {
                        status: 'success',
                        message: `Hoàn thiện video`,
                        data: { videoAIPath: finalVideoPath },
                        taskId: task.id,
                        index
                    });


                } catch (error: any) {
                    // Giải phóng tài nguyên tồn đọng nếu tất cả các lần retry đều fail
                    try {
                        if (currentProfileId) await shopeeManager.releaseProfile(currentProfileId);
                    } catch (error) {
                        
                    }
                    
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