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
  // Gộp waitingQueue vào trong từng profile luôn
  private profileStatus: Map<string, { 
    isLocked: boolean; 
    lastUsed: number;
    waitingQueue: ((value: boolean) => void)[]; // Hàng đợi RIÊNG cho profile này
  }>;

  constructor(profileIds: string[]) {
    // Không cần gán this.profiles = profileIds nữa
    this.profileStatus = new Map();
    profileIds.forEach(id => {
      this.profileStatus.set(id, { 
        isLocked: false, 
        lastUsed: 0,
        waitingQueue: [] // Khởi tạo hàng đợi rỗng
      });
    });
  }

  // Đổi tên thành lockProfile (hoặc giữ tên cũ tuỳ bạn), truyền id vào
  async lockProfile(profileId: string): Promise<boolean> {
    const status = this.profileStatus.get(profileId);

    if (!status) {
      throw new Error(`[GPM-Grok] ❌ Profile ${profileId} không tồn tại trong Manager`);
    }

    // 1. Nếu profile đang rảnh -> Chiếm dụng luôn và trả về true
    if (!status.isLocked) {
      status.isLocked = true;
      logger.info(`[GPM-Grok] 🔒 Đã chiếm quyền Profile: ${profileId}`);
      return true;
    }

    // 2. Nếu profile đang bận -> Ném vào hàng đợi CỦA RIÊNG PROFILE ĐÓ
    return new Promise((resolve) => {
      status.waitingQueue.push(resolve);
      logger.info(`[GPM-Grok] ⏳ Profile ${profileId} đang bận. Task vào hàng đợi (Vị trí: ${status.waitingQueue.length})`);
    });
  }

  async releaseProfile(profileId: string, cooldownTime: number = 3000) {
    const status = this.profileStatus.get(profileId);
    if (!status) return;

    logger.info(`[GPM-Grok] ⏳ Đang đợi dọn dẹp Profile ${profileId}...`);
    await new Promise(resolve => setTimeout(resolve, cooldownTime));

    status.lastUsed = Date.now();

    // 3. QUAN TRỌNG: Xử lý bàn giao quyền
    if (status.waitingQueue.length > 0) {
      // Nếu có người đang đợi đúng profile này, lấy người đầu tiên ra
      const nextTaskResolve = status.waitingQueue.shift(); 
      logger.info(`[GPM-Grok] 🔄 Bàn giao Profile ${profileId} cho task tiếp theo trong hàng đợi...`);
      
      if (nextTaskResolve) {
        // LƯU Ý: Không set isLocked = false, vì ta sang tay luôn (bàn giao chìa khóa)
        nextTaskResolve(true); 
      }
    } else {
      // Nếu không còn ai đợi profile này nữa thì mới mở khóa hoàn toàn
      status.isLocked = false;
      logger.info(`[GPM-Grok] 🔓 Đã nhả hoàn toàn Profile: ${profileId}`);
    }
  }
}