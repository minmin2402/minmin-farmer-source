import { GoogleGenerativeAI } from "@google/generative-ai";
import { logger } from "../utils/logger";

interface KeyStatus {
    key: string;
    lastUsed: number;
    isCooldown: boolean;
    failCount: number;
}

export class GeminiService {
    private keys: KeyStatus[];
    private models: string[] = [
 // Ưu tiên bản Lite vì Rate Limit cực cao cho MMO
        "gemini-3.1-flash",
        "gemini-2.0-flash",
        "gemini-2.5-flash",
        "gemini-1.5-flash-8b",
        "gemini-flash-latest"
    ];

    // Băng chuyền Promise để xử lý đa luồng
    private queue: Promise<any> = Promise.resolve();

    // Giãn cách tối thiểu giữa các request (ms). 
    // 400ms = ~150 request/phút. Nếu bạn có 10 keys, có thể giảm xuống 100-200ms.
    private readonly REQUEST_DELAY = 400;

    constructor(apiKeys: string[]) {
        this.keys = apiKeys.map(key => ({
            key,
            lastUsed: 0,
            isCooldown: false,
            failCount: 0
        }));
    }

    /**
     * Cơ chế hàng đợi: Ép các luồng gọi tới phải xếp hàng nhả dần
     */
    private async addToQueue<T>(task: () => Promise<T>): Promise<T> {
        this.queue = this.queue.then(async () => {
            await new Promise(resolve => setTimeout(resolve, this.REQUEST_DELAY));
            return task();
        }).catch((err) => {
            // Tránh treo hàng đợi nếu một task bị crash
            logger.error("❌ Queue Task Error:", err.message);
            return task();
        });
        return this.queue;
    }

    private getBestKey(): string {
        const now = Date.now();
        // Sắp xếp lấy key rảnh nhất và không trong thời gian phạt cooldown (60s)
        const availableKeys = [...this.keys].sort((a, b) => {
            if (a.isCooldown !== b.isCooldown) return a.isCooldown ? 1 : -1;
            return a.lastUsed - b.lastUsed;
        });

        const bestKey = availableKeys[0];
        // Nếu key tốt nhất vẫn đang bị phạt nhưng đã quá 60s thì thả xích
        if (bestKey.isCooldown && (now - bestKey.lastUsed > 60000)) {
            bestKey.isCooldown = false;
        }

        return bestKey.key;
    }

    private markKeyStatus(key: string, success: boolean) {
        const k = this.keys.find(item => item.key === key);
        if (k) {
            k.lastUsed = Date.now();
            if (success) {
                k.isCooldown = false;
                k.failCount = 0;
            } else {
                k.isCooldown = true;
                k.failCount++;
            }
        }
    }

    async generateVideoPrompt(productTitle: string, productDesc: string, prompt_review: string, outputCount: number): Promise<any> {
        // Đưa vào hàng đợi để xử lý tuần tự, tránh dồn dập vào cùng 1 thời điểm
        return this.addToQueue(async () => {
            let attempts = 0;
            // Thử tối đa qua 2 vòng Keys để đảm bảo tỉ lệ thành công cao nhất
            const maxTotalAttempts = this.keys.length * 2;

            while (attempts < maxTotalAttempts) {
                const currentKey = this.getBestKey();
                const modelName = this.models[attempts % this.models.length];

                try {
                    const genAI = new GoogleGenerativeAI(currentKey);

                    const model = genAI.getGenerativeModel(
                        { model: modelName },
                        { apiVersion: "v1beta" }
                    );

                    const systemPrompt = this.buildPrompt(productTitle, productDesc, prompt_review, outputCount);
                    const result = await model.generateContent({
                        contents: [{ role: "user", parts: [{ text: systemPrompt }] }],
                        generationConfig: {
                            responseMimeType: "application/json",
                            temperature: 0.7,
                        }
                    });

                    const response = await result.response;
                    const text = response.text();

                    this.markKeyStatus(currentKey, true);
                    return { success: true, data: JSON.parse(text || "[]") };

                } catch (error: any) {
                    attempts++;
                    this.markKeyStatus(currentKey, false);

                    const isRateLimit = error.message.includes("429") || error.message.includes("Rate Limit") || error.message.includes("503");

                    if (isRateLimit) {
                        logger.warn(`⚠️ Lần thử ${attempts}: Key bận hoặc Server quá tải. Đang đổi sang Key/Model tiếp theo...`);
                        // Nếu đã thử hết sạch Key trong 1 vòng mà vẫn lỗi, cho hệ thống nghỉ 2s
                        if (attempts === this.keys.length) {
                            await new Promise(r => setTimeout(r, 2000));
                        }
                    } else {
                        // Lỗi nội dung (Safety) hoặc lỗi logic thì trả về luôn để sửa prompt
                        return { success: false, error: error.message };
                    }
                }
            }
            return { success: false, ratelimit: true, data: prompt_review };
        });
    }

    private buildPrompt(productTitle: string, productDesc: string, prompt_review: string, outputCount: number): string {
        return `
    Bạn là chuyên gia điều phối Video Script cho AI Video.
    Sản phẩm: ${productTitle}
    Mô tả: ${productDesc}
    Tổng thời lượng: ${outputCount * 10} giây.
    Yêu cầu: Chia làm ${outputCount} đoạn, mỗi đoạn 10 giây.

    DỰA TRÊN CẤU TRÚC NGƯỜI DÙNG CUNG CẤP:
    ${prompt_review}

    NHIỆM VỤ CỦA BẠN:
    Hãy điều phối (mapping) cấu trúc trên vào đúng ${outputCount} phân đoạn (mỗi đoạn 10s) theo quy tắc sau:

    ${outputCount === 1 ? `
    - Gộp toàn bộ cấu trúc (Đầu, Giữa, Cuối) vào duy nhất 1 đoạn 10 giây. 
    - Nhịp độ nhanh, dứt khoát.` : `
    - Phải chia nội dung thành CHÍNH XÁC ${outputCount} đoạn, phân cách bằng "---".
    - Đoạn 1: Thực hiện nội dung "Các prompt đầu".
    - Các đoạn ở giữa: Thực hiện nội dung "Các prompt giữa". Phải bắt đầu bằng: "Tiếp nối cảnh trước, camera di chuyển..." để tránh lặp hình (looping).
    - Đoạn cuối cùng: Thực hiện nội dung "Các prompt cuối".`}
    
    YÊU CẦU VỀ THỜI LƯỢNG:
    - Mỗi đoạn "voice_content" chỉ được phép dài tối đa 30 từ tiếng Việt.
    - Đảm bảo khi đọc lên mất khoảng 7-9 giây, không được vượt quá 10 giây.

    YÊU CẦU ĐẦU RA (JSON FORMAT):
    Trả về duy nhất một mảng JSON các đối tượng. Mỗi đối tượng gồm:
    - "visual_prompt": Mô tả hành động, bối cảnh bằng tiếng Anh (để Grok hiểu tốt nhất).
    - "voice_content": Lời bình tiếng Việt (đã phiên âm các từ tiếng nước ngoài, ví dụ: "S-mát-phôn").
    - "voice_content": Chỉ ghi nội dung nói của nhân vật không ghi nhầm các từ chuyển cảnh vào đó nhé.

    MẪU CẤU TRÚC:
    [
      {
        "visual_prompt": "Cinematic shot of the product on a wooden table, soft sunlight...",
        "voice_content": "Chào mừng bạn đến với s-mát-phôn thế hệ mới."
      }
    ]
      Chỉ trả về JSON, không kèm theo bất kỳ văn bản giải thích nào.
    
`;
    }
}