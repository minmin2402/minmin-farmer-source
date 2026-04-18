import axios from 'axios';
import { machineIdSync } from 'node-machine-id';
import crypto from 'crypto';
import { logger } from '../utils/logger';

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
      const deviceId = machineIdSync(true); // Lấy mã máy chuẩn NDK
      const encryptedPayload = this.obfuscate(deviceId); // Mã hóa tự chế

      // 1. Gửi request lên Server của MinMin
      const response = await axios.post('https://api.nhhtool.id.vn/minminfarmer/verify.php', {
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