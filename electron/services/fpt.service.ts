import axios from 'axios';
import fs from 'fs';
import path from 'path';

export class FptService {
    private apiKey: string;
    private apiUrl = "https://api.fpt.ai/hdl/tts/v1/prediction";

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async downloadAudio(text: string, outputFolder: string): Promise<string | null> {
        try {
            // 1. Gửi yêu cầu chuyển văn bản thành giọng nói
            const response = await axios.post(this.apiUrl, text, {
                headers: {
                    "api-key": this.apiKey,
                    "voice": "banmai", // Giọng nữ miền Bắc cực mượt
                    "speed": "0", // Tốc độ bình thường (0 là 100%)
                    "format": "mp3"
                }
            });

            if (response.data.error === 0) {
                const audioUrl = response.data.async;
                console.log("📡 Đang chờ FPT xử lý file audio...");

                // 2. Poll (Kiểm tra) cho đến khi file audio sẵn sàng để tải
                const maxRetries = 10;
                for (let i = 0; i < maxRetries; i++) {
                    await new Promise(res => setTimeout(res, 2000)); // Chờ 2s

                    try {
                        const check = await axios.get(audioUrl);
                        if (check.status === 200) {
                            // 3. Tải file về thư mục output
                            const fileName = `voice_${Date.now()}.mp3`;
                            const filePath = path.join(outputFolder, fileName);
                            
                            const fileResponse = await axios.get(audioUrl, { responseType: 'arraybuffer' });
                            fs.writeFileSync(filePath, fileResponse.data);
                            
                            console.log(`✅ Đã tải xong giọng đọc: ${filePath}`);
                            return filePath;
                        }
                    } catch (e) {
                        // Nếu chưa có file (404), tiếp tục đợi
                    }
                }
            }
            return null;
        } catch (error: any) {
            console.error("❌ Lỗi FPT AI:", error.message);
            return null;
        }
    }
}