
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
    private genAI: GoogleGenAI;
    private model = "gemini-3-flash-preview";

    constructor(apiKey: string) {
        this.genAI = new GoogleGenAI({ apiKey: apiKey });
    }

    /**
     * Biến ý tưởng thô thành Prompt Video chuyên nghiệp
     */
    async generateVideoPrompt(prompt_video: string, productTitle: string, productDesc: string, prompt_review: string, outputCount: number): Promise<any> {
        try {
            const systemPrompt = `
    Bạn là chuyên gia Prompt Engineer cho AI Video (Grok Extend).
    Sản phẩm: ${productTitle}
    Mô tả: ${productDesc}
    Tổng thời lượng: ${outputCount * 10} giây.

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

    QUY TẮC VỀ GIỌNG ĐỌC (FIX LỖI GIỌNG LAI THÁI):
    - KHÔNG ĐƯỢC để từ tiếng Anh nguyên bản. PHẢI phiên âm sang tiếng Việt (Ví dụ: "Smartphone" -> "S-mát-phôn", "Grok" -> "Gờ-rốc", "Sale" -> "Sêu", "Click" -> "K-lích").
    - Tránh đưa quá nhiều từ trong prompt khiến AI nói nhanh, phân bổ từ ngữ đều thời gian ra.

    YÊU CẦU ĐẦU RA:
    - Chỉ trả về chuỗi Prompt tiếng Việt.
    - Không giải thích, không tiêu đề đoạn.
    ${prompt_video}
`;



            const result = await this.genAI.models.generateContent({
                model: this.model,
                contents: systemPrompt
            });

            if (result) {
                return { success: true, data: result.text }
            }

            return { success: false };
        } catch (error: any) {
            console.error("❌ Lỗi Gemini:", error.message);
            return { success: false, data: prompt_video };

        }
    }
}