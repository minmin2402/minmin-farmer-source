import { spawn } from 'child_process';
import net from 'net';
import path from 'path';
import { app } from 'electron';
import { streamServer } from './socket-server';
import { logger } from './utils/logger';

const isDev = !app.isPackaged;
const binPath = isDev
  ? path.join(app.getAppPath(), 'bin')
  : path.join(path.dirname(app.getPath('exe')), 'bin');





export const startDeviceStream = async (deviceId: string) => {
  const serverPath = path.join(binPath, 'scrcpy-server');
  const localPort = 1234; 

  try {
    logger.info(`🧹 [${deviceId}] Cleaning up old processes...`);
    
    // BƯỚC QUAN TRỌNG: Diệt sạch scrcpy-server cũ trên điện thoại này
    // Lệnh này tìm và kill tất cả tiến trình có tên scrcpy-server
    spawn('adb', ['-s', deviceId, 'shell', 'pkill', '-f', 'scrcpy-server']);

    // Đợi 1 chút để hệ thống Android giải phóng socket
    await new Promise(resolve => setTimeout(resolve, 500));

    // Xóa forward cũ
    spawn('adb', ['-s', deviceId, 'forward', '--remove-all']);

    // 2. Push server
    const push = spawn('adb', ['-s', deviceId, 'push', serverPath, '/data/local/tmp/scrcpy-server']);
    
    push.on('close', () => {
      // 3. Chạy server với log để kiểm tra crash
      const adbServer = spawn('adb', [
        '-s', deviceId,
        'shell', 'CLASSPATH=/data/local/tmp/scrcpy-server',
        'app_process', '/', 'com.genymobile.scrcpy.Server',
        '3.3.4', 'tunnel_forward=true', 'audio=false', 'control=false', 'video_bit_rate=2000000'
      ]);

      // Lắng nghe xem server Android có báo lỗi gì không
      adbServer.stderr.on('data', (data) => logger.error(`[Android Error]: ${data}`));

      // 4. Đợi một lát rồi mới Forward và Connect
      setTimeout(() => {
        logger.info(`🔗 [${deviceId}] Forwarding port...`);
        spawn('adb', ['-s', deviceId, 'forward', `tcp:${localPort}`, 'localabstract:scrcpy']);

        const client = new net.Socket();
        
        // Thêm cơ chế tự kết nối lại nếu bị từ chối lần đầu
        const connectWithRetry = (retries = 5) => {
          client.connect(localPort, '127.0.0.1', () => {
            logger.info(`✅ [${deviceId}] TCP Connected!`);
          });

          client.once('error', (err: any) => {
            if (err.code === 'ECONNREFUSED' && retries > 0) {
              logger.info(`🔄 [${deviceId}] Retrying connection (${retries} left)...`);
              setTimeout(() => connectWithRetry(retries - 1), 500);
            } else {
              logger.error(`❌ [${deviceId}] Final Socket Error:`, err.message);
            }
          });
        };

        connectWithRetry();

        let headerPassed = false;
        client.on('data', (data) => {
          if (!headerPassed && data.length >= 69) {
            headerPassed = true;
            streamServer.broadcastToDevice(deviceId, data.slice(69));
            return;
          }
          streamServer.broadcastToDevice(deviceId, data);
        });

      }, 2000); // Tăng lên 2s cho chắc chắn
    });

  } catch (error) {
    logger.error(`❌ Fatal Error:`, error);
  }
};