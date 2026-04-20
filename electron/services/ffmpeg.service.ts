import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import path from 'path'
import fs from 'fs'
import { logger } from '../utils/logger';
import { promises as fsc } from 'fs';



const pathFFmpeg = ffmpegPath.path.replace('app.asar', 'app.asar.unpacked');
ffmpeg.setFfmpegPath(pathFFmpeg);

/**
 * Ghép các file voice vào video clip tại các mốc thời gian cố định (10s/đoạn)
 */
export async function mergeAudioToVideo(videoPath: string, audioFiles: string[], outputPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            if (!fs.existsSync(videoPath)) return reject(new Error("Video gốc không tồn tại"));

            let command = ffmpeg(path.resolve(videoPath));

            // Nạp các file mp3 vào input
            audioFiles.forEach(audio => {
                if (fs.existsSync(audio)) {
                    command = command.input(path.resolve(audio));
                }
            });

            // Tạo filter_complex chuẩn theo cái lệnh bạn đã test
            let filter = "";
            let mixLabels = "";

            audioFiles.forEach((_, i) => {
                const delayMs = i * 10000;
                const label = `a${i}`;
                // Thêm volume=2.0 vào đây để kích âm thanh to lên ngay từ đầu
                filter += `[${i + 1}:a]adelay=${delayMs}|${delayMs},volume=2.0[${label}];`;
                mixLabels += `[${label}]`;
            });

            if (audioFiles.length > 1) {
                // Thêm volume=inputs để bù đắp việc amix tự động giảm âm lượng
                filter += `${mixLabels}amix=inputs=${audioFiles.length}:dropout_transition=0,volume=${audioFiles.length}[outa]`;
            } else {
                // Chỉ 1 file thì vẫn nên giữ volume cao
                filter += `[a0]volume=1.0[outa]`; // Bạn có thể tăng lên volume=1.5 nếu vẫn thấy nhỏ
            }

            command
                .complexFilter([filter])
                .outputOptions([
                    '-map 0:v:0',
                    '-map [outa]',
                    '-c:v copy',
                    '-c:a aac',
                    '-b:a 192k'
                ])
                .on('start', (cmd) => logger.info('🚀 Chạy lệnh FFmpeg:', cmd))
                .on('error', (err) => reject(err))
                .on('end', () => resolve(outputPath))
                .save(outputPath);

        } catch (error) {
            reject(error);
        }
    });
}

export async function addLogoToVideo(videoPath: string, logoPath: string, outputPath: string) {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .input(logoPath)
            .complexFilter([
                // 1. Resize logo: Ép logo về độ rộng bằng 15% video, chiều cao tự nhảy theo tỉ lệ
                // 2. Overlay: Đặt vào góc phải (W-w) và dưới (H-h), cách lề 20px
                `[1:v]scale=iw*0.15:-1[logo];[0:v][logo]overlay=W-w-20:H-h-20`
            ])
            .outputOptions([
                '-c:v libx264', // Render lại để dính cứng logo vào pixel
                '-preset ultrafast', // Vít ga render nhanh nhất có thể
                '-crf 23',      // Chất lượng cân bằng
                '-c:a copy'      // Audio đã làm ở bước trước nên chỉ cần copy qua
            ])
            .on('start', (cmd) => logger.info('🚀 Đang đóng dấu Logo:', cmd))
            .on('error', (err) => reject(err))
            .on('end', () => resolve(outputPath))
            .save(outputPath);
    });
}

export async function addBackgroundMusic(videoPath: string, audioPath: string, outputPath: string, volume = 0.6) {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .input(audioPath)
            .complexFilter([
                // [0:a] là audio gốc của video, [1:a] là audio của nhạc nền
                // volume=0.6 chỉnh nhạc nền nhỏ xuống 60%
                `[1:a]volume=${volume}[bgm]; [0:a][bgm]amix=inputs=2:duration=first[a]`
            ])
            .outputOptions([
                '-map 0:v',        // Lấy video từ file gốc
                '-map [a]',        // Lấy audio sau khi đã mix
                '-c:v copy',       // Copy video codec để xử lý cực nhanh (không encode lại video)
                '-shortest'        // Cắt nhạc theo file có thời lượng ngắn hơn (là video)
            ])
            .save(outputPath)
            .on('end', resolve)
            .on('error', reject);
    });
}

export const addLogoAndMusic = async (inputVideo: string, logoPath: string, musicPath: string, isLogo: boolean, isMusic: boolean) => {

    // --- BƯỚC 1: Xử lý Video (Logo) ---
    if (isLogo && fs.existsSync(logoPath)) {
        const folder = path.dirname(inputVideo);
        const tempOutput = path.join(folder, `temp_${Date.now()}_video.mp4`);
        try {
            // 2. Kiểm tra nếu file temp đã tồn tại từ trước thì xóa
            if (fs.existsSync(tempOutput)) {
                await fsc.unlink(tempOutput);
            }

            await addLogoToVideo(inputVideo, logoPath, tempOutput)

            await fsc.unlink(inputVideo);
            // Đổi tên file temp thành tên file outputPath chính thức
            await fsc.rename(tempOutput, inputVideo);
        } catch (error) {
            logger.error("Lỗi trong quá trình xử lý:", error);
            // Nếu lỗi, thử xóa file temp nếu nó đã lỡ tạo ra
            if (fs.existsSync(tempOutput)) {
                await fsc.unlink(tempOutput).catch(() => { });
            }
        }
    }


    // --- BƯỚC 2: Xử lý Audio (Nhạc nền) ---
    if (isMusic && fs.existsSync(musicPath)) {
        // 1. Xác định thư mục của file gốc để tạo file temp cùng chỗ
        const folder = path.dirname(inputVideo);
        const tempOutput = path.join(folder, `temp_${Date.now()}_video.mp4`); // Dùng Date.now() để tên file là duy nhất

        try {
            // 2. Kiểm tra nếu file temp đã tồn tại từ trước thì xóa
            if (fs.existsSync(tempOutput)) {
                await fsc.unlink(tempOutput);
            }

            // 3. Chạy FFmpeg: Input là outputPath (file hiện tại), Output là tempOutput
            // Lưu ý: videoPath lúc này là outputPath
            await addBackgroundMusic(inputVideo, musicPath, tempOutput);

            // 4. Xử lý tráo đổi file:
            // Xóa file outputPath cũ
            await fsc.unlink(inputVideo);

            // Đổi tên file temp thành tên file outputPath chính thức
            await fsc.rename(tempOutput, inputVideo);

            logger.info("Thêm nhạc nền và cập nhật file thành công!");
        } catch (error) {
            logger.error("Lỗi trong quá trình xử lý:", error);
            // Nếu lỗi, thử xóa file temp nếu nó đã lỡ tạo ra
            if (fs.existsSync(tempOutput)) {
                await fsc.unlink(tempOutput).catch(() => { });
            }
        }
    }



};