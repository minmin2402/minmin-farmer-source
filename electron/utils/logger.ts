import log from 'electron-log/main'; // Phải dùng /main để cô lập môi trường
import path from 'path';
import { app, ipcMain } from 'electron';

// 1. DỌN DẸP HANDLER CŨ (Nếu có)
// Bước này cực kỳ quan trọng để né lỗi "second handler" khi Vite Hot Reload
ipcMain.removeHandler('__ELECTRON_LOG__');

// 2. KHỞI TẠO BẰNG TAY
log.initialize();

// 3. Cấu hình đường dẫn file log
try {
  // Nếu là dev thì lưu ở thư mục gốc project cho dễ xem, product thì lưu AppData
  const logFolder = app.isPackaged 
    ? path.join(app.getPath('userData'), 'logs')
    : path.join(process.cwd(), 'logs');
    
  log.transports.file.resolvePathFn = () => path.join(logFolder, 'main.log');
} catch (e) {
  // Fallback nếu app chưa ready
  log.transports.file.level = 'error'; 
}

// 4. Cấu hình định dạng
log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';
log.transports.file.maxSize = 5 * 1024 * 1024;

export const logger = {
    info: (message: string, ...args: any[]) => log.info(message, ...args),
    error: (message: string, ...args: any[]) => log.error(message, ...args),
    warn: (message: string, ...args: any[]) => log.warn(message, ...args),
    debug: (message: string, ...args: any[]) => {
        // Chỉ log debug khi ở môi trường dev
        if (process.env.NODE_ENV === 'development') {
            log.debug(message, ...args);
        }
    }
};