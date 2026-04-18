import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import path from 'path'
import fs from 'fs'

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
                filter += `[${i + 1}:a]adelay=${delayMs}|${delayMs}[${label}];`;
                mixLabels += `[${label}]`;
            });

            // 🔥 SỬA LẠI ĐOẠN NÀY ĐỂ TRÁNH LỖI "Option not found"
            if (audioFiles.length > 1) {
                // Nhiều file thì mới amix, bỏ normalize=0 đi
                filter += `${mixLabels}amix=inputs=${audioFiles.length}:dropout_transition=0[outa]`;
            } else {
                // Chỉ 1 file thì gán thẳng label đó sang outa, không amix gì cả
                filter += `[a0]anull[outa]`;
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
                .on('start', (cmd) => console.log('🚀 Chạy lệnh FFmpeg:', cmd))
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
            .on('start', (cmd) => console.log('🚀 Đang đóng dấu Logo:', cmd))
            .on('error', (err) => reject(err))
            .on('end', () => resolve(outputPath))
            .save(outputPath);
    });
}