
import { app, BrowserWindow, dialog, globalShortcut, ipcMain, IpcMainInvokeEvent, shell } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { exec, execFile, execSync, spawn } from 'node:child_process';
import xpath from 'xpath';
import { DOMParser } from 'xmldom'



import * as fs from 'fs'; // Dùng cho createWriteStream (Stream)
import * as fsp from 'fs/promises'; // Dùng cho readFile (Async/Await)
import * as path from 'path';



import { autoUpdater } from "electron-updater";

import { TaskRunner } from './engine/TaskMakeVideoRunner';
import { gpmService } from './services/gpm.service';
import LicenseService, { getUniqueDeviceId } from './services/license.service';
//import { streamServer } from './socket-server';
//import { startDeviceStream } from './adb-manager';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import { logger } from './utils/logger';
import { TaskPostReelsRunner } from './engine/TaskPostReelsRunner';

const pathFFmpeg = ffmpegPath.path.replace('app.asar', 'app.asar.unpacked');
ffmpeg.setFfmpegPath(pathFFmpeg);

const require = createRequire(import.meta.url)


autoUpdater.logger = require("electron-log");
(autoUpdater.logger as any).transports.file.level = "info";


const __dirname = path.dirname(fileURLToPath(import.meta.url))
const Adb = require('adbkit')



process.env.APP_ROOT = path.join(__dirname, '..')




const isDev = !app.isPackaged;
const binPath = isDev
  ? path.join(app.getAppPath(), 'bin')
  : path.join(path.dirname(app.getPath('exe')), 'bin');


// 1. Cấu hình ADB Client dùng ADB local
const adbExePtr = path.join(binPath, 'adb.exe');
const keyboardPtr = path.join(binPath, 'apk');
const client = Adb.createClient({ bin: adbExePtr });

const visionExePath = path.join(binPath, 'minmin_vision.exe')

process.on('uncaughtException', (error) => {
  // Chỉ in ra console để ông debug, không hiện popup lên màn hình khách hàng
  console.log('⚠️ [Bỏ qua lỗi ngầm]:', error.message);
});

process.on('unhandledRejection', (reason) => {
  console.log('⚠️ [Promise từ chối ngầm]:', reason);
});

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null = null
let splashWindow: BrowserWindow | null = null;

function checkUpdates() {
  autoUpdater.checkForUpdatesAndNotify();

  autoUpdater.on('update-available', () => {
    // Gửi thông báo về cho Frontend (React) để hiện Popup "Có bản mới nè MinMin!"
    win?.webContents.send('update_available');
  });

  autoUpdater.on('update-downloaded', () => {
    // Tải xong rồi, hỏi khách có muốn khởi động lại để cài không
    win?.webContents.send('update_downloaded');
  });
}



// 2. Hàm Mirror dùng Scrcpy local
ipcMain.handle('adb:mirror-device', async (_event, deviceId: string) => {
  const scrcpyExePtr = path.join(binPath, 'scrcpy.exe');

  // Lệnh chạy scrcpy từ folder bin
  // Thêm --push-target để nó không bị lỗi quyền ghi file
  const command = `"${scrcpyExePtr}" -s ${deviceId} --always-on-top --window-title "MinMin Mirror - ${deviceId}"`;

  logger.info("Đang chạy lệnh:", command);

  exec(command, { cwd: binPath }, (error) => {
    if (error) {
      logger.error(`Lỗi Scrcpy: ${error.message}`);
    }
  });

  return { success: true };
});


// 2. Hàm Mirror dùng Scrcpy local
ipcMain.handle('adb:viewphone', async (_event, deviceId, x, y, width, height) => {
  const scrcpyExePtr = path.join(binPath, 'scrcpy.exe');

  const args = [
    '-s', deviceId,
    '--no-control',
    '--always-on-top',
    '--window-title', `view-${deviceId}`,
    '--window-x', Math.floor(Number(x)).toString(),
    '--window-y', Math.floor(Number(y)).toString(),
    '--window-width', Math.floor(Number(width)).toString(),
    '--window-height', Math.floor(Number(height)).toString(),
    '--max-fps', '15',
    '--video-bit-rate', '2M', // 👈 Đổi từ --bit-rate thành --video-bit-rate
    '--no-audio',            // 👈 Tắt audio để tránh lỗi driver và nhẹ máy

  ];

  const scrcpyProcess = spawn(scrcpyExePtr, args);
  scrcpyProcess.stdout.on('data', (data) => {
    // Nếu thấy dòng "Texture: ..." là chắc chắn đã lên hình
    logger.info(`[Scrcpy Log ${deviceId}]: ${data}`);
  })
  // Giữ lại cái này để theo dõi nếu còn lỗi khác
  scrcpyProcess.stderr.on('data', (data) => {
    logger.error(`[Scrcpy Error ${deviceId}]: ${data}`);
  });

  scrcpyProcess.on('close', (code) => {
    logger.info(`Scrcpy ${deviceId} exited with code ${code}`);
  });
});


ipcMain.handle('get-version', () => {
  return {
    version: app.getVersion(),// Lấy version từ file package.json
  }
});

ipcMain.handle('open-path', (_event, fullPath: string) => {
  if (fullPath) {
    // showItemInFolder sẽ mở folder và chọn luôn file đó
    shell.showItemInFolder(fullPath);
  }
});

// --- LOGIC ADB CHO MINMIN CONTROL ---
ipcMain.handle('adb:get-devices', async () => {
  try {
    const devices = await client.listDevices()
    const deviceDetails = await Promise.all(
      devices.map(async (device: any) => {
        try {
          // Lấy model máy (ví dụ: Samsung S9, v.v.)
          const properties = await client.getProperties(device.id)
          return {
            id: device.id,
            status: device.type, // 'device', 'offline', 'unauthorized'
            model: properties['ro.product.model'] || 'Unknown Device',
          }
        } catch (e) {
          return { id: device.id, status: device.type, model: 'Access Denied' }
        }
      })
    )
    return deviceDetails
  } catch (error) {
    logger.error("ADB Error:", error)
    return []
  }
})

ipcMain.handle('get-license-info', async () => {
  return await new LicenseService().checkKey();
});

// electron/main.ts
ipcMain.handle('adb:screencap', async (_event, deviceId: string) => {
  try {
    // 1. Chụp ảnh màn hình lưu vào bộ nhớ tạm của điện thoại
    await client.shell(deviceId, 'screencap -p /sdcard/screen.png');

    // 2. Kéo file ảnh về dưới dạng Buffer
    const transfer = await client.pull(deviceId, '/sdcard/screen.png');
    const chunks: any[] = [];

    return new Promise((resolve, reject) => {
      transfer.on('data', (chunk: any) => chunks.push(chunk));
      transfer.on('end', () => {
        const buffer = Buffer.concat(chunks);
        // 3. Chuyển Buffer thành chuỗi Base64 để React đọc được ngay
        const base64 = buffer.toString('base64');
        resolve(`data:image/png;base64,${base64}`);
      });
      transfer.on('error', reject);
    });
  } catch (err) {
    logger.error("Lỗi chụp ảnh:", err);
    return null;
  }
});
ipcMain.handle('adb:dump-ui', async (_event, deviceId: string) => {
  try {
    const remoteXmlPath = '/sdcard/window_dump.xml';
    const localXmlPath = path.join(app.getPath('temp'), 'minmin_view.xml');

    // 1. Thực hiện dump và ĐỢI cho đến khi lệnh kết thúc hoàn toàn
    // Dùng 'exec' thay vì 'shell' trực tiếp nếu shell của bạn không đợi kết quả trả về
    const dumpStream = await client.shell(deviceId, `uiautomator dump ${remoteXmlPath}`);
    await Adb.util.readAll(dumpStream); // Đợi cho đến khi dòng lệnh dump chạy xong

    // 2. Kiểm tra xem file đã tồn tại trên điện thoại chưa (bước bảo mật)
    // Nếu pull ngay lập tức mà máy lag là dính lỗi "No such file" ngay
    await new Promise(resolve => setTimeout(resolve, 500)); // Nghỉ 0.5s cho chắc cú

    // 3. Tiến hành kéo file về
    const transfer = await client.pull(deviceId, remoteXmlPath);
    await new Promise((resolve, reject) => {
      const dest = fs.createWriteStream(localXmlPath);
      transfer.on('end', resolve);
      transfer.on('error', reject);
      transfer.pipe(dest);
    });

    // 4. Đọc file
    const xmlContent = await fsp.readFile(localXmlPath, 'utf-8');
    return xmlContent;

  } catch (err) {
    logger.error("Lỗi Dump UI:", err);
    return null;
  }
});
ipcMain.handle('select-file-apk', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'APK Files', extensions: ['apk'] } // Chỉ cho chọn file .apk
    ]
  });
  if (canceled) return null;
  return filePaths[0]; // Trả về đường dẫn thật (C:\Users\...)
});

ipcMain.handle('select-file', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
  });
  if (canceled) return null;
  return filePaths[0]; // Trả về đường dẫn thật (C:\Users\...)
});

ipcMain.handle('select-folder', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory'],
  });
  if (canceled) return null;
  return filePaths[0]; // Trả về đường dẫn thật (C:\Users\...)
});
ipcMain.handle('adb:list-app', async (_event, deviceId: string) => {
  try {
    // 1. Lấy Stream từ lệnh shell
    const stream = await client.shell(deviceId, "pm list packages -3");

    // 2. Gom dữ liệu từ Stream (Dùng adb.util.readAll) 🚀
    const output = await Adb.util.readAll(stream);

    // 3. Bây giờ output đã là Buffer xịn, xử lý như cũ thôi
    const apps = output.toString()
      .split('\n')
      .map((line: string) => line.replace('package:', '').trim())
      .filter((line: string) => line.length > 0);


    return apps;
  } catch (err) {
    logger.error("Lỗi khi lấy danh sách App:", err);
    return [];
  }
});

ipcMain.handle('get-deviceId', async () => {
  return getUniqueDeviceId();
});

ipcMain.on('open-external', (_event, url) => {
  if (url.startsWith('https://') || url.startsWith('http://')) {
    shell.openExternal(url) // Mở link bằng trình duyệt mặc định (Chrome, Edge,...)
  }
})

async function ensureADBKeyboard(deviceId: string) {
  try {
    // 1. Kiểm tra xem App đã cài chưa
    const installedPackages = execSync(`adb -s ${deviceId} shell pm list packages com.android.adbkeyboard`).toString();

    if (!installedPackages.includes('com.android.adbkeyboard')) {
      logger.info(`[${deviceId}] Đang cài đặt ADB Keyboard...`);
      const apkPath = path.join(keyboardPtr, 'keyboard.apk');

      // Lệnh cài đặt APK
      execSync(`adb -s ${deviceId} install "${apkPath}"`);
      logger.info(`[${deviceId}] Cài đặt thành công!`);
    }


    execSync(`adb -s ${deviceId} shell ime enable com.android.adbkeyboard/.AdbIME`);
    execSync(`adb -s ${deviceId} shell ime set com.android.adbkeyboard/.AdbIME `);

    return { success: true, message: "ADB Keyboard đã sẵn sàng!" };

  } catch (error: any) {
    logger.error(`[${deviceId}] Lỗi thiết lập bàn phím:`, error.message);
    return { success: false, message: error.message };
  }
}

ipcMain.handle('adb:execute', async (_event, { deviceId, action, params }) => {
  try {
    logger.info(`[ADB] Đang thực hiện ${action} trên thiết bị ${deviceId}`);
    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    switch (action) {
      case 'screen_on':
        // Bật màn hình
        await client.shell(deviceId, 'input keyevent KEYCODE_WAKEUP');
        // Đợi 500ms cho màn hình sáng hẳn
        await new Promise(r => setTimeout(r, 500));
        // Vuốt từ dưới lên để mở khóa (tọa độ tùy máy, thường là từ giữa dưới lên giữa trên)
        await client.shell(deviceId, 'input swipe 500 1500 500 500 200');
        break;
      case 'tap_xy': {
        const x = params.x;
        const y = params.y;

        logger.info(`[ADB] 👆 Chạm vào tọa độ: ${x}, ${y}`);

        // Lệnh click tọa độ thần thánh
        await client.shell(deviceId, `input tap ${x} ${y}`);
        break;
      }
      case 'opencv_find_and_tap': {
        // Cấp ngay một giá trị mặc định cho an toàn (0.7 hoặc 0.8)
        const thresholdVal = params.threshold ? params.threshold.toString() : "0.7";
        const modeVal = params.mode ? params.mode.toString() : "icon";

        const screenPath = path.join(app.getPath('temp'), `screen_${deviceId}.png`);
        const templatePath = path.join(binPath, 'templates', params.templateName);

        try {
          // 1. Chụp ảnh màn hình từ điện thoại
          const dumpStream = await client.shell(deviceId, `screencap -p /sdcard/screen_vision.png`);
          await Adb.util.readAll(dumpStream);

          // 2. Kéo ảnh về máy tính để xử lý
          const transfer = await client.pull(deviceId, '/sdcard/screen_vision.png');
          await new Promise((resolve, reject) => {
            const chunks: any[] = [];
            transfer.on('data', (chunk: any) => chunks.push(chunk));
            transfer.on('end', () => {
              fs.writeFileSync(screenPath, Buffer.concat(chunks));
              resolve(true);
            });
            transfer.on('error', reject);
          });

          // 3. Chạy file EXE Vision để tìm tọa độ
          const visionResult: any = await new Promise((resolve) => {
            execFile(visionExePath, [screenPath, templatePath, thresholdVal,modeVal], (error, stdout) => {
              if (error) return resolve({ success: false, error: error.message });
              try {
                resolve(JSON.parse(stdout.trim()));
              } catch (e) {
                resolve({ success: false, error: "Lỗi phân tích kết quả Vision" });
              }
            });
          });

          // 4. DỌN DẸP NGAY LẬP TỨC (Dù thành công hay thất bại cũng phải xóa file rác)
          if (fs.existsSync(screenPath)) {
            fs.unlinkSync(screenPath);
          }

          // 5. Nếu tìm thấy tọa độ, thực hiện chạm (TAP)
          if (visionResult.success && visionResult.x && visionResult.y) {
            logger.info(`[Vision] ✅ Tìm thấy mục tiêu tại ${visionResult.x}, ${visionResult.y} (Độ tin cậy: ${visionResult.confidence}). Đang thực hiện Tap...`);
            
            await client.shell(deviceId, `input tap ${visionResult.x} ${visionResult.y}`);
            
            return {
              success: true,
              x: visionResult.x,
              y: visionResult.y,
              log: `Đã chạm vào tọa độ tìm được`
            };
          }

          // Nếu không tìm thấy, trả về log warning
          logger.warn(`[Vision] ⚠️ Không tìm thấy ảnh ${params.templateName}`);
          return visionResult;

        } catch (err: any) {
          // Bọc lỗi xóa file lỡ có trục trặc
          if (fs.existsSync(screenPath)) fs.unlinkSync(screenPath);
          
          logger.error("[Vision] ❌ Lỗi:", err.message);
          return { success: false, error: err.message };
        }
        break;
      }
      case 'tap_xpath': {
        const targetXpath = params.xpath;
        const remoteXmlPath = '/sdcard/view_click.xml';

        try {
          // 1. Dọn dẹp hiện trường: Xóa file cũ để tránh xung đột dữ liệu
          await client.shell(deviceId, `rm ${remoteXmlPath}`).then((stream: any) => Adb.util.readAll(stream)).catch(() => { });

          // 2. Dump XML mới và đợi lệnh thực thi xong
          logger.info(`[ADB] 🔍 Đang quét màn hình tìm XPath...`);
          const dumpStream = await client.shell(deviceId, `uiautomator dump ${remoteXmlPath}`);
          await Adb.util.readAll(dumpStream);

          // 3. Nghỉ 500ms (tăng thêm 200ms) để Android kịp nhả file ra khỏi bộ nhớ
          await new Promise(resolve => setTimeout(resolve, 500));

          // 4. Kéo file về với bộ bọc lỗi ECONNRESET 🛡️
          const transfer = await client.pull(deviceId, remoteXmlPath);

          const xmlBuffer = await new Promise<Buffer>((resolve, reject) => {
            const chunks: any[] = [];
            transfer.on('data', (chunk: any) => chunks.push(chunk));
            transfer.on('end', () => resolve(Buffer.concat(chunks)));
            transfer.on('error', (err: any) => reject(err)); // Bắt lỗi kết nối tại đây
          });

          const xmlString = xmlBuffer.toString('utf-8');

          // 5. Phân tích XPath
          const parser = new DOMParser();
          const doc = parser.parseFromString(xmlString, "text/xml");
          const nodes = xpath.select(targetXpath, doc) as any[];

          if (nodes && nodes.length > 0) {
            const bounds = nodes[0].getAttribute('bounds');
            const rect = bounds.match(/\[(\d+),(\d+)\]\[(\d+),(\d+)\]/);

            if (rect) {
              const centerX = Math.floor((parseInt(rect[1]) + parseInt(rect[3])) / 2);
              const centerY = Math.floor((parseInt(rect[2]) + parseInt(rect[4])) / 2);

              await client.shell(deviceId, `input tap ${centerX} ${centerY}`);

              const logMsg = `Click thành công: ${centerX}, ${centerY}`;
              logger.info(`[ADB] ✅ ${logMsg}`);
              return { success: true, log: logMsg };
            }
          } else {
            const logMsg = `Không tìm thấy: ${targetXpath.substring(0, 20)}...`;
            logger.warn(`[ADB] ⚠️ ${logMsg}`);
            return { success: false, error: "Không tìm thấy phần tử", log: logMsg };
          }
        } catch (err: any) {
          logger.error("[ADB] ❌ Lỗi xử lý XPath cực nặng:", err.message);
          // Trả về lỗi thay vì để mặc cho app sập
          return {
            success: false,
            error: `Mất kết nối (ECONNRESET): ${err.message}`,
            log: "Lỗi kết nối ADB"
          };
        }
        break;
      }
      case 'paste': {
        await client.shell(deviceId, `input keyevent 279`);
        break;
      }
      case 'copy': {
        await client.shell(deviceId, `input keyevent 286`);
        await client.shell(deviceId, `input keyevent 278`);

        break;
      }
      case 'type_text':


        try {
          await ensureADBKeyboard(deviceId);

          // Vít ga gửi tiếng Việt qua Broadcast
          await client.shell(deviceId, `am broadcast -a ADB_INPUT_TEXT --es msg '${params.content}'`);
        } catch (error) {
          logger.error("Lỗi gõ tiếng Việt:", error);
          // Fallback: Nếu lỗi thì gõ không dấu chữa cháy
          const noTone = params.content.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          await client.shell(deviceId, `input text "${noTone}"`);
        }
        break;

      case 'open_app':
        // Mở app qua package name
        await client.shell(deviceId, `monkey -p ${params.package} -c android.intent.category.LAUNCHER 1`);
        break;

      case 'close_app':
        // Đóng app (Force stop)
        await client.shell(deviceId, `am force-stop ${params.package_close}`);
        break;

      case 'key_event':
        // Các phím như Home (3), Back (4), Recent (187)
        await client.shell(deviceId, `input keyevent ${params.key_event}`);
        break;
      case 'push_file': {
        const { path_file, path_phone } = params;

        if (!path_file || !path_phone) {
          throw new Error("Thiếu đường dẫn file nguồn hoặc đích!");
        }

        logger.info(`[ADB] 📤 Đang đẩy file: ${path_file} -> ${path_phone}`);

        // 🚀 CÁCH VÍT GA CHUẨN:
        // 1. Tạo một transfer object từ client.push
        const transfer = await client.push(deviceId, path_file, path_phone);

        // 2. Đợi cho đến khi đẩy xong (Sự kiện 'end')
        await new Promise((resolve, reject) => {
          transfer.on('progress', (stats: { bytesTransferred: any; }) => {
            logger.info(`[ADB] Đang đẩy: ${stats.bytesTransferred} bytes`);
          });
          transfer.on('end', () => {
            logger.info("[ADB] ✅ Đẩy file thành công!");
            resolve(true);
          });
          transfer.on('error', (err: any) => {
            logger.error("[ADB] ❌ Lỗi khi đẩy file:", err);
            reject(err);
          });
        });

        // 3. (Mẹo Shopee) Quét lại thư viện ảnh nếu bạn vừa đẩy hình ảnh vào
        // Nếu không quét, app Shopee/Facebook sẽ không thấy ảnh mới trong Gallery đâu
        if (path_phone.match(/\.(jpg|jpeg|png|mp4)$/i)) {
          await client.shell(deviceId, `am broadcast -a android.intent.action.MEDIA_SCANNER_SCAN_FILE -d file://${path_phone}`);
        }

        break;
      }
      case 'delete_file': {
        // Nhập văn bản (Lưu ý: ADB mặc định không hỗ trợ tiếng Việt có dấu trực tiếp)
        await client.shell(deviceId, `rm ${params.file_delete}`);
        break;
      }

      case 'wait': {
        // 1. Lấy giá trị min và max từ params
        const ms_min = parseInt(params.ms_min) || 1000;
        const ms_max = parseInt(params.ms_max) || 2000;

        // 2. Tính toán con số ngẫu nhiên trong khoảng [min, max]
        // Công thức: Math.random() * (max - min) + min
        const randomDuration = Math.floor(Math.random() * (ms_max - ms_min + 1)) + ms_min;

        logger.info(`[ADB] ⏳ Đang đợi ngẫu nhiên: ${randomDuration}ms (Khoảng: ${ms_min}-${ms_max}ms)`);

        // 3. Thực hiện đợi
        await sleep(randomDuration);

        logger.info(`[ADB] ✅ Đã đợi xong ${randomDuration}ms, chuyển sang bước tiếp theo.`);
        break;
      }
      case 'install_apk': {
        const apkPath = params.path_apk_install;
        if (!apkPath) throw new Error("Chưa chọn file APK!");

        logger.info(`[ADB] 📦 Đang đẩy file và cài đặt APK: ${apkPath}`);

        // 🚀 CÁCH CHUẨN: Dùng hàm install trực tiếp từ client
        // Nó sẽ tự động lo việc push file vào /data/local/tmp rồi chạy pm install
        await client.install(deviceId, apkPath);

        logger.info(`[ADB] ✅ Cài đặt hoàn tất: ${apkPath}`);
        break;
      }
      default:
        return { success: false, error: "Hành động chưa được hỗ trợ" };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

export function setupGpmHandlers() {
  // Hứng lệnh lấy danh sách profile

  ipcMain.handle('gpm:check-connection', async (_event, url: string) => {
    logger.info(url)
    return await (new gpmService(url)).checkConnection(url);
  });

  ipcMain.handle('gpm:get-profiles', async () => {
    //return await gpmService.getProfiles();
  });

  // Hứng lệnh chạy profile
  ipcMain.handle('gpm:start-profile', async (_event, profileId: string) => {
    logger.info(`🚀 MinMin đang ra lệnh mở Profile: ${profileId}`);
    //return await gpmService.startProfile(profileId);
  });


}

export function setupTaskAffHandle() {
  // Hứng lệnh lấy danh sách profile

  ipcMain.handle('video:run-tasks', async (_event: IpcMainInvokeEvent, data: any) => {
    if ((await new LicenseService().checkKey()).status) {
      const runner = new TaskRunner(_event, data);
      return await runner.execute();
    }

  });

  ipcMain.handle('reels:run-tasks', async (_event: IpcMainInvokeEvent, data: any) => {
    if ((await new LicenseService().checkKey()).status) {
      const runner = new TaskPostReelsRunner(_event, data);
      return await runner.execute();
    }

  });


}



async function createWindow() {

  splashWindow = new BrowserWindow({
    width: 400, height: 500,
    transparent: true, frame: false, // Không viền, trong suốt cho xịn
    alwaysOnTop: true,
    webPreferences: { nodeIntegration: true, contextIsolation: false, preload: path.join(__dirname, 'preload.mjs') }
  });
  splashWindow.loadFile(path.join(__dirname, '../public/splash.html'));


  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'logo.ico'),
    webPreferences: {
      webSecurity: false,
      preload: path.join(__dirname, 'preload.mjs'),
    },
    show: false
  })





  win.setMenu(null);


  win.setMenuBarVisibility(false)

  if (VITE_DEV_SERVER_URL) {

    win.loadURL(VITE_DEV_SERVER_URL)
    logger.info("🛠️ Đang ở chế độ Dev - Bỏ qua check update, vào App sau 2s");
    splashWindow?.webContents.send('status', 'Chế độ Dev: Đang kết nối Server...');
    setTimeout(() => {
      launchMainApp();
    }, 2000);

  } else {
    if (app.isPackaged) {
      win.webContents.on('devtools-opened', () => {
        win?.webContents.closeDevTools();
      });
    }
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
    autoUpdater.checkForUpdatesAndNotify();
    autoUpdater.on('checking-for-update', () => {
      splashWindow?.webContents.send('status', 'Đang kiểm tra cập nhật...');
    });

    autoUpdater.on('update-available', () => {
      splashWindow?.webContents.send('status', 'Phát hiện bản mới, đang tải về...');
    });

    autoUpdater.on('update-not-available', () => {
      splashWindow?.webContents.send('status', 'Dữ liệu đã sẵn sàng!');
      // Đợi 1s cho khách kịp đọc rồi mở Main
      setTimeout(launchMainApp, 1000);
    });

    autoUpdater.on('update-downloaded', () => {
      splashWindow?.webContents.send('status', 'Cập nhật xong! Đang khởi động lại...');
      autoUpdater.quitAndInstall();
    });

    // Nếu bị lỗi update (ví dụ mất mạng) thì vẫn cho vào App
    autoUpdater.on('error', () => {
      splashWindow?.webContents.send('status', 'Bỏ qua cập nhật, đang vào App...');
      setTimeout(launchMainApp, 1000);
    });
    // Trong hàm createWindow hoặc checkUpdates
    autoUpdater.on('download-progress', (progressObj) => {
      let log_message = "Tốc độ: " + Math.floor(progressObj.bytesPerSecond / 1024) + "KB/s";
      log_message = log_message + ' - Đã tải ' + Math.floor(progressObj.percent) + '%';

      // Gửi text status cho khách đọc
      splashWindow?.webContents.send('status', log_message);

      // 🚀 THÊM DÒNG NÀY: Bắn đúng số % sang để thanh tiến trình vít ga chạy
      splashWindow?.webContents.send('download-progress', progressObj.percent);
    });
  }

  await new LicenseService().checkKey()


}
function launchMainApp() {
  if (win && splashWindow) {
    win.maximize();
    win.show();
    win.webContents.openDevTools();



    if (splashWindow) {
      splashWindow.destroy(); // 🚀 Xóa sổ hoàn toàn
      splashWindow = null;
    }

  }
}



app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
    checkUpdates();

  }
})

app.whenReady().then(() => {

  setupGpmHandlers()
  setupTaskAffHandle()
  if (app.isPackaged) {
    globalShortcut.register('Control+Shift+I', () => false);
    globalShortcut.register('F12', () => false);
    globalShortcut.register('Control+R', () => false);
  }

  createWindow();
});


/* ipcMain.handle('adb:start-stream', async (_event, deviceId: string) => {
  await startDeviceStream(deviceId);
  return { success: true };
});
 */

