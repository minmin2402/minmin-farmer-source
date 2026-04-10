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
    while (true) {
      for (const id of this.profiles) {
        const status = this.profileStatus.get(id);

        // Nếu profile không bị khóa, bốc luôn
        if (status && !status.isLocked) {
          status.isLocked = true; // Khóa ngay lập tức
          console.log(`[GPM] 🔒 Đã chiếm quyền Profile: ${id}`);
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
      console.log(`[GPM] ⏳ Đang đợi dọn dẹp Profile ${profileId}...`);
      
      // Đợi một khoảng cooldown trước khi cho phép task khác bốc trúng
      await new Promise(resolve => setTimeout(resolve, cooldownTime));
      
      status.isLocked = false;
      status.lastUsed = Date.now();
      console.log(`[GPM] 🔓 Đã nhả Profile: ${profileId}`);
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
          console.log(`[GPM] 🔒 Đã chiếm quyền Profile: ${id}`);
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
      console.log(`[GPM] ⏳ Đang đợi dọn dẹp Profile ${profileId}...`);
      
      // Đợi một khoảng cooldown trước khi cho phép task khác bốc trúng
      await new Promise(resolve => setTimeout(resolve, cooldownTime));
      
      status.isLocked = false;
      status.lastUsed = Date.now();
      console.log(`[GPM] 🔓 Đã nhả Profile: ${profileId}`);
    }
  }
}