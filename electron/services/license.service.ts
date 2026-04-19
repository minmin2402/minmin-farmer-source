import axios from 'axios';
import { machineIdSync } from 'node-machine-id';
import crypto from 'crypto';
import { logger } from '../utils/logger';

import os from 'os';

// ĐỊNH NGHĨA THÔNG TIN GIẤY PHÉP
export interface LicenseInfo {
  status: boolean;
  deviceId: string;
  plan: 'Basic' | 'Pro' | 'Ultra' | 'Member'; // Gói sử dụng
  maxDevices: number;
  expiredAt: string;               // Hạn sử dụng
  permissions: string[];           // Các quyền (ví dụ: ['auto_shopee', 'multi_control'])
  message: string;
}

export const getUniqueDeviceId = () => {
  try {
    // 1. Lấy ID máy từ thư viện (Dựa trên UUID của OS/Mainboard)
    const rawId = machineIdSync();

    // 2. Kết hợp thêm tên máy và Username để tăng độ unique
    const extraInfo = os.hostname() + os.userInfo().username;

    // 3. Hash tất cả lại thành một chuỗi ngắn gọn, chuyên nghiệp (SHA256)
    const finalId = crypto
      .createHash('sha256')
      .update(rawId + extraInfo)
      .digest('hex')
      .toUpperCase()
      .substring(0, 24); // Lấy 24 ký tự cho đẹp: XXXXXX-XXXXXX-XXXXXX

    return `MM-${finalId.match(/.{1,6}/g)?.join('-')}`;
    // Kết quả dạng: MM-A1B2C3-D4E5F6-G7H8I9-J0K1L2
  } catch (error) {
    logger.error("Lỗi lấy Device ID:", error);
    return "MM-UNKNOWN-DEVICE-ID";
  }
};

export default class LicenseService {

  private readonly PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlrUvdXGRzSwv5T+SCqJp
dLSrd2doTZJyuxjFpbzho9/gpKJNfRNUJeJ7OP9PbzKeg3KElOHMpj0DV4jOxPnO
dCJMMErAKqmJvR/myBWe0pk3FCDfJlxYsxFvE+9svbG1QjuWuG3lPrKQGz4L685j
o/6WgPRVT5ty12qLdwCqkd0mzGEVmxne3C/8JvfTYUkJ5qr4b7quCDf8fgeLSmIR
kG7MNwq3FoIvxS6kGjngapkU3a6W4TL1FPgw+Q4kBKzv+9JbWhJlAgX6v/Kb3Lq2
A5bn46e7LlUg9Nh4H3e+tsYSyWk2QJD+g7rt0FMXcxQeElsiRFtGIzyngiYcpc2C
8wIDAQAB
-----END PUBLIC KEY-----`;

  // 🛠️ Hàm mã hoá "tự chế" (Simple XOR hoặc Base64 + Secret để che mắt)
  private obfuscate(text: string): string {
    const secret = "MINMIN_SECRET_2026";
    return Buffer.from(text + "|" + secret).toString('base64').split('').reverse().join('');
  }
  
  // 🎯 Hàm chính: Kiểm tra License
  async checkKey(): Promise<LicenseInfo> {
    try {
      const deviceId = getUniqueDeviceId(); // Lấy mã máy chuẩn NDK
      const encryptedPayload = this.obfuscate(deviceId); // Mã hóa tự chế

      // 1. Gửi request lên Server của MinMin
      const response = await axios.post(Buffer.from("aHR0cHM6Ly9hY2NvdW50Lm1pbm1pbnRvb2wuc2l0ZS9hcGkvdmVyaWZ5LnBocA==", 'base64').toString('utf-8'), {
        key: deviceId,
        data: encryptedPayload
      }, { timeout: 10000 });

      const { signedData, signature } = response.data;

      // 2. Xác thực chữ ký từ Server (Dùng Public Key)
      const isVerified = crypto.verify(
        "sha256",
        Buffer.from(signedData),
        {
          key: this.PUBLIC_KEY,

        },
        Buffer.from(signature, 'hex')
      );

      if (!isVerified) {
        throw new Error("Dữ liệu bản quyền bị giả mạo!");
      }

      // 3. Giải mã dữ liệu JSON sau khi đã xác thực
      const licenseData: LicenseInfo = JSON.parse(signedData);

      // 4. Kiểm tra Device ID trả về có khớp với máy hiện tại không (Chống Replay Attack)
      if (licenseData.deviceId !== deviceId) {
        throw new Error("Mã máy không khớp!");
      }

      return {...licenseData};

    } catch (error: any) {
      logger.error("Lỗi xác thực:", error.message);
      return {
        status: false,
        deviceId: '',
        maxDevices:0,
        plan: 'Basic',
        expiredAt: '',
        permissions: [],
        message: error.response?.data?.message || error.message || "Không thể kết nối Server bảo quyền!"
      };
    }
  }
}

export const licenseService = new LicenseService();