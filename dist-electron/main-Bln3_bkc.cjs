"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const main = require("./main-xJJYL7I_.cjs");
require("node:process");
require("node:readline");
Object.defineProperty(exports, "Browser", {
  enumerable: true,
  get: () => main.Browser
});
Object.defineProperty(exports, "BrowserPlatform", {
  enumerable: true,
  get: () => main.BrowserPlatform
});
Object.defineProperty(exports, "BrowserTag", {
  enumerable: true,
  get: () => main.BrowserTag
});
exports.CDP_WEBSOCKET_ENDPOINT_REGEX = main.CDP_WEBSOCKET_ENDPOINT_REGEX;
exports.Cache = main.Cache;
Object.defineProperty(exports, "ChromeReleaseChannel", {
  enumerable: true,
  get: () => main.ChromeReleaseChannel
});
exports.InstalledBrowser = main.InstalledBrowser;
exports.Process = main.Process;
exports.TimeoutError = main.TimeoutError;
exports.WEBDRIVER_BIDI_WEBSOCKET_ENDPOINT_REGEX = main.WEBDRIVER_BIDI_WEBSOCKET_ENDPOINT_REGEX;
exports.computeExecutablePath = main.computeExecutablePath;
exports.computeSystemExecutablePath = main.computeSystemExecutablePath;
exports.createProfile = main.createProfile;
exports.detectBrowserPlatform = main.detectBrowserPlatform;
exports.getInstalledBrowsers = main.getInstalledBrowsers;
exports.getVersionComparator = main.getVersionComparator;
exports.launch = main.launch;
exports.resolveBuildId = main.resolveBuildId;
exports.resolveDefaultUserDataDir = main.resolveDefaultUserDataDir;
exports.uninstall = main.uninstall;
