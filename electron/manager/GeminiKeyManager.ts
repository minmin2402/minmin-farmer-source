import { logger } from "../utils/logger";

export class GeminiKeyManager {
  private keys: string[];
  private currentIndex: number = 0;
  private keyStatus: Map<string, { lastUsed: number; isLocked: boolean }>;

  constructor(apiKeys: string[]) {
    this.keys = apiKeys;
    this.keyStatus = new Map();
    apiKeys.forEach(key => this.keyStatus.set(key, { lastUsed: 0, isLocked: false }));
  }

  // Lấy một Key sẵn sàng sử dụng
  async getAvailableKey(): Promise<string> {
    while (true) {
      const key = this.keys[this.currentIndex];
      const status = this.keyStatus.get(key);

      // Nếu key không bị khóa (Rate limit)
      if (status && !status.isLocked) {
        // Tạm thời khóa nhẹ để tránh các luồng song song bốc trùng khít 1 lúc
        status.isLocked = true; 
        this.currentIndex = (this.currentIndex + 1) % this.keys.length;
        return key;
      }

      // Nếu tất cả key đều bận, đợi một chút rồi tìm tiếp
      this.currentIndex = (this.currentIndex + 1) % this.keys.length;
      await new Promise(resolve => setTimeout(resolve, 500)); 
    }
  }

  // Giải phóng Key sau khi dùng xong hoặc bị lỗi Rate Limit
  releaseKey(key: string, isRateLimited: boolean = false) {
    const status = this.keyStatus.get(key);
    if (status) {
      status.isLocked = false;
      if (isRateLimited) {
        status.isLocked = true;
        logger.info(`⚠️ Key ${key.substring(0, 5)}... bị Rate Limit. Khóa 60s.`);
        setTimeout(() => { status.isLocked = false; }, 60000); // Khóa 1 phút
      }
    }
  }
}