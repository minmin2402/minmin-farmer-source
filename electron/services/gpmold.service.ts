import axios, { AxiosInstance } from 'axios';
import { logger } from '../utils/logger';

interface profileArgs{
    name: string
}

export class GpmOldClient {
    private axiosInstance: AxiosInstance;

    constructor(baseUrl: string = "http://localhost:19995") {
        this.axiosInstance = axios.create({
            baseURL: baseUrl,
            timeout: 5000
        });
    }

    // Lấy danh sách profiles
    async getProfiles() {
        const res = await this.axiosInstance.get('/api/v3/profiles');
        return res.data; // Thường trả về { success: true, data: [...] }
    }
    async createProfile(p:profileArgs){
        return (await this.axiosInstance.post('/api/v3/profiles/create',{profile_name: p.name}))?.data?.data || null;
    }

    async deleteProfile(id:string,mode:number=2){
        return await this.axiosInstance.get(`/api/v3/profiles/delete/${id}?mode=${mode}`);

    }

    // Mở Profile
    async start(id: string, options?: { 
        addination_args?: string, 
        win_scale?: number, 
        win_pos?: string, 
        win_size?: string 
    }) {
        try {
            // Sử dụng axios params để tự động build query string (?key=value&...)
            const res = await this.axiosInstance.get(`/api/v3/profiles/start/${id}`, {
                params: options
            });
            return res.data; 
        } catch (error) {
            logger.error("❌ GPM Old Start Error:", error);
            throw error;
        }
    }

    // Đóng Profile
    async stop(id: string) {
        const res = await this.axiosInstance.get(`/api/v3/profiles/close/${id}`);
        return res.data;
    }
}