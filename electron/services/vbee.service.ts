import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger';

export class VbeeService {
    private api_key: string;
    private app_id: string;
    private base_url = "https://vbee.vn/api/v1/tts";

    constructor(api_key: string, app_id: string) {
        this.api_key = api_key;
        this.app_id = app_id;
    }

    async downloadAudio(text: string, outputFolder: string, voiceCode: string = "s_cantho_female_xanxan_advertise_vc"): Promise<string | null> {
        try {
            // 1. Gửi request POST để lấy request_id
            const postRes = await axios.post(this.base_url, {
                app_id: this.app_id,
                input_text: text,
                voice_code: voiceCode,
                audio_type: "mp3",
                callbackUrl:"https://mydomain.com/callback",
                response_type: "indirect" // Dùng indirect để lấy request_id
            }, {
                headers: { "Authorization": `Bearer ${this.api_key}` }
            });

          
            if (postRes.data.status !== 1) {
                logger.error("❌ Vbee Post Error:", postRes.data.error_message);
                return null;
            }

            const requestId = postRes.data.result.request_id;
            logger.info(`📡 Đã lấy được Request ID: ${requestId}. Đang chờ xử lý...`);

            // 2. Vòng lặp kiểm tra trạng thái (Poll Request)
            const maxRetries = 15; // Chờ tối đa khoảng 30s
            for (let i = 0; i < maxRetries; i++) {
                await new Promise(resolve => setTimeout(resolve, 2000)); // Nghỉ 2s mỗi lần check

                const statusRes = await axios.get(`${this.base_url}/${requestId}`, {
                    headers: { "Authorization": `Bearer ${this.api_key}` }
                });

                const data = statusRes.data;
                // Tài liệu Vbee: Status 'SUCCESS' hoặc 'COMPLETED' tùy version, check log để khớp
                if (data.status === 1 && data.result.status === "SUCCESS") {
                    const audioUrl = data.result.audio_link || data.result.audio_url || data.result.link_audio;
                    
                    if (!audioUrl) throw new Error("Thành công nhưng không tìm thấy link audio");

                    // 3. Tải file về máy
                    const fileName = `vbee_${Date.now()}.mp3`;
                    const filePath = path.join(outputFolder, fileName);
                    const fileStream = await axios.get(audioUrl, { responseType: 'arraybuffer' });
                    
                    fs.writeFileSync(filePath, fileStream.data);
                    logger.info(`✅ [Vbee] Đã tải xong: ${filePath}`);
                    return filePath;
                }

                if (data.result.status === "FAILURE") {
                    logger.error("❌ Vbee xử lý file thất bại");
                    return null;
                }

                logger.info(`⏳ Đang xử lý... (${i + 1}/${maxRetries})`);
            }

            return null;
        } catch (error: any) {
            logger.error("❌ Lỗi Vbee Service:", error.message);
            return null;
        }
    }
}