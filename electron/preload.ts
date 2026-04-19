import { ipcRenderer, contextBridge } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  openExternal: (url: string) => ipcRenderer.send('open-external', url),
  getLicenseInfo: () => ipcRenderer.invoke('get-license-info'),
  getDevices: () => ipcRenderer.invoke('adb:get-devices'),
  getDeviceId: () => ipcRenderer.invoke('get-deviceId'),
  getVersionApp: () => ipcRenderer.invoke('get-version'),
  selectFileApk: () => ipcRenderer.invoke('select-file-apk'),
  selectFile: () => ipcRenderer.invoke('select-file'),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  openPath: (path: string) => ipcRenderer.invoke('open-path', path),
  openMirror: (deviceId: string) => ipcRenderer.invoke('adb:mirror-device', deviceId), // Thêm dòng này
  openViewPhone: (deviceId:string, x:string, y:string, width:string, height:string) => ipcRenderer.invoke('adb:viewphone', deviceId,x,y,width,height), // Thêm dòng này
  startStream: (deviceId: string) => ipcRenderer.invoke('adb:start-stream', deviceId), // Thêm dòng này


  executeAdb: (data:any) => ipcRenderer.invoke('adb:execute', data),
  onMainMessage: (callback:any) => ipcRenderer.on('main-process-message', (_event, value) => callback(value)),
  dumpUi: (deviceId:string) => ipcRenderer.invoke('adb:dump-ui', deviceId),
  screencap: (deviceId:string) => ipcRenderer.invoke('adb:screencap', deviceId),
  listApp: (deviceId:string) => ipcRenderer.invoke('adb:list-app', deviceId),
  onUpdateStatus: (callback: (arg0: any) => void) => {
    ipcRenderer.on('status', (_event, value) => callback(value));
  },

  // Lắng nghe % tiến độ tải (nếu có)
  onDownloadProgress: (callback: (arg0: any) => void) => {
    ipcRenderer.on('download-progress', (_event, value) => callback(value));
  },

  getGpmProfiles: () => ipcRenderer.invoke('gpm:get-profiles'),
  startGpmProfile: (id: any) => ipcRenderer.invoke('gpm:start-profile', id),
  stopGpmProfile: (id: any) => ipcRenderer.invoke('gpm:stop-profile', id),
  checkGpmConnection: (url: string) => ipcRenderer.invoke('gpm:check-connection', url),

  runTaskAutoVideo: (data:any) => ipcRenderer.invoke('video:run-tasks', data),
  stopTaskAutoVideo: (taskIds:any) => ipcRenderer.send('video:stop-single-task', taskIds),

  runTaskAutoReels: (data:any) => ipcRenderer.invoke('reels:run-tasks', data),
  stopTaskAutoReels: (taskIds:any) => ipcRenderer.send('reels:stop-single-task', taskIds),

  getInfoProduct: (data:any) => ipcRenderer.invoke('video:get-info-product', data),
  
  onTaskLog: (callback: (data: any) => void) => {
    const subscription = (_event: any, data: any) => callback(data);
    
    // Đăng ký lắng nghe sự kiện 'video:task-log'
    ipcRenderer.on('video:task-log', subscription);

    // Trả về một hàm để "hủy" lắng nghe (Cleanup) tránh rò rỉ bộ nhớ
    return () => {
      ipcRenderer.removeListener('video:task-log', subscription);
    };
  },

  onTaskLogReels: (callback: (data: any) => void) => {
    const subscription = (_event: any, data: any) => callback(data);
    
    // Đăng ký lắng nghe sự kiện 'video:task-log'
    ipcRenderer.on('reels:task-log', subscription);

    // Trả về một hàm để "hủy" lắng nghe (Cleanup) tránh rò rỉ bộ nhớ
    return () => {
      ipcRenderer.removeListener('reels:task-log', subscription);
    };
  }
});
