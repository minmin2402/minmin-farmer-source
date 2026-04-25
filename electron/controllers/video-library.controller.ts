import { app, ipcMain } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import { promises as fsPromises } from 'fs';

export class VideoLibraryController {
    private configDir: string;
    private jsonPath: string;

    constructor() {
        // Khởi tạo đường dẫn
        this.configDir = path.join(app.getPath('userData'), 'configs');
        this.jsonPath = path.join(this.configDir, 'pinned_videos.json');

        this.ensureDirectoryExists();
    }

    // Đảm bảo thư mục luôn tồn tại
    private ensureDirectoryExists() {
        if (!fs.existsSync(this.configDir)) {
            fs.mkdirSync(this.configDir, { recursive: true });
        }
    }

    // Helper đọc JSON
    private readJSON(): any[] {
        if (!fs.existsSync(this.jsonPath)) return [];
        try {
            const data = fs.readFileSync(this.jsonPath, 'utf8');
            return JSON.parse(data);
        } catch {
            return [];
        }
    }

    // Helper ghi JSON
    private writeJSON(data: any[]) {
        fs.writeFileSync(this.jsonPath, JSON.stringify(data, null, 2));
    }

    // Nơi đăng ký toàn bộ các endpoint (IPC handlers)
    public registerHandlers() {
        ipcMain.handle('library:get-all', async (_event, folderStore: string) => {
            try {
                // 1. Kiểm tra xem thư mục kho đã tồn tại chưa
                if (!folderStore || !fs.existsSync(folderStore)) {
                    return []; // Chưa có kho hoặc kho trống thì trả về mảng rỗng
                }

                // 2. Đọc toàn bộ danh sách file có trong thư mục
                const files = await fsPromises.readdir(folderStore);
                const videoList = [];

                // 3. Lặp qua từng file để lấy thông tin
                for (const file of files) {
                    // Chỉ nhặt các file video (ông có thể thêm .mov, .avi nếu cần)
                    if (file.toLowerCase().endsWith('.mp4')) {
                        const absolutePath = path.join(folderStore, file);

                        // Đọc "lý lịch" của file để lấy ngày tạo
                        const stats = await fsPromises.stat(absolutePath);

                        videoList.push({
                            id: `vid_${stats.birthtimeMs}`, // Tạo ID tạm thời để React xài làm key trong map()
                            name: file, // Tên video (VD: video_01.mp4)
                            createdAt: stats.birthtime.toISOString(), // Ngày tạo file chuẩn ISO
                            absolutePath: absolutePath // Đường dẫn gốc
                        });
                    }
                }

                // 4. Sắp xếp mảng: Video nào mới tạo (mới copy vào) sẽ lên đầu danh sách
                videoList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

                return videoList;

            } catch (error) {
                console.error("❌ Lỗi khi đọc kho video:", error);
                return []; // Có lỗi gì cũng trả về mảng rỗng cho Frontend đỡ bị crash
            }
        });

        ipcMain.handle('library:pin', async (_event, videoPaths: string[], folderStore: string) => {
            let countSuccess = 0;

            try {
                // 1. Đảm bảo thư mục lưu trữ (folderStore) phải tồn tại, nếu chưa có thì tự tạo
                if (!fs.existsSync(folderStore)) {
                    fs.mkdirSync(folderStore, { recursive: true });
                }

                // 2. Lặp qua từng đường dẫn video để copy
                for (const sourcePath of videoPaths) {
                    // Kiểm tra xem file gốc có thực sự tồn tại không
                    if (fs.existsSync(sourcePath)) {
                        try {
                            // Lấy tên file gốc (ví dụ: "video1.mp4")
                            const fileName = path.basename(sourcePath);
                            // Tạo đường dẫn đích mới
                            const destPath = path.join(folderStore, `video_${Date.now()}_${fileName.slice(7,15)}.mp4`);

                            // Copy file (Dùng await để không làm đơ tool khi copy file nặng)
                            await fsPromises.copyFile(sourcePath, destPath);

                            countSuccess++;
                        } catch (copyError) {
                            console.error(`Lỗi khi copy file ${sourcePath}:`, copyError);
                        }
                    } else {
                        console.warn(`File không tồn tại, bỏ qua: ${sourcePath}`);
                    }
                }

                // 3. Trả về kết quả
                return { success: true, countSuccess };

            } catch (error: any) {
                console.error("Lỗi hệ thống khi copy video vào kho:", error);
                return { success: false, message: error?.message ?? "Lỗi kxd" };
            }
        });

        ipcMain.handle('library:unpin', (_event, id) => {
            const videos = this.readJSON().filter((v: any) => v.id !== id);
            this.writeJSON(videos);
            return true;
        });

        ipcMain.handle('library:delete', (_event, id, absolutePath) => {
            // 1. Xóa trong JSON
            const videos = this.readJSON().filter((v: any) => v.id !== id);
            this.writeJSON(videos);

            // 2. Xóa file vật lý
            try {
                if (fs.existsSync(absolutePath)) {
                    fs.unlinkSync(absolutePath);
                }
            } catch (e) {
                console.error("Lỗi xóa file:", e);
            }
            return true;
        });
    }
}