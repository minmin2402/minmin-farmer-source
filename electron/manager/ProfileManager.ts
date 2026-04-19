import { logger } from "../utils/logger";

export class ShopeeProfileManager {
  private profiles: string[];
  private profileStatus: Map<string, { isLocked: boolean; lastUsed: number }>;
  private requestQueue: Array<(value: string) => void> = []; // Hàng đợi các task đang chờ

  constructor(profileIds: string[]) {
    this.profiles = profileIds;
    this.profileStatus = new Map();
    profileIds.forEach(id => {
      this.profileStatus.set(id, { isLocked: false, lastUsed: 0 });
    });
  }

  async getAvailableProfile(): Promise<string> {
    // Thử lấy profile ngay nếu có sẵn
    const id = this.findFreeProfile();
    if (id) return id;

    // Nếu không có, tạo một Promise và đẩy "lệnh giải quyết" vào hàng đợi
    return new Promise((resolve) => {
      this.requestQueue.push(resolve);
      logger.info(`[GPM] ⏳ Task đang xếp hàng đợi Profile... (Hàng đợi: ${this.requestQueue.length})`);
    });
  }

  private findFreeProfile(): string | null {
    for (const id of this.profiles) {
      const status = this.profileStatus.get(id);
      if (status && !status.isLocked) {
        status.isLocked = true;
        logger.info(`[GPM] 🔒 Task đã chiếm Profile: ${id}`);
        return id;
      }
    }
    return null;
  }

  async releaseProfile(profileId: string, cooldownTime: number = 3000) {
    const status = this.profileStatus.get(profileId);
    if (status) {
      logger.info(`[GPM] ⏳ Đang đợi dọn dẹp Profile ${profileId}...`);
      await new Promise(resolve => setTimeout(resolve, cooldownTime));

      status.isLocked = false;
      status.lastUsed = Date.now();
      logger.info(`[GPM] 🔓 Đã nhả Profile: ${profileId}`);

      // KIỂM TRA HÀNG ĐỢI: Nếu có ai đang chờ, cho họ vào luôn
      if (this.requestQueue.length > 0) {
        const nextResolve = this.requestQueue.shift();
        const nextId = this.findFreeProfile(); 
        if (nextResolve && nextId) {
          nextResolve(nextId);
        }
      }
    }
  }
}


export class GrokProfileManager {
  private profiles: string[];
  private profileStatus: Map<string, { isLocked: boolean; lastUsed: number }>;
  // Hàng đợi lưu trữ các hàm resolve của Promise đang chờ
  private waitingQueue: ((value: string) => void)[] = [];

  constructor(profileIds: string[]) {
    this.profiles = profileIds;
    this.profileStatus = new Map();
    profileIds.forEach(id => {
      this.profileStatus.set(id, { isLocked: false, lastUsed: 0 });
    });
  }

  async getAvailableProfile(): Promise<string> {
    // 1. Thử tìm xem có profile nào rảnh không
    const freeId = this.findFreeProfile();
    
    if (freeId) {
      return freeId; // Có rảnh thì chiếm luôn
    }

    // 2. Nếu không rảnh, tạo một "phiếu chờ" (Promise)
    return new Promise((resolve) => {
      this.waitingQueue.push(resolve);
      logger.info(`[GPM-Grok] ⏳ Hết Profile rảnh. Task đã vào hàng đợi (Vị trí: ${this.waitingQueue.length})`);
    });
  }

  // Hàm phụ trợ để tìm và khóa profile (tránh lặp code)
  private findFreeProfile(): string | null {
    for (const id of this.profiles) {
      const status = this.profileStatus.get(id);
      if (status && !status.isLocked) {
        status.isLocked = true;
        logger.info(`[GPM-Grok] 🔒 Đã chiếm quyền Profile: ${id}`);
        return id;
      }
    }
    return null;
  }

  async releaseProfile(profileId: string, cooldownTime: number = 3000) {
    const status = this.profileStatus.get(profileId);
    if (!status) return;

    logger.info(`[GPM-Grok] ⏳ Đang đợi dọn dẹp Profile ${profileId}...`);
    await new Promise(resolve => setTimeout(resolve, cooldownTime));

    status.isLocked = false;
    status.lastUsed = Date.now();
    logger.info(`[GPM-Grok] 🔓 Đã nhả Profile: ${profileId}`);

    // 3. QUAN TRỌNG: Khi vừa nhả, kiểm tra xem có ai đang chờ trong hàng đợi không
    if (this.waitingQueue.length > 0) {
      const nextTaskResolve = this.waitingQueue.shift(); // Lấy người xếp hàng đầu tiên ra
      const availableId = this.findFreeProfile(); // Tìm profile vừa nhả
      
      if (nextTaskResolve && availableId) {
        nextTaskResolve(availableId); // Kích hoạt Promise của task đang chờ
      }
    }
  }
}