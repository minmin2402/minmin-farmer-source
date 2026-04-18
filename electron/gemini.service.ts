
import { GoogleGenAI } from "@google/genai";
import { logger } from "./utils/logger";

export class GeminiService {
    private genAI: GoogleGenAI;
    private model = "gemini-2.5-flash";

    constructor(apiKey: string) {
        this.genAI = new GoogleGenAI({ apiKey: apiKey });
    }

    /**
     * Biến ý tưởng thô thành Prompt Video chuyên nghiệp
     */
    async generateVideoPrompt(productTitle: string, productDesc: string, prompt_review: string, outputCount: number): Promise<any> {
        try {
            const systemPrompt = `
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
    - Mỗi đoạn "voice_content" chỉ được phép dài tối đa 35 từ tiếng Việt.
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



            const result = await this.genAI.models.generateContent({
                model: this.model,
                contents: systemPrompt,
                config: {
        responseMimeType: "application/json",
    }
            });

            if (result) {
                return { success: true, data: JSON.parse(result?.text || "") }
            }

            return { success: false };
        } catch (error: any) {
            logger.error("❌ Lỗi Gemini:", error.message);
            return { success: false, data: prompt_review };

        }
    }
}