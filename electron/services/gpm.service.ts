import axios from 'axios';
import { GPMLoginGlobalClient } from '../gpm-login-global';

export class GpmService {

    private client: any;

    constructor(url: string = "http://localhost:9495") {
        this.client = new GPMLoginGlobalClient(url);
    }
    async checkConnection(url: string) {
        try {
            // Thử gọi lấy danh sách profiles với timeout ngắn (2 giây) để check kết nối
            console.log("Check GPM tại " + url)
            const res = await axios.get(url, { timeout: 2000 });
            if (res.data.success === true) {
                return { success: true, message: "Kết nối GPM thành công!" };
            } else {
                return { success: false, message: "Không thể kết nối tới GPM. Hãy đảm bảo App GPM đã bật!" };
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
            // Trả về: { success: true, data: { remote_debugging_address: "127.0.0.1:xxxxx" } }
            console.log(`\nStarting profile ${id} …`);
            const startResult = await this.client.profiles.start(id, {
                windowSize: '-2000,0',
                remoteDebuggingPort,
                addArgs: [
                    '--headless=new', // Flag mới nhất của Chrome để chạy ẩn
                    '--disable-gpu',  // Thường đi kèm headless để giảm tải CPU
                    '--mute-audio'    // Tiện thể tắt tiếng luôn cho đỡ ồn khi cào data
                ]

            });

            console.log(`  Remote debugging port : ${startResult.remote_debugging_port}`);
            console.log(`  ChromeDriver path     : ${startResult.driver_path}`);
            console.log(`  Browser process ID    : ${startResult.addition_info?.process_id}`);


            return {success:true,data:startResult};
        } catch (error: any) {
            return {success:false,message:error?.message};
        }

    }

    // Đóng Profile
    async stopProfile(id: string) {
        try {
            await this.client.profiles.stop(id);
        } catch (error) {

        }


    }
}

// Khởi tạo một bản dùng chung
export const gpmService = GpmService;