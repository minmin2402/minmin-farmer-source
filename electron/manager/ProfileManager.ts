import { logger } from "../utils/logger";

export class ShopeeProfileManager {
  private profiles: string[];
  private profileStatus: Map<string, { isLocked: boolean; lastUsed: number }>;

  constructor(profileIds: string[]) {
    this.profiles = profileIds;
    this.profileStatus = new Map();
    profileIds.forEach(id => {
      this.profileStatus.set(id, { isLocked: false, lastUsed: 0 });
    });
  }

  /**
   * Đợi và lấy một Profile đang rảnh
   */
  async getAvailableProfile(): Promise<string> {
    let waitTime = 0;
    const maxWaitTime = 60000; // 60 giây - Nếu đợi quá 1 phút thì báo lỗi luôn chứ không đợi mãi

    while (true) {
      for (const id of this.profiles) {
        const status = this.profileStatus.get(id);

        // Kiểm tra profile sẵn sàng
        if (status && !status.isLocked) {
          status.isLocked = true;
          logger.info(`[GPM] 🔒 Task đã chiếm Profile: ${id}`);
          return id;
        }
      }

    

      // Log để Hoàng biết là tool vẫn đang chạy chứ không phải bị đơ
      if (waitTime % 5000 === 0) {
        logger.info(`[GPM] ⏳ Task đang xếp hàng đợi Profile trống... (${waitTime / 1000}s)`);
      }

      if (waitTime >= maxWaitTime) {
        throw new Error("Timeout: Không có Profile Grok nào trống sau 1 phút đợi!");
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      waitTime += 1000;
    }
  }

  /**
   * Giải phóng Profile sau khi đóng trình duyệt
   * @param cooldownTime Thời gian nghỉ (ms) để GPM kịp dọn dẹp tiến trình Chrome
   */
  async releaseProfile(profileId: string, cooldownTime: number = 3000) {
    const status = this.profileStatus.get(profileId);
    if (status) {
      logger.info(`[GPM] ⏳ Đang đợi dọn dẹp Profile ${profileId}...`);

      // Đợi một khoảng cooldown trước khi cho phép task khác bốc trúng
      await new Promise(resolve => setTimeout(resolve, cooldownTime));

      status.isLocked = false;
      status.lastUsed = Date.now();
      logger.info(`[GPM] 🔓 Đã nhả Profile: ${profileId}`);
    }
  }
}


export class GrokProfileManager {
  private profiles: string[];
  private profileStatus: Map<string, { isLocked: boolean; lastUsed: number }>;

  constructor(profileIds: string[]) {
    this.profiles = profileIds;
    this.profileStatus = new Map();
    profileIds.forEach(id => {
      this.profileStatus.set(id, { isLocked: false, lastUsed: 0 });
    });
  }

  /**
   * Đợi và lấy một Profile đang rảnh
   */
  async getAvailableProfile(): Promise<string> {
    while (true) {
      for (const id of this.profiles) {
        const status = this.profileStatus.get(id);

        // Nếu profile không bị khóa, bốc luôn
        if (status && !status.isLocked) {
          status.isLocked = true; // Khóa ngay lập tức
          logger.info(`[GPM] 🔒 Đã chiếm quyền Profile: ${id}`);
          return id;
        }
      }

      // Nếu tất cả profile đều đang bận, đợi 1 giây rồi quét lại
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  /**
   * Giải phóng Profile sau khi đóng trình duyệt
   * @param cooldownTime Thời gian nghỉ (ms) để GPM kịp dọn dẹp tiến trình Chrome
   */
  async releaseProfile(profileId: string, cooldownTime: number = 3000) {
    const status = this.profileStatus.get(profileId);
    if (status) {
      logger.info(`[GPM] ⏳ Đang đợi dọn dẹp Profile ${profileId}...`);

      // Đợi một khoảng cooldown trước khi cho phép task khác bốc trúng
      await new Promise(resolve => setTimeout(resolve, cooldownTime));

      status.isLocked = false;
      status.lastUsed = Date.now();
      logger.info(`[GPM] 🔓 Đã nhả Profile: ${profileId}`);
    }
  }
}