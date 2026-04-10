"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  openExternal: (url) => electron.ipcRenderer.send("open-external", url),
  getDevices: () => electron.ipcRenderer.invoke("adb:get-devices"),
  getDeviceId: () => electron.ipcRenderer.invoke("get-deviceId"),
  getVersionApp: () => electron.ipcRenderer.invoke("get-version"),
  selectFileApk: () => electron.ipcRenderer.invoke("select-file-apk"),
  selectFile: () => electron.ipcRenderer.invoke("select-file"),
  selectFolder: () => electron.ipcRenderer.invoke("select-folder"),
  openMirror: (deviceId) => electron.ipcRenderer.invoke("adb:mirror-device", deviceId),
  // Thêm dòng này
  executeAdb: (data) => electron.ipcRenderer.invoke("adb:execute", data),
  onMainMessage: (callback) => electron.ipcRenderer.on("main-process-message", (_event, value) => callback(value)),
  dumpUi: (deviceId) => electron.ipcRenderer.invoke("adb:dump-ui", deviceId),
  screencap: (deviceId) => electron.ipcRenderer.invoke("adb:screencap", deviceId),
  listApp: (deviceId) => electron.ipcRenderer.invoke("adb:list-app", deviceId),
  onUpdateStatus: (callback) => {
    electron.ipcRenderer.on("status", (_event, value) => callback(value));
  },
  // Lắng nghe % tiến độ tải (nếu có)
  onDownloadProgress: (callback) => {
    electron.ipcRenderer.on("download-progress", (_event, value) => callback(value));
  },
  getGpmProfiles: () => electron.ipcRenderer.invoke("gpm:get-profiles"),
  startGpmProfile: (id) => electron.ipcRenderer.invoke("gpm:start-profile", id),
  stopGpmProfile: (id) => electron.ipcRenderer.invoke("gpm:stop-profile", id),
  checkGpmConnection: (url) => electron.ipcRenderer.invoke("gpm:check-connection", url),
  runTaskAutoVideo: (data) => electron.ipcRenderer.invoke("video:run-tasks", data),
  stopTaskAutoVideo: (taskIds) => electron.ipcRenderer.send("video:stop-single-task", taskIds),
  getInfoProduct: (data) => electron.ipcRenderer.invoke("video:get-info-product", data),
  onTaskLog: (callback) => {
    const subscription = (_event, data) => callback(data);
    electron.ipcRenderer.on("video:task-log", subscription);
    return () => {
      electron.ipcRenderer.removeListener("video:task-log", subscription);
    };
  }
});
