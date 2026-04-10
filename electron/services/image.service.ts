
import path from 'path';
import sharp from 'sharp';



export async function processImageTo916(inputPath: string): Promise<string> {
    sharp.cache(false);
    const fileName = `processed_${path.basename(inputPath)}`;
    const outputPath = path.join(path.dirname(inputPath), fileName);
    

    // 1. Lấy thông tin ảnh gốc
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    if (!metadata.width || !metadata.height) throw new Error("Không đọc được kích thước ảnh");

    // 2. Tính toán kích thước cho tỉ lệ 9:16
    // Giả sử lấy chiều rộng làm chuẩn, chiều cao mới sẽ là: (width / 9) * 16
    const targetWidth = metadata.width;
    const targetHeight = Math.round((targetWidth / 9) * 16);

    // 3. Tiến hành "Extend" (thêm viền trắng)
    // extend: thêm pixel vào các cạnh. Ta chia đều khoảng trống lên trên và dưới.
    const extendTopBottom = Math.round((targetHeight - metadata.height) / 2);

    await image
        .extend({
            top: extendTopBottom,
            bottom: extendTopBottom,
            left: 0,
            right: 0,
            background: { r: 255, g: 255, b: 255, alpha: 1 } // Màu trắng (White Bar)
        })
        .toFile(outputPath);

    return fileName;
}

