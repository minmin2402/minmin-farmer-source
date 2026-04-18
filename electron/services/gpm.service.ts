import axios from 'axios';
import { GPMLoginGlobalClient } from '../gpm-login-global';
import { GpmOldClient } from './gpmold.service';

export class GpmService {

    private client: any;
    private isGlobal: boolean;


    constructor(url: string = "http://localhost:9495") {
        if (url.includes("127.0.0.1")) {
            this.client = new GpmOldClient(url)
            this.isGlobal = false;
        } else {
            this.client = new GPMLoginGlobalClient(url);
            this.isGlobal = true;
        }

    }
    async checkConnection(url: string) {
        try {
            if (this.isGlobal) {
                // Thử gọi lấy danh sách profiles với timeout ngắn (2 giây) để check kết nối
                console.log("Check GPM tại " + url)
                const res = await axios.get(url, { timeout: 2000 });
                if (res.data.success === true) {
                    return { success: true, message: "Kết nối GPM thành công!" };
                } else {
                    return { success: false, message: "Không thể kết nối tới GPM. Hãy đảm bảo App GPM đã bật!" };
                }
            } else {
                console.log("Check GPM tại " + url)
                const res = await axios.get(url, { timeout: 2000 });
                if (res.data === "GPM-Login") {
                    return { success: true, message: "Kết nối GPM thành công!" };
                } else {
                    return { success: false, message: "Không thể kết nối tới GPM. Hãy đảm bảo App GPM đã bật!" };
                }
            }


        } catch (error) {
            return { success: false, message: "Không thể kết nối tới GPM. Hãy đảm bảo App GPM đã bật!" };
        }
    }
    // Lấy danh sách Profile
    async getProfiles() {
        /* const res = await axios.get(`${this.baseUrl}/api/v3/profiles`);
        return res.data; */
    }

    // Mở Profile và trả về link debug (để dùng Puppeteer)
    async startProfile(id: string, remoteDebuggingPort: number) {
        try {


            console.log(`\nStarting profile ${id} …`);
            if (this.isGlobal) {
                const startResult = await this.client.profiles.start(id, {
                    windowSize: '-2000,0',
                    remoteDebuggingPort,
                    addArgs: [
                        '--headless=new', // Flag mới nhất của Chrome để chạy ẩn
                        '--disable-gpu',  // Thường đi kèm headless để giảm tải CPU
                        '--mute-audio'    // Tiện thể tắt tiếng luôn cho đỡ ồn khi cào data
                    ]

                });
                return { success: true, data: startResult };
            } else {
                // 🔥 LOGIC BẢN CŨ ĐÃ THÊM ARGS
                const options = {
                    // Nối các args thành một chuỗi cách nhau bởi dấu cách
                    addination_args: '--disable-gpu --mute-audio',
                    win_size: '-2000,0',

                };

                const startResult = await this.client.start(id, options);

                return {
                    success: true,
                    data: {
                        // Map lại đúng trường để Puppeteer phía sau dùng chung được
                        remote_debugging_port: startResult.data?.remote_debugging_address.split(':').pop(),
                        ...startResult.data
                    }
                };
            }

        } catch (error: any) {
            return { success: false, message: error?.message };
        }

    }

    // Đóng Profile
    async stopProfile(id: string) {
        try {
            if (this.isGlobal) {
                await this.client.profiles.stop(id);
            } else {
                await this.client.stop(id);
            }
        } catch (error) {
            console.error("❌ Lỗi đóng profile:", error);
        }


    }
}

// Khởi tạo một bản dùng chung
export const gpmService = GpmService;