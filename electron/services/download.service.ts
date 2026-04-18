import axios from 'axios';
import fs from 'fs';
import path from 'path';


export async function downloadImage(url: string, save_path:string): Promise<{ success: boolean; name: string }> {
    try {
        // 1. Tạo tên file unique: img_1712345678_abcd.png
        const uniqueSuffix = Math.random().toString(36).substring(2, 7);
        const fileName = `prod_${Date.now()}_${uniqueSuffix}.png`;

        // 2. Lấy đường dẫn lưu từ config của MinMin
        const outputFolder = save_path || "D:\\Output\\Videos";
        
        if (!fs.existsSync(outputFolder)) {
            fs.mkdirSync(outputFolder, { recursive: true });
        }

        const filePath = path.join(outputFolder, fileName);

        // 3. Tiến hành tải
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        return new Promise((resolve) => {
            writer.on('finish', () => {
                console.log(`✅ Đã tải: ${fileName}`);
                resolve({ success: true, name: fileName }); // Trả về đúng format MinMin cần
            });
            writer.on('error', (err) => {
                console.error("❌ Lỗi ghi file:", err);
                resolve({ success: false, name: "" });
            });
        });
    } catch (error) {
        console.error("❌ Lỗi download:", error);
        return { success: false, name: "" };
    }
}

export const saveImageLocally = async (imageBuffer: ArrayBuffer, folderPath: string) => {
    try {
        // 1. Kiểm tra và tạo thư mục nếu chưa có
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        // 2. Tạo tên file unique (Ví dụ: img_1712345678_a9b2.png)
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 7);
        const fileName = `img_${timestamp}_${randomStr}.png`;
        const fullPath = path.join(folderPath, fileName);

        // 3. Ghi file từ Buffer
        const buffer = Buffer.from(imageBuffer);
        fs.writeFileSync(fullPath, buffer);

        console.log(`✅ Đã lưu ảnh tại: ${fullPath}`);
        return fullPath; // Trả về đường dẫn để ông lưu vào DB nếu cần
    } catch (error) {
        console.error("❌ Lỗi khi lưu file:", error);
        return null;
    }
};