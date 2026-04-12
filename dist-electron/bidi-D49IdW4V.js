var tg = Object.defineProperty;
var sg = Object.getPrototypeOf;
var rg = Reflect.get;
var md = (i) => {
  throw TypeError(i);
};
var ng = (i, e, t) => e in i ? tg(i, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : i[e] = t;
var O = (i, e, t) => ng(i, typeof e != "symbol" ? e + "" : e, t), gd = (i, e, t) => e.has(i) || md("Cannot " + t), cc = (i, e) => Object(e) !== e ? md('Cannot use the "in" operator on this value') : i.has(e), s = (i, e, t) => (gd(i, e, "read from private field"), t ? t.call(i) : e.get(i)), u = (i, e, t) => e.has(i) ? md("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(i) : e.set(i, t), f = (i, e, t, r) => (gd(i, e, "write to private field"), r ? r.call(i, t) : e.set(i, t), t), m = (i, e, t) => (gd(i, e, "access private method"), t);
var Ch = (i, e, t, r) => ({
  set _(n) {
    f(i, e, n, t);
  },
  get _() {
    return s(i, e, r);
  }
}), xh = (i, e, t) => rg(sg(i), t, e);
import { n as ig, m as St, o as og, D as Jl, U as q, p as Yl, E as Z, q as ag, t as cg, v as Ee, w as Zl, x as ug, y as $t, z as pe, A as Ls, F as L, G as bp, H as uo, J as Xe, K as Cp, L as dg, M as lg, N as hg, O as xp, Q as pg, R as fg, S as Ep, V as mg, X as gg, Y as wg, Z as yg, _ as Eh, $ as vg, a0 as bg, a1 as Cg, a2 as xg, a3 as Eg, a4 as Sg, a5 as Pg, a6 as Ig, a7 as vc, a8 as Sh, a9 as _g, aa as kg, ab as Tg, ac as Dg, ad as Ph, ae as Ih, af as Ng, ag as Og, ah as ds, ai as uc, aj as Ct, ak as Hi, al as _h, am as Ys, an as qc, ao as Rg, ap as Ag, aq as Bg, ar as Fg, as as Mg, at as Hc, au as jg, av as wd, aw as Ug, ax as $g, ay as ls, az as Lg, aA as qg, aB as ms, aC as Hg, aD as zg, aE as Wg, aF as Kg, aG as Vg, aH as Gg, aI as Xg, aJ as kh, aK as Jg, aL as Iu, aM as Yg, aN as _u, aO as ku, aP as Th, aQ as Zg, aR as Qg } from "./main-BhDk8ZXB.js";
import ew from "crypto";
var Tu = {}, Du = {}, qs = {};
function tw(i) {
  return { all: i = i || /* @__PURE__ */ new Map(), on: function(e, t) {
    var r = i.get(e);
    r ? r.push(t) : i.set(e, [t]);
  }, off: function(e, t) {
    var r = i.get(e);
    r && (t ? r.splice(r.indexOf(t) >>> 0, 1) : i.set(e, []));
  }, emit: function(e, t) {
    var r = i.get(e);
    r && r.slice().map(function(n) {
      n(t);
    }), (r = i.get("*")) && r.slice().map(function(n) {
      n(e, t);
    });
  } };
}
const sw = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: tw
}, Symbol.toStringTag, { value: "Module" })), rw = /* @__PURE__ */ ig(sw);
var nw = St && St.__importDefault || function(i) {
  return i && i.__esModule ? i : { default: i };
};
Object.defineProperty(qs, "__esModule", { value: !0 });
qs.EventEmitter = void 0;
const iw = nw(rw);
var gs;
class ow {
  constructor() {
    u(this, gs, (0, iw.default)());
  }
  on(e, t) {
    return s(this, gs).on(e, t), this;
  }
  /**
   * Like `on` but the listener will only be fired once and then it will be removed.
   * @param event The event you'd like to listen to
   * @param handler The handler function to run when the event occurs
   * @return `this` to enable chaining method calls.
   */
  once(e, t) {
    const r = (n) => {
      t(n), this.off(e, r);
    };
    return this.on(e, r);
  }
  off(e, t) {
    return s(this, gs).off(e, t), this;
  }
  /**
   * Emits an event and call any associated listeners.
   *
   * @param event The event to emit.
   * @param eventData Any data to emit with the event.
   * @return `true` if there are any listeners, `false` otherwise.
   */
  emit(e, t) {
    s(this, gs).emit(e, t);
  }
  /**
   * Removes all listeners. If given an event argument, it will remove only
   * listeners for that event.
   * @param event - the event to remove listeners for.
   * @returns `this` to enable you to chain method calls.
   */
  removeAllListeners(e) {
    return e ? s(this, gs).all.delete(e) : s(this, gs).all.clear(), this;
  }
}
gs = new WeakMap();
qs.EventEmitter = ow;
var Te = {};
Object.defineProperty(Te, "__esModule", { value: !0 });
Te.LogType = void 0;
var Dh;
(function(i) {
  i.bidi = "bidi", i.cdp = "cdp", i.debug = "debug", i.debugError = "debug:error", i.debugInfo = "debug:info", i.debugWarn = "debug:warn";
})(Dh || (Te.LogType = Dh = {}));
var Nu = {}, Sp;
Object.defineProperty(Nu, "__esModule", { value: !0 });
Nu.ProcessingQueue = void 0;
const yd = Te;
var Qs, po, yn, vn, Xc, Pp;
class Ql {
  constructor(e, t) {
    u(this, Xc);
    u(this, Qs);
    u(this, po);
    u(this, yn, []);
    // Flag to keep only 1 active processor.
    u(this, vn, !1);
    f(this, po, e), f(this, Qs, t);
  }
  add(e, t) {
    s(this, yn).push([e, t]), m(this, Xc, Pp).call(this);
  }
}
Qs = new WeakMap(), po = new WeakMap(), yn = new WeakMap(), vn = new WeakMap(), Xc = new WeakSet(), Pp = async function() {
  var e;
  if (!s(this, vn)) {
    for (f(this, vn, !0); s(this, yn).length > 0; ) {
      const t = s(this, yn).shift();
      if (!t)
        continue;
      const [r, n] = t;
      (e = s(this, Qs)) == null || e.call(this, Sp.LOGGER_PREFIX, "Processing event:", n), await r.then((o) => {
        var a;
        if (o.kind === "error") {
          (a = s(this, Qs)) == null || a.call(this, yd.LogType.debugError, "Event threw before sending:", o.error.message, o.error.stack);
          return;
        }
        return s(this, po).call(this, o.value);
      }).catch((o) => {
        var a;
        (a = s(this, Qs)) == null || a.call(this, yd.LogType.debugError, "Event was not processed:", o == null ? void 0 : o.message);
      });
    }
    f(this, vn, !1);
  }
}, O(Ql, "LOGGER_PREFIX", `${yd.LogType.debug}:queue`);
Nu.ProcessingQueue = Ql;
Sp = Ql;
var Ou = {}, se = {}, Ip = {};
Object.defineProperty(Ip, "__esModule", { value: !0 });
var ve = {};
Object.defineProperty(ve, "__esModule", { value: !0 });
ve.EVENT_NAMES = ve.Speculation = ve.Bluetooth = ve.Network = ve.Input = ve.BrowsingContext = ve.Log = ve.Script = ve.BiDiModule = void 0;
var Ad;
(function(i) {
  i.Bluetooth = "bluetooth", i.Browser = "browser", i.BrowsingContext = "browsingContext", i.Cdp = "goog:cdp", i.Input = "input", i.Log = "log", i.Network = "network", i.Script = "script", i.Session = "session", i.Speculation = "speculation";
})(Ad || (ve.BiDiModule = Ad = {}));
var Bd;
(function(i) {
  (function(e) {
    e.Message = "script.message", e.RealmCreated = "script.realmCreated", e.RealmDestroyed = "script.realmDestroyed";
  })(i.EventNames || (i.EventNames = {}));
})(Bd || (ve.Script = Bd = {}));
var Fd;
(function(i) {
  (function(e) {
    e.LogEntryAdded = "log.entryAdded";
  })(i.EventNames || (i.EventNames = {}));
})(Fd || (ve.Log = Fd = {}));
var Md;
(function(i) {
  (function(e) {
    e.ContextCreated = "browsingContext.contextCreated", e.ContextDestroyed = "browsingContext.contextDestroyed", e.DomContentLoaded = "browsingContext.domContentLoaded", e.DownloadEnd = "browsingContext.downloadEnd", e.DownloadWillBegin = "browsingContext.downloadWillBegin", e.FragmentNavigated = "browsingContext.fragmentNavigated", e.HistoryUpdated = "browsingContext.historyUpdated", e.Load = "browsingContext.load", e.NavigationAborted = "browsingContext.navigationAborted", e.NavigationCommitted = "browsingContext.navigationCommitted", e.NavigationFailed = "browsingContext.navigationFailed", e.NavigationStarted = "browsingContext.navigationStarted", e.UserPromptClosed = "browsingContext.userPromptClosed", e.UserPromptOpened = "browsingContext.userPromptOpened";
  })(i.EventNames || (i.EventNames = {}));
})(Md || (ve.BrowsingContext = Md = {}));
var jd;
(function(i) {
  (function(e) {
    e.FileDialogOpened = "input.fileDialogOpened";
  })(i.EventNames || (i.EventNames = {}));
})(jd || (ve.Input = jd = {}));
var Ud;
(function(i) {
  (function(e) {
    e.AuthRequired = "network.authRequired", e.BeforeRequestSent = "network.beforeRequestSent", e.FetchError = "network.fetchError", e.ResponseCompleted = "network.responseCompleted", e.ResponseStarted = "network.responseStarted";
  })(i.EventNames || (i.EventNames = {}));
})(Ud || (ve.Network = Ud = {}));
var $d;
(function(i) {
  (function(e) {
    e.RequestDevicePromptUpdated = "bluetooth.requestDevicePromptUpdated", e.GattConnectionAttempted = "bluetooth.gattConnectionAttempted", e.CharacteristicEventGenerated = "bluetooth.characteristicEventGenerated", e.DescriptorEventGenerated = "bluetooth.descriptorEventGenerated";
  })(i.EventNames || (i.EventNames = {}));
})($d || (ve.Bluetooth = $d = {}));
var Ld;
(function(i) {
  (function(e) {
    e.PrefetchStatusUpdated = "speculation.prefetchStatusUpdated";
  })(i.EventNames || (i.EventNames = {}));
})(Ld || (ve.Speculation = Ld = {}));
ve.EVENT_NAMES = /* @__PURE__ */ new Set([
  // keep-sorted start
  ...Object.values(Ad),
  ...Object.values($d.EventNames),
  ...Object.values(Md.EventNames),
  ...Object.values(jd.EventNames),
  ...Object.values(Fd.EventNames),
  ...Object.values(Ud.EventNames),
  ...Object.values(Bd.EventNames),
  ...Object.values(Ld.EventNames)
  // keep-sorted end
]);
var _p = {};
Object.defineProperty(_p, "__esModule", { value: !0 });
var M = {};
Object.defineProperty(M, "__esModule", { value: !0 });
M.UnavailableNetworkDataException = M.NoSuchNetworkDataException = M.NoSuchNetworkCollectorException = M.NoSuchWebExtensionException = M.InvalidWebExtensionException = M.UnderspecifiedStoragePartitionException = M.UnableToSetFileInputException = M.UnableToSetCookieException = M.NoSuchStoragePartitionException = M.UnsupportedOperationException = M.UnableToCloseBrowserException = M.UnableToCaptureScreenException = M.UnknownErrorException = M.UnknownCommandException = M.SessionNotCreatedException = M.NoSuchUserContextException = M.NoSuchScriptException = M.NoSuchRequestException = M.NoSuchNodeException = M.NoSuchInterceptException = M.NoSuchHistoryEntryException = M.NoSuchHandleException = M.NoSuchFrameException = M.NoSuchElementException = M.NoSuchAlertException = M.MoveTargetOutOfBoundsException = M.InvalidSessionIdException = M.InvalidSelectorException = M.InvalidArgumentException = M.Exception = void 0;
class re extends Error {
  constructor(t, r, n) {
    super();
    O(this, "error");
    O(this, "message");
    O(this, "stacktrace");
    this.error = t, this.message = r, this.stacktrace = n;
  }
  toErrorResponse(t) {
    return {
      type: "error",
      id: t,
      error: this.error,
      message: this.message,
      stacktrace: this.stacktrace
    };
  }
}
M.Exception = re;
class aw extends re {
  constructor(e, t) {
    super("invalid argument", e, t);
  }
}
M.InvalidArgumentException = aw;
class cw extends re {
  constructor(e, t) {
    super("invalid selector", e, t);
  }
}
M.InvalidSelectorException = cw;
class uw extends re {
  constructor(e, t) {
    super("invalid session id", e, t);
  }
}
M.InvalidSessionIdException = uw;
class dw extends re {
  constructor(e, t) {
    super("move target out of bounds", e, t);
  }
}
M.MoveTargetOutOfBoundsException = dw;
class lw extends re {
  constructor(e, t) {
    super("no such alert", e, t);
  }
}
M.NoSuchAlertException = lw;
class hw extends re {
  constructor(e, t) {
    super("no such element", e, t);
  }
}
M.NoSuchElementException = hw;
class pw extends re {
  constructor(e, t) {
    super("no such frame", e, t);
  }
}
M.NoSuchFrameException = pw;
class fw extends re {
  constructor(e, t) {
    super("no such handle", e, t);
  }
}
M.NoSuchHandleException = fw;
class mw extends re {
  constructor(e, t) {
    super("no such history entry", e, t);
  }
}
M.NoSuchHistoryEntryException = mw;
class gw extends re {
  constructor(e, t) {
    super("no such intercept", e, t);
  }
}
M.NoSuchInterceptException = gw;
class ww extends re {
  constructor(e, t) {
    super("no such node", e, t);
  }
}
M.NoSuchNodeException = ww;
class yw extends re {
  constructor(e, t) {
    super("no such request", e, t);
  }
}
M.NoSuchRequestException = yw;
class vw extends re {
  constructor(e, t) {
    super("no such script", e, t);
  }
}
M.NoSuchScriptException = vw;
class bw extends re {
  constructor(e, t) {
    super("no such user context", e, t);
  }
}
M.NoSuchUserContextException = bw;
class Cw extends re {
  constructor(e, t) {
    super("session not created", e, t);
  }
}
M.SessionNotCreatedException = Cw;
class xw extends re {
  constructor(e, t) {
    super("unknown command", e, t);
  }
}
M.UnknownCommandException = xw;
class Ew extends re {
  constructor(e, t = new Error().stack) {
    super("unknown error", e, t);
  }
}
M.UnknownErrorException = Ew;
class Sw extends re {
  constructor(e, t) {
    super("unable to capture screen", e, t);
  }
}
M.UnableToCaptureScreenException = Sw;
class Pw extends re {
  constructor(e, t) {
    super("unable to close browser", e, t);
  }
}
M.UnableToCloseBrowserException = Pw;
class Iw extends re {
  constructor(e, t) {
    super("unsupported operation", e, t);
  }
}
M.UnsupportedOperationException = Iw;
class _w extends re {
  constructor(e, t) {
    super("no such storage partition", e, t);
  }
}
M.NoSuchStoragePartitionException = _w;
class kw extends re {
  constructor(e, t) {
    super("unable to set cookie", e, t);
  }
}
M.UnableToSetCookieException = kw;
class Tw extends re {
  constructor(e, t) {
    super("unable to set file input", e, t);
  }
}
M.UnableToSetFileInputException = Tw;
class Dw extends re {
  constructor(e, t) {
    super("underspecified storage partition", e, t);
  }
}
M.UnderspecifiedStoragePartitionException = Dw;
class Nw extends re {
  constructor(e, t) {
    super("invalid web extension", e, t);
  }
}
M.InvalidWebExtensionException = Nw;
class Ow extends re {
  constructor(e, t) {
    super("no such web extension", e, t);
  }
}
M.NoSuchWebExtensionException = Ow;
class Rw extends re {
  constructor(e, t) {
    super("no such network collector", e, t);
  }
}
M.NoSuchNetworkCollectorException = Rw;
class Aw extends re {
  constructor(e, t) {
    super("no such network data", e, t);
  }
}
M.NoSuchNetworkDataException = Aw;
class Bw extends re {
  constructor(e, t) {
    super("unavailable network data", e, t);
  }
}
M.UnavailableNetworkDataException = Bw;
var kp = {};
Object.defineProperty(kp, "__esModule", { value: !0 });
var Tp = {};
Object.defineProperty(Tp, "__esModule", { value: !0 });
var Dp = {};
Object.defineProperty(Dp, "__esModule", { value: !0 });
var Np = {};
Object.defineProperty(Np, "__esModule", { value: !0 });
(function(i) {
  var e = St && St.__createBinding || (Object.create ? function(o, a, c, p) {
    p === void 0 && (p = c);
    var l = Object.getOwnPropertyDescriptor(a, c);
    (!l || ("get" in l ? !a.__esModule : l.writable || l.configurable)) && (l = { enumerable: !0, get: function() {
      return a[c];
    } }), Object.defineProperty(o, p, l);
  } : function(o, a, c, p) {
    p === void 0 && (p = c), o[p] = a[c];
  }), t = St && St.__setModuleDefault || (Object.create ? function(o, a) {
    Object.defineProperty(o, "default", { enumerable: !0, value: a });
  } : function(o, a) {
    o.default = a;
  }), r = St && St.__importStar || /* @__PURE__ */ function() {
    var o = function(a) {
      return o = Object.getOwnPropertyNames || function(c) {
        var p = [];
        for (var l in c) Object.prototype.hasOwnProperty.call(c, l) && (p[p.length] = l);
        return p;
      }, o(a);
    };
    return function(a) {
      if (a && a.__esModule) return a;
      var c = {};
      if (a != null) for (var p = o(a), l = 0; l < p.length; l++) p[l] !== "default" && e(c, a, p[l]);
      return t(c, a), c;
    };
  }(), n = St && St.__exportStar || function(o, a) {
    for (var c in o) c !== "default" && !Object.prototype.hasOwnProperty.call(a, c) && e(a, o, c);
  };
  Object.defineProperty(i, "__esModule", { value: !0 }), i.UAClientHints = i.ChromiumBidi = i.Cdp = void 0, i.Cdp = r(Ip), i.ChromiumBidi = r(ve), n(_p, i), n(M, i), n(kp, i), n(Tp, i), n(Dp, i), i.UAClientHints = r(Np);
})(se);
var Ru = {};
Object.defineProperty(Ru, "__esModule", { value: !0 });
Ru.BidiNoOpParser = void 0;
class Fw {
  // Bluetooth module
  // keep-sorted start block=yes
  parseDisableSimulationParameters(e) {
    return e;
  }
  parseHandleRequestDevicePromptParams(e) {
    return e;
  }
  parseSimulateAdapterParameters(e) {
    return e;
  }
  parseSimulateAdvertisementParameters(e) {
    return e;
  }
  parseSimulateCharacteristicParameters(e) {
    return e;
  }
  parseSimulateCharacteristicResponseParameters(e) {
    return e;
  }
  parseSimulateDescriptorParameters(e) {
    return e;
  }
  parseSimulateDescriptorResponseParameters(e) {
    return e;
  }
  parseSimulateGattConnectionResponseParameters(e) {
    return e;
  }
  parseSimulateGattDisconnectionParameters(e) {
    return e;
  }
  parseSimulatePreconnectedPeripheralParameters(e) {
    return e;
  }
  parseSimulateServiceParameters(e) {
    return e;
  }
  // keep-sorted end
  // Browser module
  // keep-sorted start block=yes
  parseCreateUserContextParameters(e) {
    return e;
  }
  parseRemoveUserContextParameters(e) {
    return e;
  }
  parseSetClientWindowStateParameters(e) {
    return e;
  }
  parseSetDownloadBehaviorParameters(e) {
    return e;
  }
  // keep-sorted end
  // Browsing Context module
  // keep-sorted start block=yes
  parseActivateParams(e) {
    return e;
  }
  parseCaptureScreenshotParams(e) {
    return e;
  }
  parseCloseParams(e) {
    return e;
  }
  parseCreateParams(e) {
    return e;
  }
  parseGetTreeParams(e) {
    return e;
  }
  parseHandleUserPromptParams(e) {
    return e;
  }
  parseLocateNodesParams(e) {
    return e;
  }
  parseNavigateParams(e) {
    return e;
  }
  parsePrintParams(e) {
    return e;
  }
  parseReloadParams(e) {
    return e;
  }
  parseSetViewportParams(e) {
    return e;
  }
  parseTraverseHistoryParams(e) {
    return e;
  }
  // keep-sorted end
  // CDP module
  // keep-sorted start block=yes
  parseGetSessionParams(e) {
    return e;
  }
  parseResolveRealmParams(e) {
    return e;
  }
  parseSendCommandParams(e) {
    return e;
  }
  // keep-sorted end
  // Emulation module
  // keep-sorted start block=yes
  parseSetClientHintsOverrideParams(e) {
    return e;
  }
  parseSetForcedColorsModeThemeOverrideParams(e) {
    return e;
  }
  parseSetGeolocationOverrideParams(e) {
    return e;
  }
  parseSetLocaleOverrideParams(e) {
    return e;
  }
  parseSetNetworkConditionsParams(e) {
    return e;
  }
  parseSetScreenOrientationOverrideParams(e) {
    return e;
  }
  parseSetScreenSettingsOverrideParams(e) {
    return e;
  }
  parseSetScriptingEnabledParams(e) {
    return e;
  }
  parseSetTimezoneOverrideParams(e) {
    return e;
  }
  parseSetTouchOverrideParams(e) {
    return e;
  }
  parseSetUserAgentOverrideParams(e) {
    return e;
  }
  // keep-sorted end
  // Script module
  // keep-sorted start block=yes
  parseAddPreloadScriptParams(e) {
    return e;
  }
  parseCallFunctionParams(e) {
    return e;
  }
  parseDisownParams(e) {
    return e;
  }
  parseEvaluateParams(e) {
    return e;
  }
  parseGetRealmsParams(e) {
    return e;
  }
  parseRemovePreloadScriptParams(e) {
    return e;
  }
  // keep-sorted end
  // Input module
  // keep-sorted start block=yes
  parsePerformActionsParams(e) {
    return e;
  }
  parseReleaseActionsParams(e) {
    return e;
  }
  parseSetFilesParams(e) {
    return e;
  }
  // keep-sorted end
  // Network module
  // keep-sorted start block=yes
  parseAddDataCollectorParams(e) {
    return e;
  }
  parseAddInterceptParams(e) {
    return e;
  }
  parseContinueRequestParams(e) {
    return e;
  }
  parseContinueResponseParams(e) {
    return e;
  }
  parseContinueWithAuthParams(e) {
    return e;
  }
  parseDisownDataParams(e) {
    return e;
  }
  parseFailRequestParams(e) {
    return e;
  }
  parseGetDataParams(e) {
    return e;
  }
  parseProvideResponseParams(e) {
    return e;
  }
  parseRemoveDataCollectorParams(e) {
    return e;
  }
  parseRemoveInterceptParams(e) {
    return e;
  }
  parseSetCacheBehaviorParams(e) {
    return e;
  }
  parseSetExtraHeadersParams(e) {
    return e;
  }
  // keep-sorted end
  // Permissions module
  // keep-sorted start block=yes
  parseSetPermissionsParams(e) {
    return e;
  }
  // keep-sorted end
  // Session module
  // keep-sorted start block=yes
  parseSubscribeParams(e) {
    return e;
  }
  parseUnsubscribeParams(e) {
    return e;
  }
  // keep-sorted end
  // Storage module
  // keep-sorted start block=yes
  parseDeleteCookiesParams(e) {
    return e;
  }
  parseGetCookiesParams(e) {
    return e;
  }
  parseSetCookieParams(e) {
    return e;
  }
  // keep-sorted end
  // WebExtenstion module
  // keep-sorted start block=yes
  parseInstallParams(e) {
    return e;
  }
  parseUninstallParams(e) {
    return e;
  }
}
Ru.BidiNoOpParser = Fw;
var Qa = {};
Object.defineProperty(Qa, "__esModule", { value: !0 });
Qa.BrowserProcessor = void 0;
Qa.getProxyStr = Ap;
const jt = se;
var ct, fo, Kt, er, as, Op, Rp, qd;
class Mw {
  constructor(e, t, r, n) {
    u(this, as);
    u(this, ct);
    u(this, fo);
    u(this, Kt);
    u(this, er);
    f(this, ct, e), f(this, fo, t), f(this, Kt, r), f(this, er, n);
  }
  close() {
    return setTimeout(() => s(this, ct).sendCommand("Browser.close").catch(() => {
    }), 0), {};
  }
  async createUserContext(e) {
    const t = e, r = s(this, Kt).getGlobalConfig();
    if (t.acceptInsecureCerts !== void 0 && t.acceptInsecureCerts === !1 && r.acceptInsecureCerts === !0)
      throw new jt.UnknownErrorException(`Cannot set user context's "acceptInsecureCerts" to false, when a capability "acceptInsecureCerts" is set to true`);
    const n = {};
    if (t.proxy) {
      const a = Ap(t.proxy);
      a && (n.proxyServer = a), t.proxy.noProxy && (n.proxyBypassList = t.proxy.noProxy.join(","));
    } else {
      e["goog:proxyServer"] !== void 0 && (n.proxyServer = e["goog:proxyServer"]);
      const a = e["goog:proxyBypassList"] ?? void 0;
      a && (n.proxyBypassList = a.join(","));
    }
    const o = await s(this, ct).sendCommand("Target.createBrowserContext", n);
    return await m(this, as, qd).call(this, r.downloadBehavior ?? null, o.browserContextId), s(this, Kt).updateUserContextConfig(o.browserContextId, {
      acceptInsecureCerts: e.acceptInsecureCerts,
      userPromptHandler: e.unhandledPromptBehavior
    }), {
      userContext: o.browserContextId
    };
  }
  async removeUserContext(e) {
    const t = e.userContext;
    if (t === "default")
      throw new jt.InvalidArgumentException("`default` user context cannot be removed");
    try {
      await s(this, ct).sendCommand("Target.disposeBrowserContext", {
        browserContextId: t
      });
    } catch (r) {
      throw r.message.startsWith("Failed to find context with id") ? new jt.NoSuchUserContextException(r.message) : r;
    }
    return {};
  }
  async getUserContexts() {
    return {
      userContexts: await s(this, er).getUserContexts()
    };
  }
  async setClientWindowState(e) {
    const { clientWindow: t } = e, r = {
      windowState: e.state
    };
    e.state === "normal" && (e.width !== void 0 && (r.width = e.width), e.height !== void 0 && (r.height = e.height), e.x !== void 0 && (r.left = e.x), e.y !== void 0 && (r.top = e.y));
    const n = Number.parseInt(t);
    if (isNaN(n))
      throw new jt.InvalidArgumentException("no such client window");
    await s(this, ct).sendCommand("Browser.setWindowBounds", {
      windowId: n,
      bounds: r
    });
    const o = await s(this, ct).sendCommand("Browser.getWindowBounds", {
      windowId: n
    });
    return {
      active: !1,
      clientWindow: `${n}`,
      state: o.bounds.windowState ?? "normal",
      height: o.bounds.height ?? 0,
      width: o.bounds.width ?? 0,
      x: o.bounds.left ?? 0,
      y: o.bounds.top ?? 0
    };
  }
  async getClientWindows() {
    const e = s(this, fo).getTopLevelContexts().map((o) => o.cdpTarget.id), t = await Promise.all(e.map(async (o) => await m(this, as, Op).call(this, o))), r = /* @__PURE__ */ new Set(), n = new Array();
    for (const o of t)
      r.has(o.clientWindow) || (r.add(o.clientWindow), n.push(o));
    return { clientWindows: n };
  }
  async setDownloadBehavior(e) {
    let t;
    return e.userContexts === void 0 ? t = (await s(this, er).getUserContexts()).map((r) => r.userContext) : t = Array.from(await s(this, er).verifyUserContextIdList(e.userContexts)), e.userContexts === void 0 ? s(this, Kt).updateGlobalConfig({
      downloadBehavior: e.downloadBehavior
    }) : e.userContexts.map((r) => s(this, Kt).updateUserContextConfig(r, {
      downloadBehavior: e.downloadBehavior
    })), await Promise.all(t.map(async (r) => {
      const n = s(this, Kt).getActiveConfig(void 0, r).downloadBehavior ?? null;
      await m(this, as, qd).call(this, n, r);
    })), {};
  }
}
ct = new WeakMap(), fo = new WeakMap(), Kt = new WeakMap(), er = new WeakMap(), as = new WeakSet(), Op = async function(e) {
  const t = await s(this, ct).sendCommand("Browser.getWindowForTarget", { targetId: e });
  return {
    // `active` is not supported in CDP yet.
    active: !1,
    clientWindow: `${t.windowId}`,
    state: t.bounds.windowState ?? "normal",
    height: t.bounds.height ?? 0,
    width: t.bounds.width ?? 0,
    x: t.bounds.left ?? 0,
    y: t.bounds.top ?? 0
  };
}, Rp = function(e) {
  if (e === null)
    return {
      behavior: "default"
    };
  if ((e == null ? void 0 : e.type) === "denied")
    return {
      behavior: "deny"
    };
  if ((e == null ? void 0 : e.type) === "allowed")
    return {
      behavior: "allow",
      downloadPath: e.destinationFolder
    };
  throw new jt.UnknownErrorException("Unexpected download behavior");
}, qd = async function(e, t) {
  await s(this, ct).sendCommand("Browser.setDownloadBehavior", {
    ...m(this, as, Rp).call(this, e),
    browserContextId: t === "default" ? void 0 : t,
    // Required for enabling download events.
    eventsEnabled: !0
  });
};
Qa.BrowserProcessor = Mw;
function Ap(i) {
  if (!(i.proxyType === "direct" || i.proxyType === "system")) {
    if (i.proxyType === "pac")
      throw new jt.UnsupportedOperationException("PAC proxy configuration is not supported per user context");
    if (i.proxyType === "autodetect")
      throw new jt.UnsupportedOperationException("Autodetect proxy is not supported per user context");
    if (i.proxyType === "manual") {
      const e = [];
      if (i.httpProxy !== void 0 && e.push(`http=${i.httpProxy}`), i.sslProxy !== void 0 && e.push(`https=${i.sslProxy}`), i.socksProxy !== void 0 || i.socksVersion !== void 0) {
        if (i.socksProxy === void 0)
          throw new jt.InvalidArgumentException("'socksVersion' cannot be set without 'socksProxy'");
        if (i.socksVersion === void 0 || typeof i.socksVersion != "number" || !Number.isInteger(i.socksVersion) || i.socksVersion < 0 || i.socksVersion > 255)
          throw new jt.InvalidArgumentException("'socksVersion' must be between 0 and 255");
        e.push(`socks=socks${i.socksVersion}://${i.socksProxy}`);
      }
      return e.length === 0 ? void 0 : e.join(";");
    }
    throw new jt.UnknownErrorException("Unknown proxy type");
  }
}
var Au = {};
Object.defineProperty(Au, "__esModule", { value: !0 });
Au.CdpProcessor = void 0;
const jw = se;
var mo, go, wo, yo;
class Uw {
  constructor(e, t, r, n) {
    u(this, mo);
    u(this, go);
    u(this, wo);
    u(this, yo);
    f(this, mo, e), f(this, go, t), f(this, wo, r), f(this, yo, n);
  }
  getSession(e) {
    const t = e.context, r = s(this, mo).getContext(t).cdpTarget.cdpSessionId;
    return r === void 0 ? {} : { session: r };
  }
  resolveRealm(e) {
    const t = e.realm, r = s(this, go).getRealm({ realmId: t });
    if (r === void 0)
      throw new jw.UnknownErrorException(`Could not find realm ${e.realm}`);
    return { executionContextId: r.executionContextId };
  }
  async sendCommand(e) {
    return {
      result: await (e.session ? s(this, wo).getCdpClient(e.session) : s(this, yo)).sendCommand(e.method, e.params),
      session: e.session
    };
  }
}
mo = new WeakMap(), go = new WeakMap(), wo = new WeakMap(), yo = new WeakMap();
Au.CdpProcessor = Uw;
var Bu = {};
Object.defineProperty(Bu, "__esModule", { value: !0 });
Bu.BrowsingContextProcessor = void 0;
const $e = se;
var vo, me, tr, bn, bo, Ri, Bp, Fp;
class $w {
  constructor(e, t, r, n, o) {
    u(this, Ri);
    u(this, vo);
    u(this, me);
    u(this, tr);
    u(this, bn);
    u(this, bo);
    f(this, tr, n), f(this, bo, r), f(this, vo, e), f(this, me, t), f(this, bn, o), s(this, bn).addSubscribeHook($e.ChromiumBidi.BrowsingContext.EventNames.ContextCreated, m(this, Ri, Fp).bind(this));
  }
  getTree(e) {
    return {
      contexts: (e.root === void 0 ? s(this, me).getTopLevelContexts() : [s(this, me).getContext(e.root)]).map((r) => r.serializeToBidiValue(e.maxDepth ?? Number.MAX_VALUE))
    };
  }
  async create(e) {
    let t, r = "default";
    if (e.referenceContext !== void 0) {
      if (t = s(this, me).getContext(e.referenceContext), !t.isTopLevelContext())
        throw new $e.InvalidArgumentException("referenceContext should be a top-level context");
      r = t.userContext;
    }
    e.userContext !== void 0 && (r = e.userContext);
    const n = s(this, me).getAllContexts().filter((p) => p.userContext === r);
    let o = !1;
    switch (e.type) {
      case "tab":
        o = !1;
        break;
      case "window":
        o = !0;
        break;
    }
    n.length || (o = !0);
    let a;
    try {
      a = await s(this, vo).sendCommand("Target.createTarget", {
        url: "about:blank",
        newWindow: o,
        browserContextId: r === "default" ? void 0 : r,
        background: e.background === !0
      });
    } catch (p) {
      throw (
        // See https://source.chromium.org/chromium/chromium/src/+/main:chrome/browser/devtools/protocol/target_handler.cc;l=90;drc=e80392ac11e48a691f4309964cab83a3a59e01c8
        p.message.startsWith("Failed to find browser context with id") || // See https://source.chromium.org/chromium/chromium/src/+/main:headless/lib/browser/protocol/target_handler.cc;l=49;drc=e80392ac11e48a691f4309964cab83a3a59e01c8
        p.message === "browserContextId" ? new $e.NoSuchUserContextException(`The context ${r} was not found`) : p
      );
    }
    const c = await s(this, me).waitForContext(a.targetId);
    return await c.lifecycleLoaded(), { context: c.id };
  }
  navigate(e) {
    return s(this, me).getContext(e.context).navigate(
      e.url,
      e.wait ?? "none"
      /* BrowsingContext.ReadinessState.None */
    );
  }
  reload(e) {
    return s(this, me).getContext(e.context).reload(
      e.ignoreCache ?? !1,
      e.wait ?? "none"
      /* BrowsingContext.ReadinessState.None */
    );
  }
  async activate(e) {
    const t = s(this, me).getContext(e.context);
    if (!t.isTopLevelContext())
      throw new $e.InvalidArgumentException("Activation is only supported on the top-level context");
    return await t.activate(), {};
  }
  async captureScreenshot(e) {
    return await s(this, me).getContext(e.context).captureScreenshot(e);
  }
  async print(e) {
    return await s(this, me).getContext(e.context).print(e);
  }
  async setViewport(e) {
    var o, a;
    if ((((o = e.viewport) == null ? void 0 : o.height) ?? 0) > 1e7 || (((a = e.viewport) == null ? void 0 : a.width) ?? 0) > 1e7)
      throw new $e.UnsupportedOperationException("Viewport dimension over 10000000 are not supported");
    const r = {};
    e.devicePixelRatio !== void 0 && (r.devicePixelRatio = e.devicePixelRatio), e.viewport !== void 0 && (r.viewport = e.viewport);
    const n = await m(this, Ri, Bp).call(this, e.context, e.userContexts);
    for (const c of e.userContexts ?? [])
      s(this, tr).updateUserContextConfig(c, r);
    return e.context !== void 0 && s(this, tr).updateBrowsingContextConfig(e.context, r), await Promise.all(n.map(async (c) => {
      const p = s(this, tr).getActiveConfig(c.id, c.userContext);
      await c.setViewport(p.viewport ?? null, p.devicePixelRatio ?? null, p.screenOrientation ?? null);
    })), {};
  }
  async traverseHistory(e) {
    const t = s(this, me).getContext(e.context);
    if (!t)
      throw new $e.InvalidArgumentException(`No browsing context with id ${e.context}`);
    if (!t.isTopLevelContext())
      throw new $e.InvalidArgumentException("Traversing history is only supported on the top-level context");
    return await t.traverseHistory(e.delta), {};
  }
  async handleUserPrompt(e) {
    var r;
    const t = s(this, me).getContext(e.context);
    try {
      await t.handleUserPrompt(e.accept, e.userText);
    } catch (n) {
      throw (r = n.message) != null && r.includes("No dialog is showing") ? new $e.NoSuchAlertException("No dialog is showing") : n;
    }
    return {};
  }
  async close(e) {
    const t = s(this, me).getContext(e.context);
    if (!t.isTopLevelContext())
      throw new $e.InvalidArgumentException(`Non top-level browsing context ${t.id} cannot be closed.`);
    const r = t.cdpTarget.parentCdpClient;
    try {
      const n = new Promise((o) => {
        const a = (c) => {
          c.targetId === e.context && (r.off("Target.detachedFromTarget", a), o());
        };
        r.on("Target.detachedFromTarget", a);
      });
      try {
        e.promptUnload ? await t.close() : await r.sendCommand("Target.closeTarget", {
          targetId: e.context
        });
      } catch (o) {
        if (!r.isCloseError(o))
          throw o;
      }
      await n;
    } catch (n) {
      if (!(n.code === -32e3 && n.message === "Not attached to an active page"))
        throw n;
    }
    return {};
  }
  async locateNodes(e) {
    return await s(this, me).getContext(e.context).locateNodes(e);
  }
}
vo = new WeakMap(), me = new WeakMap(), tr = new WeakMap(), bn = new WeakMap(), bo = new WeakMap(), Ri = new WeakSet(), Bp = async function(e, t) {
  if (e === void 0 && t === void 0)
    throw new $e.InvalidArgumentException("Either userContexts or context must be provided");
  if (e !== void 0 && t !== void 0)
    throw new $e.InvalidArgumentException("userContexts and context are mutually exclusive");
  if (e !== void 0) {
    const n = s(this, me).getContext(e);
    if (!n.isTopLevelContext())
      throw new $e.InvalidArgumentException("Emulating viewport is only supported on the top-level context");
    return [n];
  }
  await s(this, bo).verifyUserContextIdList(t);
  const r = [];
  for (const n of t) {
    const o = s(this, me).getTopLevelContexts().filter((a) => a.userContext === n);
    r.push(...o);
  }
  return [...new Set(r).values()];
}, Fp = function(e) {
  return [
    s(this, me).getContext(e),
    ...s(this, me).getContext(e).allChildren
  ].forEach((n) => {
    s(this, bn).registerEvent({
      type: "event",
      method: $e.ChromiumBidi.BrowsingContext.EventNames.ContextCreated,
      params: n.serializeToBidiValue()
    }, n.id);
  }), Promise.resolve();
};
Bu.BrowsingContextProcessor = $w;
var Xr = {};
Object.defineProperty(Xr, "__esModule", { value: !0 });
Xr.EmulationProcessor = void 0;
Xr.isValidLocale = Mp;
Xr.isValidTimezone = jp;
Xr.isTimeZoneOffsetString = Up;
const Le = se;
var Co, sr, Y, He, it;
class Lw {
  constructor(e, t, r) {
    u(this, He);
    u(this, Co);
    u(this, sr);
    u(this, Y);
    f(this, Co, t), f(this, sr, e), f(this, Y, r);
  }
  async setGeolocationOverride(e) {
    var n, o;
    if ("coordinates" in e && "error" in e)
      throw new Le.InvalidArgumentException("Coordinates and error cannot be set at the same time");
    let t = null;
    if ("coordinates" in e) {
      if ((((n = e.coordinates) == null ? void 0 : n.altitude) ?? null) === null && (((o = e.coordinates) == null ? void 0 : o.altitudeAccuracy) ?? null) !== null)
        throw new Le.InvalidArgumentException("Geolocation altitudeAccuracy can be set only with altitude");
      t = e.coordinates;
    } else if ("error" in e) {
      if (e.error.type !== "positionUnavailable")
        throw new Le.InvalidArgumentException(`Unknown geolocation error ${e.error.type}`);
      t = e.error;
    } else
      throw new Le.InvalidArgumentException("Coordinates or error should be set");
    const r = await m(this, He, it).call(this, e.contexts, e.userContexts);
    for (const a of e.contexts ?? [])
      s(this, Y).updateBrowsingContextConfig(a, {
        geolocation: t
      });
    for (const a of e.userContexts ?? [])
      s(this, Y).updateUserContextConfig(a, {
        geolocation: t
      });
    return await Promise.all(r.map(async (a) => {
      const c = s(this, Y).getActiveConfig(a.id, a.userContext);
      await a.setGeolocationOverride(c.geolocation ?? null);
    })), {};
  }
  async setLocaleOverride(e) {
    const t = e.locale ?? null;
    if (t !== null && !Mp(t))
      throw new Le.InvalidArgumentException(`Invalid locale "${t}"`);
    const r = await m(this, He, it).call(this, e.contexts, e.userContexts);
    for (const n of e.contexts ?? [])
      s(this, Y).updateBrowsingContextConfig(n, {
        locale: t
      });
    for (const n of e.userContexts ?? [])
      s(this, Y).updateUserContextConfig(n, {
        locale: t
      });
    return await Promise.all(r.map(async (n) => {
      const o = s(this, Y).getActiveConfig(n.id, n.userContext);
      await Promise.all([
        n.setLocaleOverride(o.locale ?? null),
        // Set `AcceptLanguage` to locale.
        n.setUserAgentAndAcceptLanguage(o.userAgent, o.locale, o.clientHints)
      ]);
    })), {};
  }
  async setScriptingEnabled(e) {
    const t = e.enabled, r = await m(this, He, it).call(this, e.contexts, e.userContexts);
    for (const n of e.contexts ?? [])
      s(this, Y).updateBrowsingContextConfig(n, {
        scriptingEnabled: t
      });
    for (const n of e.userContexts ?? [])
      s(this, Y).updateUserContextConfig(n, {
        scriptingEnabled: t
      });
    return await Promise.all(r.map(async (n) => {
      const o = s(this, Y).getActiveConfig(n.id, n.userContext);
      await n.setScriptingEnabled(o.scriptingEnabled ?? null);
    })), {};
  }
  async setScreenOrientationOverride(e) {
    const t = await m(this, He, it).call(this, e.contexts, e.userContexts);
    for (const r of e.contexts ?? [])
      s(this, Y).updateBrowsingContextConfig(r, {
        screenOrientation: e.screenOrientation
      });
    for (const r of e.userContexts ?? [])
      s(this, Y).updateUserContextConfig(r, {
        screenOrientation: e.screenOrientation
      });
    return await Promise.all(t.map(async (r) => {
      const n = s(this, Y).getActiveConfig(r.id, r.userContext);
      await r.setViewport(n.viewport ?? null, n.devicePixelRatio ?? null, n.screenOrientation ?? null);
    })), {};
  }
  async setScreenSettingsOverride(e) {
    const t = await m(this, He, it).call(this, e.contexts, e.userContexts);
    for (const r of e.contexts ?? [])
      s(this, Y).updateBrowsingContextConfig(r, {
        screenArea: e.screenArea
      });
    for (const r of e.userContexts ?? [])
      s(this, Y).updateUserContextConfig(r, {
        screenArea: e.screenArea
      });
    return await Promise.all(t.map(async (r) => {
      const n = s(this, Y).getActiveConfig(r.id, r.userContext);
      await r.setViewport(n.viewport ?? null, n.devicePixelRatio ?? null, n.screenOrientation ?? null);
    })), {};
  }
  async setTimezoneOverride(e) {
    let t = e.timezone ?? null;
    if (t !== null && !jp(t))
      throw new Le.InvalidArgumentException(`Invalid timezone "${t}"`);
    t !== null && Up(t) && (t = `GMT${t}`);
    const r = await m(this, He, it).call(this, e.contexts, e.userContexts);
    for (const n of e.contexts ?? [])
      s(this, Y).updateBrowsingContextConfig(n, {
        timezone: t
      });
    for (const n of e.userContexts ?? [])
      s(this, Y).updateUserContextConfig(n, {
        timezone: t
      });
    return await Promise.all(r.map(async (n) => {
      const o = s(this, Y).getActiveConfig(n.id, n.userContext);
      await n.setTimezoneOverride(o.timezone ?? null);
    })), {};
  }
  async setTouchOverride(e) {
    const t = e.maxTouchPoints, r = await m(this, He, it).call(this, e.contexts, e.userContexts, !0);
    for (const n of e.contexts ?? [])
      s(this, Y).updateBrowsingContextConfig(n, {
        maxTouchPoints: t
      });
    for (const n of e.userContexts ?? [])
      s(this, Y).updateUserContextConfig(n, {
        maxTouchPoints: t
      });
    return e.contexts === void 0 && e.userContexts === void 0 && s(this, Y).updateGlobalConfig({
      maxTouchPoints: t
    }), await Promise.all(r.map(async (n) => {
      const o = s(this, Y).getActiveConfig(n.id, n.userContext);
      await n.setTouchOverride(o.maxTouchPoints ?? null);
    })), {};
  }
  async setUserAgentOverrideParams(e) {
    if (e.userAgent === "")
      throw new Le.UnsupportedOperationException("empty user agent string is not supported");
    const t = await m(this, He, it).call(this, e.contexts, e.userContexts, !0);
    for (const r of e.contexts ?? [])
      s(this, Y).updateBrowsingContextConfig(r, {
        userAgent: e.userAgent
      });
    for (const r of e.userContexts ?? [])
      s(this, Y).updateUserContextConfig(r, {
        userAgent: e.userAgent
      });
    return e.contexts === void 0 && e.userContexts === void 0 && s(this, Y).updateGlobalConfig({
      userAgent: e.userAgent
    }), await Promise.all(t.map(async (r) => {
      const n = s(this, Y).getActiveConfig(r.id, r.userContext);
      await r.setUserAgentAndAcceptLanguage(n.userAgent, n.locale, n.clientHints);
    })), {};
  }
  async setClientHintsOverride(e) {
    const t = e.clientHints ?? null, r = await m(this, He, it).call(this, e.contexts, e.userContexts, !0);
    for (const n of e.contexts ?? [])
      s(this, Y).updateBrowsingContextConfig(n, {
        clientHints: t
      });
    for (const n of e.userContexts ?? [])
      s(this, Y).updateUserContextConfig(n, {
        clientHints: t
      });
    return e.contexts === void 0 && e.userContexts === void 0 && s(this, Y).updateGlobalConfig({
      clientHints: t
    }), await Promise.all(r.map(async (n) => {
      const o = s(this, Y).getActiveConfig(n.id, n.userContext);
      await n.setUserAgentAndAcceptLanguage(o.userAgent, o.locale, o.clientHints);
    })), {};
  }
  async setNetworkConditions(e) {
    const t = await m(this, He, it).call(this, e.contexts, e.userContexts, !0);
    for (const r of e.contexts ?? [])
      s(this, Y).updateBrowsingContextConfig(r, {
        emulatedNetworkConditions: e.networkConditions
      });
    for (const r of e.userContexts ?? [])
      s(this, Y).updateUserContextConfig(r, {
        emulatedNetworkConditions: e.networkConditions
      });
    if (e.contexts === void 0 && e.userContexts === void 0 && s(this, Y).updateGlobalConfig({
      emulatedNetworkConditions: e.networkConditions
    }), e.networkConditions !== null && e.networkConditions.type !== "offline")
      throw new Le.UnsupportedOperationException(`Unsupported network conditions ${e.networkConditions.type}`);
    return await Promise.all(t.map(async (r) => {
      const n = s(this, Y).getActiveConfig(r.id, r.userContext);
      await r.setEmulatedNetworkConditions(n.emulatedNetworkConditions ?? null);
    })), {};
  }
}
Co = new WeakMap(), sr = new WeakMap(), Y = new WeakMap(), He = new WeakSet(), it = async function(e, t, r = !1) {
  if (e === void 0 && t === void 0) {
    if (r)
      return s(this, sr).getTopLevelContexts();
    throw new Le.InvalidArgumentException("Either user contexts or browsing contexts must be provided");
  }
  if (e !== void 0 && t !== void 0)
    throw new Le.InvalidArgumentException("User contexts and browsing contexts are mutually exclusive");
  const n = [];
  if (e === void 0) {
    if (t.length === 0)
      throw new Le.InvalidArgumentException("user context should be provided");
    await s(this, Co).verifyUserContextIdList(t);
    for (const o of t) {
      const a = s(this, sr).getTopLevelContexts().filter((c) => c.userContext === o);
      n.push(...a);
    }
  } else {
    if (e.length === 0)
      throw new Le.InvalidArgumentException("browsing context should be provided");
    for (const o of e) {
      const a = s(this, sr).getContext(o);
      if (!a.isTopLevelContext())
        throw new Le.InvalidArgumentException("The command is only supported on the top-level context");
      n.push(a);
    }
  }
  return [...new Set(n).values()];
};
Xr.EmulationProcessor = Lw;
function Mp(i) {
  try {
    return new Intl.Locale(i), !0;
  } catch (e) {
    if (e instanceof RangeError)
      return !1;
    throw e;
  }
}
function jp(i) {
  try {
    return Intl.DateTimeFormat(void 0, { timeZone: i }), !0;
  } catch (e) {
    if (e instanceof RangeError)
      return !1;
    throw e;
  }
}
function Up(i) {
  return /^[+-](?:2[0-3]|[01]\d)(?::[0-5]\d)?$/.test(i);
}
var Fu = {}, us = {};
Object.defineProperty(us, "__esModule", { value: !0 });
us.assert = qw;
function qw(i, e) {
  if (!i)
    throw new Error(e ?? "Internal assertion failed.");
}
var Mu = {}, ju = {};
Object.defineProperty(ju, "__esModule", { value: !0 });
ju.isSingleComplexGrapheme = Hw;
ju.isSingleGrapheme = $p;
function Hw(i) {
  return $p(i) && i.length > 1;
}
function $p(i) {
  return [...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(i)].length === 1;
}
var yt = {};
Object.defineProperty(yt, "__esModule", { value: !0 });
yt.WheelSource = yt.PointerSource = yt.KeySource = yt.NoneSource = void 0;
class zw {
  constructor() {
    O(this, "type", "none");
  }
}
yt.NoneSource = zw;
var Pt, rr, Zi;
class Ww {
  constructor() {
    u(this, rr);
    O(this, "type", "key");
    O(this, "pressed", /* @__PURE__ */ new Set());
    // This is a bitfield that matches the modifiers parameter of
    // https://chromedevtools.github.io/devtools-protocol/tot/Input/#method-dispatchKeyEvent
    u(this, Pt, 0);
  }
  get modifiers() {
    return s(this, Pt);
  }
  get alt() {
    return (s(this, Pt) & 1) === 1;
  }
  set alt(e) {
    m(this, rr, Zi).call(this, e, 1);
  }
  get ctrl() {
    return (s(this, Pt) & 2) === 2;
  }
  set ctrl(e) {
    m(this, rr, Zi).call(this, e, 2);
  }
  get meta() {
    return (s(this, Pt) & 4) === 4;
  }
  set meta(e) {
    m(this, rr, Zi).call(this, e, 4);
  }
  get shift() {
    return (s(this, Pt) & 8) === 8;
  }
  set shift(e) {
    m(this, rr, Zi).call(this, e, 8);
  }
}
Pt = new WeakMap(), rr = new WeakSet(), Zi = function(e, t) {
  e ? f(this, Pt, s(this, Pt) | t) : f(this, Pt, s(this, Pt) & ~t);
};
yt.KeySource = Ww;
var Ut, Jc, xo, Cn, xn, En, nr;
class Lp {
  constructor(e, t) {
    O(this, "type", "pointer");
    O(this, "subtype");
    O(this, "pointerId");
    O(this, "pressed", /* @__PURE__ */ new Set());
    O(this, "x", 0);
    O(this, "y", 0);
    O(this, "radiusX");
    O(this, "radiusY");
    O(this, "force");
    u(this, nr, /* @__PURE__ */ new Map());
    this.pointerId = e, this.subtype = t;
  }
  // This is a bitfield that matches the buttons parameter of
  // https://chromedevtools.github.io/devtools-protocol/tot/Input/#method-dispatchMouseEvent
  get buttons() {
    let e = 0;
    for (const t of this.pressed)
      switch (t) {
        case 0:
          e |= 1;
          break;
        case 1:
          e |= 4;
          break;
        case 2:
          e |= 2;
          break;
        case 3:
          e |= 8;
          break;
        case 4:
          e |= 16;
          break;
      }
    return e;
  }
  setClickCount(e, t) {
    let r = s(this, nr).get(e);
    return (!r || r.compare(t)) && (r = t), ++r.count, s(this, nr).set(e, r), r.count;
  }
  getClickCount(e) {
    var t;
    return ((t = s(this, nr).get(e)) == null ? void 0 : t.count) ?? 0;
  }
  /**
   * Resets click count. Resets consequent click counter. Prevents grouping clicks in
   * different `performActions` calls, so that they are not grouped as double, triple etc
   * clicks. Required for https://github.com/GoogleChromeLabs/chromium-bidi/issues/3043.
   */
  resetClickCount() {
    f(this, nr, /* @__PURE__ */ new Map());
  }
}
nr = new WeakMap(), // --- Platform-specific code starts here ---
// Input.dispatchMouseEvent doesn't know the concept of double click, so we
// need to create the logic, similar to how it's done for OSes:
// https://source.chromium.org/chromium/chromium/src/+/refs/heads/main:ui/events/event.cc;l=479
O(Lp, "ClickContext", (Ut = class {
  constructor(t, r, n) {
    O(this, "count", 0);
    u(this, Cn);
    u(this, xn);
    u(this, En);
    f(this, Cn, t), f(this, xn, r), f(this, En, n);
  }
  compare(t) {
    return (
      // The click needs to be within a certain amount of ms.
      s(t, En) - s(this, En) > s(Ut, Jc) || // The click needs to be within a certain square radius.
      Math.abs(s(t, Cn) - s(this, Cn)) > s(Ut, xo) || Math.abs(s(t, xn) - s(this, xn)) > s(Ut, xo)
    );
  }
}, Jc = new WeakMap(), xo = new WeakMap(), Cn = new WeakMap(), xn = new WeakMap(), En = new WeakMap(), u(Ut, Jc, 500), u(Ut, xo, 2), Ut));
yt.PointerSource = Lp;
class Kw {
  constructor() {
    O(this, "type", "wheel");
  }
}
yt.WheelSource = Kw;
var ec = {};
Object.defineProperty(ec, "__esModule", { value: !0 });
ec.getNormalizedKey = Vw;
ec.getKeyCode = Gw;
ec.getKeyLocation = Xw;
function Vw(i) {
  switch (i) {
    case "":
      return "Unidentified";
    case "":
      return "Cancel";
    case "":
      return "Help";
    case "":
      return "Backspace";
    case "":
      return "Tab";
    case "":
      return "Clear";
    case "":
    case "":
      return "Enter";
    case "":
      return "Shift";
    case "":
      return "Control";
    case "":
      return "Alt";
    case "":
      return "Pause";
    case "":
      return "Escape";
    case "":
      return " ";
    case "":
      return "PageUp";
    case "":
      return "PageDown";
    case "":
      return "End";
    case "":
      return "Home";
    case "":
      return "ArrowLeft";
    case "":
      return "ArrowUp";
    case "":
      return "ArrowRight";
    case "":
      return "ArrowDown";
    case "":
      return "Insert";
    case "":
      return "Delete";
    case "":
      return ";";
    case "":
      return "=";
    case "":
      return "0";
    case "":
      return "1";
    case "":
      return "2";
    case "":
      return "3";
    case "":
      return "4";
    case "":
      return "5";
    case "":
      return "6";
    case "":
      return "7";
    case "":
      return "8";
    case "":
      return "9";
    case "":
      return "*";
    case "":
      return "+";
    case "":
      return ",";
    case "":
      return "-";
    case "":
      return ".";
    case "":
      return "/";
    case "":
      return "F1";
    case "":
      return "F2";
    case "":
      return "F3";
    case "":
      return "F4";
    case "":
      return "F5";
    case "":
      return "F6";
    case "":
      return "F7";
    case "":
      return "F8";
    case "":
      return "F9";
    case "":
      return "F10";
    case "":
      return "F11";
    case "":
      return "F12";
    case "":
      return "Meta";
    case "":
      return "ZenkakuHankaku";
    case "":
      return "Shift";
    case "":
      return "Control";
    case "":
      return "Alt";
    case "":
      return "Meta";
    case "":
      return "PageUp";
    case "":
      return "PageDown";
    case "":
      return "End";
    case "":
      return "Home";
    case "":
      return "ArrowLeft";
    case "":
      return "ArrowUp";
    case "":
      return "ArrowRight";
    case "":
      return "ArrowDown";
    case "":
      return "Insert";
    case "":
      return "Delete";
    default:
      return i;
  }
}
function Gw(i) {
  switch (i) {
    case "`":
    case "~":
      return "Backquote";
    case "\\":
    case "|":
      return "Backslash";
    case "":
      return "Backspace";
    case "[":
    case "{":
      return "BracketLeft";
    case "]":
    case "}":
      return "BracketRight";
    case ",":
    case "<":
      return "Comma";
    case "0":
    case ")":
      return "Digit0";
    case "1":
    case "!":
      return "Digit1";
    case "2":
    case "@":
      return "Digit2";
    case "3":
    case "#":
      return "Digit3";
    case "4":
    case "$":
      return "Digit4";
    case "5":
    case "%":
      return "Digit5";
    case "6":
    case "^":
      return "Digit6";
    case "7":
    case "&":
      return "Digit7";
    case "8":
    case "*":
      return "Digit8";
    case "9":
    case "(":
      return "Digit9";
    case "=":
    case "+":
      return "Equal";
    case ">":
      return "IntlBackslash";
    case "a":
    case "A":
      return "KeyA";
    case "b":
    case "B":
      return "KeyB";
    case "c":
    case "C":
      return "KeyC";
    case "d":
    case "D":
      return "KeyD";
    case "e":
    case "E":
      return "KeyE";
    case "f":
    case "F":
      return "KeyF";
    case "g":
    case "G":
      return "KeyG";
    case "h":
    case "H":
      return "KeyH";
    case "i":
    case "I":
      return "KeyI";
    case "j":
    case "J":
      return "KeyJ";
    case "k":
    case "K":
      return "KeyK";
    case "l":
    case "L":
      return "KeyL";
    case "m":
    case "M":
      return "KeyM";
    case "n":
    case "N":
      return "KeyN";
    case "o":
    case "O":
      return "KeyO";
    case "p":
    case "P":
      return "KeyP";
    case "q":
    case "Q":
      return "KeyQ";
    case "r":
    case "R":
      return "KeyR";
    case "s":
    case "S":
      return "KeyS";
    case "t":
    case "T":
      return "KeyT";
    case "u":
    case "U":
      return "KeyU";
    case "v":
    case "V":
      return "KeyV";
    case "w":
    case "W":
      return "KeyW";
    case "x":
    case "X":
      return "KeyX";
    case "y":
    case "Y":
      return "KeyY";
    case "z":
    case "Z":
      return "KeyZ";
    case "-":
    case "_":
      return "Minus";
    case ".":
      return "Period";
    case "'":
    case '"':
      return "Quote";
    case ";":
    case ":":
      return "Semicolon";
    case "/":
    case "?":
      return "Slash";
    case "":
      return "AltLeft";
    case "":
      return "AltRight";
    case "":
      return "ControlLeft";
    case "":
      return "ControlRight";
    case "":
      return "Enter";
    case "":
      return "Pause";
    case "":
      return "MetaLeft";
    case "":
      return "MetaRight";
    case "":
      return "ShiftLeft";
    case "":
      return "ShiftRight";
    case " ":
    case "":
      return "Space";
    case "":
      return "Tab";
    case "":
      return "Delete";
    case "":
      return "End";
    case "":
      return "Help";
    case "":
      return "Home";
    case "":
      return "Insert";
    case "":
      return "PageDown";
    case "":
      return "PageUp";
    case "":
      return "ArrowDown";
    case "":
      return "ArrowLeft";
    case "":
      return "ArrowRight";
    case "":
      return "ArrowUp";
    case "":
      return "Escape";
    case "":
      return "F1";
    case "":
      return "F2";
    case "":
      return "F3";
    case "":
      return "F4";
    case "":
      return "F5";
    case "":
      return "F6";
    case "":
      return "F7";
    case "":
      return "F8";
    case "":
      return "F9";
    case "":
      return "F10";
    case "":
      return "F11";
    case "":
      return "F12";
    case "":
      return "NumpadEqual";
    case "":
    case "":
      return "Numpad0";
    case "":
    case "":
      return "Numpad1";
    case "":
    case "":
      return "Numpad2";
    case "":
    case "":
      return "Numpad3";
    case "":
    case "":
      return "Numpad4";
    case "":
      return "Numpad5";
    case "":
    case "":
      return "Numpad6";
    case "":
    case "":
      return "Numpad7";
    case "":
    case "":
      return "Numpad8";
    case "":
    case "":
      return "Numpad9";
    case "":
      return "NumpadAdd";
    case "":
      return "NumpadComma";
    case "":
    case "":
      return "NumpadDecimal";
    case "":
      return "NumpadDivide";
    case "":
      return "NumpadEnter";
    case "":
      return "NumpadMultiply";
    case "":
      return "NumpadSubtract";
    default:
      return;
  }
}
function Xw(i) {
  switch (i) {
    case "":
    case "":
    case "":
    case "":
    case "":
      return 1;
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
    case "":
      return 3;
    case "":
    case "":
    case "":
    case "":
      return 2;
    default:
      return 0;
  }
}
var Uu = {};
Object.defineProperty(Uu, "__esModule", { value: !0 });
Uu.KeyToKeyCode = void 0;
Uu.KeyToKeyCode = {
  0: 48,
  1: 49,
  2: 50,
  3: 51,
  4: 52,
  5: 53,
  6: 54,
  7: 55,
  8: 56,
  9: 57,
  Abort: 3,
  Help: 6,
  Backspace: 8,
  Tab: 9,
  Numpad5: 12,
  NumpadEnter: 13,
  Enter: 13,
  "\\r": 13,
  "\\n": 13,
  ShiftLeft: 16,
  ShiftRight: 16,
  ControlLeft: 17,
  ControlRight: 17,
  AltLeft: 18,
  AltRight: 18,
  Pause: 19,
  CapsLock: 20,
  Escape: 27,
  Convert: 28,
  NonConvert: 29,
  Space: 32,
  Numpad9: 33,
  PageUp: 33,
  Numpad3: 34,
  PageDown: 34,
  End: 35,
  Numpad1: 35,
  Home: 36,
  Numpad7: 36,
  ArrowLeft: 37,
  Numpad4: 37,
  Numpad8: 38,
  ArrowUp: 38,
  ArrowRight: 39,
  Numpad6: 39,
  Numpad2: 40,
  ArrowDown: 40,
  Select: 41,
  Open: 43,
  PrintScreen: 44,
  Insert: 45,
  Numpad0: 45,
  Delete: 46,
  NumpadDecimal: 46,
  Digit0: 48,
  Digit1: 49,
  Digit2: 50,
  Digit3: 51,
  Digit4: 52,
  Digit5: 53,
  Digit6: 54,
  Digit7: 55,
  Digit8: 56,
  Digit9: 57,
  KeyA: 65,
  KeyB: 66,
  KeyC: 67,
  KeyD: 68,
  KeyE: 69,
  KeyF: 70,
  KeyG: 71,
  KeyH: 72,
  KeyI: 73,
  KeyJ: 74,
  KeyK: 75,
  KeyL: 76,
  KeyM: 77,
  KeyN: 78,
  KeyO: 79,
  KeyP: 80,
  KeyQ: 81,
  KeyR: 82,
  KeyS: 83,
  KeyT: 84,
  KeyU: 85,
  KeyV: 86,
  KeyW: 87,
  KeyX: 88,
  KeyY: 89,
  KeyZ: 90,
  MetaLeft: 91,
  MetaRight: 92,
  ContextMenu: 93,
  NumpadMultiply: 106,
  NumpadAdd: 107,
  NumpadSubtract: 109,
  NumpadDivide: 111,
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,
  F13: 124,
  F14: 125,
  F15: 126,
  F16: 127,
  F17: 128,
  F18: 129,
  F19: 130,
  F20: 131,
  F21: 132,
  F22: 133,
  F23: 134,
  F24: 135,
  NumLock: 144,
  ScrollLock: 145,
  AudioVolumeMute: 173,
  AudioVolumeDown: 174,
  AudioVolumeUp: 175,
  MediaTrackNext: 176,
  MediaTrackPrevious: 177,
  MediaStop: 178,
  MediaPlayPause: 179,
  Semicolon: 186,
  Equal: 187,
  NumpadEqual: 187,
  Comma: 188,
  Minus: 189,
  Period: 190,
  Slash: 191,
  Backquote: 192,
  BracketLeft: 219,
  Backslash: 220,
  BracketRight: 221,
  Quote: 222,
  AltGraph: 225,
  Props: 247,
  Cancel: 3,
  Clear: 12,
  Shift: 16,
  Control: 17,
  Alt: 18,
  Accept: 30,
  ModeChange: 31,
  " ": 32,
  Print: 42,
  Execute: 43,
  "\\u0000": 46,
  a: 65,
  b: 66,
  c: 67,
  d: 68,
  e: 69,
  f: 70,
  g: 71,
  h: 72,
  i: 73,
  j: 74,
  k: 75,
  l: 76,
  m: 77,
  n: 78,
  o: 79,
  p: 80,
  q: 81,
  r: 82,
  s: 83,
  t: 84,
  u: 85,
  v: 86,
  w: 87,
  x: 88,
  y: 89,
  z: 90,
  Meta: 91,
  "*": 106,
  "+": 107,
  "-": 109,
  "/": 111,
  ";": 186,
  "=": 187,
  ",": 188,
  ".": 190,
  "`": 192,
  "[": 219,
  "\\\\": 220,
  "]": 221,
  "'": 222,
  Attn: 246,
  CrSel: 247,
  ExSel: 248,
  EraseEof: 249,
  Play: 250,
  ZoomOut: 251,
  ")": 48,
  "!": 49,
  "@": 50,
  "#": 51,
  $: 52,
  "%": 53,
  "^": 54,
  "&": 55,
  "(": 57,
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  ":": 186,
  "<": 188,
  _: 189,
  ">": 190,
  "?": 191,
  "~": 192,
  "{": 219,
  "|": 220,
  "}": 221,
  '"': 222,
  Camera: 44,
  EndCall: 95,
  VolumeDown: 182,
  VolumeUp: 183
};
Object.defineProperty(Mu, "__esModule", { value: !0 });
Mu.ActionDispatcher = void 0;
const un = se, ao = us, dc = ju, Jw = yt, Zr = ec, Nh = Uu, Yw = ((i) => {
  const e = i.getClientRects()[0], t = Math.max(0, Math.min(e.x, e.x + e.width)), r = Math.min(window.innerWidth, Math.max(e.x, e.x + e.width)), n = Math.max(0, Math.min(e.y, e.y + e.height)), o = Math.min(window.innerHeight, Math.max(e.y, e.y + e.height));
  return [t + (r - t >> 1), n + (o - n >> 1)];
}).toString(), Zw = (() => navigator.platform.toLowerCase().includes("mac")).toString();
async function Qw(i, e) {
  var a, c, p, l;
  const r = await (await i.getOrCreateHiddenSandbox()).callFunction(Yw, !1, { type: "undefined" }, [e]);
  if (r.type === "exception")
    throw new un.NoSuchElementException(`Origin element ${e.sharedId} was not found`);
  (0, ao.assert)(r.result.type === "array"), (0, ao.assert)(((c = (a = r.result.value) == null ? void 0 : a[0]) == null ? void 0 : c.type) === "number"), (0, ao.assert)(((l = (p = r.result.value) == null ? void 0 : p[1]) == null ? void 0 : l.type) === "number");
  const { result: { value: [{ value: n }, { value: o }] } } = r;
  return { x: n, y: o };
}
var Eo, Sn, Vt, Gt, So, ir, J, xe, Hp, zp, Wp, Kp, Vp, Hd, Gp, Xp, Jp;
class qp {
  constructor(e, t, r, n) {
    u(this, J);
    u(this, Eo);
    u(this, Sn, 0);
    u(this, Vt, 0);
    u(this, Gt);
    u(this, So);
    u(this, ir);
    f(this, Eo, t), f(this, Gt, e), f(this, So, r), f(this, ir, n);
  }
  async dispatchActions(e) {
    await s(this, Gt).queue.run(async () => {
      for (const t of e)
        await this.dispatchTickActions(t);
    });
  }
  async dispatchTickActions(e) {
    f(this, Sn, performance.now()), f(this, Vt, 0);
    for (const { action: r } of e)
      "duration" in r && r.duration !== void 0 && f(this, Vt, Math.max(s(this, Vt), r.duration));
    const t = [
      new Promise((r) => setTimeout(r, s(this, Vt)))
    ];
    for (const r of e)
      t.push(m(this, J, Hp).call(this, r));
    await Promise.all(t);
  }
}
Eo = new WeakMap(), Sn = new WeakMap(), Vt = new WeakMap(), Gt = new WeakMap(), So = new WeakMap(), ir = new WeakMap(), J = new WeakSet(), xe = function() {
  return s(this, Eo).getContext(s(this, So));
}, Hp = async function({ id: e, action: t }) {
  const r = s(this, Gt).get(e), n = s(this, Gt).getGlobalKeyState();
  switch (t.type) {
    case "keyDown": {
      await m(this, J, Xp).call(this, r, t), s(this, Gt).cancelList.push({
        id: e,
        action: {
          ...t,
          type: "keyUp"
        }
      });
      break;
    }
    case "keyUp": {
      await m(this, J, Jp).call(this, r, t);
      break;
    }
    case "pause":
      break;
    case "pointerDown": {
      await m(this, J, zp).call(this, r, n, t), s(this, Gt).cancelList.push({
        id: e,
        action: {
          ...t,
          type: "pointerUp"
        }
      });
      break;
    }
    case "pointerMove": {
      await m(this, J, Kp).call(this, r, n, t);
      break;
    }
    case "pointerUp": {
      await m(this, J, Wp).call(this, r, n, t);
      break;
    }
    case "scroll": {
      await m(this, J, Gp).call(this, r, n, t);
      break;
    }
  }
}, zp = async function(e, t, r) {
  const { button: n } = r;
  if (e.pressed.has(n))
    return;
  e.pressed.add(n);
  const { x: o, y: a, subtype: c } = e, { width: p, height: l, pressure: d, twist: h, tangentialPressure: g } = r, { tiltX: x, tiltY: E } = Ah(r), { modifiers: P } = t, { radiusX: C, radiusY: b } = Bh(p ?? 1, l ?? 1);
  switch (c) {
    case "mouse":
    case "pen":
      await s(this, J, xe).cdpTarget.cdpClient.sendCommand("Input.dispatchMouseEvent", {
        type: "mousePressed",
        x: o,
        y: a,
        modifiers: P,
        button: lc(n),
        buttons: e.buttons,
        clickCount: e.setClickCount(n, new Jw.PointerSource.ClickContext(o, a, performance.now())),
        pointerType: c,
        tangentialPressure: g,
        tiltX: x,
        tiltY: E,
        twist: h,
        force: d
      });
      break;
    case "touch":
      await s(this, J, xe).cdpTarget.cdpClient.sendCommand("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [
          {
            x: o,
            y: a,
            radiusX: C,
            radiusY: b,
            tangentialPressure: g,
            tiltX: x,
            tiltY: E,
            twist: h,
            force: d,
            id: e.pointerId
          }
        ],
        modifiers: P
      });
      break;
  }
  e.radiusX = C, e.radiusY = b, e.force = d;
}, Wp = function(e, t, r) {
  const { button: n } = r;
  if (!e.pressed.has(n))
    return;
  e.pressed.delete(n);
  const { x: o, y: a, force: c, radiusX: p, radiusY: l, subtype: d } = e, { modifiers: h } = t;
  switch (d) {
    case "mouse":
    case "pen":
      return s(this, J, xe).cdpTarget.cdpClient.sendCommand("Input.dispatchMouseEvent", {
        type: "mouseReleased",
        x: o,
        y: a,
        modifiers: h,
        button: lc(n),
        buttons: e.buttons,
        clickCount: e.getClickCount(n),
        pointerType: d
      });
    case "touch":
      return s(this, J, xe).cdpTarget.cdpClient.sendCommand("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [
          {
            x: o,
            y: a,
            id: e.pointerId,
            force: c,
            radiusX: p,
            radiusY: l
          }
        ],
        modifiers: h
      });
  }
}, Kp = async function(e, t, r) {
  const { x: n, y: o, subtype: a } = e, { width: c, height: p, pressure: l, twist: d, tangentialPressure: h, x: g, y: x, origin: E = "viewport", duration: P = s(this, Vt) } = r, { tiltX: C, tiltY: b } = Ah(r), { radiusX: N, radiusY: v } = Bh(c ?? 1, p ?? 1), { targetX: T, targetY: R } = await m(this, J, Hd).call(this, E, g, x, n, o);
  if (T < 0 || R < 0)
    throw new un.MoveTargetOutOfBoundsException(`Cannot move beyond viewport (x: ${T}, y: ${R})`);
  let w;
  do {
    const D = P > 0 ? (performance.now() - s(this, Sn)) / P : 1;
    w = D >= 1;
    let S, y;
    if (w ? (S = T, y = R) : (S = Math.round(D * (T - n) + n), y = Math.round(D * (R - o) + o)), e.x !== S || e.y !== y) {
      const { modifiers: k } = t;
      switch (a) {
        case "mouse":
          await s(this, J, xe).cdpTarget.cdpClient.sendCommand("Input.dispatchMouseEvent", {
            type: "mouseMoved",
            x: S,
            y,
            modifiers: k,
            clickCount: 0,
            button: lc(e.pressed.values().next().value ?? 5),
            buttons: e.buttons,
            pointerType: a,
            tangentialPressure: h,
            tiltX: C,
            tiltY: b,
            twist: d,
            force: l
          });
          break;
        case "pen":
          e.pressed.size !== 0 && await s(this, J, xe).cdpTarget.cdpClient.sendCommand("Input.dispatchMouseEvent", {
            type: "mouseMoved",
            x: S,
            y,
            modifiers: k,
            clickCount: 0,
            button: lc(e.pressed.values().next().value ?? 5),
            buttons: e.buttons,
            pointerType: a,
            tangentialPressure: h,
            tiltX: C,
            tiltY: b,
            twist: d,
            force: l ?? 0.5
          });
          break;
        case "touch":
          e.pressed.size !== 0 && await s(this, J, xe).cdpTarget.cdpClient.sendCommand("Input.dispatchTouchEvent", {
            type: "touchMove",
            touchPoints: [
              {
                x: S,
                y,
                radiusX: N,
                radiusY: v,
                tangentialPressure: h,
                tiltX: C,
                tiltY: b,
                twist: d,
                force: l,
                id: e.pointerId
              }
            ],
            modifiers: k
          });
          break;
      }
      e.x = S, e.y = y, e.radiusX = N, e.radiusY = v, e.force = l;
    }
  } while (!w);
}, Vp = async function() {
  if (s(this, J, xe).id === s(this, J, xe).cdpTarget.id)
    return { x: 0, y: 0 };
  const { backendNodeId: e } = await s(this, J, xe).cdpTarget.cdpClient.sendCommand("DOM.getFrameOwner", { frameId: s(this, J, xe).id }), { model: t } = await s(this, J, xe).cdpTarget.cdpClient.sendCommand("DOM.getBoxModel", {
    backendNodeId: e
  });
  return { x: t.content[0], y: t.content[1] };
}, Hd = async function(e, t, r, n, o) {
  let a, c;
  const p = await m(this, J, Vp).call(this);
  switch (e) {
    case "viewport":
      a = t + p.x, c = r + p.y;
      break;
    case "pointer":
      a = n + t + p.x, c = o + r + p.y;
      break;
    default: {
      const { x: l, y: d } = await Qw(s(this, J, xe), e.element);
      a = l + t + p.x, c = d + r + p.y;
      break;
    }
  }
  return { targetX: a, targetY: c };
}, Gp = async function(e, t, r) {
  const { deltaX: n, deltaY: o, x: a, y: c, origin: p = "viewport", duration: l = s(this, Vt) } = r;
  if (p === "pointer")
    throw new un.InvalidArgumentException('"pointer" origin is invalid for scrolling.');
  const { targetX: d, targetY: h } = await m(this, J, Hd).call(this, p, a, c, 0, 0);
  if (d < 0 || h < 0)
    throw new un.MoveTargetOutOfBoundsException(`Cannot move beyond viewport (x: ${d}, y: ${h})`);
  let g = 0, x = 0, E;
  do {
    const P = l > 0 ? (performance.now() - s(this, Sn)) / l : 1;
    E = P >= 1;
    let C, b;
    if (E ? (C = n - g, b = o - x) : (C = Math.round(P * n - g), b = Math.round(P * o - x)), C !== 0 || b !== 0) {
      const { modifiers: N } = t;
      await s(this, J, xe).cdpTarget.cdpClient.sendCommand("Input.dispatchMouseEvent", {
        type: "mouseWheel",
        deltaX: C,
        deltaY: b,
        x: d,
        y: h,
        modifiers: N
      }), g += C, x += b;
    }
  } while (!E);
}, Xp = async function(e, t) {
  const r = t.value;
  if (!(0, dc.isSingleGrapheme)(r))
    throw new un.InvalidArgumentException(`Invalid key value: ${r}`);
  const n = (0, dc.isSingleComplexGrapheme)(r), o = (0, Zr.getNormalizedKey)(r), a = e.pressed.has(o), c = (0, Zr.getKeyCode)(r), p = (0, Zr.getKeyLocation)(r);
  switch (o) {
    case "Alt":
      e.alt = !0;
      break;
    case "Shift":
      e.shift = !0;
      break;
    case "Control":
      e.ctrl = !0;
      break;
    case "Meta":
      e.meta = !0;
      break;
  }
  e.pressed.add(o);
  const { modifiers: l } = e, d = Oh(o, e, n), h = Rh(c ?? "", e) ?? d;
  let g;
  if (s(this, ir) && e.meta)
    switch (c) {
      case "KeyA":
        g = "SelectAll";
        break;
      case "KeyC":
        g = "Copy";
        break;
      case "KeyV":
        g = e.shift ? "PasteAndMatchStyle" : "Paste";
        break;
      case "KeyX":
        g = "Cut";
        break;
      case "KeyZ":
        g = e.shift ? "Redo" : "Undo";
        break;
    }
  const x = [
    s(this, J, xe).cdpTarget.cdpClient.sendCommand("Input.dispatchKeyEvent", {
      type: h ? "keyDown" : "rawKeyDown",
      windowsVirtualKeyCode: Nh.KeyToKeyCode[o],
      key: o,
      code: c,
      text: h,
      unmodifiedText: d,
      autoRepeat: a,
      isSystemKey: e.alt || void 0,
      location: p < 3 ? p : void 0,
      isKeypad: p === 3,
      modifiers: l,
      commands: g ? [g] : void 0
    })
  ];
  o === "Escape" && !e.alt && (s(this, ir) && !e.ctrl && !e.meta || !s(this, ir)) && x.push(s(this, J, xe).cdpTarget.cdpClient.sendCommand("Input.cancelDragging")), await Promise.all(x);
}, Jp = function(e, t) {
  const r = t.value;
  if (!(0, dc.isSingleGrapheme)(r))
    throw new un.InvalidArgumentException(`Invalid key value: ${r}`);
  const n = (0, dc.isSingleComplexGrapheme)(r), o = (0, Zr.getNormalizedKey)(r);
  if (!e.pressed.has(o))
    return;
  const a = (0, Zr.getKeyCode)(r), c = (0, Zr.getKeyLocation)(r);
  switch (o) {
    case "Alt":
      e.alt = !1;
      break;
    case "Shift":
      e.shift = !1;
      break;
    case "Control":
      e.ctrl = !1;
      break;
    case "Meta":
      e.meta = !1;
      break;
  }
  e.pressed.delete(o);
  const { modifiers: p } = e, l = Oh(o, e, n), d = Rh(a ?? "", e) ?? l;
  return s(this, J, xe).cdpTarget.cdpClient.sendCommand("Input.dispatchKeyEvent", {
    type: "keyUp",
    windowsVirtualKeyCode: Nh.KeyToKeyCode[o],
    key: o,
    code: a,
    text: d,
    unmodifiedText: l,
    location: c < 3 ? c : void 0,
    isSystemKey: e.alt || void 0,
    isKeypad: c === 3,
    modifiers: p
  });
}, O(qp, "isMacOS", async (e) => {
  const r = await (await e.getOrCreateHiddenSandbox()).callFunction(Zw, !1);
  return (0, ao.assert)(r.type !== "exception"), (0, ao.assert)(r.result.type === "boolean"), r.result.value;
});
Mu.ActionDispatcher = qp;
const Oh = (i, e, t) => t ? i : i === "Enter" ? "\r" : [...i].length === 1 ? e.shift ? i.toLocaleUpperCase("en-US") : i : void 0, Rh = (i, e) => {
  if (e.ctrl) {
    switch (i) {
      case "Digit2":
        if (e.shift)
          return "\0";
        break;
      case "KeyA":
        return "";
      case "KeyB":
        return "";
      case "KeyC":
        return "";
      case "KeyD":
        return "";
      case "KeyE":
        return "";
      case "KeyF":
        return "";
      case "KeyG":
        return "\x07";
      case "KeyH":
        return "\b";
      case "KeyI":
        return "	";
      case "KeyJ":
        return `
`;
      case "KeyK":
        return "\v";
      case "KeyL":
        return "\f";
      case "KeyM":
        return "\r";
      case "KeyN":
        return "";
      case "KeyO":
        return "";
      case "KeyP":
        return "";
      case "KeyQ":
        return "";
      case "KeyR":
        return "";
      case "KeyS":
        return "";
      case "KeyT":
        return "";
      case "KeyU":
        return "";
      case "KeyV":
        return "";
      case "KeyW":
        return "";
      case "KeyX":
        return "";
      case "KeyY":
        return "";
      case "KeyZ":
        return "";
      case "BracketLeft":
        return "\x1B";
      case "Backslash":
        return "";
      case "BracketRight":
        return "";
      case "Digit6":
        if (e.shift)
          return "";
        break;
      case "Minus":
        return "";
    }
    return "";
  }
  if (e.alt)
    return "";
};
function lc(i) {
  switch (i) {
    case 0:
      return "left";
    case 1:
      return "middle";
    case 2:
      return "right";
    case 3:
      return "back";
    case 4:
      return "forward";
    default:
      return "none";
  }
}
function Ah(i) {
  const e = i.altitudeAngle ?? Math.PI / 2, t = i.azimuthAngle ?? 0;
  let r = 0, n = 0;
  if (e === 0 && ((t === 0 || t === 2 * Math.PI) && (r = Math.PI / 2), t === Math.PI / 2 && (n = Math.PI / 2), t === Math.PI && (r = -Math.PI / 2), t === 3 * Math.PI / 2 && (n = -Math.PI / 2), t > 0 && t < Math.PI / 2 && (r = Math.PI / 2, n = Math.PI / 2), t > Math.PI / 2 && t < Math.PI && (r = -Math.PI / 2, n = Math.PI / 2), t > Math.PI && t < 3 * Math.PI / 2 && (r = -Math.PI / 2, n = -Math.PI / 2), t > 3 * Math.PI / 2 && t < 2 * Math.PI && (r = Math.PI / 2, n = -Math.PI / 2)), e !== 0) {
    const a = Math.tan(e);
    r = Math.atan(Math.cos(t) / a), n = Math.atan(Math.sin(t) / a);
  }
  const o = 180 / Math.PI;
  return {
    tiltX: Math.round(r * o),
    tiltY: Math.round(n * o)
  };
}
function Bh(i, e) {
  return {
    radiusX: i ? i / 2 : 0.5,
    radiusY: e ? e / 2 : 0.5
  };
}
var $u = {}, Lu = {}, qu = {};
Object.defineProperty(qu, "__esModule", { value: !0 });
qu.Mutex = void 0;
var Pn, Po, Io, zd;
class ey {
  constructor() {
    u(this, Io);
    u(this, Pn, !1);
    u(this, Po, []);
  }
  // This is FIFO.
  acquire() {
    const e = { resolved: !1 };
    return s(this, Pn) ? new Promise((t) => {
      s(this, Po).push(() => t(m(this, Io, zd).bind(this, e)));
    }) : (f(this, Pn, !0), Promise.resolve(m(this, Io, zd).bind(this, e)));
  }
  async run(e) {
    const t = await this.acquire();
    try {
      return await e();
    } finally {
      t();
    }
  }
}
Pn = new WeakMap(), Po = new WeakMap(), Io = new WeakSet(), zd = function(e) {
  if (e.resolved)
    throw new Error("Cannot release more than once.");
  e.resolved = !0;
  const t = s(this, Po).shift();
  if (!t) {
    f(this, Pn, !1);
    return;
  }
  t();
};
qu.Mutex = ey;
Object.defineProperty(Lu, "__esModule", { value: !0 });
Lu.InputState = void 0;
const vd = se, ty = qu, zi = yt;
var ws, Yc;
class sy {
  constructor() {
    O(this, "cancelList", []);
    u(this, ws, /* @__PURE__ */ new Map());
    u(this, Yc, new ty.Mutex());
  }
  getOrCreate(e, t, r) {
    let n = s(this, ws).get(e);
    if (!n) {
      switch (t) {
        case "none":
          n = new zi.NoneSource();
          break;
        case "key":
          n = new zi.KeySource();
          break;
        case "pointer": {
          let o = r === "mouse" ? 0 : 2;
          const a = /* @__PURE__ */ new Set();
          for (const [, c] of s(this, ws))
            c.type === "pointer" && a.add(c.pointerId);
          for (; a.has(o); )
            ++o;
          n = new zi.PointerSource(o, r);
          break;
        }
        case "wheel":
          n = new zi.WheelSource();
          break;
        default:
          throw new vd.InvalidArgumentException(`Expected "none", "key", "pointer", or "wheel". Found unknown source type ${t}.`);
      }
      return s(this, ws).set(e, n), n;
    }
    if (n.type !== t)
      throw new vd.InvalidArgumentException(`Input source type of ${e} is ${n.type}, but received ${t}.`);
    return n;
  }
  get(e) {
    const t = s(this, ws).get(e);
    if (!t)
      throw new vd.UnknownErrorException("Internal error.");
    return t;
  }
  getGlobalKeyState() {
    const e = new zi.KeySource();
    for (const [, t] of s(this, ws))
      if (t.type === "key") {
        for (const r of t.pressed)
          e.pressed.add(r);
        e.alt || (e.alt = t.alt), e.ctrl || (e.ctrl = t.ctrl), e.meta || (e.meta = t.meta), e.shift || (e.shift = t.shift);
      }
    return e;
  }
  get queue() {
    return s(this, Yc);
  }
}
ws = new WeakMap(), Yc = new WeakMap();
Lu.InputState = sy;
Object.defineProperty($u, "__esModule", { value: !0 });
$u.InputStateManager = void 0;
const ry = us, ny = Lu;
class iy extends WeakMap {
  get(e) {
    return (0, ry.assert)(e.isTopLevelContext()), this.has(e) || this.set(e, new ny.InputState()), super.get(e);
  }
}
$u.InputStateManager = iy;
Object.defineProperty(Fu, "__esModule", { value: !0 });
Fu.InputProcessor = void 0;
const Ks = se, hc = us, pc = Mu, oy = $u;
var Xt, In, Zc, Yp;
class ay {
  constructor(e) {
    u(this, Zc);
    u(this, Xt);
    u(this, In, new oy.InputStateManager());
    f(this, Xt, e);
  }
  async performActions(e) {
    const t = s(this, Xt).getContext(e.context), r = s(this, In).get(t.top), n = m(this, Zc, Yp).call(this, e, r);
    return await new pc.ActionDispatcher(r, s(this, Xt), e.context, await pc.ActionDispatcher.isMacOS(t).catch(() => !1)).dispatchActions(n), {};
  }
  async releaseActions(e) {
    const t = s(this, Xt).getContext(e.context), r = t.top, n = s(this, In).get(r);
    return await new pc.ActionDispatcher(n, s(this, Xt), e.context, await pc.ActionDispatcher.isMacOS(t).catch(() => !1)).dispatchTickActions(n.cancelList.reverse()), s(this, In).delete(r), {};
  }
  async setFiles(e) {
    const r = await s(this, Xt).getContext(e.context).getOrCreateHiddenSandbox();
    let n;
    try {
      n = await r.callFunction(String(function(p) {
        if (!(this instanceof HTMLInputElement))
          return this instanceof Element ? 1 : 0;
        if (this.type !== "file")
          return 2;
        if (this.disabled)
          return 3;
        if (p > 1 && !this.multiple)
          return 4;
      }), !1, e.element, [{ type: "number", value: e.files.length }]);
    } catch {
      throw new Ks.NoSuchNodeException(`Could not find element ${e.element.sharedId}`);
    }
    if ((0, hc.assert)(n.type === "success"), n.result.type === "number")
      switch (n.result.value) {
        case 0:
          throw new Ks.NoSuchElementException(`Could not find element ${e.element.sharedId}`);
        case 1:
          throw new Ks.UnableToSetFileInputException(`Element ${e.element.sharedId} is not a input`);
        case 2:
          throw new Ks.UnableToSetFileInputException(`Input element ${e.element.sharedId} is not a file type`);
        case 3:
          throw new Ks.UnableToSetFileInputException(`Input element ${e.element.sharedId} is disabled`);
        case 4:
          throw new Ks.UnableToSetFileInputException("Cannot set multiple files on a non-multiple input element");
      }
    if (e.files.length === 0)
      return await r.callFunction(String(function() {
        var p;
        if (((p = this.files) == null ? void 0 : p.length) === 0) {
          this.dispatchEvent(new Event("cancel", {
            bubbles: !0
          }));
          return;
        }
        this.files = new DataTransfer().files, this.dispatchEvent(new Event("input", { bubbles: !0, composed: !0 })), this.dispatchEvent(new Event("change", { bubbles: !0 }));
      }), !1, e.element), {};
    const o = [];
    for (let c = 0; c < e.files.length; ++c) {
      const p = await r.callFunction(
        String(function(g) {
          var x;
          return (x = this.files) == null ? void 0 : x.item(g);
        }),
        !1,
        e.element,
        [{ type: "number", value: 0 }],
        "root"
        /* Script.ResultOwnership.Root */
      );
      if ((0, hc.assert)(p.type === "success"), p.result.type !== "object")
        break;
      const { handle: l } = p.result;
      (0, hc.assert)(l !== void 0);
      const { path: d } = await r.cdpClient.sendCommand("DOM.getFileInfo", {
        objectId: l
      });
      o.push(d), r.disown(l).catch(void 0);
    }
    o.sort();
    const a = [...e.files].sort();
    if (o.length !== e.files.length || a.some((c, p) => o[p] !== c)) {
      const { objectId: c } = await r.deserializeForCdp(e.element);
      (0, hc.assert)(c !== void 0), await r.cdpClient.sendCommand("DOM.setFileInputFiles", {
        files: e.files,
        objectId: c
      });
    } else
      await r.callFunction(String(function() {
        this.dispatchEvent(new Event("cancel", {
          bubbles: !0
        }));
      }), !1, e.element);
    return {};
  }
}
Xt = new WeakMap(), In = new WeakMap(), Zc = new WeakSet(), Yp = function(e, t) {
  var n;
  const r = [];
  for (const o of e.actions) {
    switch (o.type) {
      case "pointer": {
        o.parameters ?? (o.parameters = {
          pointerType: "mouse"
          /* Input.PointerType.Mouse */
        }), (n = o.parameters).pointerType ?? (n.pointerType = "mouse");
        const c = t.getOrCreate(o.id, "pointer", o.parameters.pointerType);
        if (c.subtype !== o.parameters.pointerType)
          throw new Ks.InvalidArgumentException(`Expected input source ${o.id} to be ${c.subtype}; got ${o.parameters.pointerType}.`);
        c.resetClickCount();
        break;
      }
      default:
        t.getOrCreate(o.id, o.type);
    }
    const a = o.actions.map((c) => ({
      id: o.id,
      action: c
    }));
    for (let c = 0; c < a.length; c++)
      r.length === c && r.push([]), r[c].push(a[c]);
  }
  return r;
};
Fu.InputProcessor = ay;
var Mi = {}, ye = {}, eh = {};
Object.defineProperty(eh, "__esModule", { value: !0 });
eh.base64ToString = cy;
function cy(i) {
  return "atob" in globalThis ? globalThis.atob(i) : Buffer.from(i, "base64").toString("ascii");
}
Object.defineProperty(ye, "__esModule", { value: !0 });
ye.computeHeadersSize = ly;
ye.stringToBase64 = hy;
ye.bidiNetworkHeadersFromCdpNetworkHeaders = fy;
ye.bidiNetworkHeadersFromCdpNetworkHeadersEntries = my;
ye.cdpNetworkHeadersFromBidiNetworkHeaders = gy;
ye.bidiNetworkHeadersFromCdpFetchHeaders = wy;
ye.cdpFetchHeadersFromBidiNetworkHeaders = yy;
ye.networkHeaderFromCookieHeaders = vy;
ye.cdpAuthChallengeResponseFromBidiAuthContinueWithAuthAction = by;
ye.cdpToBiDiCookie = Cy;
ye.deserializeByteValue = Zp;
ye.bidiToCdpCookie = xy;
ye.sameSiteBiDiToCdp = Qp;
ye.isSpecialScheme = Sy;
ye.matchUrlPattern = Iy;
ye.bidiBodySizeFromCdpPostDataEntries = _y;
ye.getTiming = ky;
const uy = M, dy = eh;
function ly(i) {
  const e = i.reduce((t, r) => `${t}${r.name}: ${r.value.value}\r
`, "");
  return new TextEncoder().encode(e).length;
}
function hy(i) {
  return py(new TextEncoder().encode(i));
}
function py(i) {
  const t = [];
  for (let n = 0; n < i.length; n += 65534) {
    const o = i.subarray(n, n + 65534);
    t.push(String.fromCodePoint.apply(null, o));
  }
  const r = t.join("");
  return btoa(r);
}
function fy(i) {
  return i ? Object.entries(i).map(([e, t]) => ({
    name: e,
    value: {
      type: "string",
      value: t
    }
  })) : [];
}
function my(i) {
  return i ? i.map(({ name: e, value: t }) => ({
    name: e,
    value: {
      type: "string",
      value: t
    }
  })) : [];
}
function gy(i) {
  if (i !== void 0)
    return i.reduce((e, t) => (e[t.name] = t.value.value, e), {});
}
function wy(i) {
  return i ? i.map(({ name: e, value: t }) => ({
    name: e,
    value: {
      type: "string",
      value: t
    }
  })) : [];
}
function yy(i) {
  if (i !== void 0)
    return i.map(({ name: e, value: t }) => ({
      name: e,
      value: t.value
    }));
}
function vy(i) {
  return i === void 0 ? void 0 : {
    name: "Cookie",
    value: {
      type: "string",
      value: i.reduce((t, r, n) => {
        n > 0 && (t += ";");
        const o = r.value.type === "base64" ? btoa(r.value.value) : r.value.value;
        return t += `${r.name}=${o}`, t;
      }, "")
    }
  };
}
function by(i) {
  switch (i) {
    case "default":
      return "Default";
    case "cancel":
      return "CancelAuth";
    case "provideCredentials":
      return "ProvideCredentials";
  }
}
function Cy(i) {
  const e = {
    name: i.name,
    value: { type: "string", value: i.value },
    domain: i.domain,
    path: i.path,
    size: i.size,
    httpOnly: i.httpOnly,
    secure: i.secure,
    sameSite: i.sameSite === void 0 ? "none" : Ey(i.sameSite),
    ...i.expires >= 0 ? { expiry: Math.round(i.expires) } : void 0
  };
  return e["goog:session"] = i.session, e["goog:priority"] = i.priority, e["goog:sourceScheme"] = i.sourceScheme, e["goog:sourcePort"] = i.sourcePort, i.partitionKey !== void 0 && (e["goog:partitionKey"] = i.partitionKey), i.partitionKeyOpaque !== void 0 && (e["goog:partitionKeyOpaque"] = i.partitionKeyOpaque), e;
}
function Zp(i) {
  return i.type === "base64" ? (0, dy.base64ToString)(i.value) : i.value;
}
function xy(i, e) {
  const t = Zp(i.cookie.value), r = {
    name: i.cookie.name,
    value: t,
    domain: i.cookie.domain,
    path: i.cookie.path ?? "/",
    secure: i.cookie.secure ?? !1,
    httpOnly: i.cookie.httpOnly ?? !1,
    ...e.sourceOrigin !== void 0 && {
      partitionKey: {
        hasCrossSiteAncestor: !1,
        // CDP's `partitionKey.topLevelSite` is the BiDi's `partition.sourceOrigin`.
        topLevelSite: e.sourceOrigin
      }
    },
    ...i.cookie.expiry !== void 0 && {
      expires: i.cookie.expiry
    },
    ...i.cookie.sameSite !== void 0 && {
      sameSite: Qp(i.cookie.sameSite)
    }
  };
  return i.cookie["goog:url"] !== void 0 && (r.url = i.cookie["goog:url"]), i.cookie["goog:priority"] !== void 0 && (r.priority = i.cookie["goog:priority"]), i.cookie["goog:sourceScheme"] !== void 0 && (r.sourceScheme = i.cookie["goog:sourceScheme"]), i.cookie["goog:sourcePort"] !== void 0 && (r.sourcePort = i.cookie["goog:sourcePort"]), r;
}
function Ey(i) {
  switch (i) {
    case "Strict":
      return "strict";
    case "None":
      return "none";
    case "Lax":
      return "lax";
    default:
      return "lax";
  }
}
function Qp(i) {
  switch (i) {
    case "none":
      return "None";
    case "strict":
      return "Strict";
    case "default":
    case "lax":
      return "Lax";
  }
  throw new uy.InvalidArgumentException(`Unknown 'sameSite' value ${i}`);
}
function Sy(i) {
  return ["ftp", "file", "http", "https", "ws", "wss"].includes(i.replace(/:$/, ""));
}
function Py(i) {
  return i.protocol.replace(/:$/, "");
}
function Iy(i, e) {
  const t = new URL(e);
  return !(i.protocol !== void 0 && i.protocol !== Py(t) || i.hostname !== void 0 && i.hostname !== t.hostname || i.port !== void 0 && i.port !== t.port || i.pathname !== void 0 && i.pathname !== t.pathname || i.search !== void 0 && i.search !== t.search);
}
function _y(i) {
  let e = 0;
  for (const t of i)
    e += atob(t.bytes ?? "").length;
  return e;
}
function ky(i, e = 0) {
  return !i || i <= 0 || i + e <= 0 ? 0 : i + e;
}
Object.defineProperty(Mi, "__esModule", { value: !0 });
Mi.NetworkProcessor = void 0;
Mi.parseBiDiHeaders = tf;
const te = se, Fh = ye;
var Je, Ye, _n, ys, ke, Qi, Kd, eo, ef;
const at = class at {
  constructor(e, t, r, n) {
    u(this, ke);
    u(this, Je);
    u(this, Ye);
    u(this, _n);
    u(this, ys);
    f(this, _n, r), f(this, Je, e), f(this, Ye, t), f(this, ys, n);
  }
  async addIntercept(e) {
    s(this, Je).verifyTopLevelContextsList(e.contexts);
    const t = e.urlPatterns ?? [], r = at.parseUrlPatterns(t), n = s(this, Ye).addIntercept({
      urlPatterns: r,
      phases: e.phases,
      contexts: e.contexts
    });
    return await m(this, ke, Qi).call(this), {
      intercept: n
    };
  }
  async continueRequest(e) {
    if (e.url !== void 0 && at.parseUrlString(e.url), e.method !== void 0 && !at.isMethodValid(e.method))
      throw new te.InvalidArgumentException(`Method '${e.method}' is invalid.`);
    e.headers && at.validateHeaders(e.headers);
    const t = m(this, ke, eo).call(this, e.request, [
      "beforeRequestSent"
    ]);
    try {
      await t.continueRequest(e);
    } catch (r) {
      throw at.wrapInterceptionError(r);
    }
    return {};
  }
  async continueResponse(e) {
    e.headers && at.validateHeaders(e.headers);
    const t = m(this, ke, eo).call(this, e.request, [
      "authRequired",
      "responseStarted"
    ]);
    try {
      await t.continueResponse(e);
    } catch (r) {
      throw at.wrapInterceptionError(r);
    }
    return {};
  }
  async continueWithAuth(e) {
    const t = e.request;
    return await m(this, ke, eo).call(this, t, [
      "authRequired"
    ]).continueWithAuth(e), {};
  }
  async failRequest({ request: e }) {
    const t = m(this, ke, Kd).call(this, e);
    if (t.interceptPhase === "authRequired")
      throw new te.InvalidArgumentException(`Request '${e}' in 'authRequired' phase cannot be failed`);
    if (!t.interceptPhase)
      throw new te.NoSuchRequestException(`No blocked request found for network id '${e}'`);
    return await t.failRequest("Failed"), {};
  }
  async provideResponse(e) {
    e.headers && at.validateHeaders(e.headers);
    const t = m(this, ke, eo).call(this, e.request, [
      "beforeRequestSent",
      "responseStarted",
      "authRequired"
    ]);
    try {
      await t.provideResponse(e);
    } catch (r) {
      throw at.wrapInterceptionError(r);
    }
    return {};
  }
  async removeIntercept(e) {
    return s(this, Ye).removeIntercept(e.intercept), await m(this, ke, Qi).call(this), {};
  }
  async setCacheBehavior(e) {
    const t = s(this, Je).verifyTopLevelContextsList(e.contexts);
    if (t.size === 0)
      return s(this, Ye).defaultCacheBehavior = e.cacheBehavior, await Promise.all(s(this, Je).getAllContexts().map((n) => n.cdpTarget.toggleSetCacheDisabled())), {};
    const r = e.cacheBehavior === "bypass";
    return await Promise.all([...t.values()].map((n) => n.cdpTarget.toggleSetCacheDisabled(r))), {};
  }
  /**
   * Validate https://fetch.spec.whatwg.org/#header-value
   */
  static validateHeaders(e) {
    for (const t of e) {
      let r;
      if (t.value.type === "string" ? r = t.value.value : r = atob(t.value.value), r !== r.trim() || r.includes(`
`) || r.includes("\0"))
        throw new te.InvalidArgumentException(`Header value '${r}' is not acceptable value`);
    }
  }
  static isMethodValid(e) {
    return /^[!#$%&'*+\-.^_`|~a-zA-Z\d]+$/.test(e);
  }
  /**
   * Attempts to parse the given url.
   * Throws an InvalidArgumentException if the url is invalid.
   */
  static parseUrlString(e) {
    try {
      return new URL(e);
    } catch (t) {
      throw new te.InvalidArgumentException(`Invalid URL '${e}': ${t}`);
    }
  }
  static parseUrlPatterns(e) {
    return e.map((t) => {
      let r = "", n = !0, o = !0, a = !0, c = !0, p = !0;
      switch (t.type) {
        case "string": {
          r = Qr(t.pattern);
          break;
        }
        case "pattern": {
          if (t.protocol === void 0)
            n = !1, r += "http";
          else {
            if (t.protocol === "")
              throw new te.InvalidArgumentException("URL pattern must specify a protocol");
            if (t.protocol = Qr(t.protocol), !t.protocol.match(/^[a-zA-Z+-.]+$/))
              throw new te.InvalidArgumentException("Forbidden characters");
            r += t.protocol;
          }
          const d = r.toLocaleLowerCase();
          if (r += ":", (0, Fh.isSpecialScheme)(d) && (r += "//"), t.hostname === void 0)
            d !== "file" && (r += "placeholder"), o = !1;
          else {
            if (t.hostname === "")
              throw new te.InvalidArgumentException("URL pattern must specify a hostname");
            if (t.protocol === "file")
              throw new te.InvalidArgumentException("URL pattern protocol cannot be 'file'");
            t.hostname = Qr(t.hostname);
            let h = !1;
            for (const g of t.hostname) {
              if (g === "/" || g === "?" || g === "#")
                throw new te.InvalidArgumentException("'/', '?', '#' are forbidden in hostname");
              if (!h && g === ":")
                throw new te.InvalidArgumentException("':' is only allowed inside brackets in hostname");
              g === "[" && (h = !0), g === "]" && (h = !1);
            }
            r += t.hostname;
          }
          if (t.port === void 0)
            a = !1;
          else {
            if (t.port === "")
              throw new te.InvalidArgumentException("URL pattern must specify a port");
            if (t.port = Qr(t.port), r += ":", !t.port.match(/^\d+$/))
              throw new te.InvalidArgumentException("Forbidden characters");
            r += t.port;
          }
          if (t.pathname === void 0)
            c = !1;
          else {
            if (t.pathname = Qr(t.pathname), t.pathname[0] !== "/" && (r += "/"), t.pathname.includes("#") || t.pathname.includes("?"))
              throw new te.InvalidArgumentException("Forbidden characters");
            r += t.pathname;
          }
          if (t.search === void 0)
            p = !1;
          else {
            if (t.search = Qr(t.search), t.search[0] !== "?" && (r += "?"), t.search.includes("#"))
              throw new te.InvalidArgumentException("Forbidden characters");
            r += t.search;
          }
          break;
        }
      }
      const l = (d) => {
        const h = {
          "ftp:": 21,
          "file:": null,
          "http:": 80,
          "https:": 443,
          "ws:": 80,
          "wss:": 443
        };
        if ((0, Fh.isSpecialScheme)(d.protocol) && h[d.protocol] !== null && (!d.port || String(h[d.protocol]) === d.port))
          return "";
        if (d.port)
          return d.port;
      };
      try {
        const d = new URL(r);
        return {
          protocol: n ? d.protocol.replace(/:$/, "") : void 0,
          hostname: o ? d.hostname : void 0,
          port: a ? l(d) : void 0,
          pathname: c && d.pathname ? d.pathname : void 0,
          search: p ? d.search : void 0
        };
      } catch (d) {
        throw new te.InvalidArgumentException(`${d.message} '${r}'`);
      }
    });
  }
  static wrapInterceptionError(e) {
    return e != null && e.message.includes("Invalid header") || e != null && e.message.includes("Unsafe header") ? new te.InvalidArgumentException(e.message) : e;
  }
  async addDataCollector(e) {
    if (e.userContexts !== void 0 && e.contexts !== void 0)
      throw new te.InvalidArgumentException("'contexts' and 'userContexts' are mutually exclusive");
    if (e.userContexts !== void 0 && await s(this, _n).verifyUserContextIdList(e.userContexts), e.contexts !== void 0) {
      for (const r of e.contexts)
        if (!s(this, Je).getContext(r).isTopLevelContext())
          throw new te.InvalidArgumentException("Data collectors are available only on top-level browsing contexts");
    }
    const t = s(this, Ye).addDataCollector(e);
    return await m(this, ke, Qi).call(this), { collector: t };
  }
  async getData(e) {
    return await s(this, Ye).getCollectedData(e);
  }
  async removeDataCollector(e) {
    return s(this, Ye).removeDataCollector(e), await m(this, ke, Qi).call(this), {};
  }
  disownData(e) {
    return s(this, Ye).disownData(e), {};
  }
  async setExtraHeaders(e) {
    const t = await m(this, ke, ef).call(this, e.contexts, e.userContexts), r = tf(e.headers);
    return e.userContexts === void 0 && e.contexts === void 0 && s(this, ys).updateGlobalConfig({
      extraHeaders: r
    }), e.userContexts !== void 0 && e.userContexts.forEach((n) => {
      s(this, ys).updateUserContextConfig(n, {
        extraHeaders: r
      });
    }), e.contexts !== void 0 && e.contexts.forEach((n) => {
      s(this, ys).updateBrowsingContextConfig(n, { extraHeaders: r });
    }), await Promise.all(t.map(async (n) => {
      const o = s(this, ys).getActiveConfig(n.id, n.userContext).extraHeaders ?? {};
      await n.setExtraHeaders(o);
    })), {};
  }
};
Je = new WeakMap(), Ye = new WeakMap(), _n = new WeakMap(), ys = new WeakMap(), ke = new WeakSet(), Qi = async function() {
  await Promise.all(s(this, Je).getAllContexts().map((e) => e.cdpTarget.toggleNetwork()));
}, Kd = function(e) {
  const t = s(this, Ye).getRequestById(e);
  if (!t)
    throw new te.NoSuchRequestException(`Network request with ID '${e}' doesn't exist`);
  return t;
}, eo = function(e, t) {
  const r = m(this, ke, Kd).call(this, e);
  if (!r.interceptPhase)
    throw new te.NoSuchRequestException(`No blocked request found for network id '${e}'`);
  if (r.interceptPhase && !t.includes(r.interceptPhase))
    throw new te.InvalidArgumentException(`Blocked request for network id '${e}' is in '${r.interceptPhase}' phase`);
  return r;
}, ef = async function(e, t) {
  if (e === void 0 && t === void 0)
    return s(this, Je).getTopLevelContexts();
  if (e !== void 0 && t !== void 0)
    throw new te.InvalidArgumentException("User contexts and browsing contexts are mutually exclusive");
  const r = [];
  if (t !== void 0) {
    if (t.length === 0)
      throw new te.InvalidArgumentException("user context should be provided");
    await s(this, _n).verifyUserContextIdList(t);
    for (const n of t) {
      const o = s(this, Je).getTopLevelContexts().filter((a) => a.userContext === n);
      r.push(...o);
    }
  }
  if (e !== void 0) {
    if (e.length === 0)
      throw new te.InvalidArgumentException("browsing context should be provided");
    for (const n of e) {
      const o = s(this, Je).getContext(n);
      if (!o.isTopLevelContext())
        throw new te.InvalidArgumentException("The command is only supported on the top-level context");
      r.push(o);
    }
  }
  return [...new Set(r).values()];
};
let Wd = at;
Mi.NetworkProcessor = Wd;
function Qr(i) {
  const e = /* @__PURE__ */ new Set(["(", ")", "*", "{", "}"]);
  let t = "", r = !1;
  for (const n of i) {
    if (!r) {
      if (e.has(n))
        throw new te.InvalidArgumentException("Forbidden characters");
      if (n === "\\") {
        r = !0;
        continue;
      }
    }
    t += n, r = !1;
  }
  return t;
}
const Ty = /* @__PURE__ */ new Set([
  " ",
  "	",
  `
`,
  '"',
  "(",
  ")",
  ",",
  "/",
  ":",
  ";",
  "<",
  "=",
  ">",
  "?",
  "@",
  "[",
  "\\",
  "]",
  "{",
  "}"
]), Dy = /* @__PURE__ */ new Set(["\0", `
`, "\r"]);
function Mh(i, e) {
  for (const t of i)
    if (e.has(t))
      return !0;
  return !1;
}
function tf(i) {
  const e = {};
  for (const t of i)
    if (t.value.type === "string") {
      const r = t.name, n = t.value.value;
      if (r.length === 0)
        throw new te.InvalidArgumentException("Empty header name is not allowed");
      if (Mh(r, Ty))
        throw new te.InvalidArgumentException(`Header name '${r}' contains forbidden symbols`);
      if (Mh(n, Dy))
        throw new te.InvalidArgumentException(`Header value '${n}' contains forbidden symbols`);
      if (n.trim() !== n)
        throw new te.InvalidArgumentException("Header value should not contain trailing or ending whitespaces");
      e[t.name] = t.value.value;
    } else
      throw new te.UnsupportedOperationException("Only string headers values are supported");
  return e;
}
var Hu = {};
Object.defineProperty(Hu, "__esModule", { value: !0 });
Hu.PermissionsProcessor = void 0;
const Ny = se;
var _o;
class Oy {
  constructor(e) {
    u(this, _o);
    f(this, _o, e);
  }
  async setPermissions(e) {
    try {
      const t = e["goog:userContext"] || e.userContext;
      await s(this, _o).sendCommand("Browser.setPermission", {
        origin: e.origin,
        embeddedOrigin: e.embeddedOrigin,
        browserContextId: t && t !== "default" ? t : void 0,
        permission: {
          name: e.descriptor.name
        },
        setting: e.state
      });
    } catch (t) {
      if (t.message === "Permission can't be granted to opaque origins.")
        return {};
      throw new Ny.InvalidArgumentException(t.message);
    }
    return {};
  }
}
_o = new WeakMap();
Hu.PermissionsProcessor = Oy;
var zu = {}, Wu = {}, qt = {};
Object.defineProperty(qt, "__esModule", { value: !0 });
qt.uuidv4 = Ry;
function Wi(i) {
  return i.reduce((e, t) => e + t.toString(16).padStart(2, "0"), "");
}
function Ry() {
  if ("crypto" in globalThis && "randomUUID" in globalThis.crypto)
    return globalThis.crypto.randomUUID();
  const i = new Uint8Array(16);
  return "crypto" in globalThis && "getRandomValues" in globalThis.crypto ? globalThis.crypto.getRandomValues(i) : ew.webcrypto.getRandomValues(i), i[6] = i[6] & 15 | 64, i[8] = i[8] & 63 | 128, [
    Wi(i.subarray(0, 4)),
    Wi(i.subarray(4, 6)),
    Wi(i.subarray(6, 8)),
    Wi(i.subarray(8, 10)),
    Wi(i.subarray(10, 16))
  ].join("-");
}
var tc = {};
Object.defineProperty(tc, "__esModule", { value: !0 });
tc.ChannelProxy = void 0;
const Ay = se, jh = Te, By = qt;
var or, kn, Tn, cs, Gd, sf, rf, Vr, Xd, nf;
const wn = class wn {
  constructor(e, t) {
    u(this, Vr);
    u(this, or);
    u(this, kn, (0, By.uuidv4)());
    u(this, Tn);
    f(this, or, e), f(this, Tn, t);
  }
  /**
   * Creates a channel proxy in the given realm, initialises listener and
   * returns a handle to `sendMessage` delegate.
   */
  async init(e, t) {
    var o, a;
    const r = await m(o = wn, cs, sf).call(o, e), n = await m(a = wn, cs, rf).call(a, e, r);
    return m(this, Vr, Xd).call(this, e, r, t), n;
  }
  /** Gets a ChannelProxy from window and returns its handle. */
  async startListenerFromWindow(e, t) {
    var r;
    try {
      const n = await m(this, Vr, nf).call(this, e);
      m(this, Vr, Xd).call(this, e, n, t);
    } catch (n) {
      (r = s(this, Tn)) == null || r.call(this, jh.LogType.debugError, n);
    }
  }
  /**
   * String to be evaluated to create a ProxyChannel and put it to window.
   * Returns the delegate `sendMessage`. Used to provide an argument for preload
   * script. Does the following:
   * 1. Creates a ChannelProxy.
   * 2. Puts the ChannelProxy to window['${this.#id}'] or resolves the promise
   *    by calling delegate stored in window['${this.#id}'].
   *    This is needed because `#getHandleFromWindow` can be called before or
   *    after this method.
   * 3. Returns the delegate `sendMessage` of the created ChannelProxy.
   */
  getEvalInWindowStr() {
    var r;
    const e = String((n, o) => {
      const a = window;
      return a[n] === void 0 ? a[n] = o : (a[n](o), delete a[n]), o.sendMessage;
    }), t = m(r = wn, cs, Gd).call(r);
    return `(${e})('${s(this, kn)}',${t})`;
  }
};
or = new WeakMap(), kn = new WeakMap(), Tn = new WeakMap(), cs = new WeakSet(), Gd = function() {
  return `(${String(() => {
    const t = [];
    let r = null;
    return {
      /**
       * Gets a promise, which is resolved as soon as a message occurs
       * in the queue.
       */
      async getMessage() {
        return await (t.length > 0 ? Promise.resolve() : new Promise((o) => {
          r = o;
        })), t.shift();
      },
      /**
       * Adds a message to the queue.
       * Resolves the pending promise if needed.
       */
      sendMessage(n) {
        t.push(n), r !== null && (r(), r = null);
      }
    };
  })})()`;
}, sf = async function(e) {
  const t = await e.cdpClient.sendCommand("Runtime.evaluate", {
    expression: m(this, cs, Gd).call(this),
    contextId: e.executionContextId,
    serializationOptions: {
      serialization: "idOnly"
    }
  });
  if (t.exceptionDetails || t.result.objectId === void 0)
    throw new Error("Cannot create channel");
  return t.result.objectId;
}, rf = async function(e, t) {
  return (await e.cdpClient.sendCommand("Runtime.callFunctionOn", {
    functionDeclaration: String((n) => n.sendMessage),
    arguments: [{ objectId: t }],
    executionContextId: e.executionContextId,
    serializationOptions: {
      serialization: "idOnly"
    }
  })).result.objectId;
}, Vr = new WeakSet(), Xd = async function(e, t, r) {
  var n, o;
  for (; ; )
    try {
      const a = await e.cdpClient.sendCommand("Runtime.callFunctionOn", {
        functionDeclaration: String(async (c) => await c.getMessage()),
        arguments: [
          {
            objectId: t
          }
        ],
        awaitPromise: !0,
        executionContextId: e.executionContextId,
        serializationOptions: {
          serialization: "deep",
          maxDepth: ((n = s(this, or).serializationOptions) == null ? void 0 : n.maxObjectDepth) ?? void 0
        }
      });
      if (a.exceptionDetails)
        throw new Error("Runtime.callFunctionOn in ChannelProxy", {
          cause: a.exceptionDetails
        });
      for (const c of e.associatedBrowsingContexts)
        r.registerEvent({
          type: "event",
          method: Ay.ChromiumBidi.Script.EventNames.Message,
          params: {
            channel: s(this, or).channel,
            data: e.cdpToBidiValue(
              a,
              s(this, or).ownership ?? "none"
              /* Script.ResultOwnership.None */
            ),
            source: e.source
          }
        }, c.id);
    } catch (a) {
      (o = s(this, Tn)) == null || o.call(this, jh.LogType.debugError, a);
      break;
    }
}, nf = async function(e) {
  const t = await e.cdpClient.sendCommand("Runtime.callFunctionOn", {
    functionDeclaration: String((r) => {
      const n = window;
      if (n[r] === void 0)
        return new Promise((a) => n[r] = a);
      const o = n[r];
      return delete n[r], o;
    }),
    arguments: [{ value: s(this, kn) }],
    executionContextId: e.executionContextId,
    awaitPromise: !0,
    serializationOptions: {
      serialization: "idOnly"
    }
  });
  if (t.exceptionDetails !== void 0 || t.result.objectId === void 0)
    throw new Error(`ChannelHandle not found in window["${s(this, kn)}"]`);
  return t.result.objectId;
}, u(wn, cs);
let Vd = wn;
tc.ChannelProxy = Vd;
Object.defineProperty(Wu, "__esModule", { value: !0 });
Wu.PreloadScript = void 0;
const Fy = qt, My = tc;
var Qc, ar, ko, Dn, To, Do, No, Oo, eu, of;
class jy {
  constructor(e, t) {
    u(this, eu);
    /** BiDi ID, an automatically generated UUID. */
    u(this, Qc, (0, Fy.uuidv4)());
    /** CDP preload scripts. */
    u(this, ar, []);
    /** The script itself, in a format expected by the spec i.e. a function. */
    u(this, ko);
    /** Targets, in which the preload script is initialized. */
    u(this, Dn, /* @__PURE__ */ new Set());
    /** Channels to be added as arguments to functionDeclaration. */
    u(this, To);
    /** The script sandbox / world name. */
    u(this, Do);
    /** The browsing contexts to execute the preload scripts in, if any. */
    u(this, No);
    /** The browsing contexts to execute the preload scripts in, if any. */
    u(this, Oo);
    var r;
    f(this, To, ((r = e.arguments) == null ? void 0 : r.map((n) => new My.ChannelProxy(n.value, t))) ?? []), f(this, ko, e.functionDeclaration), f(this, Do, e.sandbox), f(this, No, e.contexts), f(this, Oo, e.userContexts);
  }
  get id() {
    return s(this, Qc);
  }
  get targetIds() {
    return s(this, Dn);
  }
  /** Channels of the preload script. */
  get channels() {
    return s(this, To);
  }
  /** Contexts of the preload script, if any */
  get contexts() {
    return s(this, No);
  }
  /** UserContexts of the preload script, if any */
  get userContexts() {
    return s(this, Oo);
  }
  /**
   * Adds the script to the given CDP targets by calling the
   * `Page.addScriptToEvaluateOnNewDocument` command.
   */
  async initInTargets(e, t) {
    await Promise.all(Array.from(e).map((r) => this.initInTarget(r, t)));
  }
  /**
   * Adds the script to the given CDP target by calling the
   * `Page.addScriptToEvaluateOnNewDocument` command.
   */
  async initInTarget(e, t) {
    const r = await e.cdpClient.sendCommand("Page.addScriptToEvaluateOnNewDocument", {
      source: m(this, eu, of).call(this),
      worldName: s(this, Do),
      runImmediately: t
    });
    s(this, ar).push({
      target: e,
      preloadScriptId: r.identifier
    }), s(this, Dn).add(e.id);
  }
  /**
   * Removes this script from all CDP targets.
   */
  async remove() {
    await Promise.all([
      s(this, ar).map(async (e) => {
        const t = e.target, r = e.preloadScriptId;
        return await t.cdpClient.sendCommand("Page.removeScriptToEvaluateOnNewDocument", {
          identifier: r
        });
      })
    ]);
  }
  /** Removes the provided cdp target from the list of cdp preload scripts. */
  dispose(e) {
    f(this, ar, s(this, ar).filter((t) => {
      var r;
      return ((r = t.target) == null ? void 0 : r.id) !== e;
    })), s(this, Dn).delete(e);
  }
}
Qc = new WeakMap(), ar = new WeakMap(), ko = new WeakMap(), Dn = new WeakMap(), To = new WeakMap(), Do = new WeakMap(), No = new WeakMap(), Oo = new WeakMap(), eu = new WeakSet(), /**
 * String to be evaluated. Wraps user-provided function so that the following
 * steps are run:
 * 1. Create channels.
 * 2. Store the created channels in window.
 * 3. Call the user-provided function with channels as arguments.
 */
of = function() {
  const e = `[${this.channels.map((t) => t.getEvalInWindowStr()).join(", ")}]`;
  return `(()=>{(${s(this, ko)})(...${e})})()`;
};
Wu.PreloadScript = jy;
Object.defineProperty(zu, "__esModule", { value: !0 });
zu.ScriptProcessor = void 0;
const bd = se, Uy = Wu;
var Nn, ut, cr, ur, Ro, Ao, js, af, bc;
class $y {
  constructor(e, t, r, n, o, a) {
    u(this, js);
    u(this, Nn);
    u(this, ut);
    u(this, cr);
    u(this, ur);
    u(this, Ro);
    u(this, Ao);
    f(this, ut, t), f(this, cr, r), f(this, ur, n), f(this, Ro, o), f(this, Ao, a), f(this, Nn, e), s(this, Nn).addSubscribeHook(bd.ChromiumBidi.Script.EventNames.RealmCreated, m(this, js, af).bind(this));
  }
  async addPreloadScript(e) {
    var c, p;
    if ((c = e.userContexts) != null && c.length && ((p = e.contexts) != null && p.length))
      throw new bd.InvalidArgumentException("Both userContexts and contexts cannot be specified.");
    const t = await s(this, Ro).verifyUserContextIdList(e.userContexts ?? []), r = s(this, ut).verifyTopLevelContextsList(e.contexts), n = new Uy.PreloadScript(e, s(this, Ao));
    s(this, ur).add(n);
    let o = [];
    t.size ? o = s(this, ut).getTopLevelContexts().filter((l) => t.has(l.userContext)) : r.size ? o = [...r.values()] : o = s(this, ut).getTopLevelContexts();
    const a = new Set(o.map((l) => l.cdpTarget));
    return await n.initInTargets(a, !1), {
      script: n.id
    };
  }
  async removePreloadScript(e) {
    const { script: t } = e;
    return await s(this, ur).getPreloadScript(t).remove(), s(this, ur).remove(t), {};
  }
  async callFunction(e) {
    return await (await m(this, js, bc).call(this, e.target)).callFunction(e.functionDeclaration, e.awaitPromise, e.this, e.arguments, e.resultOwnership, e.serializationOptions, e.userActivation);
  }
  async evaluate(e) {
    return await (await m(this, js, bc).call(this, e.target)).evaluate(e.expression, e.awaitPromise, e.resultOwnership, e.serializationOptions, e.userActivation);
  }
  async disown(e) {
    const t = await m(this, js, bc).call(this, e.target);
    return await Promise.all(e.handles.map(async (r) => await t.disown(r))), {};
  }
  getRealms(e) {
    return e.context !== void 0 && s(this, ut).getContext(e.context), { realms: s(this, cr).findRealms({
      browsingContextId: e.context,
      type: e.type,
      isHidden: !1
    }).map((r) => r.realmInfo) };
  }
}
Nn = new WeakMap(), ut = new WeakMap(), cr = new WeakMap(), ur = new WeakMap(), Ro = new WeakMap(), Ao = new WeakMap(), js = new WeakSet(), af = function(e) {
  const t = s(this, ut).getContext(e), r = [
    t,
    ...s(this, ut).getContext(e).allChildren
  ], n = /* @__PURE__ */ new Set();
  for (const o of r) {
    const a = s(this, cr).findRealms({
      browsingContextId: o.id
    });
    for (const c of a)
      n.add(c);
  }
  for (const o of n)
    s(this, Nn).registerEvent({
      type: "event",
      method: bd.ChromiumBidi.Script.EventNames.RealmCreated,
      params: o.realmInfo
    }, t.id);
  return Promise.resolve();
}, bc = async function(e) {
  return "context" in e ? await s(this, ut).getContext(e.context).getOrCreateUserSandbox(e.sandbox) : s(this, cr).getRealm({
    realmId: e.realm,
    isHidden: !1
  });
};
zu.ScriptProcessor = $y;
var Ku = {};
Object.defineProperty(Ku, "__esModule", { value: !0 });
Ku.SessionProcessor = void 0;
const Cd = se;
var dr, Bo, Fo, Mo, Ai, cf, uf;
class Ly {
  constructor(e, t, r) {
    u(this, Ai);
    u(this, dr);
    u(this, Bo);
    u(this, Fo);
    u(this, Mo, !1);
    f(this, dr, e), f(this, Bo, t), f(this, Fo, r);
  }
  status() {
    return { ready: !1, message: "already connected" };
  }
  async new(e) {
    if (s(this, Mo))
      throw new Error("Session has been already created.");
    f(this, Mo, !0);
    const t = m(this, Ai, cf).call(this, e.capabilities);
    await s(this, Fo).call(this, t);
    const r = await s(this, Bo).sendCommand("Browser.getVersion");
    return {
      sessionId: "unknown",
      capabilities: {
        ...t,
        acceptInsecureCerts: t.acceptInsecureCerts ?? !1,
        browserName: r.product,
        browserVersion: r.revision,
        platformName: "",
        setWindowRect: !1,
        webSocketUrl: "",
        userAgent: r.userAgent
      }
    };
  }
  async subscribe(e, t = null) {
    return {
      subscription: await s(this, dr).subscribe(e.events, e.contexts ?? [], e.userContexts ?? [], t)
    };
  }
  async unsubscribe(e, t = null) {
    return "subscriptions" in e ? (await s(this, dr).unsubscribeByIds(e.subscriptions), {}) : (await s(this, dr).unsubscribe(e.events, t), {});
  }
}
dr = new WeakMap(), Bo = new WeakMap(), Fo = new WeakMap(), Mo = new WeakMap(), Ai = new WeakSet(), cf = function(e) {
  const t = [];
  for (const n of e.firstMatch ?? [{}]) {
    const o = {
      ...e.alwaysMatch
    };
    for (const a of Object.keys(n)) {
      if (o[a] !== void 0)
        throw new Cd.InvalidArgumentException(`Capability ${a} in firstMatch is already defined in alwaysMatch`);
      o[a] = n[a];
    }
    t.push(o);
  }
  const r = t.find((n) => n.browserName === "chrome") ?? t[0] ?? {};
  return r.unhandledPromptBehavior = m(this, Ai, uf).call(this, r.unhandledPromptBehavior), r;
}, uf = function(e) {
  if (e !== void 0) {
    if (typeof e == "object")
      return e;
    if (typeof e != "string")
      throw new Cd.InvalidArgumentException(`Unexpected 'unhandledPromptBehavior' type: ${typeof e}`);
    switch (e) {
      case "accept":
      case "accept and notify":
        return {
          default: "accept",
          beforeUnload: "accept"
        };
      case "dismiss":
      case "dismiss and notify":
        return {
          default: "dismiss",
          beforeUnload: "accept"
        };
      case "ignore":
        return {
          default: "ignore",
          beforeUnload: "accept"
        };
      default:
        throw new Cd.InvalidArgumentException(`Unexpected 'unhandledPromptBehavior' value: ${e}`);
    }
  }
};
Ku.SessionProcessor = Ly;
var Vu = {};
Object.defineProperty(Vu, "__esModule", { value: !0 });
Vu.StorageProcessor = void 0;
const fc = se, qy = us, Uh = Te, Hy = Mi, Ki = ye;
var vs, jo, On, we, Cc, to, df, lf, xc, Jd;
class zy {
  constructor(e, t, r) {
    u(this, we);
    u(this, vs);
    u(this, jo);
    u(this, On);
    f(this, jo, t), f(this, vs, e), f(this, On, r);
  }
  async deleteCookies(e) {
    const t = m(this, we, xc).call(this, e.partition);
    let r;
    try {
      r = await s(this, vs).sendCommand("Storage.getCookies", {
        browserContextId: m(this, we, to).call(this, t)
      });
    } catch (o) {
      throw m(this, we, Cc).call(this, o) ? new fc.NoSuchUserContextException(o.message) : o;
    }
    const n = r.cookies.filter(
      // CDP's partition key is the source origin. If the request specifies the
      // `sourceOrigin` partition key, only cookies with the requested source origin
      // are returned.
      (o) => {
        var a;
        return t.sourceOrigin === void 0 || ((a = o.partitionKey) == null ? void 0 : a.topLevelSite) === t.sourceOrigin;
      }
    ).filter((o) => {
      const a = (0, Ki.cdpToBiDiCookie)(o);
      return m(this, we, Jd).call(this, a, e.filter);
    }).map((o) => ({
      ...o,
      // Set expiry to pass date to delete the cookie.
      expires: 1
    }));
    return await s(this, vs).sendCommand("Storage.setCookies", {
      cookies: n,
      browserContextId: m(this, we, to).call(this, t)
    }), {
      partitionKey: t
    };
  }
  async getCookies(e) {
    const t = m(this, we, xc).call(this, e.partition);
    let r;
    try {
      r = await s(this, vs).sendCommand("Storage.getCookies", {
        browserContextId: m(this, we, to).call(this, t)
      });
    } catch (o) {
      throw m(this, we, Cc).call(this, o) ? new fc.NoSuchUserContextException(o.message) : o;
    }
    return {
      cookies: r.cookies.filter(
        // CDP's partition key is the source origin. If the request specifies the
        // `sourceOrigin` partition key, only cookies with the requested source origin
        // are returned.
        (o) => {
          var a;
          return t.sourceOrigin === void 0 || ((a = o.partitionKey) == null ? void 0 : a.topLevelSite) === t.sourceOrigin;
        }
      ).map((o) => (0, Ki.cdpToBiDiCookie)(o)).filter((o) => m(this, we, Jd).call(this, o, e.filter)),
      partitionKey: t
    };
  }
  async setCookie(e) {
    var n;
    const t = m(this, we, xc).call(this, e.partition), r = (0, Ki.bidiToCdpCookie)(e, t);
    try {
      await s(this, vs).sendCommand("Storage.setCookies", {
        cookies: [r],
        browserContextId: m(this, we, to).call(this, t)
      });
    } catch (o) {
      throw m(this, we, Cc).call(this, o) ? new fc.NoSuchUserContextException(o.message) : ((n = s(this, On)) == null || n.call(this, Uh.LogType.debugError, o), new fc.UnableToSetCookieException(o.toString()));
    }
    return {
      partitionKey: t
    };
  }
}
vs = new WeakMap(), jo = new WeakMap(), On = new WeakMap(), we = new WeakSet(), Cc = function(e) {
  var t;
  return (t = e.message) == null ? void 0 : t.startsWith("Failed to find browser context for id");
}, to = function(e) {
  return e.userContext === "default" ? void 0 : e.userContext;
}, df = function(e) {
  const t = e.context;
  return {
    userContext: s(this, jo).getContext(t).userContext
  };
}, lf = function(e) {
  var o;
  const t = /* @__PURE__ */ new Map();
  let r = e.sourceOrigin;
  if (r !== void 0) {
    const a = Hy.NetworkProcessor.parseUrlString(r);
    a.origin === "null" ? r = a.origin : r = `${a.protocol}//${a.hostname}`;
  }
  for (const [a, c] of Object.entries(e))
    a !== void 0 && c !== void 0 && !["type", "sourceOrigin", "userContext"].includes(a) && t.set(a, c);
  return t.size > 0 && ((o = s(this, On)) == null || o.call(this, Uh.LogType.debugInfo, `Unsupported partition keys: ${JSON.stringify(Object.fromEntries(t))}`)), {
    userContext: e.userContext ?? "default",
    ...r === void 0 ? {} : { sourceOrigin: r }
  };
}, xc = function(e) {
  return e === void 0 ? { userContext: "default" } : e.type === "context" ? m(this, we, df).call(this, e) : ((0, qy.assert)(e.type === "storageKey", "Unknown partition type"), m(this, we, lf).call(this, e));
}, Jd = function(e, t) {
  return t === void 0 ? !0 : (t.domain === void 0 || t.domain === e.domain) && (t.name === void 0 || t.name === e.name) && // `value` contains fields `type` and `value`.
  (t.value === void 0 || (0, Ki.deserializeByteValue)(t.value) === (0, Ki.deserializeByteValue)(e.value)) && (t.path === void 0 || t.path === e.path) && (t.size === void 0 || t.size === e.size) && (t.httpOnly === void 0 || t.httpOnly === e.httpOnly) && (t.secure === void 0 || t.secure === e.secure) && (t.sameSite === void 0 || t.sameSite === e.sameSite) && (t.expiry === void 0 || t.expiry === e.expiry);
};
Vu.StorageProcessor = zy;
var Gu = {};
Object.defineProperty(Gu, "__esModule", { value: !0 });
Gu.WebExtensionProcessor = void 0;
const xd = se;
var Rn;
class Wy {
  constructor(e) {
    u(this, Rn);
    f(this, Rn, e);
  }
  async install(e) {
    switch (e.extensionData.type) {
      case "archivePath":
      case "base64":
        throw new xd.UnsupportedOperationException("Archived and Base64 extensions are not supported");
    }
    try {
      return {
        extension: (await s(this, Rn).sendCommand("Extensions.loadUnpacked", {
          path: e.extensionData.path
        })).id
      };
    } catch (t) {
      throw t.message.startsWith("invalid web extension") ? new xd.InvalidWebExtensionException(t.message) : t;
    }
  }
  async uninstall(e) {
    try {
      return await s(this, Rn).sendCommand("Extensions.uninstall", {
        id: e.extension
      }), {};
    } catch (t) {
      throw t.message === "Uninstall failed. Reason: could not find extension." ? new xd.NoSuchWebExtensionException("no such web extension") : t;
    }
  }
}
Rn = new WeakMap();
Gu.WebExtensionProcessor = Wy;
var ji = {};
Object.defineProperty(ji, "__esModule", { value: !0 });
ji.OutgoingMessage = void 0;
var Uo, $o;
const tu = class tu {
  constructor(e, t = null) {
    u(this, Uo);
    u(this, $o);
    f(this, Uo, e), f(this, $o, t);
  }
  static createFromPromise(e, t) {
    return e.then((r) => r.kind === "success" ? {
      kind: "success",
      value: new tu(r.value, t)
    } : r);
  }
  static createResolved(e, t = null) {
    return Promise.resolve({
      kind: "success",
      value: new tu(e, t)
    });
  }
  get message() {
    return s(this, Uo);
  }
  get googChannel() {
    return s(this, $o);
  }
};
Uo = new WeakMap(), $o = new WeakMap();
let Yd = tu;
ji.OutgoingMessage = Yd;
Object.defineProperty(Ou, "__esModule", { value: !0 });
Ou.CommandProcessor = void 0;
const en = se, Ky = qs, Vy = Te, Gy = Ru, Xy = Qa, Jy = Au, Yy = Bu, Zy = Xr, Qy = Fu, ev = Mi, tv = Hu, sv = zu, rv = Ku, nv = Vu, iv = Gu, Ed = ji;
var De, Lo, dt, Ne, lr, Me, hr, Ie, qo, It, bs, pr, An, F, Ho, Us, hf, Ec;
class ov extends Ky.EventEmitter {
  constructor(t, r, n, o, a, c, p, l, d, h, g = new Gy.BidiNoOpParser(), x, E) {
    super();
    u(this, Us);
    // keep-sorted start
    u(this, De);
    u(this, Lo);
    u(this, dt);
    u(this, Ne);
    u(this, lr);
    u(this, Me);
    u(this, hr);
    u(this, Ie);
    u(this, qo);
    u(this, It);
    u(this, bs);
    u(this, pr);
    u(this, An);
    // keep-sorted end
    u(this, F);
    u(this, Ho);
    f(this, Lo, r), f(this, F, g), f(this, Ho, E), f(this, De, d), f(this, dt, new Xy.BrowserProcessor(r, o, l, h)), f(this, Ne, new Yy.BrowsingContextProcessor(r, o, h, l, n)), f(this, lr, new Jy.CdpProcessor(o, a, t, r)), f(this, Me, new Zy.EmulationProcessor(o, h, l)), f(this, hr, new Qy.InputProcessor(o)), f(this, Ie, new ev.NetworkProcessor(o, p, h, l)), f(this, qo, new tv.PermissionsProcessor(r)), f(this, It, new sv.ScriptProcessor(n, o, a, c, h, E)), f(this, bs, new rv.SessionProcessor(n, r, x)), f(this, pr, new nv.StorageProcessor(r, o, E)), f(this, An, new iv.WebExtensionProcessor(r));
  }
  async processCommand(t) {
    var r;
    try {
      const n = await m(this, Us, hf).call(this, t), o = {
        type: "success",
        id: t.id,
        result: n
      };
      this.emit("response", {
        message: Ed.OutgoingMessage.createResolved(o, t["goog:channel"]),
        event: t.method
      });
    } catch (n) {
      if (n instanceof en.Exception)
        this.emit("response", {
          message: Ed.OutgoingMessage.createResolved(n.toErrorResponse(t.id), t["goog:channel"]),
          event: t.method
        });
      else {
        const o = n;
        (r = s(this, Ho)) == null || r.call(this, Vy.LogType.bidi, o);
        const a = s(this, Lo).isCloseError(n) ? new en.NoSuchFrameException("Browsing context is gone") : new en.UnknownErrorException(o.message, o.stack);
        this.emit("response", {
          message: Ed.OutgoingMessage.createResolved(a.toErrorResponse(t.id), t["goog:channel"]),
          event: t.method
        });
      }
    }
  }
}
De = new WeakMap(), Lo = new WeakMap(), dt = new WeakMap(), Ne = new WeakMap(), lr = new WeakMap(), Me = new WeakMap(), hr = new WeakMap(), Ie = new WeakMap(), qo = new WeakMap(), It = new WeakMap(), bs = new WeakMap(), pr = new WeakMap(), An = new WeakMap(), F = new WeakMap(), Ho = new WeakMap(), Us = new WeakSet(), hf = async function(t) {
  switch (t.method) {
    case "bluetooth.disableSimulation":
      return await s(this, De).disableSimulation(s(this, F).parseDisableSimulationParameters(t.params));
    case "bluetooth.handleRequestDevicePrompt":
      return await s(this, De).handleRequestDevicePrompt(s(this, F).parseHandleRequestDevicePromptParams(t.params));
    case "bluetooth.simulateAdapter":
      return await s(this, De).simulateAdapter(s(this, F).parseSimulateAdapterParameters(t.params));
    case "bluetooth.simulateAdvertisement":
      return await s(this, De).simulateAdvertisement(s(this, F).parseSimulateAdvertisementParameters(t.params));
    case "bluetooth.simulateCharacteristic":
      return await s(this, De).simulateCharacteristic(s(this, F).parseSimulateCharacteristicParameters(t.params));
    case "bluetooth.simulateCharacteristicResponse":
      return await s(this, De).simulateCharacteristicResponse(s(this, F).parseSimulateCharacteristicResponseParameters(t.params));
    case "bluetooth.simulateDescriptor":
      return await s(this, De).simulateDescriptor(s(this, F).parseSimulateDescriptorParameters(t.params));
    case "bluetooth.simulateDescriptorResponse":
      return await s(this, De).simulateDescriptorResponse(s(this, F).parseSimulateDescriptorResponseParameters(t.params));
    case "bluetooth.simulateGattConnectionResponse":
      return await s(this, De).simulateGattConnectionResponse(s(this, F).parseSimulateGattConnectionResponseParameters(t.params));
    case "bluetooth.simulateGattDisconnection":
      return await s(this, De).simulateGattDisconnection(s(this, F).parseSimulateGattDisconnectionParameters(t.params));
    case "bluetooth.simulatePreconnectedPeripheral":
      return await s(this, De).simulatePreconnectedPeripheral(s(this, F).parseSimulatePreconnectedPeripheralParameters(t.params));
    case "bluetooth.simulateService":
      return await s(this, De).simulateService(s(this, F).parseSimulateServiceParameters(t.params));
    case "browser.close":
      return s(this, dt).close();
    case "browser.createUserContext":
      return await s(this, dt).createUserContext(s(this, F).parseCreateUserContextParameters(t.params));
    case "browser.getClientWindows":
      return await s(this, dt).getClientWindows();
    case "browser.getUserContexts":
      return await s(this, dt).getUserContexts();
    case "browser.removeUserContext":
      return await s(this, dt).removeUserContext(s(this, F).parseRemoveUserContextParameters(t.params));
    case "browser.setClientWindowState":
      return await s(this, dt).setClientWindowState(s(this, F).parseSetClientWindowStateParameters(t.params));
    case "browser.setDownloadBehavior":
      return await s(this, dt).setDownloadBehavior(s(this, F).parseSetDownloadBehaviorParameters(t.params));
    case "browsingContext.activate":
      return await s(this, Ne).activate(s(this, F).parseActivateParams(t.params));
    case "browsingContext.captureScreenshot":
      return await s(this, Ne).captureScreenshot(s(this, F).parseCaptureScreenshotParams(t.params));
    case "browsingContext.close":
      return await s(this, Ne).close(s(this, F).parseCloseParams(t.params));
    case "browsingContext.create":
      return await s(this, Ne).create(s(this, F).parseCreateParams(t.params));
    case "browsingContext.getTree":
      return s(this, Ne).getTree(s(this, F).parseGetTreeParams(t.params));
    case "browsingContext.handleUserPrompt":
      return await s(this, Ne).handleUserPrompt(s(this, F).parseHandleUserPromptParams(t.params));
    case "browsingContext.locateNodes":
      return await s(this, Ne).locateNodes(s(this, F).parseLocateNodesParams(t.params));
    case "browsingContext.navigate":
      return await s(this, Ne).navigate(s(this, F).parseNavigateParams(t.params));
    case "browsingContext.print":
      return await s(this, Ne).print(s(this, F).parsePrintParams(t.params));
    case "browsingContext.reload":
      return await s(this, Ne).reload(s(this, F).parseReloadParams(t.params));
    case "browsingContext.setViewport":
      return await s(this, Ne).setViewport(s(this, F).parseSetViewportParams(t.params));
    case "browsingContext.traverseHistory":
      return await s(this, Ne).traverseHistory(s(this, F).parseTraverseHistoryParams(t.params));
    case "goog:cdp.getSession":
      return s(this, lr).getSession(s(this, F).parseGetSessionParams(t.params));
    case "goog:cdp.resolveRealm":
      return s(this, lr).resolveRealm(s(this, F).parseResolveRealmParams(t.params));
    case "goog:cdp.sendCommand":
      return await s(this, lr).sendCommand(s(this, F).parseSendCommandParams(t.params));
    case "emulation.setForcedColorsModeThemeOverride":
      throw s(this, F).parseSetForcedColorsModeThemeOverrideParams(t.params), new en.UnsupportedOperationException(`Method ${t.method} is not implemented.`);
    case "emulation.setGeolocationOverride":
      return await s(this, Me).setGeolocationOverride(s(this, F).parseSetGeolocationOverrideParams(t.params));
    case "emulation.setLocaleOverride":
      return await s(this, Me).setLocaleOverride(s(this, F).parseSetLocaleOverrideParams(t.params));
    case "emulation.setNetworkConditions":
      return await s(this, Me).setNetworkConditions(s(this, F).parseSetNetworkConditionsParams(t.params));
    case "emulation.setScreenOrientationOverride":
      return await s(this, Me).setScreenOrientationOverride(s(this, F).parseSetScreenOrientationOverrideParams(t.params));
    case "emulation.setScreenSettingsOverride":
      return await s(this, Me).setScreenSettingsOverride(s(this, F).parseSetScreenSettingsOverrideParams(t.params));
    case "emulation.setScriptingEnabled":
      return await s(this, Me).setScriptingEnabled(s(this, F).parseSetScriptingEnabledParams(t.params));
    case "emulation.setTimezoneOverride":
      return await s(this, Me).setTimezoneOverride(s(this, F).parseSetTimezoneOverrideParams(t.params));
    case "emulation.setTouchOverride":
      return await s(this, Me).setTouchOverride(s(this, F).parseSetTouchOverrideParams(t.params));
    case "emulation.setUserAgentOverride":
      return await s(this, Me).setUserAgentOverrideParams(s(this, F).parseSetUserAgentOverrideParams(t.params));
    case "userAgentClientHints.setClientHintsOverride":
      return await s(this, Me).setClientHintsOverride(s(this, F).parseSetClientHintsOverrideParams(t.params));
    case "input.performActions":
      return await s(this, hr).performActions(s(this, F).parsePerformActionsParams(t.params));
    case "input.releaseActions":
      return await s(this, hr).releaseActions(s(this, F).parseReleaseActionsParams(t.params));
    case "input.setFiles":
      return await s(this, hr).setFiles(s(this, F).parseSetFilesParams(t.params));
    case "network.addDataCollector":
      return await s(this, Ie).addDataCollector(s(this, F).parseAddDataCollectorParams(t.params));
    case "network.addIntercept":
      return await s(this, Ie).addIntercept(s(this, F).parseAddInterceptParams(t.params));
    case "network.continueRequest":
      return await s(this, Ie).continueRequest(s(this, F).parseContinueRequestParams(t.params));
    case "network.continueResponse":
      return await s(this, Ie).continueResponse(s(this, F).parseContinueResponseParams(t.params));
    case "network.continueWithAuth":
      return await s(this, Ie).continueWithAuth(s(this, F).parseContinueWithAuthParams(t.params));
    case "network.disownData":
      return s(this, Ie).disownData(s(this, F).parseDisownDataParams(t.params));
    case "network.failRequest":
      return await s(this, Ie).failRequest(s(this, F).parseFailRequestParams(t.params));
    case "network.getData":
      return await s(this, Ie).getData(s(this, F).parseGetDataParams(t.params));
    case "network.provideResponse":
      return await s(this, Ie).provideResponse(s(this, F).parseProvideResponseParams(t.params));
    case "network.removeDataCollector":
      return await s(this, Ie).removeDataCollector(s(this, F).parseRemoveDataCollectorParams(t.params));
    case "network.removeIntercept":
      return await s(this, Ie).removeIntercept(s(this, F).parseRemoveInterceptParams(t.params));
    case "network.setCacheBehavior":
      return await s(this, Ie).setCacheBehavior(s(this, F).parseSetCacheBehaviorParams(t.params));
    case "network.setExtraHeaders":
      return await s(this, Ie).setExtraHeaders(s(this, F).parseSetExtraHeadersParams(t.params));
    case "permissions.setPermission":
      return await s(this, qo).setPermissions(s(this, F).parseSetPermissionsParams(t.params));
    case "script.addPreloadScript":
      return await s(this, It).addPreloadScript(s(this, F).parseAddPreloadScriptParams(t.params));
    case "script.callFunction":
      return await s(this, It).callFunction(s(this, F).parseCallFunctionParams(m(this, Us, Ec).call(this, t.params)));
    case "script.disown":
      return await s(this, It).disown(s(this, F).parseDisownParams(m(this, Us, Ec).call(this, t.params)));
    case "script.evaluate":
      return await s(this, It).evaluate(s(this, F).parseEvaluateParams(m(this, Us, Ec).call(this, t.params)));
    case "script.getRealms":
      return s(this, It).getRealms(s(this, F).parseGetRealmsParams(t.params));
    case "script.removePreloadScript":
      return await s(this, It).removePreloadScript(s(this, F).parseRemovePreloadScriptParams(t.params));
    case "session.end":
      throw new en.UnsupportedOperationException(`Method ${t.method} is not implemented.`);
    case "session.new":
      return await s(this, bs).new(t.params);
    case "session.status":
      return s(this, bs).status();
    case "session.subscribe":
      return await s(this, bs).subscribe(s(this, F).parseSubscribeParams(t.params), t["goog:channel"]);
    case "session.unsubscribe":
      return await s(this, bs).unsubscribe(s(this, F).parseUnsubscribeParams(t.params), t["goog:channel"]);
    case "storage.deleteCookies":
      return await s(this, pr).deleteCookies(s(this, F).parseDeleteCookiesParams(t.params));
    case "storage.getCookies":
      return await s(this, pr).getCookies(s(this, F).parseGetCookiesParams(t.params));
    case "storage.setCookie":
      return await s(this, pr).setCookie(s(this, F).parseSetCookieParams(t.params));
    case "webExtension.install":
      return await s(this, An).install(s(this, F).parseInstallParams(t.params));
    case "webExtension.uninstall":
      return await s(this, An).uninstall(s(this, F).parseUninstallParams(t.params));
  }
  throw new en.UnknownCommandException(`Unknown command '${t == null ? void 0 : t.method}'.`);
}, // Workaround for as zod.union always take the first schema
// https://github.com/w3c/webdriver-bidi/issues/635
Ec = function(t) {
  return typeof t == "object" && t && "target" in t && typeof t.target == "object" && t.target && "context" in t.target && delete t.target.realm, t;
};
Ou.CommandProcessor = ov;
var Xu = {};
Object.defineProperty(Xu, "__esModule", { value: !0 });
Xu.BluetoothProcessor = void 0;
const Fe = se;
class th {
  constructor(e, t) {
    O(this, "id");
    O(this, "uuid");
    this.id = e, this.uuid = t;
  }
}
class av extends th {
  constructor(t, r, n) {
    super(t, r);
    O(this, "characteristic");
    this.characteristic = n;
  }
}
class cv extends th {
  constructor(t, r, n) {
    super(t, r);
    O(this, "descriptors", /* @__PURE__ */ new Map());
    O(this, "service");
    this.service = n;
  }
}
class uv extends th {
  constructor(t, r, n) {
    super(t, r);
    O(this, "characteristics", /* @__PURE__ */ new Map());
    O(this, "device");
    this.device = n;
  }
}
class dv {
  constructor(e) {
    O(this, "address");
    O(this, "services", /* @__PURE__ */ new Map());
    this.address = e;
  }
}
var Cs, Oe, xs, Jt, Yt, ge, dn, ln, so, Zd;
class lv {
  constructor(e, t) {
    u(this, ge);
    u(this, Cs);
    u(this, Oe);
    u(this, xs, /* @__PURE__ */ new Map());
    // A map from a characteristic id from CDP to its BluetoothCharacteristic object.
    u(this, Jt, /* @__PURE__ */ new Map());
    // A map from a descriptor id from CDP to its BluetoothDescriptor object.
    u(this, Yt, /* @__PURE__ */ new Map());
    f(this, Cs, e), f(this, Oe, t);
  }
  async simulateAdapter(e) {
    if (e.state === void 0)
      throw new Fe.InvalidArgumentException('Parameter "state" is required for creating a Bluetooth adapter');
    const t = s(this, Oe).getContext(e.context);
    return await t.cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.disable"), s(this, xs).clear(), s(this, Jt).clear(), s(this, Yt).clear(), await t.cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.enable", {
      state: e.state,
      leSupported: e.leSupported ?? !0
    }), {};
  }
  async disableSimulation(e) {
    return await s(this, Oe).getContext(e.context).cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.disable"), s(this, xs).clear(), s(this, Jt).clear(), s(this, Yt).clear(), {};
  }
  async simulatePreconnectedPeripheral(e) {
    if (s(this, xs).has(e.address))
      throw new Fe.InvalidArgumentException(`Bluetooth device with address ${e.address} already exists`);
    return await s(this, Oe).getContext(e.context).cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.simulatePreconnectedPeripheral", {
      address: e.address,
      name: e.name,
      knownServiceUuids: e.knownServiceUuids,
      manufacturerData: e.manufacturerData
    }), s(this, xs).set(e.address, new dv(e.address)), {};
  }
  async simulateAdvertisement(e) {
    return await s(this, Oe).getContext(e.context).cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.simulateAdvertisement", {
      entry: e.scanEntry
    }), {};
  }
  async simulateCharacteristic(e) {
    const t = m(this, ge, dn).call(this, e.address), r = m(this, ge, ln).call(this, t, e.serviceUuid), n = s(this, Oe).getContext(e.context);
    switch (e.type) {
      case "add": {
        if (e.characteristicProperties === void 0)
          throw new Fe.InvalidArgumentException('Parameter "characteristicProperties" is required for adding a Bluetooth characteristic');
        if (r.characteristics.has(e.characteristicUuid))
          throw new Fe.InvalidArgumentException(`Characteristic with UUID ${e.characteristicUuid} already exists`);
        const o = await n.cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.addCharacteristic", {
          serviceId: r.id,
          characteristicUuid: e.characteristicUuid,
          properties: e.characteristicProperties
        }), a = new cv(o.characteristicId, e.characteristicUuid, r);
        return r.characteristics.set(e.characteristicUuid, a), s(this, Jt).set(a.id, a), {};
      }
      case "remove": {
        if (e.characteristicProperties !== void 0)
          throw new Fe.InvalidArgumentException('Parameter "characteristicProperties" should not be provided for removing a Bluetooth characteristic');
        const o = m(this, ge, so).call(this, r, e.characteristicUuid);
        return await n.cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.removeCharacteristic", {
          characteristicId: o.id
        }), r.characteristics.delete(e.characteristicUuid), s(this, Jt).delete(o.id), {};
      }
      default:
        throw new Fe.InvalidArgumentException(`Parameter "type" of ${e.type} is not supported`);
    }
  }
  async simulateCharacteristicResponse(e) {
    const t = s(this, Oe).getContext(e.context), r = m(this, ge, dn).call(this, e.address), n = m(this, ge, ln).call(this, r, e.serviceUuid), o = m(this, ge, so).call(this, n, e.characteristicUuid);
    return await t.cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.simulateCharacteristicOperationResponse", {
      characteristicId: o.id,
      type: e.type,
      code: e.code,
      ...e.data && {
        data: btoa(String.fromCharCode(...e.data))
      }
    }), {};
  }
  async simulateDescriptor(e) {
    const t = m(this, ge, dn).call(this, e.address), r = m(this, ge, ln).call(this, t, e.serviceUuid), n = m(this, ge, so).call(this, r, e.characteristicUuid), o = s(this, Oe).getContext(e.context);
    switch (e.type) {
      case "add": {
        if (n.descriptors.has(e.descriptorUuid))
          throw new Fe.InvalidArgumentException(`Descriptor with UUID ${e.descriptorUuid} already exists`);
        const a = await o.cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.addDescriptor", {
          characteristicId: n.id,
          descriptorUuid: e.descriptorUuid
        }), c = new av(a.descriptorId, e.descriptorUuid, n);
        return n.descriptors.set(e.descriptorUuid, c), s(this, Yt).set(c.id, c), {};
      }
      case "remove": {
        const a = m(this, ge, Zd).call(this, n, e.descriptorUuid);
        return await o.cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.removeDescriptor", {
          descriptorId: a.id
        }), n.descriptors.delete(e.descriptorUuid), s(this, Yt).delete(a.id), {};
      }
      default:
        throw new Fe.InvalidArgumentException(`Parameter "type" of ${e.type} is not supported`);
    }
  }
  async simulateDescriptorResponse(e) {
    const t = s(this, Oe).getContext(e.context), r = m(this, ge, dn).call(this, e.address), n = m(this, ge, ln).call(this, r, e.serviceUuid), o = m(this, ge, so).call(this, n, e.characteristicUuid), a = m(this, ge, Zd).call(this, o, e.descriptorUuid);
    return await t.cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.simulateDescriptorOperationResponse", {
      descriptorId: a.id,
      type: e.type,
      code: e.code,
      ...e.data && {
        data: btoa(String.fromCharCode(...e.data))
      }
    }), {};
  }
  async simulateGattConnectionResponse(e) {
    return await s(this, Oe).getContext(e.context).cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.simulateGATTOperationResponse", {
      address: e.address,
      type: "connection",
      code: e.code
    }), {};
  }
  async simulateGattDisconnection(e) {
    return await s(this, Oe).getContext(e.context).cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.simulateGATTDisconnection", {
      address: e.address
    }), {};
  }
  async simulateService(e) {
    const t = m(this, ge, dn).call(this, e.address), r = s(this, Oe).getContext(e.context);
    switch (e.type) {
      case "add": {
        if (t.services.has(e.uuid))
          throw new Fe.InvalidArgumentException(`Service with UUID ${e.uuid} already exists`);
        const n = await r.cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.addService", {
          address: e.address,
          serviceUuid: e.uuid
        });
        return t.services.set(e.uuid, new uv(n.serviceId, e.uuid, t)), {};
      }
      case "remove": {
        const n = m(this, ge, ln).call(this, t, e.uuid);
        return await r.cdpTarget.browserCdpClient.sendCommand("BluetoothEmulation.removeService", {
          serviceId: n.id
        }), t.services.delete(e.uuid), {};
      }
      default:
        throw new Fe.InvalidArgumentException(`Parameter "type" of ${e.type} is not supported`);
    }
  }
  onCdpTargetCreated(e) {
    e.cdpClient.on("DeviceAccess.deviceRequestPrompted", (t) => {
      s(this, Cs).registerEvent({
        type: "event",
        method: "bluetooth.requestDevicePromptUpdated",
        params: {
          context: e.id,
          prompt: t.id,
          devices: t.devices
        }
      }, e.id);
    }), e.browserCdpClient.on("BluetoothEmulation.gattOperationReceived", async (t) => {
      switch (t.type) {
        case "connection":
          s(this, Cs).registerEvent({
            type: "event",
            method: "bluetooth.gattConnectionAttempted",
            params: {
              context: e.id,
              address: t.address
            }
          }, e.id);
          return;
        case "discovery":
          await e.browserCdpClient.sendCommand("BluetoothEmulation.simulateGATTOperationResponse", {
            address: t.address,
            type: "discovery",
            code: 0
          });
      }
    }), e.browserCdpClient.on("BluetoothEmulation.characteristicOperationReceived", (t) => {
      if (!s(this, Jt).has(t.characteristicId))
        return;
      let r;
      if (t.type === "write") {
        if (t.writeType === "write-default-deprecated")
          return;
        r = t.writeType;
      } else
        r = t.type;
      const n = s(this, Jt).get(t.characteristicId);
      s(this, Cs).registerEvent({
        type: "event",
        method: "bluetooth.characteristicEventGenerated",
        params: {
          context: e.id,
          address: n.service.device.address,
          serviceUuid: n.service.uuid,
          characteristicUuid: n.uuid,
          type: r,
          ...t.data && {
            data: Array.from(atob(t.data), (o) => o.charCodeAt(0))
          }
        }
      }, e.id);
    }), e.browserCdpClient.on("BluetoothEmulation.descriptorOperationReceived", (t) => {
      if (!s(this, Yt).has(t.descriptorId))
        return;
      const r = s(this, Yt).get(t.descriptorId);
      s(this, Cs).registerEvent({
        type: "event",
        method: "bluetooth.descriptorEventGenerated",
        params: {
          context: e.id,
          address: r.characteristic.service.device.address,
          serviceUuid: r.characteristic.service.uuid,
          characteristicUuid: r.characteristic.uuid,
          descriptorUuid: r.uuid,
          type: t.type,
          ...t.data && {
            data: Array.from(atob(t.data), (n) => n.charCodeAt(0))
          }
        }
      }, e.id);
    });
  }
  async handleRequestDevicePrompt(e) {
    const t = s(this, Oe).getContext(e.context);
    return e.accept ? await t.cdpTarget.cdpClient.sendCommand("DeviceAccess.selectPrompt", {
      id: e.prompt,
      deviceId: e.device
    }) : await t.cdpTarget.cdpClient.sendCommand("DeviceAccess.cancelPrompt", {
      id: e.prompt
    }), {};
  }
}
Cs = new WeakMap(), Oe = new WeakMap(), xs = new WeakMap(), Jt = new WeakMap(), Yt = new WeakMap(), ge = new WeakSet(), dn = function(e) {
  const t = s(this, xs).get(e);
  if (!t)
    throw new Fe.InvalidArgumentException(`Bluetooth device with address ${e} does not exist`);
  return t;
}, ln = function(e, t) {
  const r = e.services.get(t);
  if (!r)
    throw new Fe.InvalidArgumentException(`Service with UUID ${t} on device ${e.address} does not exist`);
  return r;
}, so = function(e, t) {
  const r = e.characteristics.get(t);
  if (!r)
    throw new Fe.InvalidArgumentException(`Characteristic with UUID ${t} does not exist for service ${e.uuid} on device ${e.device.address}`);
  return r;
}, Zd = function(e, t) {
  const r = e.descriptors.get(t);
  if (!r)
    throw new Fe.InvalidArgumentException(`Descriptor with UUID ${t} does not exist for characteristic ${e.uuid} on service ${e.service.uuid} on device ${e.service.device.address}`);
  return r;
};
Xu.BluetoothProcessor = lv;
var Ju = {}, Yu = {};
Object.defineProperty(Yu, "__esModule", { value: !0 });
Yu.ContextConfig = void 0;
class sh {
  constructor() {
    // keep-sorted start block=yes
    O(this, "acceptInsecureCerts");
    O(this, "clientHints");
    O(this, "devicePixelRatio");
    O(this, "disableNetworkDurableMessages");
    O(this, "downloadBehavior");
    O(this, "emulatedNetworkConditions");
    // Extra headers are kept in CDP format.
    O(this, "extraHeaders");
    O(this, "geolocation");
    O(this, "locale");
    O(this, "maxTouchPoints");
    O(this, "prerenderingDisabled");
    O(this, "screenArea");
    O(this, "screenOrientation");
    O(this, "scriptingEnabled");
    // Timezone is kept in CDP format with GMT prefix for offset values.
    O(this, "timezone");
    O(this, "userAgent");
    O(this, "userPromptHandler");
    O(this, "viewport");
  }
  // keep-sorted end
  /**
   * Merges multiple `ContextConfig` objects. The configs are merged in the order they are
   * provided. For each property, the value from the last config that defines it will be
   * used. The final result will not contain any `undefined` or `null` properties.
   * `undefined` values are ignored. `null` values remove the already set value.
   */
  static merge(...e) {
    const t = new sh();
    for (const r of e)
      if (r)
        for (const n in r) {
          const o = r[n];
          o === null ? delete t[n] : o !== void 0 && (t[n] = o);
        }
    return t;
  }
}
Yu.ContextConfig = sh;
Object.defineProperty(Ju, "__esModule", { value: !0 });
Ju.ContextConfigStorage = void 0;
const tn = Yu;
var Es, fr, mr, su, pf;
class hv {
  constructor() {
    u(this, su);
    u(this, Es, new tn.ContextConfig());
    u(this, fr, /* @__PURE__ */ new Map());
    u(this, mr, /* @__PURE__ */ new Map());
  }
  /**
   * Updates the global configuration. Properties with `undefined` values in the
   * provided `config` are ignored.
   */
  updateGlobalConfig(e) {
    f(this, Es, tn.ContextConfig.merge(s(this, Es), e));
  }
  /**
   * Updates the configuration for a specific browsing context. Properties with
   * `undefined` values in the provided `config` are ignored.
   */
  updateBrowsingContextConfig(e, t) {
    s(this, mr).set(e, tn.ContextConfig.merge(s(this, mr).get(e), t));
  }
  /**
   * Updates the configuration for a specific user context. Properties with
   * `undefined` values in the provided `config` are ignored.
   */
  updateUserContextConfig(e, t) {
    s(this, fr).set(e, tn.ContextConfig.merge(s(this, fr).get(e), t));
  }
  /**
   * Returns the current global configuration.
   */
  getGlobalConfig() {
    return s(this, Es);
  }
  /**
   * Calculates the active configuration by merging global, user context, and
   * browsing context settings.
   */
  getActiveConfig(e, t) {
    let r = tn.ContextConfig.merge(s(this, Es), s(this, fr).get(t));
    e !== void 0 && (r = tn.ContextConfig.merge(r, s(this, mr).get(e)));
    const n = m(this, su, pf).call(this, e, t);
    return r.extraHeaders = Object.keys(n).length > 0 ? n : void 0, r;
  }
}
Es = new WeakMap(), fr = new WeakMap(), mr = new WeakMap(), su = new WeakSet(), /**
 * Extra headers is a special case. The headers from the different levels have to be
 * merged instead of being overridden.
 */
pf = function(e, t) {
  var a, c;
  const r = s(this, Es).extraHeaders ?? {}, n = ((a = s(this, fr).get(t)) == null ? void 0 : a.extraHeaders) ?? {}, o = e === void 0 ? {} : ((c = s(this, mr).get(e)) == null ? void 0 : c.extraHeaders) ?? {};
  return { ...r, ...n, ...o };
};
Ju.ContextConfigStorage = hv;
var Zu = {};
Object.defineProperty(Zu, "__esModule", { value: !0 });
Zu.UserContextStorage = void 0;
const pv = se;
var zo;
class fv {
  constructor(e) {
    u(this, zo);
    f(this, zo, e);
  }
  async getUserContexts() {
    const e = await s(this, zo).sendCommand("Target.getBrowserContexts");
    return [
      {
        userContext: "default"
      },
      ...e.browserContextIds.map((t) => ({
        userContext: t
      }))
    ];
  }
  async verifyUserContextIdList(e) {
    const t = /* @__PURE__ */ new Set();
    if (!e.length)
      return t;
    const r = await this.getUserContexts(), n = new Set(r.map((o) => o.userContext));
    for (const o of e) {
      if (!n.has(o))
        throw new pv.NoSuchUserContextException(`User context ${o} not found`);
      t.add(o);
    }
    return t;
  }
}
zo = new WeakMap();
Zu.UserContextStorage = fv;
var Qu = {}, Ui = {}, Jr = {};
Object.defineProperty(Jr, "__esModule", { value: !0 });
Jr.Deferred = void 0;
var wp, Zt, Ss, Wo, Ko, Vo;
wp = Symbol.toStringTag;
class mv {
  constructor() {
    u(this, Zt, !1);
    u(this, Ss);
    u(this, Wo);
    u(this, Ko);
    u(this, Vo);
    O(this, wp, "Promise");
    f(this, Ss, new Promise((e, t) => {
      f(this, Ko, e), f(this, Vo, t);
    })), s(this, Ss).catch((e) => {
    });
  }
  get isFinished() {
    return s(this, Zt);
  }
  get result() {
    if (!s(this, Zt))
      throw new Error("Deferred is not finished yet");
    return s(this, Wo);
  }
  then(e, t) {
    return s(this, Ss).then(e, t);
  }
  catch(e) {
    return s(this, Ss).catch(e);
  }
  resolve(e) {
    f(this, Wo, e), s(this, Zt) || (f(this, Zt, !0), s(this, Ko).call(this, e));
  }
  reject(e) {
    s(this, Zt) || (f(this, Zt, !0), s(this, Vo).call(this, e));
  }
  finally(e) {
    return s(this, Ss).finally(e);
  }
}
Zt = new WeakMap(), Ss = new WeakMap(), Wo = new WeakMap(), Ko = new WeakMap(), Vo = new WeakMap();
Jr.Deferred = mv;
var ed = {};
Object.defineProperty(ed, "__esModule", { value: !0 });
ed.getTimestamp = gv;
function gv() {
  return (/* @__PURE__ */ new Date()).getTime();
}
var rh = {};
Object.defineProperty(rh, "__esModule", { value: !0 });
rh.inchesFromCm = wv;
function wv(i) {
  return i / 2.54;
}
var sc = {};
Object.defineProperty(sc, "__esModule", { value: !0 });
sc.getSharedId = vv;
sc.parseSharedId = Cv;
const yv = "_element_";
function vv(i, e, t) {
  return `f.${i}.d.${e}.e.${t}`;
}
function bv(i) {
  const e = i.match(new RegExp(`(.*)${yv}(.*)`));
  if (!e)
    return null;
  const t = e[1], r = e[2];
  if (t === void 0 || r === void 0)
    return null;
  const n = parseInt(r ?? "");
  return isNaN(n) ? null : {
    documentId: t,
    backendNodeId: n
  };
}
function Cv(i) {
  const e = bv(i);
  if (e !== null)
    return { ...e, frameId: void 0 };
  const t = i.match(/f\.(.*)\.d\.(.*)\.e\.([0-9]*)/);
  if (!t)
    return null;
  const r = t[1], n = t[2], o = t[3];
  if (r === void 0 || n === void 0 || o === void 0)
    return null;
  const a = parseInt(o ?? "");
  return isNaN(a) ? null : {
    frameId: r,
    documentId: n,
    backendNodeId: a
  };
}
var rc = {}, nc = {};
Object.defineProperty(nc, "__esModule", { value: !0 });
nc.Realm = void 0;
const mc = se, xv = Te, Ev = qt, Sv = tc;
var Go, gr, Xo, Bn, Jo, Yo, Ce, Qd, vt, wt, ff, el, tl, mf, sl, rl, gf, wf, nl;
let Pv = (wt = class {
  constructor(e, t, r, n, o, a, c) {
    u(this, Ce);
    u(this, Go);
    u(this, gr);
    u(this, Xo);
    u(this, Bn);
    u(this, Jo);
    u(this, Yo);
    O(this, "realmStorage");
    f(this, Go, e), f(this, gr, t), f(this, Xo, r), f(this, Bn, n), f(this, Jo, o), f(this, Yo, a), this.realmStorage = c, this.realmStorage.addRealm(this);
  }
  cdpToBidiValue(e, t) {
    const r = this.serializeForBiDi(e.result.deepSerializedValue, /* @__PURE__ */ new Map());
    if (e.result.objectId) {
      const n = e.result.objectId;
      t === "root" ? (r.handle = n, this.realmStorage.knownHandlesToRealmMap.set(n, this.realmId)) : m(this, Ce, nl).call(this, n).catch((o) => {
        var a;
        return (a = s(this, Bn)) == null ? void 0 : a.call(this, xv.LogType.debugError, o);
      });
    }
    return r;
  }
  isHidden() {
    return !1;
  }
  /**
   * Relies on the CDP to implement proper BiDi serialization, except:
   * * CDP integer property `backendNodeId` is replaced with `sharedId` of
   * `{documentId}_element_{backendNodeId}`;
   * * CDP integer property `weakLocalObjectReference` is replaced with UUID `internalId`
   * using unique-per serialization `internalIdMap`.
   * * CDP type `platformobject` is replaced with `object`.
   * @param deepSerializedValue - CDP value to be converted to BiDi.
   * @param internalIdMap - Map from CDP integer `weakLocalObjectReference` to BiDi UUID
   * `internalId`.
   */
  serializeForBiDi(e, t) {
    if (Object.hasOwn(e, "weakLocalObjectReference")) {
      const n = e.weakLocalObjectReference;
      t.has(n) || t.set(n, (0, Ev.uuidv4)()), e.internalId = t.get(n), delete e.weakLocalObjectReference;
    }
    if (e.type === "node" && e.value && Object.hasOwn(e.value, "frameId") && delete e.value.frameId, e.type === "platformobject")
      return { type: "object" };
    const r = e.value;
    if (r === void 0)
      return e;
    if (["array", "set", "htmlcollection", "nodelist"].includes(e.type))
      for (const n in r)
        r[n] = this.serializeForBiDi(r[n], t);
    if (["object", "map"].includes(e.type))
      for (const n in r)
        r[n] = [
          this.serializeForBiDi(r[n][0], t),
          this.serializeForBiDi(r[n][1], t)
        ];
    return e;
  }
  get realmId() {
    return s(this, Yo);
  }
  get executionContextId() {
    return s(this, Xo);
  }
  get origin() {
    return s(this, Jo);
  }
  get source() {
    return {
      realm: this.realmId
    };
  }
  get cdpClient() {
    return s(this, Go);
  }
  get baseInfo() {
    return {
      realm: this.realmId,
      origin: this.origin
    };
  }
  async evaluate(e, t, r = "none", n = {}, o = !1, a = !1) {
    var p;
    const c = await this.cdpClient.sendCommand("Runtime.evaluate", {
      contextId: this.executionContextId,
      expression: e,
      awaitPromise: t,
      serializationOptions: m(p = wt, vt, rl).call(p, "deep", n),
      userGesture: o,
      includeCommandLineAPI: a
    });
    return c.exceptionDetails ? await m(this, Ce, sl).call(this, c.exceptionDetails, 0, r) : {
      realm: this.realmId,
      result: this.cdpToBidiValue(c, r),
      type: "success"
    };
  }
  initialize() {
    this.isHidden() || m(this, Ce, Qd).call(this, {
      type: "event",
      method: mc.ChromiumBidi.Script.EventNames.RealmCreated,
      params: this.realmInfo
    });
  }
  /**
   * Serializes a given CDP object into BiDi, keeping references in the
   * target's `globalThis`.
   */
  async serializeCdpObject(e, t) {
    var o;
    const r = m(o = wt, vt, ff).call(o, e), n = await this.cdpClient.sendCommand("Runtime.callFunctionOn", {
      functionDeclaration: String((a) => a),
      awaitPromise: !1,
      arguments: [r],
      serializationOptions: {
        serialization: "deep"
      },
      executionContextId: this.executionContextId
    });
    return this.cdpToBidiValue(n, t);
  }
  /**
   * Gets the string representation of an object. This is equivalent to
   * calling `toString()` on the object value.
   */
  async stringifyObject(e) {
    const { result: t } = await this.cdpClient.sendCommand("Runtime.callFunctionOn", {
      functionDeclaration: String((r) => String(r)),
      awaitPromise: !1,
      arguments: [e],
      returnByValue: !0,
      executionContextId: this.executionContextId
    });
    return t.value;
  }
  async callFunction(e, t, r = {
    type: "undefined"
  }, n = [], o = "none", a = {}, c = !1) {
    var h;
    const p = `(...args) => {
      function callFunction(f, args) {
        const deserializedThis = args.shift();
        const deserializedArgs = args;
        return f.apply(deserializedThis, deserializedArgs);
      }
      return callFunction((
        ${e}
      ), args);
    }`, l = [
      await this.deserializeForCdp(r),
      ...await Promise.all(n.map(async (g) => await this.deserializeForCdp(g)))
    ];
    let d;
    try {
      d = await this.cdpClient.sendCommand("Runtime.callFunctionOn", {
        functionDeclaration: p,
        awaitPromise: t,
        arguments: l,
        serializationOptions: m(h = wt, vt, rl).call(h, "deep", a),
        executionContextId: this.executionContextId,
        userGesture: c
      });
    } catch (g) {
      throw g.code === -32e3 && [
        "Could not find object with given id",
        "Argument should belong to the same JavaScript world as target object",
        "Invalid remote object id"
      ].includes(g.message) ? new mc.NoSuchHandleException("Handle was not found.") : g;
    }
    return d.exceptionDetails ? await m(this, Ce, sl).call(this, d.exceptionDetails, 1, o) : {
      type: "success",
      result: this.cdpToBidiValue(d, o),
      realm: this.realmId
    };
  }
  async deserializeForCdp(e) {
    if ("handle" in e && e.handle)
      return { objectId: e.handle };
    if ("handle" in e || "sharedId" in e)
      throw new mc.NoSuchHandleException("Handle was not found.");
    switch (e.type) {
      case "undefined":
        return { unserializableValue: "undefined" };
      case "null":
        return { unserializableValue: "null" };
      case "string":
        return { value: e.value };
      case "number":
        return e.value === "NaN" ? { unserializableValue: "NaN" } : e.value === "-0" ? { unserializableValue: "-0" } : e.value === "Infinity" ? { unserializableValue: "Infinity" } : e.value === "-Infinity" ? { unserializableValue: "-Infinity" } : {
          value: e.value
        };
      case "boolean":
        return { value: !!e.value };
      case "bigint":
        return {
          unserializableValue: `BigInt(${JSON.stringify(e.value)})`
        };
      case "date":
        return {
          unserializableValue: `new Date(Date.parse(${JSON.stringify(e.value)}))`
        };
      case "regexp":
        return {
          unserializableValue: `new RegExp(${JSON.stringify(e.value.pattern)}, ${JSON.stringify(e.value.flags)})`
        };
      case "map": {
        const t = await m(this, Ce, el).call(this, e.value), { result: r } = await this.cdpClient.sendCommand("Runtime.callFunctionOn", {
          functionDeclaration: String((...n) => {
            const o = /* @__PURE__ */ new Map();
            for (let a = 0; a < n.length; a += 2)
              o.set(n[a], n[a + 1]);
            return o;
          }),
          awaitPromise: !1,
          arguments: t,
          returnByValue: !1,
          executionContextId: this.executionContextId
        });
        return { objectId: r.objectId };
      }
      case "object": {
        const t = await m(this, Ce, el).call(this, e.value), { result: r } = await this.cdpClient.sendCommand("Runtime.callFunctionOn", {
          functionDeclaration: String((...n) => {
            const o = {};
            for (let a = 0; a < n.length; a += 2) {
              const c = n[a];
              o[c] = n[a + 1];
            }
            return o;
          }),
          awaitPromise: !1,
          arguments: t,
          returnByValue: !1,
          executionContextId: this.executionContextId
        });
        return { objectId: r.objectId };
      }
      case "array": {
        const t = await m(this, Ce, tl).call(this, e.value), { result: r } = await this.cdpClient.sendCommand("Runtime.callFunctionOn", {
          functionDeclaration: String((...n) => n),
          awaitPromise: !1,
          arguments: t,
          returnByValue: !1,
          executionContextId: this.executionContextId
        });
        return { objectId: r.objectId };
      }
      case "set": {
        const t = await m(this, Ce, tl).call(this, e.value), { result: r } = await this.cdpClient.sendCommand("Runtime.callFunctionOn", {
          functionDeclaration: String((...n) => new Set(n)),
          awaitPromise: !1,
          arguments: t,
          returnByValue: !1,
          executionContextId: this.executionContextId
        });
        return { objectId: r.objectId };
      }
      case "channel":
        return { objectId: await new Sv.ChannelProxy(e.value, s(this, Bn)).init(this, s(this, gr)) };
    }
    throw new Error(`Value ${JSON.stringify(e)} is not deserializable.`);
  }
  async disown(e) {
    this.realmStorage.knownHandlesToRealmMap.get(e) === this.realmId && (await m(this, Ce, nl).call(this, e), this.realmStorage.knownHandlesToRealmMap.delete(e));
  }
  dispose() {
    this.isHidden() || m(this, Ce, Qd).call(this, {
      type: "event",
      method: mc.ChromiumBidi.Script.EventNames.RealmDestroyed,
      params: {
        realm: this.realmId
      }
    });
  }
}, Go = new WeakMap(), gr = new WeakMap(), Xo = new WeakMap(), Bn = new WeakMap(), Jo = new WeakMap(), Yo = new WeakMap(), Ce = new WeakSet(), Qd = function(e) {
  if (this.associatedBrowsingContexts.length === 0)
    s(this, gr).registerGlobalEvent(e);
  else
    for (const t of this.associatedBrowsingContexts)
      s(this, gr).registerEvent(e, t.id);
}, vt = new WeakSet(), ff = function(e) {
  return e.objectId !== void 0 ? { objectId: e.objectId } : e.unserializableValue !== void 0 ? { unserializableValue: e.unserializableValue } : { value: e.value };
}, el = async function(e) {
  return (await Promise.all(e.map(async ([r, n]) => {
    let o;
    typeof r == "string" ? o = { value: r } : o = await this.deserializeForCdp(r);
    const a = await this.deserializeForCdp(n);
    return [o, a];
  }))).flat();
}, tl = async function(e) {
  return await Promise.all(e.map((t) => this.deserializeForCdp(t)));
}, mf = async function(e, t, r) {
  var a;
  const n = ((a = e.stackTrace) == null ? void 0 : a.callFrames.map((c) => ({
    url: c.url,
    functionName: c.functionName,
    lineNumber: c.lineNumber - t,
    columnNumber: c.columnNumber
  }))) ?? [], o = e.exception;
  return {
    exception: await this.serializeCdpObject(o, r),
    columnNumber: e.columnNumber,
    lineNumber: e.lineNumber - t,
    stackTrace: {
      callFrames: n
    },
    text: await this.stringifyObject(o) || e.text
  };
}, sl = async function(e, t, r) {
  return {
    exceptionDetails: await m(this, Ce, mf).call(this, e, t, r),
    realm: this.realmId,
    type: "exception"
  };
}, rl = function(e, t) {
  var r, n;
  return {
    serialization: e,
    additionalParameters: m(r = wt, vt, gf).call(r, t),
    ...m(n = wt, vt, wf).call(n, t)
  };
}, gf = function(e) {
  const t = {};
  return e.maxDomDepth !== void 0 && (t.maxNodeDepth = e.maxDomDepth === null ? 1e3 : e.maxDomDepth), e.includeShadowTree !== void 0 && (t.includeShadowTree = e.includeShadowTree), t;
}, wf = function(e) {
  return e.maxObjectDepth === void 0 || e.maxObjectDepth === null ? {} : { maxDepth: e.maxObjectDepth };
}, nl = async function(e) {
  try {
    await this.cdpClient.sendCommand("Runtime.releaseObject", {
      objectId: e
    });
  } catch (t) {
    if (!(t.code === -32e3 && t.message === "Invalid remote object id"))
      throw t;
  }
}, u(wt, vt), wt);
nc.Realm = Pv;
Object.defineProperty(rc, "__esModule", { value: !0 });
rc.WindowRealm = void 0;
const gc = se, Iv = nc, $h = sc;
var Ps, Is, ru, yf, yp;
let _v = (yp = class extends Iv.Realm {
  constructor(t, r, n, o, a, c, p, l, d, h) {
    super(n, o, a, c, p, l, d);
    u(this, ru);
    u(this, Ps);
    u(this, Is);
    O(this, "sandbox");
    f(this, Ps, t), f(this, Is, r), this.sandbox = h, this.initialize();
  }
  get browsingContext() {
    return s(this, Is).getContext(s(this, Ps));
  }
  /**
   * Do not expose to user hidden realms.
   */
  isHidden() {
    return this.realmStorage.hiddenSandboxes.has(this.sandbox);
  }
  get associatedBrowsingContexts() {
    return [this.browsingContext];
  }
  get realmType() {
    return "window";
  }
  get realmInfo() {
    return {
      ...this.baseInfo,
      type: this.realmType,
      context: s(this, Ps),
      sandbox: this.sandbox
    };
  }
  get source() {
    return {
      realm: this.realmId,
      context: this.browsingContext.id
    };
  }
  serializeForBiDi(t, r) {
    const n = t.value;
    if (t.type === "node" && n !== void 0) {
      if (Object.hasOwn(n, "backendNodeId")) {
        let o = this.browsingContext.navigableId ?? "UNKNOWN";
        Object.hasOwn(n, "loaderId") && (o = n.loaderId, delete n.loaderId), t.sharedId = (0, $h.getSharedId)(m(this, ru, yf).call(this, o), o, n.backendNodeId), delete n.backendNodeId;
      }
      if (Object.hasOwn(n, "children"))
        for (const o in n.children)
          n.children[o] = this.serializeForBiDi(n.children[o], r);
      Object.hasOwn(n, "shadowRoot") && n.shadowRoot !== null && (n.shadowRoot = this.serializeForBiDi(n.shadowRoot, r)), n.namespaceURI === "" && (n.namespaceURI = null);
    }
    return super.serializeForBiDi(t, r);
  }
  async deserializeForCdp(t) {
    if ("sharedId" in t && t.sharedId) {
      const r = (0, $h.parseSharedId)(t.sharedId);
      if (r === null)
        throw new gc.NoSuchNodeException(`SharedId "${t.sharedId}" was not found.`);
      const { documentId: n, backendNodeId: o } = r;
      if (this.browsingContext.navigableId !== n)
        throw new gc.NoSuchNodeException(`SharedId "${t.sharedId}" belongs to different document. Current document is ${this.browsingContext.navigableId}.`);
      try {
        const { object: a } = await this.cdpClient.sendCommand("DOM.resolveNode", {
          backendNodeId: o,
          executionContextId: this.executionContextId
        });
        return { objectId: a.objectId };
      } catch (a) {
        throw a.code === -32e3 && a.message === "No node with given id found" ? new gc.NoSuchNodeException(`SharedId "${t.sharedId}" was not found.`) : new gc.UnknownErrorException(a.message, a.stack);
      }
    }
    return await super.deserializeForCdp(t);
  }
  async evaluate(t, r, n, o, a, c) {
    return await s(this, Is).getContext(s(this, Ps)).targetUnblockedOrThrow(), await super.evaluate(t, r, n, o, a, c);
  }
  async callFunction(t, r, n, o, a, c, p) {
    return await s(this, Is).getContext(s(this, Ps)).targetUnblockedOrThrow(), await super.callFunction(t, r, n, o, a, c, p);
  }
}, Ps = new WeakMap(), Is = new WeakMap(), ru = new WeakSet(), yf = function(t) {
  const r = s(this, Is).getAllContexts().find((n) => n.navigableId === t);
  return (r == null ? void 0 : r.id) ?? "UNKNOWN";
}, yp);
rc.WindowRealm = _v;
var Ms = {}, nh = {};
Object.defineProperty(nh, "__esModule", { value: !0 });
nh.urlMatchesAboutBlank = kv;
function kv(i) {
  if (i === "")
    return !0;
  try {
    const e = new URL(i);
    return e.protocol.replace(/:$/, "").toLowerCase() === "about" && e.pathname.toLowerCase() === "blank" && e.username === "" && e.password === "" && e.host === "";
  } catch (e) {
    if (e instanceof TypeError)
      return !1;
    throw e;
  }
}
Object.defineProperty(Ms, "__esModule", { value: !0 });
Ms.NavigationTracker = Ms.NavigationState = Ms.NavigationResult = void 0;
const Lh = se, qh = Jr, hs = Te, Tv = ed, Hh = nh, Dv = qt;
class Sc {
  constructor(e, t) {
    O(this, "eventName");
    O(this, "message");
    this.eventName = e, this.message = t;
  }
}
Ms.NavigationResult = Sc;
var _s, Fn, Mn, wr, yr, jn, Ic;
class Pc {
  constructor(e, t, r, n) {
    u(this, jn);
    O(this, "navigationId", (0, Dv.uuidv4)());
    u(this, _s);
    u(this, Fn, !1);
    u(this, Mn, new qh.Deferred());
    O(this, "url");
    O(this, "loaderId");
    u(this, wr);
    u(this, yr);
    O(this, "committed", new qh.Deferred());
    O(this, "isFragmentNavigation");
    f(this, _s, t), this.url = e, f(this, wr, r), f(this, yr, n);
  }
  get finished() {
    return s(this, Mn);
  }
  navigationInfo() {
    return {
      context: s(this, _s),
      navigation: this.navigationId,
      timestamp: (0, Tv.getTimestamp)(),
      url: this.url
    };
  }
  start() {
    // Initial navigation should not be reported.
    !s(this, wr) && // No need in reporting started navigation twice.
    !s(this, Fn) && // No need for reporting fragment navigations. Step 13 vs step 16 of the spec:
    // https://html.spec.whatwg.org/#beginning-navigation:webdriver-bidi-navigation-started
    !this.isFragmentNavigation && s(this, yr).registerEvent({
      type: "event",
      method: Lh.ChromiumBidi.BrowsingContext.EventNames.NavigationStarted,
      params: this.navigationInfo()
    }, s(this, _s)), f(this, Fn, !0);
  }
  frameNavigated() {
    this.committed.resolve(), s(this, wr) || s(this, yr).registerEvent({
      type: "event",
      method: Lh.ChromiumBidi.BrowsingContext.EventNames.NavigationCommitted,
      params: this.navigationInfo()
    }, s(this, _s));
  }
  fragmentNavigated() {
    this.committed.resolve(), m(this, jn, Ic).call(this, new Sc(
      "browsingContext.fragmentNavigated"
      /* NavigationEventName.FragmentNavigated */
    ));
  }
  load() {
    m(this, jn, Ic).call(this, new Sc(
      "browsingContext.load"
      /* NavigationEventName.Load */
    ));
  }
  fail(e) {
    m(this, jn, Ic).call(this, new Sc(this.committed.isFinished ? "browsingContext.navigationAborted" : "browsingContext.navigationFailed", e));
  }
}
_s = new WeakMap(), Fn = new WeakMap(), Mn = new WeakMap(), wr = new WeakMap(), yr = new WeakMap(), jn = new WeakSet(), Ic = function(e) {
  f(this, Fn, !0), !s(this, wr) && !s(this, Mn).isFinished && e.eventName !== "browsingContext.load" && s(this, yr).registerEvent({
    type: "event",
    method: e.eventName,
    params: this.navigationInfo()
  }, s(this, _s)), s(this, Mn).resolve(e);
};
Ms.NavigationState = Pc;
var vr, Ze, ze, Un, Qe, de, Qt, nu, vf, Zo, ol;
const co = class co {
  constructor(e, t, r, n) {
    u(this, nu);
    u(this, vr);
    u(this, Ze);
    u(this, ze, /* @__PURE__ */ new Map());
    u(this, Un);
    /**
     * Last committed navigation is committed, but is not guaranteed to be finished, as it
     * can still wait for `load` or `DOMContentLoaded` events.
     */
    u(this, Qe);
    /**
     * Pending navigation is a navigation that is started but not yet committed.
     */
    u(this, de);
    // Flags if the initial navigation to `about:blank` is in progress.
    u(this, Qt, !0);
    f(this, Un, t), f(this, vr, r), f(this, Ze, n), f(this, Qt, !0), f(this, Qe, new Pc(e, t, (0, Hh.urlMatchesAboutBlank)(e), s(this, vr)));
  }
  /**
   * Returns current started ongoing navigation. It can be either a started pending
   * navigation, or one is already navigated.
   */
  get currentNavigationId() {
    var e;
    return ((e = s(this, de)) == null ? void 0 : e.isFragmentNavigation) === !1 ? s(this, de).navigationId : s(this, Qe).navigationId;
  }
  /**
   * Flags if the current navigation relates to the initial to `about:blank` navigation.
   */
  get isInitialNavigation() {
    return s(this, Qt);
  }
  /**
   * Url of the last navigated navigation.
   */
  get url() {
    return s(this, Qe).url;
  }
  /**
   * Creates a pending navigation e.g. when navigation command is called. Required to
   * provide navigation id before the actual navigation is started. It will be used when
   * navigation started. Can be aborted, failed, fragment navigated, or became a current
   * navigation.
   */
  createPendingNavigation(e, t = !1) {
    var n, o;
    (n = s(this, Ze)) == null || n.call(this, hs.LogType.debug, "createCommandNavigation"), f(this, Qt, t && s(this, Qt) && (0, Hh.urlMatchesAboutBlank)(e)), (o = s(this, de)) == null || o.fail("navigation canceled by concurrent navigation");
    const r = new Pc(e, s(this, Un), s(this, Qt), s(this, vr));
    return f(this, de, r), r;
  }
  dispose() {
    var e;
    (e = s(this, de)) == null || e.fail("navigation canceled by context disposal"), s(this, Qe).fail("navigation canceled by context disposal");
  }
  // Update the current url.
  onTargetInfoChanged(e) {
    var t;
    (t = s(this, Ze)) == null || t.call(this, hs.LogType.debug, `onTargetInfoChanged ${e}`), s(this, Qe).url = e;
  }
  /**
   * @param {string} unreachableUrl indicated the navigation is actually failed.
   */
  frameNavigated(e, t, r) {
    var o;
    if ((o = s(this, Ze)) == null || o.call(this, hs.LogType.debug, `frameNavigated ${e}`), r !== void 0) {
      const a = s(this, ze).get(t) ?? s(this, de) ?? this.createPendingNavigation(r, !0);
      a.url = r, a.start(), a.fail("the requested url is unreachable");
      return;
    }
    const n = m(this, nu, vf).call(this, e, t);
    n !== s(this, Qe) && s(this, Qe).fail("navigation canceled by concurrent navigation"), n.url = e, n.loaderId = t, s(this, ze).set(t, n), n.start(), n.frameNavigated(), f(this, Qe, n), s(this, de) === n && f(this, de, void 0);
  }
  navigatedWithinDocument(e, t) {
    var n, o;
    if ((n = s(this, Ze)) == null || n.call(this, hs.LogType.debug, `navigatedWithinDocument ${e}, ${t}`), s(this, Qe).url = e, t !== "fragment")
      return;
    const r = ((o = s(this, de)) == null ? void 0 : o.isFragmentNavigation) === !0 ? s(this, de) : new Pc(e, s(this, Un), !1, s(this, vr));
    r.fragmentNavigated(), r === s(this, de) && f(this, de, void 0);
  }
  /**
   * Required to mark navigation as fully complete.
   * TODO: navigation should be complete when it became the current one on
   * `Page.frameNavigated` or on navigating command finished with a new loader Id.
   */
  loadPageEvent(e) {
    var t, r;
    (t = s(this, Ze)) == null || t.call(this, hs.LogType.debug, "loadPageEvent"), f(this, Qt, !1), (r = s(this, ze).get(e)) == null || r.load();
  }
  /**
   * Fail navigation due to navigation command failed.
   */
  failNavigation(e, t) {
    var r;
    (r = s(this, Ze)) == null || r.call(this, hs.LogType.debug, "failCommandNavigation"), e.fail(t);
  }
  /**
   * Updates the navigation's `loaderId` and sets it as current one, if it is a
   * cross-document navigation.
   */
  navigationCommandFinished(e, t) {
    var r;
    (r = s(this, Ze)) == null || r.call(this, hs.LogType.debug, `finishCommandNavigation ${e.navigationId}, ${t}`), t !== void 0 && (e.loaderId = t, s(this, ze).set(t, e)), e.isFragmentNavigation = t === void 0;
  }
  frameStartedNavigating(e, t, r) {
    var o, a, c, p, l, d;
    if ((o = s(this, Ze)) == null || o.call(this, hs.LogType.debug, `frameStartedNavigating ${e}, ${t}`), s(this, de) && ((a = s(this, de)) == null ? void 0 : a.loaderId) !== void 0 && ((c = s(this, de)) == null ? void 0 : c.loaderId) !== t && ((p = s(this, de)) == null || p.fail("navigation canceled by concurrent navigation"), f(this, de, void 0)), s(this, ze).has(t)) {
      const h = s(this, ze).get(t);
      h.isFragmentNavigation = m(l = co, Zo, ol).call(l, r), f(this, de, h);
      return;
    }
    const n = s(this, de) ?? this.createPendingNavigation(e, !0);
    s(this, ze).set(t, n), n.isFragmentNavigation = m(d = co, Zo, ol).call(d, r), n.url = e, n.loaderId = t, n.start();
  }
  /**
   * If there is a navigation with the loaderId equals to the network request id, it means
   * that the navigation failed.
   */
  networkLoadingFailed(e, t) {
    var r;
    (r = s(this, ze).get(e)) == null || r.fail(t);
  }
};
vr = new WeakMap(), Ze = new WeakMap(), ze = new WeakMap(), Un = new WeakMap(), Qe = new WeakMap(), de = new WeakMap(), Qt = new WeakMap(), nu = new WeakSet(), vf = function(e, t) {
  return s(this, ze).has(t) ? s(this, ze).get(t) : s(this, de) !== void 0 && s(this, de).loaderId === void 0 ? s(this, de) : this.createPendingNavigation(e, !0);
}, Zo = new WeakSet(), ol = function(e) {
  return ["historySameDocument", "sameDocument"].includes(e);
}, u(co, Zo);
let il = co;
Ms.NavigationTracker = il;
var hn;
Object.defineProperty(Ui, "__esModule", { value: !0 });
Ui.BrowsingContextImpl = void 0;
Ui.serializeOrigin = If;
const z = se, Vi = us, Vs = Jr, Gi = Te, sn = ed, rn = rh, Nv = qt, Ov = sc, Rv = rc, Sd = Ms;
var $n, Ln, Qo, qn, et, We, ea, Re, K, Be, lt, _e, tt, le, ht, Hn, br, G, _c, al, cl, iu, bf, Cf, kc, ul, xf, dl, Ef, Sf, Pf, zt;
class zc {
  constructor(e, t, r, n, o, a, c, p, l, d, h) {
    u(this, G);
    /** Direct children browsing contexts. */
    u(this, $n, /* @__PURE__ */ new Set());
    /** The ID of this browsing context. */
    u(this, Ln);
    O(this, "userContext");
    // Used for running helper scripts.
    u(this, Qo, (0, Nv.uuidv4)());
    u(this, qn, /* @__PURE__ */ new Map());
    /**
     * The ID of the parent browsing context.
     * If null, this is a top-level context.
     */
    u(this, et);
    u(this, We, null);
    u(this, ea);
    u(this, Re, {
      DOMContentLoaded: new Vs.Deferred(),
      load: new Vs.Deferred()
    });
    u(this, K);
    u(this, Be, new Vs.Deferred());
    u(this, lt);
    u(this, _e);
    u(this, tt);
    u(this, le);
    u(this, ht);
    u(this, Hn);
    // Set when the user prompt is opened. Required to provide the type in closing event.
    u(this, br);
    f(this, K, n), f(this, Ln, e), f(this, We, t), this.userContext = r, f(this, _e, o), f(this, lt, a), f(this, ht, c), f(this, Hn, p), f(this, tt, h), f(this, ea, d), s(this, ht).hiddenSandboxes.add(s(this, Qo)), f(this, le, new Sd.NavigationTracker(l, e, o, h));
  }
  static create(e, t, r, n, o, a, c, p, l, d, h) {
    var x;
    const g = new hn(e, t, r, n, o, a, c, p, l, d, h);
    return m(x = g, G, cl).call(x), a.addContext(g), g.isTopLevelContext() || g.parent.addChild(g.id), o.registerPromiseEvent(g.targetUnblockedOrThrow().then(() => ({
      kind: "success",
      value: {
        type: "event",
        method: z.ChromiumBidi.BrowsingContext.EventNames.ContextCreated,
        params: {
          ...g.serializeToBidiValue(),
          // Hack to provide the initial URL of the context, as it can be changed
          // between the page target is attached and unblocked, as the page is not
          // fully paused in MPArch session (https://crbug.com/372842894).
          // TODO: remove once https://crbug.com/372842894 is addressed.
          url: l
        }
      }
    }), (E) => ({
      kind: "error",
      error: E
    })), g.id, z.ChromiumBidi.BrowsingContext.EventNames.ContextCreated), g;
  }
  /**
   * @see https://html.spec.whatwg.org/multipage/document-sequences.html#navigable
   */
  get navigableId() {
    return s(this, et);
  }
  get navigationId() {
    return s(this, le).currentNavigationId;
  }
  dispose(e) {
    s(this, le).dispose(), s(this, ht).deleteRealms({
      browsingContextId: this.id
    }), this.isTopLevelContext() || s(this.parent, $n).delete(this.id), m(this, G, xf).call(this), e && s(this, _e).registerEvent({
      type: "event",
      method: z.ChromiumBidi.BrowsingContext.EventNames.ContextDestroyed,
      params: this.serializeToBidiValue(null)
    }, this.id), m(this, G, _c).call(this), s(this, _e).clearBufferedEvents(this.id), s(this, lt).deleteContextById(this.id);
  }
  /** Returns the ID of this context. */
  get id() {
    return s(this, Ln);
  }
  /** Returns the parent context ID. */
  get parentId() {
    return s(this, We);
  }
  /** Sets the parent context ID and updates parent's children. */
  set parentId(e) {
    var t;
    if (s(this, We) !== null) {
      (t = s(this, tt)) == null || t.call(this, Gi.LogType.debugError, "Parent context already set");
      return;
    }
    f(this, We, e), this.isTopLevelContext() || this.parent.addChild(this.id);
  }
  /** Returns the parent context. */
  get parent() {
    return this.parentId === null ? null : s(this, lt).getContext(this.parentId);
  }
  /** Returns all direct children contexts. */
  get directChildren() {
    return [...s(this, $n)].map((e) => s(this, lt).getContext(e));
  }
  /** Returns all children contexts, flattened. */
  get allChildren() {
    const e = this.directChildren;
    return e.concat(...e.map((t) => t.allChildren));
  }
  /**
   * Returns true if this is a top-level context.
   * This is the case whenever the parent context ID is null.
   */
  isTopLevelContext() {
    return s(this, We) === null;
  }
  get top() {
    let e = this, t = e.parent;
    for (; t; )
      e = t, t = e.parent;
    return e;
  }
  addChild(e) {
    s(this, $n).add(e);
  }
  get cdpTarget() {
    return s(this, K);
  }
  updateCdpTarget(e) {
    f(this, K, e), m(this, G, cl).call(this);
  }
  get url() {
    return s(this, le).url;
  }
  async lifecycleLoaded() {
    await s(this, Re).load;
  }
  async targetUnblockedOrThrow() {
    const e = await s(this, K).unblocked;
    if (e.kind === "error")
      throw e.error;
  }
  /** Returns a sandbox for internal helper scripts which is not exposed to the user.*/
  async getOrCreateHiddenSandbox() {
    return await m(this, G, al).call(this, s(this, Qo));
  }
  /** Returns a sandbox which is exposed to user. */
  async getOrCreateUserSandbox(e) {
    const t = await m(this, G, al).call(this, e);
    if (t.isHidden())
      throw new z.NoSuchFrameException(`Realm "${e}" not found`);
    return t;
  }
  /**
   * Implements https://w3c.github.io/webdriver-bidi/#get-the-navigable-info.
   */
  serializeToBidiValue(e = 0, t = !0) {
    return {
      context: s(this, Ln),
      url: this.url,
      userContext: this.userContext,
      originalOpener: s(this, ea) ?? null,
      clientWindow: `${this.cdpTarget.windowId}`,
      children: e === null || e > 0 ? this.directChildren.map((r) => r.serializeToBidiValue(e === null ? e : e - 1, !1)) : null,
      ...t ? { parent: s(this, We) } : {}
    };
  }
  onTargetInfoChanged(e) {
    s(this, le).onTargetInfoChanged(e.targetInfo.url);
  }
  async navigate(e, t) {
    try {
      new URL(e);
    } catch {
      throw new z.InvalidArgumentException(`Invalid URL: ${e}`);
    }
    const r = s(this, le).createPendingNavigation(e), n = (async () => {
      const a = await s(this, K).cdpClient.sendCommand("Page.navigate", {
        url: e,
        frameId: this.id
      });
      if (a.errorText)
        throw s(this, le).failNavigation(r, a.errorText), new z.UnknownErrorException(a.errorText);
      s(this, le).navigationCommandFinished(r, a.loaderId), m(this, G, kc).call(this, a.loaderId);
    })(), o = await Promise.race([
      // No `loaderId` means same-document navigation.
      m(this, G, dl).call(this, t, n, r),
      // Throw an error if the navigation is canceled.
      r.finished
    ]);
    if (o instanceof Sd.NavigationResult && // TODO: check after decision on the spec is done:
    //  https://github.com/w3c/webdriver-bidi/issues/799.
    (o.eventName === "browsingContext.navigationAborted" || o.eventName === "browsingContext.navigationFailed"))
      throw new z.UnknownErrorException(o.message ?? "unknown exception");
    return {
      navigation: r.navigationId,
      // Url can change due to redirects. Get the one from commandNavigation.
      url: r.url
    };
  }
  // TODO: support concurrent navigations analogous to `navigate`.
  async reload(e, t) {
    await this.targetUnblockedOrThrow(), m(this, G, ul).call(this);
    const r = s(this, le).createPendingNavigation(s(this, le).url), n = s(this, K).cdpClient.sendCommand("Page.reload", {
      ignoreCache: e
    }), o = await Promise.race([
      // No `loaderId` means same-document navigation.
      m(this, G, dl).call(this, t, n, r),
      // Throw an error if the navigation is canceled.
      r.finished
    ]);
    if (o instanceof Sd.NavigationResult && (o.eventName === "browsingContext.navigationAborted" || o.eventName === "browsingContext.navigationFailed"))
      throw new z.UnknownErrorException(o.message ?? "unknown exception");
    return {
      navigation: r.navigationId,
      // Url can change due to redirects. Get the one from commandNavigation.
      url: r.url
    };
  }
  async setViewport(e, t, r) {
    const n = s(this, Hn).getActiveConfig(this.id, this.userContext);
    await this.cdpTarget.setDeviceMetricsOverride(e, t, r, n.screenArea ?? null);
  }
  async handleUserPrompt(e, t) {
    await s(this.top, K).cdpClient.sendCommand("Page.handleJavaScriptDialog", {
      accept: e ?? !0,
      promptText: t
    });
  }
  async activate() {
    await s(this, K).cdpClient.sendCommand("Page.bringToFront");
  }
  async captureScreenshot(e) {
    if (!this.isTopLevelContext())
      throw new z.UnsupportedOperationException(`Non-top-level 'context' (${e.context}) is currently not supported`);
    const t = Av(e);
    let r = !1, n;
    switch (e.origin ?? (e.origin = "viewport"), e.origin) {
      case "document": {
        n = String(() => {
          const l = document.documentElement;
          return {
            x: 0,
            y: 0,
            width: l.scrollWidth,
            height: l.scrollHeight
          };
        }), r = !0;
        break;
      }
      case "viewport": {
        n = String(() => {
          const l = window.visualViewport;
          return {
            x: l.pageLeft,
            y: l.pageTop,
            width: l.width,
            height: l.height
          };
        });
        break;
      }
    }
    const a = await (await this.getOrCreateHiddenSandbox()).callFunction(n, !1);
    (0, Vi.assert)(a.type === "success");
    const c = zh(a.result);
    (0, Vi.assert)(c);
    let p = c;
    if (e.clip) {
      const l = e.clip;
      e.origin === "viewport" && l.type === "box" && (l.x += c.x, l.y += c.y), p = Bv(await m(this, G, Ef).call(this, l), c);
    }
    if (p.width === 0 || p.height === 0)
      throw new z.UnableToCaptureScreenException(`Unable to capture screenshot with zero dimensions: width=${p.width}, height=${p.height}`);
    return await s(this, K).cdpClient.sendCommand("Page.captureScreenshot", {
      clip: { ...p, scale: 1 },
      ...t,
      captureBeyondViewport: r
    });
  }
  async print(e) {
    var r, n, o, a, c, p;
    if (!this.isTopLevelContext())
      throw new z.UnsupportedOperationException("Printing of non-top level contexts is not supported");
    const t = {};
    if (e.background !== void 0 && (t.printBackground = e.background), ((r = e.margin) == null ? void 0 : r.bottom) !== void 0 && (t.marginBottom = (0, rn.inchesFromCm)(e.margin.bottom)), ((n = e.margin) == null ? void 0 : n.left) !== void 0 && (t.marginLeft = (0, rn.inchesFromCm)(e.margin.left)), ((o = e.margin) == null ? void 0 : o.right) !== void 0 && (t.marginRight = (0, rn.inchesFromCm)(e.margin.right)), ((a = e.margin) == null ? void 0 : a.top) !== void 0 && (t.marginTop = (0, rn.inchesFromCm)(e.margin.top)), e.orientation !== void 0 && (t.landscape = e.orientation === "landscape"), ((c = e.page) == null ? void 0 : c.height) !== void 0 && (t.paperHeight = (0, rn.inchesFromCm)(e.page.height)), ((p = e.page) == null ? void 0 : p.width) !== void 0 && (t.paperWidth = (0, rn.inchesFromCm)(e.page.width)), e.pageRanges !== void 0) {
      for (const l of e.pageRanges) {
        if (typeof l == "number")
          continue;
        const d = l.split("-");
        if (d.length < 1 || d.length > 2)
          throw new z.InvalidArgumentException(`Invalid page range: ${l} is not a valid integer range.`);
        if (d.length === 1) {
          Pd(d[0] ?? "");
          continue;
        }
        let h, g;
        const [x = "", E = ""] = d;
        if (x === "" ? h = 1 : h = Pd(x), E === "" ? g = Number.MAX_SAFE_INTEGER : g = Pd(E), h > g)
          throw new z.InvalidArgumentException(`Invalid page range: ${x} > ${E}`);
      }
      t.pageRanges = e.pageRanges.join(",");
    }
    e.scale !== void 0 && (t.scale = e.scale), e.shrinkToFit !== void 0 && (t.preferCSSPageSize = !e.shrinkToFit);
    try {
      return {
        data: (await s(this, K).cdpClient.sendCommand("Page.printToPDF", t)).data
      };
    } catch (l) {
      throw l.message === "invalid print parameters: content area is empty" ? new z.UnsupportedOperationException(l.message) : l;
    }
  }
  async close() {
    await s(this, K).cdpClient.sendCommand("Page.close");
  }
  async traverseHistory(e) {
    if (e === 0)
      return;
    const t = await s(this, K).cdpClient.sendCommand("Page.getNavigationHistory"), r = t.entries[t.currentIndex + e];
    if (!r)
      throw new z.NoSuchHistoryEntryException(`No history entry at delta ${e}`);
    await s(this, K).cdpClient.sendCommand("Page.navigateToHistoryEntry", {
      entryId: r.id
    });
  }
  async toggleModulesIfNeeded() {
    await Promise.all([
      s(this, K).toggleNetworkIfNeeded(),
      s(this, K).toggleDeviceAccessIfNeeded(),
      s(this, K).togglePreloadIfNeeded()
    ]);
  }
  async locateNodes(e) {
    return await m(this, G, Pf).call(this, await s(this, Be), e.locator, e.startNodes ?? [], e.maxNodeCount, e.serializationOptions);
  }
  async setTimezoneOverride(e) {
    await Promise.all(m(this, G, zt).call(this).map(async (t) => await t.setTimezoneOverride(e)));
  }
  async setLocaleOverride(e) {
    await Promise.all(m(this, G, zt).call(this).map(async (t) => await t.setLocaleOverride(e)));
  }
  async setGeolocationOverride(e) {
    await Promise.all(m(this, G, zt).call(this).map(async (t) => await t.setGeolocationOverride(e)));
  }
  async setScriptingEnabled(e) {
    await Promise.all(m(this, G, zt).call(this).map(async (t) => await t.setScriptingEnabled(e)));
  }
  async setUserAgentAndAcceptLanguage(e, t, r) {
    await Promise.all(m(this, G, zt).call(this).map(async (n) => await n.setUserAgentAndAcceptLanguage(e, t, r)));
  }
  async setEmulatedNetworkConditions(e) {
    await Promise.all(m(this, G, zt).call(this).map(async (t) => await t.setEmulatedNetworkConditions(e)));
  }
  async setTouchOverride(e) {
    await Promise.allSettled(m(this, G, zt).call(this).map(async (t) => await t.setTouchOverride(e)));
  }
  async setExtraHeaders(e) {
    await Promise.all(m(this, G, zt).call(this).map(async (t) => await t.setExtraHeaders(e)));
  }
}
$n = new WeakMap(), Ln = new WeakMap(), Qo = new WeakMap(), qn = new WeakMap(), et = new WeakMap(), We = new WeakMap(), ea = new WeakMap(), Re = new WeakMap(), K = new WeakMap(), Be = new WeakMap(), lt = new WeakMap(), _e = new WeakMap(), tt = new WeakMap(), le = new WeakMap(), ht = new WeakMap(), Hn = new WeakMap(), br = new WeakMap(), G = new WeakSet(), _c = function(e = !1) {
  this.directChildren.map((t) => t.dispose(e));
}, al = async function(e) {
  if (e === void 0 || e === "")
    return await s(this, Be);
  let t = s(this, ht).findRealms({
    browsingContextId: this.id,
    sandbox: e
  });
  return t.length === 0 && (await s(this, K).cdpClient.sendCommand("Page.createIsolatedWorld", {
    frameId: this.id,
    worldName: e
  }), t = s(this, ht).findRealms({
    browsingContextId: this.id,
    sandbox: e
  }), (0, Vi.assert)(t.length !== 0)), t[0];
}, cl = function() {
  s(this, K).cdpClient.on("Network.loadingFailed", (e) => {
    s(this, le).networkLoadingFailed(e.requestId, e.errorText);
  }), s(this, K).cdpClient.on("Page.fileChooserOpened", (e) => {
    var r;
    if (this.id !== e.frameId)
      return;
    if (s(this, et) === void 0) {
      (r = s(this, tt)) == null || r.call(this, Gi.LogType.debugError, "LoaderId should be defined when file upload is shown", e);
      return;
    }
    const t = e.backendNodeId === void 0 ? void 0 : {
      sharedId: (0, Ov.getSharedId)(this.id, s(this, et), e.backendNodeId)
    };
    s(this, _e).registerEvent({
      type: "event",
      method: z.ChromiumBidi.Input.EventNames.FileDialogOpened,
      params: {
        context: this.id,
        multiple: e.mode === "selectMultiple",
        element: t
      }
    }, this.id);
  }), s(this, K).cdpClient.on("Page.frameNavigated", (e) => {
    this.id === e.frame.id && (s(this, le).frameNavigated(
      e.frame.url + (e.frame.urlFragment ?? ""),
      e.frame.loaderId,
      // `unreachableUrl` indicates if the navigation failed.
      e.frame.unreachableUrl
    ), m(this, G, _c).call(this), m(this, G, kc).call(this, e.frame.loaderId));
  }), s(this, K).cdpClient.on("Page.frameStartedNavigating", (e) => {
    this.id === e.frameId && s(this, le).frameStartedNavigating(e.url, e.loaderId, e.navigationType);
  }), s(this, K).cdpClient.on("Page.navigatedWithinDocument", (e) => {
    if (this.id === e.frameId && (s(this, le).navigatedWithinDocument(e.url, e.navigationType), e.navigationType === "historyApi")) {
      s(this, _e).registerEvent({
        type: "event",
        method: "browsingContext.historyUpdated",
        params: {
          context: this.id,
          timestamp: (0, sn.getTimestamp)(),
          url: s(this, le).url
        }
      }, this.id);
      return;
    }
  }), s(this, K).cdpClient.on("Page.lifecycleEvent", (e) => {
    if (this.id === e.frameId) {
      if (e.name === "init") {
        m(this, G, kc).call(this, e.loaderId);
        return;
      }
      if (e.name === "commit") {
        f(this, et, e.loaderId);
        return;
      }
      if (s(this, et) || f(this, et, e.loaderId), e.loaderId === s(this, et))
        switch (e.name) {
          case "DOMContentLoaded":
            s(this, le).isInitialNavigation || s(this, _e).registerEvent({
              type: "event",
              method: z.ChromiumBidi.BrowsingContext.EventNames.DomContentLoaded,
              params: {
                context: this.id,
                navigation: s(this, le).currentNavigationId,
                timestamp: (0, sn.getTimestamp)(),
                url: s(this, le).url
              }
            }, this.id), s(this, Re).DOMContentLoaded.resolve();
            break;
          case "load":
            s(this, le).isInitialNavigation || s(this, _e).registerEvent({
              type: "event",
              method: z.ChromiumBidi.BrowsingContext.EventNames.Load,
              params: {
                context: this.id,
                navigation: s(this, le).currentNavigationId,
                timestamp: (0, sn.getTimestamp)(),
                url: s(this, le).url
              }
            }, this.id), s(this, le).loadPageEvent(e.loaderId), s(this, Re).load.resolve();
            break;
        }
    }
  }), s(this, K).cdpClient.on("Runtime.executionContextCreated", (e) => {
    var l;
    const { auxData: t, name: r, uniqueId: n, id: o } = e.context;
    if (!t || t.frameId !== this.id || t.type === "isolated" && r === "")
      return;
    let a, c;
    switch (t.type) {
      case "isolated":
        c = r, s(this, Be).isFinished || (l = s(this, tt)) == null || l.call(this, Gi.LogType.debugError, "Unexpectedly, isolated realm created before the default one"), a = s(this, Be).isFinished ? s(this, Be).result.origin : (
          // This fallback is not expected to be ever reached.
          ""
        );
        break;
      case "default":
        a = If(e.context.origin);
        break;
      default:
        return;
    }
    const p = new Rv.WindowRealm(this.id, s(this, lt), s(this, K).cdpClient, s(this, _e), o, s(this, tt), a, n, s(this, ht), c);
    t.isDefault && (s(this, Be).resolve(p), Promise.all(s(this, K).getChannels().map((d) => d.startListenerFromWindow(p, s(this, _e)))));
  }), s(this, K).cdpClient.on("Runtime.executionContextDestroyed", (e) => {
    s(this, Be).isFinished && s(this, Be).result.executionContextId === e.executionContextId && f(this, Be, new Vs.Deferred()), s(this, ht).deleteRealms({
      cdpSessionId: s(this, K).cdpSessionId,
      executionContextId: e.executionContextId
    });
  }), s(this, K).cdpClient.on("Runtime.executionContextsCleared", () => {
    s(this, Be).isFinished || s(this, Be).reject(new z.UnknownErrorException("execution contexts cleared")), f(this, Be, new Vs.Deferred()), s(this, ht).deleteRealms({
      cdpSessionId: s(this, K).cdpSessionId
    });
  }), s(this, K).cdpClient.on("Page.javascriptDialogClosed", (e) => {
    var r, n;
    if (e.frameId && this.id !== e.frameId || !e.frameId && s(this, We) && s(this, K).cdpClient !== ((r = s(this, lt).getContext(s(this, We))) == null ? void 0 : r.cdpTarget.cdpClient))
      return;
    const t = e.result;
    s(this, br) === void 0 && ((n = s(this, tt)) == null || n.call(this, Gi.LogType.debugError, "Unexpectedly no opening prompt event before closing one")), s(this, _e).registerEvent({
      type: "event",
      method: z.ChromiumBidi.BrowsingContext.EventNames.UserPromptClosed,
      params: {
        context: this.id,
        accepted: t,
        // `lastUserPromptType` should never be undefined here, so fallback to
        // `UNKNOWN`. The fallback is required to prevent tests from hanging while
        // waiting for the closing event. The cast is required, as the `UNKNOWN` value
        // is not standard.
        type: s(this, br) ?? "UNKNOWN",
        userText: t && e.userInput ? e.userInput : void 0
      }
    }, this.id), f(this, br, void 0);
  }), s(this, K).cdpClient.on("Page.javascriptDialogOpening", (e) => {
    var n, o;
    if (e.frameId && this.id !== e.frameId || !e.frameId && s(this, We) && s(this, K).cdpClient !== ((n = s(this, lt).getContext(s(this, We))) == null ? void 0 : n.cdpTarget.cdpClient))
      return;
    const t = m(o = hn, iu, bf).call(o, e.type);
    f(this, br, t);
    const r = m(this, G, Cf).call(this, t);
    switch (s(this, _e).registerEvent({
      type: "event",
      method: z.ChromiumBidi.BrowsingContext.EventNames.UserPromptOpened,
      params: {
        context: this.id,
        handler: r,
        type: t,
        message: e.message,
        ...e.type === "prompt" ? { defaultValue: e.defaultPrompt } : {}
      }
    }, this.id), r) {
      case "accept":
        this.handleUserPrompt(!0);
        break;
      case "dismiss":
        this.handleUserPrompt(!1);
        break;
    }
  }), s(this, K).browserCdpClient.on("Browser.downloadWillBegin", (e) => {
    this.id === e.frameId && (s(this, qn).set(e.guid, e.url), s(this, _e).registerEvent({
      type: "event",
      method: z.ChromiumBidi.BrowsingContext.EventNames.DownloadWillBegin,
      params: {
        context: this.id,
        suggestedFilename: e.suggestedFilename,
        navigation: e.guid,
        timestamp: (0, sn.getTimestamp)(),
        url: e.url
      }
    }, this.id));
  }), s(this, K).browserCdpClient.on("Browser.downloadProgress", (e) => {
    if (!s(this, qn).has(e.guid) || e.state === "inProgress")
      return;
    const t = s(this, qn).get(e.guid);
    switch (e.state) {
      case "canceled":
        s(this, _e).registerEvent({
          type: "event",
          method: z.ChromiumBidi.BrowsingContext.EventNames.DownloadEnd,
          params: {
            status: "canceled",
            context: this.id,
            navigation: e.guid,
            timestamp: (0, sn.getTimestamp)(),
            url: t
          }
        }, this.id);
        break;
      case "completed":
        s(this, _e).registerEvent({
          type: "event",
          method: z.ChromiumBidi.BrowsingContext.EventNames.DownloadEnd,
          params: {
            filepath: e.filePath ?? null,
            status: "complete",
            context: this.id,
            navigation: e.guid,
            timestamp: (0, sn.getTimestamp)(),
            url: t
          }
        }, this.id);
        break;
      default:
        throw new z.UnknownErrorException(`Unknown download state: ${e.state}`);
    }
  });
}, iu = new WeakSet(), bf = function(e) {
  switch (e) {
    case "alert":
      return "alert";
    case "beforeunload":
      return "beforeunload";
    case "confirm":
      return "confirm";
    case "prompt":
      return "prompt";
  }
}, /**
 * Returns either custom UserContext's prompt handler, global or default one.
 */
Cf = function(e) {
  var n, o, a, c, p, l, d, h;
  const t = "dismiss", r = s(this, Hn).getActiveConfig(this.top.id, this.userContext);
  switch (e) {
    case "alert":
      return ((n = r.userPromptHandler) == null ? void 0 : n.alert) ?? ((o = r.userPromptHandler) == null ? void 0 : o.default) ?? t;
    case "beforeunload":
      return ((a = r.userPromptHandler) == null ? void 0 : a.beforeUnload) ?? ((c = r.userPromptHandler) == null ? void 0 : c.default) ?? "accept";
    case "confirm":
      return ((p = r.userPromptHandler) == null ? void 0 : p.confirm) ?? ((l = r.userPromptHandler) == null ? void 0 : l.default) ?? t;
    case "prompt":
      return ((d = r.userPromptHandler) == null ? void 0 : d.prompt) ?? ((h = r.userPromptHandler) == null ? void 0 : h.default) ?? t;
  }
}, kc = function(e) {
  e === void 0 || s(this, et) === e || (m(this, G, ul).call(this), f(this, et, e), m(this, G, _c).call(this, !0));
}, ul = function() {
  var e, t;
  s(this, Re).DOMContentLoaded.isFinished ? s(this, Re).DOMContentLoaded = new Vs.Deferred() : (e = s(this, tt)) == null || e.call(this, hn.LOGGER_PREFIX, "Document changed (DOMContentLoaded)"), s(this, Re).load.isFinished ? s(this, Re).load = new Vs.Deferred() : (t = s(this, tt)) == null || t.call(this, hn.LOGGER_PREFIX, "Document changed (load)");
}, xf = function() {
  s(this, Re).DOMContentLoaded.isFinished || s(this, Re).DOMContentLoaded.reject(new z.UnknownErrorException("navigation canceled")), s(this, Re).load.isFinished || s(this, Re).load.reject(new z.UnknownErrorException("navigation canceled"));
}, dl = async function(e, t, r) {
  if (await Promise.all([r.committed, t]), e !== "none") {
    if (r.isFragmentNavigation === !0) {
      await r.finished;
      return;
    }
    if (e === "interactive") {
      await s(this, Re).DOMContentLoaded;
      return;
    }
    if (e === "complete") {
      await s(this, Re).load;
      return;
    }
    throw new z.InvalidArgumentException(`Wait condition ${e} is not supported`);
  }
}, Ef = async function(e) {
  switch (e.type) {
    case "box":
      return { x: e.x, y: e.y, width: e.width, height: e.height };
    case "element": {
      const t = await this.getOrCreateHiddenSandbox(), r = await t.callFunction(String((n) => n instanceof Element), !1, { type: "undefined" }, [e.element]);
      if (r.type === "exception")
        throw new z.NoSuchElementException(`Element '${e.element.sharedId}' was not found`);
      if ((0, Vi.assert)(r.result.type === "boolean"), !r.result.value)
        throw new z.NoSuchElementException(`Node '${e.element.sharedId}' is not an Element`);
      {
        const n = await t.callFunction(String((a) => {
          const c = a.getBoundingClientRect();
          return {
            x: c.x,
            y: c.y,
            height: c.height,
            width: c.width
          };
        }), !1, { type: "undefined" }, [e.element]);
        (0, Vi.assert)(n.type === "success");
        const o = zh(n.result);
        if (!o)
          throw new z.UnableToCaptureScreenException(`Could not get bounding box for Element '${e.element.sharedId}'`);
        return o;
      }
    }
  }
}, Sf = async function(e, t, r, n) {
  switch (t.type) {
    case "context":
      throw new Error("Unreachable");
    case "css":
      return {
        functionDeclaration: String((o, a, ...c) => {
          const p = (d) => {
            if (!(d instanceof HTMLElement || d instanceof Document || d instanceof DocumentFragment || d instanceof SVGElement))
              throw new Error("startNodes in css selector should be HTMLElement, SVGElement or Document or DocumentFragment");
            return [...d.querySelectorAll(o)];
          };
          c = c.length > 0 ? c : [document];
          const l = c.map((d) => (
            // TODO: stop search early if `maxNodeCount` is reached.
            p(d)
          )).flat(1);
          return a === 0 ? l : l.slice(0, a);
        }),
        argumentsLocalValues: [
          // `cssSelector`
          { type: "string", value: t.value },
          // `maxNodeCount` with `0` means no limit.
          { type: "number", value: r ?? 0 },
          // `startNodes`
          ...n
        ]
      };
    case "xpath":
      return {
        functionDeclaration: String((o, a, ...c) => {
          const l = new XPathEvaluator().createExpression(o), d = (g) => {
            const x = l.evaluate(g, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE), E = [];
            for (let P = 0; P < x.snapshotLength; P++)
              E.push(x.snapshotItem(P));
            return E;
          };
          c = c.length > 0 ? c : [document];
          const h = c.map((g) => (
            // TODO: stop search early if `maxNodeCount` is reached.
            d(g)
          )).flat(1);
          return a === 0 ? h : h.slice(0, a);
        }),
        argumentsLocalValues: [
          // `xPathSelector`
          { type: "string", value: t.value },
          // `maxNodeCount` with `0` means no limit.
          { type: "number", value: r ?? 0 },
          // `startNodes`
          ...n
        ]
      };
    case "innerText":
      if (t.value === "")
        throw new z.InvalidSelectorException("innerText locator cannot be empty");
      return {
        functionDeclaration: String((o, a, c, p, l, ...d) => {
          const h = c ? o.toUpperCase() : o, g = (E, P) => {
            var T;
            const C = [];
            if (E instanceof DocumentFragment || E instanceof Document)
              return [...E.children].forEach((w) => (
                // `currentMaxDepth` is not decremented intentionally according to
                // https://github.com/w3c/webdriver-bidi/pull/713.
                C.push(...g(w, P))
              )), C;
            if (!(E instanceof HTMLElement))
              return [];
            const b = E, N = c ? (T = b.innerText) == null ? void 0 : T.toUpperCase() : b.innerText;
            if (!N.includes(h))
              return [];
            const v = [];
            for (const R of b.children)
              R instanceof HTMLElement && v.push(R);
            if (v.length === 0)
              a && N === h ? C.push(b) : a || C.push(b);
            else {
              const R = (
                // Don't search deeper if `maxDepth` is reached.
                P <= 0 ? [] : v.map((w) => g(w, P - 1)).flat(1)
              );
              R.length === 0 ? (!a || N === h) && C.push(b) : C.push(...R);
            }
            return C;
          };
          d = d.length > 0 ? d : [document];
          const x = d.map((E) => (
            // TODO: stop search early if `maxNodeCount` is reached.
            g(E, l)
          )).flat(1);
          return p === 0 ? x : x.slice(0, p);
        }),
        argumentsLocalValues: [
          // `innerTextSelector`
          { type: "string", value: t.value },
          // `fullMatch` with default `true`.
          { type: "boolean", value: t.matchType !== "partial" },
          // `ignoreCase` with default `false`.
          { type: "boolean", value: t.ignoreCase === !0 },
          // `maxNodeCount` with `0` means no limit.
          { type: "number", value: r ?? 0 },
          // `maxDepth` with default `1000` (same as default full serialization depth).
          { type: "number", value: t.maxDepth ?? 1e3 },
          // `startNodes`
          ...n
        ]
      };
    case "accessibility": {
      if (!t.value.name && !t.value.role)
        throw new z.InvalidSelectorException("Either name or role has to be specified");
      await Promise.all([
        s(this, K).cdpClient.sendCommand("Accessibility.enable"),
        s(this, K).cdpClient.sendCommand("Accessibility.getRootAXNode")
      ]);
      const o = await e.evaluate(
        /* expression=*/
        "({getAccessibleName, getAccessibleRole})",
        /* awaitPromise=*/
        !1,
        "root",
        /* serializationOptions= */
        void 0,
        /* userActivation=*/
        !1,
        /* includeCommandLineApi=*/
        !0
      );
      if (o.type !== "success")
        throw new Error("Could not get bindings");
      if (o.result.type !== "object")
        throw new Error("Could not get bindings");
      return {
        functionDeclaration: String((a, c, p, l, ...d) => {
          const h = [];
          let g = !1;
          function x(E, P) {
            if (!g)
              for (const C of E) {
                let b = !0;
                if (P.role) {
                  const v = p.getAccessibleRole(C);
                  P.role !== v && (b = !1);
                }
                if (P.name) {
                  const v = p.getAccessibleName(C);
                  P.name !== v && (b = !1);
                }
                if (b) {
                  if (l !== 0 && h.length === l) {
                    g = !0;
                    break;
                  }
                  h.push(C);
                }
                const N = [];
                for (const v of C.children)
                  v instanceof HTMLElement && N.push(v);
                x(N, P);
              }
          }
          return d = d.length > 0 ? d : Array.from(document.documentElement.children).filter((E) => E instanceof HTMLElement), x(d, {
            role: c,
            name: a
          }), h;
        }),
        argumentsLocalValues: [
          // `name`
          { type: "string", value: t.value.name || "" },
          // `role`
          { type: "string", value: t.value.role || "" },
          // `bindings`.
          { handle: o.result.handle },
          // `maxNodeCount` with `0` means no limit.
          { type: "number", value: r ?? 0 },
          // `startNodes`
          ...n
        ]
      };
    }
  }
}, Pf = async function(e, t, r, n, o) {
  var l, d, h;
  if (t.type === "context") {
    if (r.length !== 0)
      throw new z.InvalidArgumentException("Start nodes are not supported");
    const g = t.value.context;
    if (!g)
      throw new z.InvalidSelectorException("Invalid context");
    const E = s(this, lt).getContext(g).parent;
    if (!E)
      throw new z.InvalidArgumentException("This context has no container");
    try {
      const { backendNodeId: P } = await s(E, K).cdpClient.sendCommand("DOM.getFrameOwner", {
        frameId: g
      }), { object: C } = await s(E, K).cdpClient.sendCommand("DOM.resolveNode", {
        backendNodeId: P
      }), b = await e.callFunction("function () { return this; }", !1, { handle: C.objectId }, [], "none", o);
      if (b.type === "exception")
        throw new Error("Unknown exception");
      return { nodes: [b.result] };
    } catch {
      throw new z.InvalidArgumentException("Context does not exist");
    }
  }
  const a = await m(this, G, Sf).call(this, e, t, n, r);
  o = {
    ...o,
    // The returned object is an array of nodes, so no need in deeper JS serialization.
    maxObjectDepth: 1
  };
  const c = await e.callFunction(a.functionDeclaration, !1, { type: "undefined" }, a.argumentsLocalValues, "none", o);
  if (c.type !== "success")
    throw (l = s(this, tt)) == null || l.call(this, hn.LOGGER_PREFIX, "Failed locateNodesByLocator", c), // CSS selector.
    (d = c.exceptionDetails.text) != null && d.endsWith("is not a valid selector.") || // XPath selector.
    (h = c.exceptionDetails.text) != null && h.endsWith("is not a valid XPath expression.") ? new z.InvalidSelectorException(`Not valid selector ${typeof t.value == "string" ? t.value : JSON.stringify(t.value)}`) : c.exceptionDetails.text === "Error: startNodes in css selector should be HTMLElement, SVGElement or Document or DocumentFragment" ? new z.InvalidArgumentException("startNodes in css selector should be HTMLElement, SVGElement or Document or DocumentFragment") : new z.UnknownErrorException(`Unexpected error in selector script: ${c.exceptionDetails.text}`);
  if (c.result.type !== "array")
    throw new z.UnknownErrorException(`Unexpected selector script result type: ${c.result.type}`);
  return { nodes: c.result.value.map((g) => {
    if (g.type !== "node")
      throw new z.UnknownErrorException(`Unexpected selector script result element: ${g.type}`);
    return g;
  }) };
}, zt = function() {
  const e = /* @__PURE__ */ new Set();
  return e.add(this.cdpTarget), this.allChildren.forEach((t) => e.add(t.cdpTarget)), Array.from(e);
}, u(zc, iu), O(zc, "LOGGER_PREFIX", `${Gi.LogType.debug}:browsingContext`);
Ui.BrowsingContextImpl = zc;
hn = zc;
function If(i) {
  return ["://", ""].includes(i) && (i = "null"), i;
}
function Av(i) {
  const { quality: e, type: t } = i.format ?? {
    type: "image/png"
  };
  switch (t) {
    case "image/png":
      return { format: "png" };
    case "image/jpeg":
      return {
        format: "jpeg",
        ...e === void 0 ? {} : { quality: Math.round(e * 100) }
      };
    case "image/webp":
      return {
        format: "webp",
        ...e === void 0 ? {} : { quality: Math.round(e * 100) }
      };
  }
  throw new z.InvalidArgumentException(`Image format '${t}' is not a supported format`);
}
function zh(i) {
  var o, a, c, p;
  if (i.type !== "object" || i.value === void 0)
    return;
  const e = (o = i.value.find(([l]) => l === "x")) == null ? void 0 : o[1], t = (a = i.value.find(([l]) => l === "y")) == null ? void 0 : a[1], r = (c = i.value.find(([l]) => l === "height")) == null ? void 0 : c[1], n = (p = i.value.find(([l]) => l === "width")) == null ? void 0 : p[1];
  if (!((e == null ? void 0 : e.type) !== "number" || (t == null ? void 0 : t.type) !== "number" || (r == null ? void 0 : r.type) !== "number" || (n == null ? void 0 : n.type) !== "number"))
    return {
      x: e.value,
      y: t.value,
      width: n.value,
      height: r.value
    };
}
function Wh(i) {
  return {
    ...i.width < 0 ? {
      x: i.x + i.width,
      width: -i.width
    } : {
      x: i.x,
      width: i.width
    },
    ...i.height < 0 ? {
      y: i.y + i.height,
      height: -i.height
    } : {
      y: i.y,
      height: i.height
    }
  };
}
function Bv(i, e) {
  i = Wh(i), e = Wh(e);
  const t = Math.max(i.x, e.x), r = Math.max(i.y, e.y);
  return {
    x: t,
    y: r,
    width: Math.max(Math.min(i.x + i.width, e.x + e.width) - t, 0),
    height: Math.max(Math.min(i.y + i.height, e.y + e.height) - r, 0)
  };
}
function Pd(i) {
  if (i = i.trim(), !/^[0-9]+$/.test(i))
    throw new z.InvalidArgumentException(`Invalid integer: ${i}`);
  return parseInt(i);
}
var td = {};
Object.defineProperty(td, "__esModule", { value: !0 });
td.WorkerRealm = void 0;
const Fv = nc;
var ta, zn;
class Mv extends Fv.Realm {
  constructor(t, r, n, o, a, c, p, l, d) {
    super(t, r, n, o, a, p, l);
    u(this, ta);
    u(this, zn);
    f(this, zn, c), f(this, ta, d), this.initialize();
  }
  get associatedBrowsingContexts() {
    return s(this, zn).flatMap((t) => t.associatedBrowsingContexts);
  }
  get realmType() {
    return s(this, ta);
  }
  get source() {
    var t;
    return {
      realm: this.realmId,
      // This is a hack to make Puppeteer able to track workers.
      // TODO: remove after Puppeteer tracks workers by owners and use the base version.
      context: (t = this.associatedBrowsingContexts[0]) == null ? void 0 : t.id
    };
  }
  get realmInfo() {
    const t = s(this, zn).map((n) => n.realmId), { realmType: r } = this;
    switch (r) {
      case "dedicated-worker": {
        const n = t[0];
        if (n === void 0 || t.length !== 1)
          throw new Error("Dedicated worker must have exactly one owner");
        return {
          ...this.baseInfo,
          type: r,
          owners: [n]
        };
      }
      case "service-worker":
      case "shared-worker":
        return {
          ...this.baseInfo,
          type: r
        };
    }
  }
}
ta = new WeakMap(), zn = new WeakMap();
td.WorkerRealm = Mv;
var sd = {}, rd = {}, nd = {};
Object.defineProperty(nd, "__esModule", { value: !0 });
nd.logMessageFormatter = Tf;
nd.getRemoteValuesText = hl;
const jv = us, _f = ["%s", "%d", "%i", "%f", "%o", "%O", "%c"];
function kf(i) {
  return _f.some((e) => i.includes(e));
}
function Tf(i) {
  let e = "";
  const t = i[0].value.toString(), r = i.slice(1, void 0), n = t.split(new RegExp(_f.map((o) => `(${o})`).join("|"), "g"));
  for (const o of n)
    if (!(o === void 0 || o === ""))
      if (kf(o)) {
        const a = r.shift();
        (0, jv.assert)(a, `Less value is provided: "${hl(i, !1)}"`), o === "%s" ? e += ih(a) : o === "%d" || o === "%i" ? a.type === "bigint" || a.type === "number" || a.type === "string" ? e += parseInt(a.value.toString(), 10) : e += "NaN" : o === "%f" ? a.type === "bigint" || a.type === "number" || a.type === "string" ? e += parseFloat(a.value.toString()) : e += "NaN" : e += ll(a);
      } else
        e += o;
  if (r.length > 0)
    throw new Error(`More value is provided: "${hl(i, !1)}"`);
  return e;
}
function ll(i) {
  var e;
  if (i.type !== "array" && i.type !== "bigint" && i.type !== "date" && i.type !== "number" && i.type !== "object" && i.type !== "string")
    return ih(i);
  if (i.type === "bigint")
    return `${i.value.toString()}n`;
  if (i.type === "number")
    return i.value.toString();
  if (["date", "string"].includes(i.type))
    return JSON.stringify(i.value);
  if (i.type === "object")
    return `{${i.value.map((t) => `${JSON.stringify(t[0])}:${ll(t[1])}`).join(",")}}`;
  if (i.type === "array")
    return `[${((e = i.value) == null ? void 0 : e.map((t) => ll(t)).join(",")) ?? ""}]`;
  throw Error(`Invalid value type: ${i}`);
}
function ih(i) {
  var e, t, r, n;
  if (!Object.hasOwn(i, "value"))
    return i.type;
  switch (i.type) {
    case "string":
    case "number":
    case "boolean":
    case "bigint":
      return String(i.value);
    case "regexp":
      return `/${i.value.pattern}/${i.value.flags ?? ""}`;
    case "date":
      return new Date(i.value).toString();
    case "object":
      return `Object(${((e = i.value) == null ? void 0 : e.length) ?? ""})`;
    case "array":
      return `Array(${((t = i.value) == null ? void 0 : t.length) ?? ""})`;
    case "map":
      return `Map(${(r = i.value) == null ? void 0 : r.length})`;
    case "set":
      return `Set(${(n = i.value) == null ? void 0 : n.length})`;
    default:
      return i.type;
  }
}
function hl(i, e) {
  const t = i[0];
  return t ? t.type === "string" && kf(t.value.toString()) && e ? Tf(i) : i.map((r) => ih(r)).join(" ") : "";
}
var pl;
Object.defineProperty(rd, "__esModule", { value: !0 });
rd.LogManager = void 0;
const wc = se, Kh = Te, Uv = nd;
function Vh(i) {
  const e = i == null ? void 0 : i.callFrames.map((t) => ({
    columnNumber: t.columnNumber,
    functionName: t.functionName,
    lineNumber: t.lineNumber,
    url: t.url
  }));
  return e ? { callFrames: e } : void 0;
}
function $v(i) {
  return ["error", "assert"].includes(i) ? "error" : ["debug", "trace"].includes(i) ? "debug" : ["warn", "warning"].includes(i) ? "warn" : "info";
}
function Lv(i) {
  switch (i) {
    case "warning":
      return "warn";
    case "startGroup":
      return "group";
    case "startGroupCollapsed":
      return "groupCollapsed";
    case "endGroup":
      return "groupEnd";
  }
  return i;
}
var Wn, Kn, ks, Vn, Bi, Df, Nf, ou, Of;
class oh {
  constructor(e, t, r, n) {
    u(this, Bi);
    u(this, Wn);
    u(this, Kn);
    u(this, ks);
    u(this, Vn);
    f(this, ks, e), f(this, Kn, t), f(this, Wn, r), f(this, Vn, n);
  }
  static create(e, t, r, n) {
    var a;
    const o = new pl(e, t, r, n);
    return m(a = o, Bi, Nf).call(a), o;
  }
}
Wn = new WeakMap(), Kn = new WeakMap(), ks = new WeakMap(), Vn = new WeakMap(), Bi = new WeakSet(), Df = async function(e, t) {
  switch (e.type) {
    case "undefined":
      return { type: "undefined" };
    case "boolean":
      return { type: "boolean", value: e.value };
    case "string":
      return { type: "string", value: e.value };
    case "number":
      return { type: "number", value: e.unserializableValue ?? e.value };
    case "bigint":
      if (e.unserializableValue !== void 0 && e.unserializableValue[e.unserializableValue.length - 1] === "n")
        return {
          type: e.type,
          value: e.unserializableValue.slice(0, -1)
        };
      break;
    case "object":
      if (e.subtype === "null")
        return { type: "null" };
      break;
  }
  return await t.serializeCdpObject(
    e,
    "none"
    /* Script.ResultOwnership.None */
  );
}, Nf = function() {
  s(this, ks).cdpClient.on("Runtime.consoleAPICalled", (e) => {
    var n;
    const t = s(this, Kn).findRealm({
      cdpSessionId: s(this, ks).cdpSessionId,
      executionContextId: e.executionContextId
    });
    if (t === void 0) {
      (n = s(this, Vn)) == null || n.call(this, Kh.LogType.cdp, e);
      return;
    }
    const r = Promise.all(e.args.map((o) => m(this, Bi, Df).call(this, o, t)));
    for (const o of t.associatedBrowsingContexts)
      s(this, Wn).registerPromiseEvent(r.then((a) => ({
        kind: "success",
        value: {
          type: "event",
          method: wc.ChromiumBidi.Log.EventNames.LogEntryAdded,
          params: {
            level: $v(e.type),
            source: t.source,
            text: (0, Uv.getRemoteValuesText)(a, !0),
            timestamp: Math.round(e.timestamp),
            stackTrace: Vh(e.stackTrace),
            type: "console",
            method: Lv(e.type),
            args: a
          }
        }
      }), (a) => ({
        kind: "error",
        error: a
      })), o.id, wc.ChromiumBidi.Log.EventNames.LogEntryAdded);
  }), s(this, ks).cdpClient.on("Runtime.exceptionThrown", (e) => {
    var r, n;
    const t = s(this, Kn).findRealm({
      cdpSessionId: s(this, ks).cdpSessionId,
      executionContextId: e.exceptionDetails.executionContextId
    });
    if (t === void 0) {
      (r = s(this, Vn)) == null || r.call(this, Kh.LogType.cdp, e);
      return;
    }
    for (const o of t.associatedBrowsingContexts)
      s(this, Wn).registerPromiseEvent(m(n = pl, ou, Of).call(n, e, t).then((a) => ({
        kind: "success",
        value: {
          type: "event",
          method: wc.ChromiumBidi.Log.EventNames.LogEntryAdded,
          params: {
            level: "error",
            source: t.source,
            text: a,
            timestamp: Math.round(e.timestamp),
            stackTrace: Vh(e.exceptionDetails.stackTrace),
            type: "javascript"
          }
        }
      }), (a) => ({
        kind: "error",
        error: a
      })), o.id, wc.ChromiumBidi.Log.EventNames.LogEntryAdded);
  });
}, ou = new WeakSet(), Of = async function(e, t) {
  return e.exceptionDetails.exception ? t === void 0 ? JSON.stringify(e.exceptionDetails.exception) : await t.stringifyObject(e.exceptionDetails.exception) : e.exceptionDetails.text;
}, u(oh, ou);
rd.LogManager = oh;
pl = oh;
var ah = {}, id = {};
Object.defineProperty(id, "__esModule", { value: !0 });
id.CollectorsStorage = void 0;
const Xi = M, Id = Te, qv = qt;
var es, Gn, Xn, Jn, Cr, $s, Tc, Rf;
class Hv {
  constructor(e, t) {
    u(this, $s);
    u(this, es, /* @__PURE__ */ new Map());
    u(this, Gn, /* @__PURE__ */ new Map());
    u(this, Xn, /* @__PURE__ */ new Map());
    u(this, Jn);
    u(this, Cr);
    f(this, Jn, e), f(this, Cr, t);
  }
  addDataCollector(e) {
    if (e.maxEncodedDataSize < 1 || e.maxEncodedDataSize > s(this, Jn))
      throw new Xi.InvalidArgumentException(`Max encoded data size should be between 1 and ${s(this, Jn)}`);
    const t = (0, qv.uuidv4)();
    return s(this, es).set(t, e), t;
  }
  isCollected(e, t, r) {
    if (r !== void 0 && !s(this, es).has(r))
      throw new Xi.NoSuchNetworkCollectorException(`Unknown collector ${r}`);
    if (t === void 0)
      return this.isCollected(e, "response", r) || this.isCollected(e, "request", r);
    const n = m(this, $s, Tc).call(this, t).get(e);
    return n === void 0 || n.size === 0 ? !1 : r === void 0 ? !0 : !!n.has(r);
  }
  disownData(e, t, r) {
    var o, a;
    const n = m(this, $s, Tc).call(this, t);
    r !== void 0 && ((o = n.get(e)) == null || o.delete(r)), (r === void 0 || ((a = n.get(e)) == null ? void 0 : a.size) === 0) && n.delete(e);
  }
  collectIfNeeded(e, t, r, n) {
    const o = [...s(this, es).keys()].filter((a) => m(this, $s, Rf).call(this, a, e, t, r, n));
    o.length > 0 && m(this, $s, Tc).call(this, t).set(e.id, new Set(o));
  }
  removeDataCollector(e) {
    if (!s(this, es).has(e))
      throw new Xi.NoSuchNetworkCollectorException(`Collector ${e} does not exist`);
    s(this, es).delete(e);
    const t = [];
    for (const [r, n] of s(this, Gn))
      n.has(e) && (n.delete(e), n.size === 0 && (s(this, Gn).delete(r), t.push(r)));
    for (const [r, n] of s(this, Xn))
      n.has(e) && (n.delete(e), n.size === 0 && (s(this, Xn).delete(r), t.push(r)));
    return t;
  }
}
es = new WeakMap(), Gn = new WeakMap(), Xn = new WeakMap(), Jn = new WeakMap(), Cr = new WeakMap(), $s = new WeakSet(), Tc = function(e) {
  switch (e) {
    case "response":
      return s(this, Gn);
    case "request":
      return s(this, Xn);
    default:
      throw new Xi.UnsupportedOperationException(`Unsupported data type ${e}`);
  }
}, Rf = function(e, t, r, n, o) {
  var c, p, l;
  const a = s(this, es).get(e);
  if (a === void 0)
    throw new Xi.NoSuchNetworkCollectorException(`Unknown collector ${e}`);
  return a.userContexts && !a.userContexts.includes(o) || a.contexts && !a.contexts.includes(n) || !a.dataTypes.includes(r) ? !1 : r === "request" && t.bodySize > a.maxEncodedDataSize ? ((c = s(this, Cr)) == null || c.call(this, Id.LogType.debug, `Request's ${t.id} body size is too big for the collector ${e}`), !1) : r === "response" && t.encodedResponseBodySize > a.maxEncodedDataSize ? ((p = s(this, Cr)) == null || p.call(this, Id.LogType.debug, `Request's ${t.id} response is too big for the collector ${e}`), !1) : ((l = s(this, Cr)) == null || l.call(this, Id.LogType.debug, `Collector ${e} collected ${r} of ${t.id}`), !0);
};
id.CollectorsStorage = Hv;
var od = {}, ic = {};
Object.defineProperty(ic, "__esModule", { value: !0 });
ic.DefaultMap = void 0;
var sa;
class zv extends Map {
  constructor(t, r) {
    super(r);
    /** The default value to return whenever a key is not present in the map. */
    u(this, sa);
    f(this, sa, t);
  }
  get(t) {
    return this.has(t) || this.set(t, s(this, sa).call(this, t)), super.get(t);
  }
}
sa = new WeakMap();
ic.DefaultMap = zv;
var Dc;
Object.defineProperty(od, "__esModule", { value: !0 });
od.NetworkRequest = void 0;
const qe = se, nn = us, Wv = ic, Gh = Jr, _d = Te, ce = ye, Kv = new RegExp('(?<=realm=").*(?=")');
var Yn, be, Ke, Ts, Zn, j, _t, Qn, U, ei, kt, Tt, xr, Er, A, fl, ml, Af, Bf, Ff, gl, ro, pn, wl, Mf, jf, Uf, yl, Gs, ot, Nc, vl, fn, mn, gn, Oc, $f, Lf, qf, Hf, zf, Wf, Kf, Rc, au, Vf;
class Wc {
  constructor(e, t, r, n, o = 0, a) {
    u(this, A);
    /**
     * Each network request has an associated request id, which is a string
     * uniquely identifying that request.
     *
     * The identifier for a request resulting from a redirect matches that of the
     * request that initiated it.
     */
    u(this, Yn);
    u(this, be);
    /**
     * Indicates the network intercept phase, if the request is currently blocked.
     * Undefined necessarily implies that the request is not blocked.
     */
    u(this, Ke);
    u(this, Ts, !1);
    u(this, Zn);
    u(this, j, {});
    u(this, _t);
    u(this, Qn);
    u(this, U, {
      decodedSize: 0,
      encodedSize: 0
    });
    u(this, ei);
    u(this, kt);
    u(this, Tt);
    u(this, xr);
    u(this, Er, {
      [qe.ChromiumBidi.Network.EventNames.AuthRequired]: !1,
      [qe.ChromiumBidi.Network.EventNames.BeforeRequestSent]: !1,
      [qe.ChromiumBidi.Network.EventNames.FetchError]: !1,
      [qe.ChromiumBidi.Network.EventNames.ResponseCompleted]: !1,
      [qe.ChromiumBidi.Network.EventNames.ResponseStarted]: !1
    });
    O(this, "waitNextPhase", new Gh.Deferred());
    f(this, Yn, e), f(this, ei, t), f(this, kt, r), f(this, Tt, n), f(this, Zn, o), f(this, xr, a);
  }
  get id() {
    return s(this, Yn);
  }
  get fetchId() {
    return s(this, be);
  }
  /**
   * When blocked returns the phase for it
   */
  get interceptPhase() {
    return s(this, Ke);
  }
  get url() {
    var r, n, o, a, c, p, l, d;
    const e = ((r = s(this, j).info) == null ? void 0 : r.request.urlFragment) ?? ((n = s(this, j).paused) == null ? void 0 : n.request.urlFragment) ?? "";
    return `${((o = s(this, U).paused) == null ? void 0 : o.request.url) ?? ((a = s(this, _t)) == null ? void 0 : a.url) ?? ((c = s(this, U).info) == null ? void 0 : c.url) ?? ((p = s(this, j).auth) == null ? void 0 : p.request.url) ?? ((l = s(this, j).info) == null ? void 0 : l.request.url) ?? ((d = s(this, j).paused) == null ? void 0 : d.request.url) ?? Dc.unknownParameter}${e}`;
  }
  get redirectCount() {
    return s(this, Zn);
  }
  get cdpTarget() {
    return s(this, Tt);
  }
  /** CdpTarget can be changed when frame is moving out of process. */
  updateCdpTarget(e) {
    var t;
    e !== s(this, Tt) && ((t = s(this, xr)) == null || t.call(this, _d.LogType.debugInfo, `Request ${this.id} was moved from ${s(this, Tt).id} to ${e.id}`), f(this, Tt, e));
  }
  get cdpClient() {
    return s(this, Tt).cdpClient;
  }
  isRedirecting() {
    return !!s(this, j).info;
  }
  get bodySize() {
    var e, t, r, n, o;
    return typeof ((e = s(this, _t)) == null ? void 0 : e.bodySize) == "number" ? s(this, _t).bodySize : ((t = s(this, j).info) == null ? void 0 : t.request.postDataEntries) !== void 0 ? (0, ce.bidiBodySizeFromCdpPostDataEntries)((r = s(this, j).info) == null ? void 0 : r.request.postDataEntries) : m(this, A, gl).call(this, (n = s(this, j).info) == null ? void 0 : n.request.headers) ?? m(this, A, gl).call(this, (o = s(this, j).extraInfo) == null ? void 0 : o.headers) ?? 0;
  }
  handleRedirect(e) {
    s(this, U).hasExtraInfo = !1, s(this, U).decodedSize = 0, s(this, U).encodedSize = 0, s(this, U).info = e.redirectResponse, m(this, A, ot).call(this, {
      wasRedirected: !0
    });
  }
  onRequestWillBeSentEvent(e) {
    s(this, j).info = e, s(this, kt).collectIfNeeded(
      this,
      "request"
      /* Network.DataType.Request */
    ), m(this, A, ot).call(this);
  }
  onRequestWillBeSentExtraInfoEvent(e) {
    s(this, j).extraInfo = e, m(this, A, ot).call(this);
  }
  onResponseReceivedExtraInfoEvent(e) {
    e.statusCode >= 300 && e.statusCode <= 399 && s(this, j).info && e.headers.location === s(this, j).info.request.url || (s(this, U).extraInfo = e, m(this, A, ot).call(this));
  }
  onResponseReceivedEvent(e) {
    s(this, U).hasExtraInfo = e.hasExtraInfo, s(this, U).info = e.response, s(this, kt).collectIfNeeded(
      this,
      "response"
      /* Network.DataType.Response */
    ), m(this, A, ot).call(this);
  }
  onServedFromCache() {
    f(this, Ts, !0), m(this, A, ot).call(this);
  }
  onLoadingFinishedEvent(e) {
    s(this, U).loadingFinished = e, m(this, A, ot).call(this);
  }
  onDataReceivedEvent(e) {
    s(this, U).decodedSize += e.dataLength, s(this, U).encodedSize += e.encodedDataLength;
  }
  onLoadingFailedEvent(e) {
    s(this, U).loadingFailed = e, m(this, A, ot).call(this), m(this, A, mn).call(this, () => ({
      method: qe.ChromiumBidi.Network.EventNames.FetchError,
      params: {
        ...m(this, A, gn).call(this),
        errorText: e.errorText
      }
    }));
  }
  /** @see https://chromedevtools.github.io/devtools-protocol/tot/Fetch/#method-failRequest */
  async failRequest(e) {
    (0, nn.assert)(s(this, be), "Network Interception not set-up."), await this.cdpClient.sendCommand("Fetch.failRequest", {
      requestId: s(this, be),
      errorReason: e
    }), f(this, Ke, void 0);
  }
  onRequestPaused(e) {
    f(this, be, e.requestId), e.responseStatusCode || e.responseErrorReason ? (s(this, U).paused = e, m(this, A, Gs).call(this, "responseStarted") && // CDP may emit multiple events for a single request
    !s(this, Er)[qe.ChromiumBidi.Network.EventNames.ResponseStarted] && // Continue all response that have not enabled Network domain
    s(this, be) !== this.id ? f(this, Ke, "responseStarted") : m(this, A, vl).call(this)) : (s(this, j).paused = e, m(this, A, Gs).call(this, "beforeRequestSent") && // CDP may emit multiple events for a single request
    !s(this, Er)[qe.ChromiumBidi.Network.EventNames.BeforeRequestSent] && // Continue all requests that have not enabled Network domain
    s(this, be) !== this.id ? f(this, Ke, "beforeRequestSent") : m(this, A, Nc).call(this)), m(this, A, ot).call(this);
  }
  onAuthRequired(e) {
    f(this, be, e.requestId), s(this, j).auth = e, m(this, A, Gs).call(this, "authRequired") && // Continue all auth requests that have not enabled Network domain
    s(this, be) !== this.id ? (f(this, Ke, "authRequired"), m(this, A, ot).call(this)) : m(this, A, fn).call(this, {
      response: "Default"
    }), m(this, A, mn).call(this, () => ({
      method: qe.ChromiumBidi.Network.EventNames.AuthRequired,
      params: {
        ...m(this, A, gn).call(this, "authRequired"),
        response: m(this, A, Oc).call(this)
      }
    }));
  }
  /** @see https://chromedevtools.github.io/devtools-protocol/tot/Fetch/#method-continueRequest */
  async continueRequest(e = {}) {
    const t = m(this, A, Rc).call(this, e.headers, e.cookies), r = (0, ce.cdpFetchHeadersFromBidiNetworkHeaders)(t), n = Xh(e.body);
    await m(this, A, Nc).call(this, {
      url: e.url,
      method: e.method,
      headers: r,
      postData: n
    }), f(this, _t, {
      url: e.url,
      method: e.method,
      headers: e.headers,
      cookies: e.cookies,
      bodySize: Vv(e.body)
    });
  }
  /** @see https://chromedevtools.github.io/devtools-protocol/tot/Fetch/#method-continueResponse */
  async continueResponse(e = {}) {
    var t, r, n;
    if (this.interceptPhase === "authRequired")
      if (e.credentials)
        await Promise.all([
          this.waitNextPhase,
          await m(this, A, fn).call(this, {
            response: "ProvideCredentials",
            username: e.credentials.username,
            password: e.credentials.password
          })
        ]);
      else
        return await m(this, A, fn).call(this, {
          response: "ProvideCredentials"
        });
    if (s(this, Ke) === "responseStarted") {
      const o = m(this, A, Rc).call(this, e.headers, e.cookies), a = (0, ce.cdpFetchHeadersFromBidiNetworkHeaders)(o);
      await m(this, A, vl).call(this, {
        responseCode: e.statusCode ?? ((t = s(this, U).paused) == null ? void 0 : t.responseStatusCode),
        responsePhrase: e.reasonPhrase ?? ((r = s(this, U).paused) == null ? void 0 : r.responseStatusText),
        responseHeaders: a ?? ((n = s(this, U).paused) == null ? void 0 : n.responseHeaders)
      }), f(this, Qn, {
        statusCode: e.statusCode,
        headers: o
      });
    }
  }
  /** @see https://chromedevtools.github.io/devtools-protocol/tot/Fetch/#method-continueWithAuth */
  async continueWithAuth(e) {
    let t, r;
    if (e.action === "provideCredentials") {
      const { credentials: o } = e;
      t = o.username, r = o.password;
    }
    const n = (0, ce.cdpAuthChallengeResponseFromBidiAuthContinueWithAuthAction)(e.action);
    await m(this, A, fn).call(this, {
      response: n,
      username: t,
      password: r
    });
  }
  /** @see https://chromedevtools.github.io/devtools-protocol/tot/Fetch/#method-provideResponse */
  async provideResponse(e) {
    if ((0, nn.assert)(s(this, be), "Network Interception not set-up."), this.interceptPhase === "authRequired")
      return await m(this, A, fn).call(this, {
        response: "ProvideCredentials"
      });
    if (!e.body && !e.headers)
      return await m(this, A, Nc).call(this);
    const t = m(this, A, Rc).call(this, e.headers, e.cookies), r = (0, ce.cdpFetchHeadersFromBidiNetworkHeaders)(t), n = e.statusCode ?? s(this, A, pn) ?? 200;
    await this.cdpClient.sendCommand("Fetch.fulfillRequest", {
      requestId: s(this, be),
      responseCode: n,
      responsePhrase: e.reasonPhrase,
      responseHeaders: r,
      body: Xh(e.body)
    }), f(this, Ke, void 0);
  }
  dispose() {
    this.waitNextPhase.reject(new Error("waitNextPhase disposed"));
  }
  get encodedResponseBodySize() {
    var e, t;
    return ((e = s(this, U).loadingFinished) == null ? void 0 : e.encodedDataLength) ?? ((t = s(this, U).info) == null ? void 0 : t.encodedDataLength) ?? s(this, U).encodedSize ?? 0;
  }
}
Yn = new WeakMap(), be = new WeakMap(), Ke = new WeakMap(), Ts = new WeakMap(), Zn = new WeakMap(), j = new WeakMap(), _t = new WeakMap(), Qn = new WeakMap(), U = new WeakMap(), ei = new WeakMap(), kt = new WeakMap(), Tt = new WeakMap(), xr = new WeakMap(), Er = new WeakMap(), A = new WeakSet(), fl = function() {
  return this.url.startsWith("data:");
}, ml = function() {
  return (
    // We can't intercept data urls from CDP
    m(this, A, fl).call(this) || // Cached requests never hit the network
    s(this, Ts)
  );
}, Af = function() {
  var e, t, r, n, o;
  return ((e = s(this, _t)) == null ? void 0 : e.method) ?? ((t = s(this, j).info) == null ? void 0 : t.request.method) ?? ((r = s(this, j).paused) == null ? void 0 : r.request.method) ?? ((n = s(this, j).auth) == null ? void 0 : n.request.method) ?? ((o = s(this, U).paused) == null ? void 0 : o.request.method);
}, Bf = function() {
  return !s(this, j).info || !s(this, j).info.loaderId || // When we navigate all CDP network events have `loaderId`
  // CDP's `loaderId` and `requestId` match when
  // that request triggered the loading
  s(this, j).info.loaderId !== s(this, j).info.requestId ? null : s(this, kt).getNavigationId(s(this, A, ro) ?? void 0);
}, Ff = function() {
  let e = [];
  return s(this, j).extraInfo && (e = s(this, j).extraInfo.associatedCookies.filter(({ blockedReasons: t }) => !Array.isArray(t) || t.length === 0).map(({ cookie: t }) => (0, ce.cdpToBiDiCookie)(t))), e;
}, gl = function(e) {
  var t;
  if (e !== void 0 && e["Content-Length"] !== void 0) {
    const r = Number.parseInt(e["Content-Length"]);
    if (Number.isInteger(r))
      return r;
    (t = s(this, xr)) == null || t.call(this, _d.LogType.debugError, "Unexpected non-integer 'Content-Length' header");
  }
}, ro = function() {
  var t, r, n, o, a, c, p, l, d, h, g;
  const e = ((t = s(this, U).paused) == null ? void 0 : t.frameId) ?? ((r = s(this, j).info) == null ? void 0 : r.frameId) ?? ((n = s(this, j).paused) == null ? void 0 : n.frameId) ?? ((o = s(this, j).auth) == null ? void 0 : o.frameId);
  if (e !== void 0)
    return e;
  if (((c = (a = s(this, j)) == null ? void 0 : a.info) == null ? void 0 : c.initiator.type) === "preflight" && ((l = (p = s(this, j)) == null ? void 0 : p.info) == null ? void 0 : l.initiator.requestId) !== void 0) {
    const x = s(this, kt).getRequestById((h = (d = s(this, j)) == null ? void 0 : d.info) == null ? void 0 : h.initiator.requestId);
    if (x !== void 0)
      return ((g = s(x, j).info) == null ? void 0 : g.frameId) ?? null;
  }
  return null;
}, pn = function() {
  var e, t, r, n;
  return ((e = s(this, Qn)) == null ? void 0 : e.statusCode) ?? ((t = s(this, U).paused) == null ? void 0 : t.responseStatusCode) ?? ((r = s(this, U).extraInfo) == null ? void 0 : r.statusCode) ?? ((n = s(this, U).info) == null ? void 0 : n.status);
}, wl = function() {
  var t, r, n;
  let e = [];
  if ((t = s(this, _t)) != null && t.headers) {
    const o = new Wv.DefaultMap(() => []);
    for (const a of s(this, _t).headers)
      o.get(a.name).push(a.value.value);
    for (const [a, c] of o.entries())
      e.push({
        name: a,
        value: {
          type: "string",
          value: c.join(`
`).trimEnd()
        }
      });
  } else
    e = [
      ...(0, ce.bidiNetworkHeadersFromCdpNetworkHeaders)((r = s(this, j).info) == null ? void 0 : r.request.headers),
      ...(0, ce.bidiNetworkHeadersFromCdpNetworkHeaders)((n = s(this, j).extraInfo) == null ? void 0 : n.headers)
    ];
  return e;
}, Mf = function() {
  var r;
  if (!s(this, U).info || !(s(this, A, pn) === 401 || s(this, A, pn) === 407))
    return;
  const e = s(this, A, pn) === 401 ? "WWW-Authenticate" : "Proxy-Authenticate", t = [];
  for (const [n, o] of Object.entries(s(this, U).info.headers))
    n.localeCompare(e, void 0, { sensitivity: "base" }) === 0 && t.push({
      scheme: o.split(" ").at(0) ?? "",
      realm: ((r = o.match(Kv)) == null ? void 0 : r.at(0)) ?? ""
    });
  return t;
}, jf = function() {
  var t, r, n, o, a, c, p, l, d, h, g, x, E, P, C, b, N, v, T, R, w, D;
  const e = (0, ce.getTiming)((0, ce.getTiming)((r = (t = s(this, U).info) == null ? void 0 : t.timing) == null ? void 0 : r.requestTime) - (0, ce.getTiming)((n = s(this, j).info) == null ? void 0 : n.timestamp));
  return {
    // TODO: Verify this is correct
    timeOrigin: Math.round((0, ce.getTiming)((o = s(this, j).info) == null ? void 0 : o.wallTime) * 1e3),
    // Timing baseline.
    // TODO: Verify this is correct.
    requestTime: 0,
    // TODO: set if redirect detected.
    redirectStart: 0,
    // TODO: set if redirect detected.
    redirectEnd: 0,
    // TODO: Verify this is correct
    // https://source.chromium.org/chromium/chromium/src/+/main:net/base/load_timing_info.h;l=145
    fetchStart: (0, ce.getTiming)((c = (a = s(this, U).info) == null ? void 0 : a.timing) == null ? void 0 : c.workerFetchStart, e),
    // fetchStart: 0,
    dnsStart: (0, ce.getTiming)((l = (p = s(this, U).info) == null ? void 0 : p.timing) == null ? void 0 : l.dnsStart, e),
    dnsEnd: (0, ce.getTiming)((h = (d = s(this, U).info) == null ? void 0 : d.timing) == null ? void 0 : h.dnsEnd, e),
    connectStart: (0, ce.getTiming)((x = (g = s(this, U).info) == null ? void 0 : g.timing) == null ? void 0 : x.connectStart, e),
    connectEnd: (0, ce.getTiming)((P = (E = s(this, U).info) == null ? void 0 : E.timing) == null ? void 0 : P.connectEnd, e),
    tlsStart: (0, ce.getTiming)((b = (C = s(this, U).info) == null ? void 0 : C.timing) == null ? void 0 : b.sslStart, e),
    requestStart: (0, ce.getTiming)((v = (N = s(this, U).info) == null ? void 0 : N.timing) == null ? void 0 : v.sendStart, e),
    // https://source.chromium.org/chromium/chromium/src/+/main:net/base/load_timing_info.h;l=196
    responseStart: (0, ce.getTiming)((R = (T = s(this, U).info) == null ? void 0 : T.timing) == null ? void 0 : R.receiveHeadersStart, e),
    responseEnd: (0, ce.getTiming)((D = (w = s(this, U).info) == null ? void 0 : w.timing) == null ? void 0 : D.receiveHeadersEnd, e)
  };
}, Uf = function() {
  this.waitNextPhase.resolve(), this.waitNextPhase = new Gh.Deferred();
}, yl = function(e) {
  return m(this, A, ml).call(this) || !s(this, Tt).isSubscribedTo(`network.${e}`) ? /* @__PURE__ */ new Set() : s(this, kt).getInterceptsForPhase(this, e);
}, Gs = function(e) {
  return m(this, A, yl).call(this, e).size > 0;
}, ot = function(e = {}) {
  const t = (
    // Flush redirects
    e.wasRedirected || !!s(this, U).loadingFailed || m(this, A, fl).call(this) || !!s(this, j).extraInfo || // If the request is intercepted during the `authRequired` phase, there
    // will be no `Network.requestWillBeSentExtraInfo` CDP events.
    m(this, A, Gs).call(this, "authRequired") || // Requests from cache don't have extra info
    s(this, Ts) || // Sometimes there is no extra info and the response
    // is the only place we can find out
    !!(s(this, U).info && !s(this, U).hasExtraInfo)
  ), r = m(this, A, ml).call(this), n = !r && m(this, A, Gs).call(this, "beforeRequestSent"), o = !n || n && !!s(this, j).paused;
  s(this, j).info && (n ? o : t) && m(this, A, mn).call(this, m(this, A, Hf).bind(this));
  const a = !!s(this, U).extraInfo || // Response from cache don't have extra info
  s(this, Ts) || // Don't expect extra info if the flag is false
  !!(s(this, U).info && !s(this, U).hasExtraInfo), c = !r && m(this, A, Gs).call(this, "responseStarted");
  (s(this, U).info || c && s(this, U).paused) && m(this, A, mn).call(this, m(this, A, zf).bind(this));
  const p = !c || c && !!s(this, U).paused, l = !!s(this, U).loadingFailed || !!s(this, U).loadingFinished;
  s(this, U).info && a && p && (l || e.wasRedirected) && (m(this, A, mn).call(this, m(this, A, Wf).bind(this)), s(this, kt).disposeRequest(this.id));
}, Nc = async function(e = {}) {
  (0, nn.assert)(s(this, be), "Network Interception not set-up."), await this.cdpClient.sendCommand("Fetch.continueRequest", {
    requestId: s(this, be),
    url: e.url,
    method: e.method,
    headers: e.headers,
    postData: e.postData
  }), f(this, Ke, void 0);
}, vl = async function({ responseCode: e, responsePhrase: t, responseHeaders: r } = {}) {
  (0, nn.assert)(s(this, be), "Network Interception not set-up."), await this.cdpClient.sendCommand("Fetch.continueResponse", {
    requestId: s(this, be),
    responseCode: e,
    responsePhrase: t,
    responseHeaders: r
  }), f(this, Ke, void 0);
}, fn = async function(e) {
  (0, nn.assert)(s(this, be), "Network Interception not set-up."), await this.cdpClient.sendCommand("Fetch.continueWithAuth", {
    requestId: s(this, be),
    authChallengeResponse: e
  }), f(this, Ke, void 0);
}, mn = function(e) {
  var r;
  let t;
  try {
    t = e();
  } catch (n) {
    (r = s(this, xr)) == null || r.call(this, _d.LogType.debugError, n);
    return;
  }
  m(this, A, Kf).call(this) || s(this, Er)[t.method] && // Special case this event can be emitted multiple times
  t.method !== qe.ChromiumBidi.Network.EventNames.AuthRequired || (m(this, A, Uf).call(this), s(this, Er)[t.method] = !0, s(this, A, ro) ? s(this, ei).registerEvent(Object.assign(t, {
    type: "event"
  }), s(this, A, ro)) : s(this, ei).registerGlobalEvent(Object.assign(t, {
    type: "event"
  })));
}, gn = function(e) {
  var r;
  const t = {
    isBlocked: !1
  };
  if (e) {
    const n = m(this, A, yl).call(this, e);
    t.isBlocked = n.size > 0, t.isBlocked && (t.intercepts = [...n]);
  }
  return {
    context: s(this, A, ro),
    navigation: s(this, A, Bf),
    redirectCount: s(this, Zn),
    request: m(this, A, $f).call(this),
    // Timestamp should be in milliseconds, while CDP provides it in seconds.
    timestamp: Math.round((0, ce.getTiming)((r = s(this, j).info) == null ? void 0 : r.wallTime) * 1e3),
    // Contains isBlocked and intercepts
    ...t
  };
}, Oc = function() {
  var a, c, p, l, d, h, g, x, E, P, C;
  (a = s(this, U).info) != null && a.fromDiskCache && (s(this, U).extraInfo = void 0);
  const e = ((c = s(this, U).info) == null ? void 0 : c.headers) ?? {}, t = ((p = s(this, U).extraInfo) == null ? void 0 : p.headers) ?? {};
  for (const [b, N] of Object.entries(t))
    e[b] = N;
  const r = (0, ce.bidiNetworkHeadersFromCdpNetworkHeaders)(e), n = s(this, A, Mf);
  return {
    ...{
      url: this.url,
      protocol: ((l = s(this, U).info) == null ? void 0 : l.protocol) ?? "",
      status: s(this, A, pn) ?? -1,
      // TODO: Throw an exception or use some other status code?
      statusText: ((d = s(this, U).info) == null ? void 0 : d.statusText) || ((h = s(this, U).paused) == null ? void 0 : h.responseStatusText) || "",
      fromCache: ((g = s(this, U).info) == null ? void 0 : g.fromDiskCache) || ((x = s(this, U).info) == null ? void 0 : x.fromPrefetchCache) || s(this, Ts),
      headers: ((E = s(this, Qn)) == null ? void 0 : E.headers) ?? r,
      mimeType: ((P = s(this, U).info) == null ? void 0 : P.mimeType) || "",
      // TODO: this should be the size for the entire HTTP response.
      bytesReceived: this.encodedResponseBodySize,
      headersSize: (0, ce.computeHeadersSize)(r),
      bodySize: this.encodedResponseBodySize,
      content: {
        size: s(this, U).decodedSize ?? 0
      },
      ...n ? { authChallenges: n } : {}
    },
    "goog:securityDetails": (C = s(this, U).info) == null ? void 0 : C.securityDetails
  };
}, $f = function() {
  var r, n, o, a, c, p;
  const e = s(this, A, wl);
  return {
    ...{
      request: s(this, Yn),
      url: this.url,
      method: s(this, A, Af) ?? Dc.unknownParameter,
      headers: e,
      cookies: s(this, A, Ff),
      headersSize: (0, ce.computeHeadersSize)(e),
      bodySize: this.bodySize,
      // TODO: populate
      destination: m(this, A, Lf).call(this),
      // TODO: populate
      initiatorType: m(this, A, qf).call(this),
      timings: s(this, A, jf)
    },
    "goog:postData": (n = (r = s(this, j).info) == null ? void 0 : r.request) == null ? void 0 : n.postData,
    "goog:hasPostData": (a = (o = s(this, j).info) == null ? void 0 : o.request) == null ? void 0 : a.hasPostData,
    "goog:resourceType": (c = s(this, j).info) == null ? void 0 : c.type,
    "goog:resourceInitiator": (p = s(this, j).info) == null ? void 0 : p.initiator
  };
}, /**
 * Heuristic trying to guess the destination.
 * Specification: https://fetch.spec.whatwg.org/#concept-request-destination.
 * Specified values: "audio", "audioworklet", "document", "embed", "font", "frame",
 * "iframe", "image", "json", "manifest", "object", "paintworklet", "report", "script",
 * "serviceworker", "sharedworker", "style", "track", "video", "webidentity", "worker",
 * "xslt".
 */
Lf = function() {
  var e, t;
  switch ((e = s(this, j).info) == null ? void 0 : e.type) {
    case "Script":
      return "script";
    case "Stylesheet":
      return "style";
    case "Image":
      return "image";
    case "Document":
      return ((t = s(this, j).info) == null ? void 0 : t.initiator.type) === "parser" ? "iframe" : "document";
    default:
      return "";
  }
}, /**
 * Heuristic trying to guess the initiator type.
 * Specification: https://fetch.spec.whatwg.org/#request-initiator-type.
 * Specified values: "audio", "beacon", "body", "css", "early-hints", "embed", "fetch",
 * "font", "frame", "iframe", "image", "img", "input", "link", "object", "ping",
 * "script", "track", "video", "xmlhttprequest", "other".
 */
qf = function() {
  var e, t, r, n, o, a, c, p, l, d;
  if (((e = s(this, j).info) == null ? void 0 : e.initiator.type) === "parser")
    switch ((t = s(this, j).info) == null ? void 0 : t.type) {
      case "Document":
        return "iframe";
      case "Font":
        return ((n = (r = s(this, j).info) == null ? void 0 : r.initiator) == null ? void 0 : n.url) === ((o = s(this, j).info) == null ? void 0 : o.documentURL) ? "font" : "css";
      case "Image":
        return ((c = (a = s(this, j).info) == null ? void 0 : a.initiator) == null ? void 0 : c.url) === ((p = s(this, j).info) == null ? void 0 : p.documentURL) ? "img" : "css";
      case "Script":
        return "script";
      case "Stylesheet":
        return "link";
      default:
        return null;
    }
  return ((d = (l = s(this, j)) == null ? void 0 : l.info) == null ? void 0 : d.type) === "Fetch" ? "fetch" : null;
}, Hf = function() {
  var e;
  return (0, nn.assert)(s(this, j).info, "RequestWillBeSentEvent is not set"), {
    method: qe.ChromiumBidi.Network.EventNames.BeforeRequestSent,
    params: {
      ...m(this, A, gn).call(this, "beforeRequestSent"),
      initiator: {
        type: m(e = Dc, au, Vf).call(e, s(this, j).info.initiator.type),
        columnNumber: s(this, j).info.initiator.columnNumber,
        lineNumber: s(this, j).info.initiator.lineNumber,
        stackTrace: s(this, j).info.initiator.stack,
        request: s(this, j).info.initiator.requestId
      }
    }
  };
}, zf = function() {
  return {
    method: qe.ChromiumBidi.Network.EventNames.ResponseStarted,
    params: {
      ...m(this, A, gn).call(this, "responseStarted"),
      response: m(this, A, Oc).call(this)
    }
  };
}, Wf = function() {
  return {
    method: qe.ChromiumBidi.Network.EventNames.ResponseCompleted,
    params: {
      ...m(this, A, gn).call(this),
      response: m(this, A, Oc).call(this)
    }
  };
}, Kf = function() {
  var t, r;
  const e = "/favicon.ico";
  return ((t = s(this, j).paused) == null ? void 0 : t.request.url.endsWith(e)) ?? ((r = s(this, j).info) == null ? void 0 : r.request.url.endsWith(e)) ?? !1;
}, Rc = function(e, t) {
  if (!e && !t)
    return;
  let r = e;
  const n = (0, ce.networkHeaderFromCookieHeaders)(t);
  return n && !r && (r = s(this, A, wl)), n && r && (r.filter((o) => o.name.localeCompare("cookie", void 0, {
    sensitivity: "base"
  }) !== 0), r.push(n)), r;
}, au = new WeakSet(), Vf = function(e) {
  switch (e) {
    case "parser":
    case "script":
    case "preflight":
      return e;
    default:
      return "other";
  }
}, u(Wc, au), O(Wc, "unknownParameter", "UNKNOWN");
od.NetworkRequest = Wc;
Dc = Wc;
function Xh(i) {
  let e;
  return (i == null ? void 0 : i.type) === "string" ? e = (0, ce.stringToBase64)(i.value) : (i == null ? void 0 : i.type) === "base64" && (e = i.value), e;
}
function Vv(i) {
  return (i == null ? void 0 : i.type) === "string" ? i.value.length : (i == null ? void 0 : i.type) === "base64" ? atob(i.value).length : 0;
}
(function(i) {
  var c, p, l, d, h, g, x, E, Et, Gf, Xf;
  Object.defineProperty(i, "__esModule", { value: !0 }), i.NetworkStorage = i.MAX_TOTAL_COLLECTED_SIZE = void 0;
  const e = se, t = qt, r = id, n = od, o = ye;
  i.MAX_TOTAL_COLLECTED_SIZE = 2e8;
  class a {
    constructor(v, T, R, w) {
      u(this, E);
      u(this, c);
      u(this, p);
      u(this, l);
      u(this, d);
      /**
       * A map from network request ID to Network Request objects.
       * Needed as long as information about requests comes from different events.
       */
      u(this, h, /* @__PURE__ */ new Map());
      /** A map from intercept ID to track active network intercepts. */
      u(this, g, /* @__PURE__ */ new Map());
      u(this, x, "default");
      f(this, c, T), f(this, p, v), f(this, l, new r.CollectorsStorage(i.MAX_TOTAL_COLLECTED_SIZE, w)), R.on("Target.detachedFromTarget", ({ sessionId: D }) => {
        this.disposeRequestMap(D);
      }), f(this, d, w);
    }
    onCdpTargetCreated(v) {
      const T = v.cdpClient, R = [
        [
          "Network.requestWillBeSent",
          (w) => {
            const D = this.getRequestById(w.requestId);
            D == null || D.updateCdpTarget(v), D && D.isRedirecting() ? (D.handleRedirect(w), this.disposeRequest(w.requestId), m(this, E, Et).call(this, w.requestId, v, D.redirectCount + 1).onRequestWillBeSentEvent(w)) : m(this, E, Et).call(this, w.requestId, v).onRequestWillBeSentEvent(w);
          }
        ],
        [
          "Network.requestWillBeSentExtraInfo",
          (w) => {
            const D = m(this, E, Et).call(this, w.requestId, v);
            D.updateCdpTarget(v), D.onRequestWillBeSentExtraInfoEvent(w);
          }
        ],
        [
          "Network.responseReceived",
          (w) => {
            const D = m(this, E, Et).call(this, w.requestId, v);
            D.updateCdpTarget(v), D.onResponseReceivedEvent(w);
          }
        ],
        [
          "Network.responseReceivedExtraInfo",
          (w) => {
            const D = m(this, E, Et).call(this, w.requestId, v);
            D.updateCdpTarget(v), D.onResponseReceivedExtraInfoEvent(w);
          }
        ],
        [
          "Network.requestServedFromCache",
          (w) => {
            const D = m(this, E, Et).call(this, w.requestId, v);
            D.updateCdpTarget(v), D.onServedFromCache();
          }
        ],
        [
          "Fetch.requestPaused",
          (w) => {
            const D = m(this, E, Et).call(
              this,
              // CDP quirk if the Network domain is not present this is undefined
              w.networkId ?? w.requestId,
              v
            );
            D.updateCdpTarget(v), D.onRequestPaused(w);
          }
        ],
        [
          "Fetch.authRequired",
          (w) => {
            let D = this.getRequestByFetchId(w.requestId);
            D || (D = m(this, E, Et).call(this, w.requestId, v)), D.updateCdpTarget(v), D.onAuthRequired(w);
          }
        ],
        [
          "Network.dataReceived",
          (w) => {
            const D = this.getRequestById(w.requestId);
            D == null || D.updateCdpTarget(v), D == null || D.onDataReceivedEvent(w);
          }
        ],
        [
          "Network.loadingFailed",
          (w) => {
            const D = m(this, E, Et).call(this, w.requestId, v);
            D.updateCdpTarget(v), D.onLoadingFailedEvent(w);
          }
        ],
        [
          "Network.loadingFinished",
          (w) => {
            const D = this.getRequestById(w.requestId);
            D == null || D.updateCdpTarget(v), D == null || D.onLoadingFinishedEvent(w);
          }
        ]
      ];
      for (const [w, D] of R)
        T.on(w, D);
    }
    async getCollectedData(v) {
      if (!s(this, l).isCollected(v.request, v.dataType, v.collector))
        throw new e.NoSuchNetworkDataException(v.collector === void 0 ? `No collected ${v.dataType} data` : `Collector ${v.collector} didn't collect ${v.dataType} data`);
      if (v.disown && v.collector === void 0)
        throw new e.InvalidArgumentException("Cannot disown collected data without collector ID");
      const T = this.getRequestById(v.request);
      if (T === void 0)
        throw new e.NoSuchNetworkDataException(`No data for ${v.request}`);
      let R;
      switch (v.dataType) {
        case "response":
          R = await m(this, E, Gf).call(this, T);
          break;
        case "request":
          R = await m(this, E, Xf).call(this, T);
          break;
        default:
          throw new e.UnsupportedOperationException(`Unsupported data type ${v.dataType}`);
      }
      return v.disown && v.collector !== void 0 && (s(this, l).disownData(T.id, v.dataType, v.collector), this.disposeRequest(T.id)), R;
    }
    collectIfNeeded(v, T) {
      s(this, l).collectIfNeeded(v, T, v.cdpTarget.topLevelId, v.cdpTarget.userContext);
    }
    getInterceptionStages(v) {
      const T = {
        request: !1,
        response: !1,
        auth: !1
      };
      for (const R of s(this, g).values())
        R.contexts && !R.contexts.includes(v) || (T.request || (T.request = R.phases.includes(
          "beforeRequestSent"
          /* Network.InterceptPhase.BeforeRequestSent */
        )), T.response || (T.response = R.phases.includes(
          "responseStarted"
          /* Network.InterceptPhase.ResponseStarted */
        )), T.auth || (T.auth = R.phases.includes(
          "authRequired"
          /* Network.InterceptPhase.AuthRequired */
        )));
      return T;
    }
    getInterceptsForPhase(v, T) {
      if (v.url === n.NetworkRequest.unknownParameter)
        return /* @__PURE__ */ new Set();
      const R = /* @__PURE__ */ new Set();
      for (const [w, D] of s(this, g).entries())
        if (!(!D.phases.includes(T) || D.contexts && !D.contexts.includes(v.cdpTarget.topLevelId))) {
          if (D.urlPatterns.length === 0) {
            R.add(w);
            continue;
          }
          for (const S of D.urlPatterns)
            if ((0, o.matchUrlPattern)(S, v.url)) {
              R.add(w);
              break;
            }
        }
      return R;
    }
    disposeRequestMap(v) {
      for (const T of s(this, h).values())
        T.cdpClient.sessionId === v && (s(this, h).delete(T.id), T.dispose());
    }
    /**
     * Adds the given entry to the intercept map.
     * URL patterns are assumed to be parsed.
     *
     * @return The intercept ID.
     */
    addIntercept(v) {
      const T = (0, t.uuidv4)();
      return s(this, g).set(T, v), T;
    }
    /**
     * Removes the given intercept from the intercept map.
     * Throws NoSuchInterceptException if the intercept does not exist.
     */
    removeIntercept(v) {
      if (!s(this, g).has(v))
        throw new e.NoSuchInterceptException(`Intercept '${v}' does not exist.`);
      s(this, g).delete(v);
    }
    getRequestsByTarget(v) {
      const T = [];
      for (const R of s(this, h).values())
        R.cdpTarget === v && T.push(R);
      return T;
    }
    getRequestById(v) {
      return s(this, h).get(v);
    }
    getRequestByFetchId(v) {
      for (const T of s(this, h).values())
        if (T.fetchId === v)
          return T;
    }
    addRequest(v) {
      s(this, h).set(v.id, v);
    }
    /**
     * Disposes the given request, if no collectors targeting it are left.
     */
    disposeRequest(v) {
      s(this, l).isCollected(v) || s(this, h).delete(v);
    }
    /**
     * Gets the virtual navigation ID for the given navigable ID.
     */
    getNavigationId(v) {
      var T;
      return v === void 0 ? null : ((T = s(this, c).findContext(v)) == null ? void 0 : T.navigationId) ?? null;
    }
    set defaultCacheBehavior(v) {
      f(this, x, v);
    }
    get defaultCacheBehavior() {
      return s(this, x);
    }
    addDataCollector(v) {
      return s(this, l).addDataCollector(v);
    }
    removeDataCollector(v) {
      s(this, l).removeDataCollector(v.collector).map((R) => this.disposeRequest(R));
    }
    disownData(v) {
      if (!s(this, l).isCollected(v.request, v.dataType, v.collector))
        throw new e.NoSuchNetworkDataException(`Collector ${v.collector} didn't collect ${v.dataType} data`);
      s(this, l).disownData(v.request, v.dataType, v.collector), this.disposeRequest(v.request);
    }
  }
  c = new WeakMap(), p = new WeakMap(), l = new WeakMap(), d = new WeakMap(), h = new WeakMap(), g = new WeakMap(), x = new WeakMap(), E = new WeakSet(), /**
   * Gets the network request with the given ID, if any.
   * Otherwise, creates a new network request with the given ID and cdp target.
   */
  Et = function(v, T, R) {
    let w = this.getRequestById(v);
    return R === void 0 && w || (w = new n.NetworkRequest(v, s(this, p), this, T, R, s(this, d)), this.addRequest(w)), w;
  }, Gf = async function(v) {
    try {
      const T = await v.cdpClient.sendCommand("Network.getResponseBody", { requestId: v.id });
      return {
        bytes: {
          type: T.base64Encoded ? "base64" : "string",
          value: T.body
        }
      };
    } catch (T) {
      throw T.code === -32e3 && T.message === "No resource with given identifier found" ? new e.NoSuchNetworkDataException("Response data was disposed") : T.code === -32001 ? new e.NoSuchNetworkDataException("Response data is disposed after the related page") : T;
    }
  }, Xf = async function(v) {
    return {
      bytes: {
        type: "string",
        value: (await v.cdpClient.sendCommand("Network.getRequestPostData", { requestId: v.id })).postData
      }
    };
  }, i.NetworkStorage = a;
})(ah);
Object.defineProperty(sd, "__esModule", { value: !0 });
sd.CdpTarget = void 0;
const Jh = ve, on = se, Gv = Jr, ps = Te, Xv = Ui, Jv = rd, Yv = ah;
var ra, fe, ti, si, na, Sr, ri, Ds, Dt, ia, oa, Ve, ni, ii, oi, ai, je, ae, Jf, Cl, no, Yf, Zf, Qf, em, tm, sm, rm, nm;
const lh = class lh {
  constructor(e, t, r, n, o, a, c, p, l, d, h, g, x) {
    u(this, ae);
    u(this, ra);
    O(this, "userContext");
    u(this, fe);
    u(this, ti);
    u(this, si);
    u(this, na);
    u(this, Sr);
    u(this, ri);
    u(this, Ds);
    u(this, Dt);
    O(this, "contextConfigStorage");
    u(this, ia, new Gv.Deferred());
    // Default user agent for the target. Required, as emulating client hints without user
    // agent is not possible. Cache it to avoid round trips to the browser for every target override.
    u(this, oa);
    u(this, Ve);
    /**
     * Target's window id. Is filled when the CDP target is created and do not reflect
     * moving targets from one window to another. The actual values
     * will be set during `#unblock`.
     * */
    u(this, ni);
    u(this, ii, !1);
    u(this, oi, !1);
    u(this, ai, !1);
    u(this, je, {
      request: !1,
      response: !1,
      auth: !1
    });
    f(this, oa, g), this.userContext = h, f(this, ra, e), f(this, fe, t), f(this, ti, r), f(this, si, n), f(this, Sr, o), f(this, na, a), f(this, ri, c), f(this, Dt, d), f(this, Ds, p), this.contextConfigStorage = l, f(this, Ve, x);
  }
  static create(e, t, r, n, o, a, c, p, l, d, h, g, x) {
    var P, C;
    const E = new lh(e, t, r, n, a, o, c, p, d, l, h, g, x);
    return Jv.LogManager.create(E, o, a, x), m(P = E, ae, Yf).call(P), m(C = E, ae, Jf).call(C), E;
  }
  /** Returns a deferred that resolves when the target is unblocked. */
  get unblocked() {
    return s(this, ia);
  }
  get id() {
    return s(this, ra);
  }
  get cdpClient() {
    return s(this, fe);
  }
  get parentCdpClient() {
    return s(this, si);
  }
  get browserCdpClient() {
    return s(this, ti);
  }
  /** Needed for CDP escape path. */
  get cdpSessionId() {
    return s(this, fe).sessionId;
  }
  /**
   * Window id the target belongs to. If not known, returns 0.
   */
  get windowId() {
    var e;
    return s(this, ni) === void 0 && ((e = s(this, Ve)) == null || e.call(this, ps.LogType.debugError, "Getting windowId before it was set, returning 0")), s(this, ni) ?? 0;
  }
  async toggleFetchIfNeeded() {
    const e = s(this, Dt).getInterceptionStages(this.topLevelId);
    if (s(this, je).request === e.request && s(this, je).response === e.response && s(this, je).auth === e.auth)
      return;
    const t = [];
    if (f(this, je, e), (e.request || e.auth) && t.push({
      urlPattern: "*",
      requestStage: "Request"
    }), e.response && t.push({
      urlPattern: "*",
      requestStage: "Response"
    }), t.length)
      await s(this, fe).sendCommand("Fetch.enable", {
        patterns: t,
        handleAuthRequests: e.auth
      });
    else {
      const r = s(this, Dt).getRequestsByTarget(this).filter((n) => n.interceptPhase);
      Promise.allSettled(r.map((n) => n.waitNextPhase)).then(async () => s(this, Dt).getRequestsByTarget(this).filter((o) => o.interceptPhase).length ? await this.toggleFetchIfNeeded() : await s(this, fe).sendCommand("Fetch.disable")).catch((n) => {
        var o;
        (o = s(this, Ve)) == null || o.call(this, ps.LogType.bidi, "Disable failed", n);
      });
    }
  }
  /**
   * Toggles CDP "Fetch" domain and enable/disable network cache.
   */
  async toggleNetworkIfNeeded() {
    var e;
    try {
      await Promise.all([
        this.toggleSetCacheDisabled(),
        this.toggleFetchIfNeeded()
      ]);
    } catch (t) {
      if ((e = s(this, Ve)) == null || e.call(this, ps.LogType.debugError, t), !m(this, ae, no).call(this, t))
        throw t;
    }
  }
  async toggleSetCacheDisabled(e) {
    var n;
    const t = s(this, Dt).defaultCacheBehavior === "bypass", r = e ?? t;
    if (s(this, oi) !== r) {
      f(this, oi, r);
      try {
        await s(this, fe).sendCommand("Network.setCacheDisabled", {
          cacheDisabled: r
        });
      } catch (o) {
        if ((n = s(this, Ve)) == null || n.call(this, ps.LogType.debugError, o), f(this, oi, !r), !m(this, ae, no).call(this, o))
          throw o;
      }
    }
  }
  async toggleDeviceAccessIfNeeded() {
    var t;
    const e = this.isSubscribedTo(Jh.Bluetooth.EventNames.RequestDevicePromptUpdated);
    if (s(this, ii) !== e) {
      f(this, ii, e);
      try {
        await s(this, fe).sendCommand(e ? "DeviceAccess.enable" : "DeviceAccess.disable");
      } catch (r) {
        if ((t = s(this, Ve)) == null || t.call(this, ps.LogType.debugError, r), f(this, ii, !e), !m(this, ae, no).call(this, r))
          throw r;
      }
    }
  }
  async togglePreloadIfNeeded() {
    var t;
    const e = this.isSubscribedTo(Jh.Speculation.EventNames.PrefetchStatusUpdated);
    if (s(this, ai) !== e) {
      f(this, ai, e);
      try {
        await s(this, fe).sendCommand(e ? "Preload.enable" : "Preload.disable");
      } catch (r) {
        if ((t = s(this, Ve)) == null || t.call(this, ps.LogType.debugError, r), f(this, ai, !e), !m(this, ae, no).call(this, r))
          throw r;
      }
    }
  }
  async toggleNetwork() {
    var n;
    const e = s(this, Dt).getInterceptionStages(this.topLevelId), t = Object.values(e).some((o) => o), r = s(this, je).request !== e.request || s(this, je).response !== e.response || s(this, je).auth !== e.auth;
    (n = s(this, Ve)) == null || n.call(this, ps.LogType.debugInfo, "Toggle Network", `Fetch (${t}) ${r}`), t && r && await m(this, ae, Zf).call(this, e), !t && r && await m(this, ae, Qf).call(this);
  }
  /**
   * All the ProxyChannels from all the preload scripts of the given
   * BrowsingContext.
   */
  getChannels() {
    return s(this, ri).find().flatMap((e) => e.channels);
  }
  async setDeviceMetricsOverride(e, t, r, n) {
    if (e === null && t === null && r === null && n === null) {
      await this.cdpClient.sendCommand("Emulation.clearDeviceMetricsOverride");
      return;
    }
    const o = {
      width: (e == null ? void 0 : e.width) ?? 0,
      height: (e == null ? void 0 : e.height) ?? 0,
      deviceScaleFactor: t ?? 0,
      screenOrientation: m(this, ae, nm).call(this, r) ?? void 0,
      mobile: !1,
      screenWidth: n == null ? void 0 : n.width,
      screenHeight: n == null ? void 0 : n.height
    };
    await this.cdpClient.sendCommand("Emulation.setDeviceMetricsOverride", o);
  }
  get topLevelId() {
    return s(this, Ds).findTopLevelContextId(this.id) ?? this.id;
  }
  isSubscribedTo(e) {
    return s(this, Sr).subscriptionManager.isSubscribedTo(e, this.topLevelId);
  }
  async setGeolocationOverride(e) {
    if (e === null)
      await this.cdpClient.sendCommand("Emulation.clearGeolocationOverride");
    else if ("type" in e) {
      if (e.type !== "positionUnavailable")
        throw new on.UnknownErrorException(`Unknown geolocation error ${e.type}`);
      await this.cdpClient.sendCommand("Emulation.setGeolocationOverride", {});
    } else if ("latitude" in e)
      await this.cdpClient.sendCommand("Emulation.setGeolocationOverride", {
        latitude: e.latitude,
        longitude: e.longitude,
        accuracy: e.accuracy ?? 1,
        // `null` value is treated as "missing".
        altitude: e.altitude ?? void 0,
        altitudeAccuracy: e.altitudeAccuracy ?? void 0,
        heading: e.heading ?? void 0,
        speed: e.speed ?? void 0
      });
    else
      throw new on.UnknownErrorException("Unexpected geolocation coordinates value");
  }
  async setTouchOverride(e) {
    const t = {
      enabled: e !== null
    };
    e !== null && (t.maxTouchPoints = e), await this.cdpClient.sendCommand("Emulation.setTouchEmulationEnabled", t);
  }
  async setLocaleOverride(e) {
    e === null ? await this.cdpClient.sendCommand("Emulation.setLocaleOverride", {}) : await this.cdpClient.sendCommand("Emulation.setLocaleOverride", {
      locale: e
    });
  }
  async setScriptingEnabled(e) {
    await this.cdpClient.sendCommand("Emulation.setScriptExecutionDisabled", {
      value: e === !1
    });
  }
  async setTimezoneOverride(e) {
    e === null ? await this.cdpClient.sendCommand("Emulation.setTimezoneOverride", {
      // If empty, disables the override and restores default host system timezone.
      timezoneId: ""
    }) : await this.cdpClient.sendCommand("Emulation.setTimezoneOverride", {
      timezoneId: e
    });
  }
  async setExtraHeaders(e) {
    await this.cdpClient.sendCommand("Network.setExtraHTTPHeaders", {
      headers: e
    });
  }
  async setUserAgentAndAcceptLanguage(e, t, r) {
    var o;
    const n = r ? {
      brands: (o = r.brands) == null ? void 0 : o.map((a) => ({
        brand: a.brand,
        version: a.version
      })),
      fullVersionList: r.fullVersionList,
      platform: r.platform ?? "",
      platformVersion: r.platformVersion ?? "",
      architecture: r.architecture ?? "",
      model: r.model ?? "",
      mobile: r.mobile ?? !1,
      bitness: r.bitness ?? void 0,
      wow64: r.wow64 ?? void 0,
      formFactors: r.formFactors ?? void 0
    } : void 0;
    await this.cdpClient.sendCommand("Emulation.setUserAgentOverride", {
      // `userAgent` is required if `userAgentMetadata` is provided.
      userAgent: e || (n ? s(this, oa) : ""),
      acceptLanguage: t ?? void 0,
      // We need to provide the platform to enable platform emulation.
      // Note that the value might be different from the one expected by the
      // legacy `navigator.platform` (e.g. `Win32` vs `Windows`).
      // https://github.com/w3c/webdriver-bidi/issues/1065
      platform: (r == null ? void 0 : r.platform) ?? void 0,
      userAgentMetadata: n
    });
  }
  async setEmulatedNetworkConditions(e) {
    if (e !== null && e.type !== "offline")
      throw new on.UnsupportedOperationException(`Unsupported network conditions ${e.type}`);
    await Promise.all([
      this.cdpClient.sendCommand("Network.emulateNetworkConditionsByRule", {
        offline: (e == null ? void 0 : e.type) === "offline",
        matchedNetworkConditions: [
          {
            urlPattern: "",
            latency: 0,
            downloadThroughput: -1,
            uploadThroughput: -1
          }
        ]
      }),
      this.cdpClient.sendCommand("Network.overrideNetworkState", {
        offline: (e == null ? void 0 : e.type) === "offline",
        // TODO: restore the original `latency` value when emulation is removed.
        latency: 0,
        downloadThroughput: -1,
        uploadThroughput: -1
      })
    ]);
  }
};
ra = new WeakMap(), fe = new WeakMap(), ti = new WeakMap(), si = new WeakMap(), na = new WeakMap(), Sr = new WeakMap(), ri = new WeakMap(), Ds = new WeakMap(), Dt = new WeakMap(), ia = new WeakMap(), oa = new WeakMap(), Ve = new WeakMap(), ni = new WeakMap(), ii = new WeakMap(), oi = new WeakMap(), ai = new WeakMap(), je = new WeakMap(), ae = new WeakSet(), Jf = async function() {
  var r;
  const e = this.contextConfigStorage.getActiveConfig(this.topLevelId, this.userContext), t = await Promise.allSettled([
    s(this, fe).sendCommand("Page.enable", {
      enableFileChooserOpenedEvent: !0
    }),
    ...m(this, ae, rm).call(this) ? [] : [
      s(this, fe).sendCommand("Page.setInterceptFileChooserDialog", {
        enabled: !0,
        // The intercepted dialog should be canceled.
        cancel: !0
      })
    ],
    // There can be some existing frames in the target, if reconnecting to an
    // existing browser instance, e.g. via Puppeteer. Need to restore the browsing
    // contexts for the frames to correctly handle further events, like
    // `Runtime.executionContextCreated`.
    // It's important to schedule this task together with enabling domains commands to
    // prepare the tree before the events (e.g. Runtime.executionContextCreated) start
    // coming.
    // https://github.com/GoogleChromeLabs/chromium-bidi/issues/2282
    s(this, fe).sendCommand("Page.getFrameTree").then((n) => m(this, ae, Cl).call(this, n.frameTree)),
    s(this, fe).sendCommand("Runtime.enable"),
    s(this, fe).sendCommand("Page.setLifecycleEventsEnabled", {
      enabled: !0
    }),
    // Enabling CDP Network domain is required for navigation detection:
    // https://github.com/GoogleChromeLabs/chromium-bidi/issues/2856.
    s(this, fe).sendCommand("Network.enable", {
      // If `googDisableNetworkDurableMessages` flag is set, do not enable durable
      // messages.
      enableDurableMessages: e.disableNetworkDurableMessages !== !0,
      maxTotalBufferSize: Yv.MAX_TOTAL_COLLECTED_SIZE
    }).then(() => this.toggleNetworkIfNeeded()),
    s(this, fe).sendCommand("Target.setAutoAttach", {
      autoAttach: !0,
      waitForDebuggerOnStart: !0,
      flatten: !0
    }),
    m(this, ae, em).call(this),
    m(this, ae, sm).call(this, e),
    m(this, ae, tm).call(this),
    s(this, fe).sendCommand("Runtime.runIfWaitingForDebugger"),
    // Resume tab execution as well if it was paused by the debugger.
    s(this, si).sendCommand("Runtime.runIfWaitingForDebugger"),
    this.toggleDeviceAccessIfNeeded(),
    this.togglePreloadIfNeeded()
  ]);
  for (const n of t)
    n instanceof Error && ((r = s(this, Ve)) == null || r.call(this, ps.LogType.debugError, "Error happened when configuring a new target", n));
  s(this, ia).resolve({
    kind: "success",
    value: void 0
  });
}, Cl = function(e) {
  var n;
  const t = e.frame, r = s(this, Ds).findContext(t.id);
  if (r !== void 0 && r.parentId === null && t.parentId !== null && t.parentId !== void 0 && (r.parentId = t.parentId), r === void 0 && t.parentId !== void 0) {
    const o = s(this, Ds).getContext(t.parentId);
    Xv.BrowsingContextImpl.create(t.id, t.parentId, this.userContext, o.cdpTarget, s(this, Sr), s(this, Ds), s(this, na), this.contextConfigStorage, t.url, void 0, s(this, Ve));
  }
  (n = e.childFrames) == null || n.map((o) => m(this, ae, Cl).call(this, o));
}, /**
 * Heuristic checking if the error is due to the session being closed. If so, ignore the
 * error.
 */
no = function(e) {
  const t = e;
  return t.code === -32001 && t.message === "Session with given id not found." || s(this, fe).isCloseError(e);
}, Yf = function() {
  s(this, fe).on("*", (e, t) => {
    typeof e == "string" && s(this, Sr).registerEvent({
      type: "event",
      method: `goog:cdp.${e}`,
      params: {
        event: e,
        params: t,
        session: this.cdpSessionId
      }
    }, this.id);
  });
}, Zf = async function(e) {
  const t = [];
  if ((e.request || e.auth) && t.push({
    urlPattern: "*",
    requestStage: "Request"
  }), e.response && t.push({
    urlPattern: "*",
    requestStage: "Response"
  }), t.length) {
    const r = s(this, je);
    f(this, je, e);
    try {
      await s(this, fe).sendCommand("Fetch.enable", {
        patterns: t,
        handleAuthRequests: e.auth
      });
    } catch {
      f(this, je, r);
    }
  }
}, Qf = async function() {
  s(this, Dt).getRequestsByTarget(this).filter((t) => t.interceptPhase).length === 0 && (f(this, je, {
    request: !1,
    response: !1,
    auth: !1
  }), await s(this, fe).sendCommand("Fetch.disable"));
}, em = async function() {
  const { windowId: e } = await s(this, ti).sendCommand("Browser.getWindowForTarget", { targetId: this.id });
  f(this, ni, e);
}, tm = async function() {
  await Promise.all(s(this, ri).find({
    // Needed for OOPIF
    targetId: this.topLevelId
  }).map((e) => e.initInTarget(this, !0)));
}, sm = async function(e) {
  const t = [];
  t.push(s(this, fe).sendCommand("Page.setPrerenderingAllowed", {
    isAllowed: !e.prerenderingDisabled
  }).catch(() => {
  })), (e.viewport !== void 0 || e.devicePixelRatio !== void 0 || e.screenOrientation !== void 0 || e.screenArea !== void 0) && t.push(this.setDeviceMetricsOverride(e.viewport ?? null, e.devicePixelRatio ?? null, e.screenOrientation ?? null, e.screenArea ?? null).catch(() => {
  })), e.geolocation !== void 0 && e.geolocation !== null && t.push(this.setGeolocationOverride(e.geolocation)), e.locale !== void 0 && t.push(this.setLocaleOverride(e.locale)), e.timezone !== void 0 && t.push(this.setTimezoneOverride(e.timezone)), e.extraHeaders !== void 0 && t.push(this.setExtraHeaders(e.extraHeaders)), (e.userAgent !== void 0 || e.locale !== void 0 || e.clientHints !== void 0) && t.push(this.setUserAgentAndAcceptLanguage(e.userAgent, e.locale, e.clientHints)), e.scriptingEnabled !== void 0 && t.push(this.setScriptingEnabled(e.scriptingEnabled)), e.acceptInsecureCerts !== void 0 && t.push(this.cdpClient.sendCommand("Security.setIgnoreCertificateErrors", {
    ignore: e.acceptInsecureCerts
  })), e.emulatedNetworkConditions !== void 0 && t.push(this.setEmulatedNetworkConditions(e.emulatedNetworkConditions)), e.maxTouchPoints !== void 0 && t.push(this.setTouchOverride(e.maxTouchPoints)), await Promise.all(t);
}, rm = function() {
  var t, r;
  const e = this.contextConfigStorage.getActiveConfig(this.topLevelId, this.userContext);
  return (((t = e.userPromptHandler) == null ? void 0 : t.file) ?? ((r = e.userPromptHandler) == null ? void 0 : r.default) ?? "ignore") === "ignore";
}, nm = function(e) {
  if (e === null)
    return null;
  if (e.natural === "portrait")
    switch (e.type) {
      case "portrait-primary":
        return {
          angle: 0,
          type: "portraitPrimary"
        };
      case "landscape-primary":
        return {
          angle: 90,
          type: "landscapePrimary"
        };
      case "portrait-secondary":
        return {
          angle: 180,
          type: "portraitSecondary"
        };
      case "landscape-secondary":
        return {
          angle: 270,
          type: "landscapeSecondary"
        };
      default:
        throw new on.UnknownErrorException(`Unexpected screen orientation type ${e.type}`);
    }
  if (e.natural === "landscape")
    switch (e.type) {
      case "landscape-primary":
        return {
          angle: 0,
          type: "landscapePrimary"
        };
      case "portrait-primary":
        return {
          angle: 90,
          type: "portraitPrimary"
        };
      case "landscape-secondary":
        return {
          angle: 180,
          type: "landscapeSecondary"
        };
      case "portrait-secondary":
        return {
          angle: 270,
          type: "portraitSecondary"
        };
      default:
        throw new on.UnknownErrorException(`Unexpected screen orientation type ${e.type}`);
    }
  throw new on.UnknownErrorException(`Unexpected orientation natural ${e.natural}`);
};
let bl = lh;
sd.CdpTarget = bl;
Object.defineProperty(Qu, "__esModule", { value: !0 });
Qu.CdpTargetManager = void 0;
const Zv = Te, kd = Ui, Qv = td, eb = sd, Yh = {
  service_worker: "service-worker",
  shared_worker: "shared-worker",
  worker: "dedicated-worker"
};
var aa, ca, ci, ua, Ns, Ge, ui, da, Pr, pt, Ir, la, ha, pa, ts, ue, Ac, im, om, am, cm, Bc, fa, xl, um, dm, lm;
class tb {
  constructor(e, t, r, n, o, a, c, p, l, d, h, g, x, E) {
    u(this, ue);
    u(this, aa);
    u(this, ca);
    u(this, ci, /* @__PURE__ */ new Set());
    u(this, ua);
    u(this, Ns);
    u(this, Ge);
    u(this, ui);
    u(this, da);
    u(this, Pr);
    u(this, pt);
    u(this, Ir);
    u(this, la);
    u(this, ha);
    u(this, pa);
    u(this, ts);
    u(this, fa, /* @__PURE__ */ new Map());
    f(this, ca, e), f(this, aa, t), s(this, ci).add(r), f(this, ua, r), f(this, Ns, n), f(this, Ge, o), f(this, Pr, h), f(this, ui, c), f(this, Ir, p), f(this, da, l), f(this, la, d), f(this, pt, a), f(this, ha, g), f(this, pa, x), f(this, ts, E), m(this, ue, Ac).call(this, t);
  }
}
aa = new WeakMap(), ca = new WeakMap(), ci = new WeakMap(), ua = new WeakMap(), Ns = new WeakMap(), Ge = new WeakMap(), ui = new WeakMap(), da = new WeakMap(), Pr = new WeakMap(), pt = new WeakMap(), Ir = new WeakMap(), la = new WeakMap(), ha = new WeakMap(), pa = new WeakMap(), ts = new WeakMap(), ue = new WeakSet(), /**
 * This method is called for each CDP session, since this class is responsible
 * for creating and destroying all targets and browsing contexts.
 */
Ac = function(e) {
  e.on("Target.attachedToTarget", (t) => {
    m(this, ue, am).call(this, t, e);
  }), e.on("Target.detachedFromTarget", m(this, ue, um).bind(this)), e.on("Target.targetInfoChanged", m(this, ue, dm).bind(this)), e.on("Inspector.targetCrashed", () => {
    m(this, ue, lm).call(this, e);
  }), e.on("Page.frameAttached", m(this, ue, im).bind(this)), e.on("Page.frameSubtreeWillBeDetached", m(this, ue, om).bind(this));
}, im = function(e) {
  const t = s(this, Ge).findContext(e.parentFrameId);
  t !== void 0 && kd.BrowsingContextImpl.create(
    e.frameId,
    e.parentFrameId,
    t.userContext,
    t.cdpTarget,
    s(this, Ns),
    s(this, Ge),
    s(this, pt),
    s(this, Ir),
    // At this point, we don't know the URL of the frame yet, so it will be updated
    // later.
    "about:blank",
    void 0,
    s(this, ts)
  );
}, om = function(e) {
  var t;
  (t = s(this, Ge).findContext(e.frameId)) == null || t.dispose(!0);
}, am = function(e, t) {
  const { sessionId: r, targetInfo: n } = e, o = s(this, ca).getCdpClient(r), a = async () => {
    await o.sendCommand("Runtime.runIfWaitingForDebugger").then(() => t.sendCommand("Target.detachFromTarget", e)).catch((l) => {
      var d;
      return (d = s(this, ts)) == null ? void 0 : d.call(this, Zv.LogType.debugError, l);
    });
  };
  if (s(this, ua) === n.targetId) {
    a();
    return;
  }
  const c = n.type === "service_worker" ? `${t.sessionId}_${n.targetId}` : n.targetId;
  if (s(this, ci).has(c))
    return;
  s(this, ci).add(c);
  const p = n.browserContextId && n.browserContextId !== s(this, ha) ? n.browserContextId : "default";
  switch (n.type) {
    case "tab": {
      m(this, ue, Ac).call(this, o), (async () => await o.sendCommand("Target.setAutoAttach", {
        autoAttach: !0,
        waitForDebuggerOnStart: !0,
        flatten: !0
      }))();
      return;
    }
    case "page":
    case "iframe": {
      const l = m(this, ue, Bc).call(this, o, t, n, p), d = s(this, Ge).findContext(n.targetId);
      if (d && n.type === "iframe")
        d.updateCdpTarget(l);
      else {
        const h = m(this, ue, cm).call(this, n, t.sessionId);
        kd.BrowsingContextImpl.create(
          n.targetId,
          h,
          p,
          l,
          s(this, Ns),
          s(this, Ge),
          s(this, pt),
          s(this, Ir),
          // Hack: when a new target created, CDP emits targetInfoChanged with an empty
          // url, and navigates it to about:blank later. When the event is emitted for
          // an existing target (reconnect), the url is already known, and navigation
          // events will not be emitted anymore. Replacing empty url with `about:blank`
          // allows to handle both cases in the same way.
          // "7.3.2.1 Creating browsing contexts".
          // https://html.spec.whatwg.org/multipage/document-sequences.html#creating-browsing-contexts
          // TODO: check who to deal with non-null creator and its `creatorOrigin`.
          n.url === "" ? "about:blank" : n.url,
          n.openerFrameId ?? n.openerId,
          s(this, ts)
        );
      }
      return;
    }
    case "service_worker":
    case "worker": {
      const l = s(this, pt).findRealm({
        cdpSessionId: t.sessionId,
        sandbox: null
        // Non-sandboxed realms.
      });
      if (!l) {
        a();
        return;
      }
      const d = m(this, ue, Bc).call(this, o, t, n, p);
      m(this, ue, xl).call(this, Yh[n.type], d, l);
      return;
    }
    case "shared_worker": {
      const l = m(this, ue, Bc).call(this, o, t, n, p);
      m(this, ue, xl).call(this, Yh[n.type], l);
      return;
    }
  }
  a();
}, /** Try to find the parent browsing context ID for the given attached target. */
cm = function(e, t) {
  var n;
  if (e.type !== "iframe")
    return null;
  const r = e.openerFrameId ?? e.openerId;
  return r !== void 0 ? r : t !== void 0 ? ((n = s(this, Ge).findContextBySession(t)) == null ? void 0 : n.id) ?? null : null;
}, Bc = function(e, t, r, n) {
  m(this, ue, Ac).call(this, e), s(this, Pr).onCdpTargetCreated(r.targetId, n);
  const o = eb.CdpTarget.create(
    r.targetId,
    e,
    s(this, aa),
    t,
    s(this, pt),
    s(this, Ns),
    s(this, Pr),
    s(this, Ge),
    s(this, ui),
    s(this, Ir),
    n,
    // Pass the cached default User Agent to the new target.
    s(this, pa),
    s(this, ts)
  );
  return s(this, ui).onCdpTargetCreated(o), s(this, da).onCdpTargetCreated(o), s(this, la).onCdpTargetCreated(o), o;
}, fa = new WeakMap(), xl = function(e, t, r) {
  t.cdpClient.on("Runtime.executionContextCreated", (n) => {
    const { uniqueId: o, id: a, origin: c } = n.context, p = new Qv.WorkerRealm(t.cdpClient, s(this, Ns), a, s(this, ts), (0, kd.serializeOrigin)(c), r ? [r] : [], o, s(this, pt), e);
    s(this, fa).set(t.cdpSessionId, p);
  });
}, um = function({ sessionId: e, targetId: t }) {
  t && s(this, Pr).find({ targetId: t }).map((o) => {
    o.dispose(t);
  });
  const r = s(this, Ge).findContextBySession(e);
  if (r) {
    r.dispose(!0);
    return;
  }
  const n = s(this, fa).get(e);
  n && s(this, pt).deleteRealms({
    cdpSessionId: n.cdpClient.sessionId
  });
}, dm = function(e) {
  const t = s(this, Ge).findContext(e.targetInfo.targetId);
  t && t.onTargetInfoChanged(e);
}, lm = function(e) {
  const t = s(this, pt).findRealms({
    cdpSessionId: e.sessionId
  });
  for (const r of t)
    r.dispose();
};
Qu.CdpTargetManager = tb;
var ad = {};
Object.defineProperty(ad, "__esModule", { value: !0 });
ad.BrowsingContextStorage = void 0;
const Zh = se, sb = qs;
var ft, di;
class rb {
  constructor() {
    /** Map from context ID to context implementation. */
    u(this, ft, /* @__PURE__ */ new Map());
    /** Event emitter for browsing context storage eventsis not expected to be exposed to
     * the outside world. */
    u(this, di, new sb.EventEmitter());
  }
  /** Gets all top-level contexts, i.e. those with no parent. */
  getTopLevelContexts() {
    return this.getAllContexts().filter((e) => e.isTopLevelContext());
  }
  /** Gets all contexts. */
  getAllContexts() {
    return Array.from(s(this, ft).values());
  }
  /** Deletes the context with the given ID. */
  deleteContextById(e) {
    s(this, ft).delete(e);
  }
  /** Deletes the given context. */
  deleteContext(e) {
    s(this, ft).delete(e.id);
  }
  /** Tracks the given context. */
  addContext(e) {
    s(this, ft).set(e.id, e), s(this, di).emit("added", {
      browsingContext: e
    });
  }
  /**
   * Waits for a context with the given ID to be added and returns it.
   */
  waitForContext(e) {
    return s(this, ft).has(e) ? Promise.resolve(this.getContext(e)) : new Promise((t) => {
      const r = (n) => {
        n.browsingContext.id === e && (s(this, di).off("added", r), t(n.browsingContext));
      };
      s(this, di).on("added", r);
    });
  }
  /** Returns true whether there is an existing context with the given ID. */
  hasContext(e) {
    return s(this, ft).has(e);
  }
  /** Gets the context with the given ID, if any. */
  findContext(e) {
    return s(this, ft).get(e);
  }
  /** Returns the top-level context ID of the given context, if any. */
  findTopLevelContextId(e) {
    if (e === null)
      return null;
    const t = this.findContext(e);
    if (!t)
      return null;
    const r = t.parentId ?? null;
    return r === null ? e : this.findTopLevelContextId(r);
  }
  findContextBySession(e) {
    for (const t of s(this, ft).values())
      if (t.cdpTarget.cdpSessionId === e)
        return t;
  }
  /** Gets the context with the given ID, if any, otherwise throws. */
  getContext(e) {
    const t = this.findContext(e);
    if (t === void 0)
      throw new Zh.NoSuchFrameException(`Context ${e} not found`);
    return t;
  }
  verifyTopLevelContextsList(e) {
    const t = /* @__PURE__ */ new Set();
    if (!e)
      return t;
    for (const r of e) {
      const n = this.getContext(r);
      if (n.isTopLevelContext())
        t.add(n);
      else
        throw new Zh.InvalidArgumentException(`Non top-level context '${r}' given.`);
    }
    return t;
  }
  verifyContextsList(e) {
    if (e.length)
      for (const t of e)
        this.getContext(t);
  }
}
ft = new WeakMap(), di = new WeakMap();
ad.BrowsingContextStorage = rb;
var cd = {};
Object.defineProperty(cd, "__esModule", { value: !0 });
cd.PreloadScriptStorage = void 0;
const Qh = M;
var Nt;
class nb {
  constructor() {
    /** Tracks all BiDi preload scripts.  */
    u(this, Nt, /* @__PURE__ */ new Set());
  }
  /**
   * Finds all entries that match the given filter (OR logic).
   */
  find(e) {
    return e ? [...s(this, Nt)].filter((t) => !!(t.contexts === void 0 && t.userContexts === void 0 || e.targetId !== void 0 && t.targetIds.has(e.targetId))) : [...s(this, Nt)];
  }
  add(e) {
    s(this, Nt).add(e);
  }
  /** Deletes all BiDi preload script entries that match the given filter. */
  remove(e) {
    const t = [...s(this, Nt)].find((r) => r.id === e);
    if (t === void 0)
      throw new Qh.NoSuchScriptException(`No preload script with id '${e}'`);
    s(this, Nt).delete(t);
  }
  /** Gets the preload script with the given ID, if any, otherwise throws. */
  getPreloadScript(e) {
    const t = [...s(this, Nt)].find((r) => r.id === e);
    if (t === void 0)
      throw new Qh.NoSuchScriptException(`No preload script with id '${e}'`);
    return t;
  }
  onCdpTargetCreated(e, t) {
    const r = [...s(this, Nt)].filter((n) => {
      var o;
      return !n.userContexts && !n.contexts ? !0 : (o = n.userContexts) == null ? void 0 : o.includes(t);
    });
    for (const n of r)
      n.targetIds.add(e);
  }
}
Nt = new WeakMap();
cd.PreloadScriptStorage = nb;
var ud = {};
Object.defineProperty(ud, "__esModule", { value: !0 });
ud.RealmStorage = void 0;
const ib = se, ob = rc;
var cu, li;
class ab {
  constructor() {
    /** Tracks handles and their realms sent to the client. */
    u(this, cu, /* @__PURE__ */ new Map());
    /** Map from realm ID to Realm. */
    u(this, li, /* @__PURE__ */ new Map());
    /** List of the internal sandboxed realms which should not be reported to the user. */
    O(this, "hiddenSandboxes", /* @__PURE__ */ new Set());
  }
  get knownHandlesToRealmMap() {
    return s(this, cu);
  }
  addRealm(e) {
    s(this, li).set(e.realmId, e);
  }
  /** Finds all realms that match the given filter. */
  findRealms(e) {
    const t = e.sandbox === null ? void 0 : e.sandbox;
    return Array.from(s(this, li).values()).filter((r) => !(e.realmId !== void 0 && e.realmId !== r.realmId || e.browsingContextId !== void 0 && !r.associatedBrowsingContexts.map((n) => n.id).includes(e.browsingContextId) || e.sandbox !== void 0 && (!(r instanceof ob.WindowRealm) || t !== r.sandbox) || e.executionContextId !== void 0 && e.executionContextId !== r.executionContextId || e.origin !== void 0 && e.origin !== r.origin || e.type !== void 0 && e.type !== r.realmType || e.cdpSessionId !== void 0 && e.cdpSessionId !== r.cdpClient.sessionId || e.isHidden !== void 0 && e.isHidden !== r.isHidden()));
  }
  findRealm(e) {
    return this.findRealms(e)[0];
  }
  /** Gets the only realm that matches the given filter, if any, otherwise throws. */
  getRealm(e) {
    const t = this.findRealm(e);
    if (t === void 0)
      throw new ib.NoSuchFrameException(`Realm ${JSON.stringify(e)} not found`);
    return t;
  }
  /** Deletes all realms that match the given filter. */
  deleteRealms(e) {
    this.findRealms(e).map((t) => {
      t.dispose(), s(this, li).delete(t.realmId), Array.from(this.knownHandlesToRealmMap.entries()).filter(([, r]) => r === t.realmId).map(([r]) => this.knownHandlesToRealmMap.delete(r));
    });
  }
}
cu = new WeakMap(), li = new WeakMap();
ud.RealmStorage = ab;
var dd = {}, ld = {};
Object.defineProperty(ld, "__esModule", { value: !0 });
ld.Buffer = void 0;
var ma, _r, ga, vp;
let cb = (vp = class {
  /**
   * @param capacity The buffer capacity.
   * @param onItemRemoved Delegate called for each removed element.
   */
  constructor(e, t) {
    u(this, ma);
    u(this, _r, []);
    u(this, ga);
    f(this, ma, e), f(this, ga, t);
  }
  get() {
    return s(this, _r);
  }
  add(e) {
    var t;
    for (s(this, _r).push(e); s(this, _r).length > s(this, ma); ) {
      const r = s(this, _r).shift();
      r !== void 0 && ((t = s(this, ga)) == null || t.call(this, r));
    }
  }
}, ma = new WeakMap(), _r = new WeakMap(), ga = new WeakMap(), vp);
ld.Buffer = cb;
var hd = {};
Object.defineProperty(hd, "__esModule", { value: !0 });
hd.IdWrapper = void 0;
var uu, wa;
const du = class du {
  constructor() {
    u(this, wa);
    f(this, wa, ++Ch(du, uu)._);
  }
  get id() {
    return s(this, wa);
  }
};
uu = new WeakMap(), wa = new WeakMap(), u(du, uu, 0);
let El = du;
hd.IdWrapper = El;
var pd = {};
Object.defineProperty(pd, "__esModule", { value: !0 });
pd.isCdpEvent = hm;
pd.assertSupportedEvent = ub;
const Sl = se;
function hm(i) {
  var e;
  return ((e = i.split(".").at(0)) == null ? void 0 : e.startsWith(Sl.ChromiumBidi.BiDiModule.Cdp)) ?? !1;
}
function ub(i) {
  if (!Sl.ChromiumBidi.EVENT_NAMES.has(i) && !hm(i))
    throw new Sl.InvalidArgumentException(`Unknown event: ${i}`);
}
var Yr = {};
Object.defineProperty(Yr, "__esModule", { value: !0 });
Yr.SubscriptionManager = void 0;
Yr.cartesianProduct = lb;
Yr.unrollEvents = Pl;
Yr.difference = Il;
const Pe = se, db = qt;
function lb(...i) {
  return i.reduce((e, t) => e.flatMap((r) => t.map((n) => [r, n].flat())));
}
function Pl(i) {
  const e = /* @__PURE__ */ new Set();
  function t(r) {
    for (const n of r)
      e.add(n);
  }
  for (const r of i)
    switch (r) {
      case Pe.ChromiumBidi.BiDiModule.Bluetooth:
        t(Object.values(Pe.ChromiumBidi.Bluetooth.EventNames));
        break;
      case Pe.ChromiumBidi.BiDiModule.BrowsingContext:
        t(Object.values(Pe.ChromiumBidi.BrowsingContext.EventNames));
        break;
      case Pe.ChromiumBidi.BiDiModule.Input:
        t(Object.values(Pe.ChromiumBidi.Input.EventNames));
        break;
      case Pe.ChromiumBidi.BiDiModule.Log:
        t(Object.values(Pe.ChromiumBidi.Log.EventNames));
        break;
      case Pe.ChromiumBidi.BiDiModule.Network:
        t(Object.values(Pe.ChromiumBidi.Network.EventNames));
        break;
      case Pe.ChromiumBidi.BiDiModule.Script:
        t(Object.values(Pe.ChromiumBidi.Script.EventNames));
        break;
      case Pe.ChromiumBidi.BiDiModule.Speculation:
        t(Object.values(Pe.ChromiumBidi.Speculation.EventNames));
        break;
      default:
        e.add(r);
    }
  return e.values();
}
var mt, kr, Tr, hi, Fc;
class hb {
  constructor(e) {
    u(this, hi);
    u(this, mt, []);
    u(this, kr, /* @__PURE__ */ new Set());
    u(this, Tr);
    f(this, Tr, e);
  }
  getGoogChannelsSubscribedToEvent(e, t) {
    const r = /* @__PURE__ */ new Set();
    for (const n of s(this, mt))
      m(this, hi, Fc).call(this, n, e, t) && r.add(n.googChannel);
    return Array.from(r);
  }
  getGoogChannelsSubscribedToEventGlobally(e) {
    const t = /* @__PURE__ */ new Set();
    for (const r of s(this, mt))
      m(this, hi, Fc).call(this, r, e) && t.add(r.googChannel);
    return Array.from(t);
  }
  isSubscribedTo(e, t) {
    for (const r of s(this, mt))
      if (m(this, hi, Fc).call(this, r, e, t))
        return !0;
    return !1;
  }
  /**
   * Subscribes to event in the given context and goog:channel.
   * @return {SubscriptionItem[]} List of
   * subscriptions. If the event is a whole module, it will return all the specific
   * events. If the contextId is null, it will return all the top-level contexts which were
   * not subscribed before the command.
   */
  subscribe(e, t, r, n) {
    const o = {
      id: (0, db.uuidv4)(),
      eventNames: new Set(Pl(e)),
      topLevelTraversableIds: new Set(t.map((a) => {
        const c = s(this, Tr).findTopLevelContextId(a);
        if (!c)
          throw new Pe.NoSuchFrameException(`Top-level navigable not found for context id ${a}`);
        return c;
      })),
      userContextIds: new Set(r),
      googChannel: n
    };
    return s(this, mt).push(o), s(this, kr).add(o.id), o;
  }
  /**
   * Unsubscribes atomically from all events in the given contexts and channel.
   *
   * This is a legacy spec branch to unsubscribe by attributes.
   */
  unsubscribe(e, t) {
    const r = new Set(Pl(e)), n = [], o = /* @__PURE__ */ new Set();
    for (const a of s(this, mt)) {
      if (a.googChannel !== t) {
        n.push(a);
        continue;
      }
      if (a.userContextIds.size !== 0) {
        n.push(a);
        continue;
      }
      if (pb(a.eventNames, r).size === 0) {
        n.push(a);
        continue;
      }
      if (a.topLevelTraversableIds.size !== 0) {
        n.push(a);
        continue;
      }
      const c = new Set(a.eventNames);
      for (const p of r)
        c.has(p) && (o.add(p), c.delete(p));
      c.size !== 0 && n.push({
        ...a,
        eventNames: c
      });
    }
    if (!fb(o, r))
      throw new Pe.InvalidArgumentException("No subscription found");
    f(this, mt, n);
  }
  /**
   * Unsubscribes by subscriptionId.
   */
  unsubscribeById(e) {
    const t = new Set(e);
    if (Il(t, s(this, kr)).size !== 0)
      throw new Pe.InvalidArgumentException("No subscription found");
    f(this, mt, s(this, mt).filter((n) => !t.has(n.id))), f(this, kr, Il(s(this, kr), t));
  }
}
mt = new WeakMap(), kr = new WeakMap(), Tr = new WeakMap(), hi = new WeakSet(), Fc = function(e, t, r) {
  let n = !1;
  for (const o of e.eventNames)
    if (
      // Event explicitly subscribed
      o === t || // Event subscribed via module
      o === t.split(".").at(0) || // Event explicitly subscribed compared to module
      o.split(".").at(0) === t
    ) {
      n = !0;
      break;
    }
  if (!n)
    return !1;
  if (e.userContextIds.size !== 0) {
    if (!r)
      return !1;
    const o = s(this, Tr).findContext(r);
    return o ? e.userContextIds.has(o.userContext) : !1;
  }
  if (e.topLevelTraversableIds.size !== 0) {
    if (!r)
      return !1;
    const o = s(this, Tr).findTopLevelContextId(r);
    return o !== null && e.topLevelTraversableIds.has(o);
  }
  return !0;
};
Yr.SubscriptionManager = hb;
function pb(i, e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of i)
    e.has(r) && t.add(r);
  return t;
}
function Il(i, e) {
  const t = /* @__PURE__ */ new Set();
  for (const r of i)
    e.has(r) || t.add(r);
  return t;
}
function fb(i, e) {
  if (i.size !== e.size)
    return !1;
  for (const t of i)
    if (!e.has(t))
      return !1;
  return !0;
}
var io;
Object.defineProperty(dd, "__esModule", { value: !0 });
dd.EventManager = void 0;
const _l = se, mb = ld, ep = ic, gb = qs, wb = hd, Td = ji, tp = pd, Dd = Yr;
var lu, ya, va;
class sp {
  constructor(e, t) {
    u(this, lu, new wb.IdWrapper());
    u(this, ya);
    u(this, va);
    f(this, va, e), f(this, ya, t);
  }
  get id() {
    return s(this, lu).id;
  }
  get contextId() {
    return s(this, ya);
  }
  get event() {
    return s(this, va);
  }
}
lu = new WeakMap(), ya = new WeakMap(), va = new WeakMap();
const yc = /* @__PURE__ */ new Map([[_l.ChromiumBidi.Log.EventNames.LogEntryAdded, 100]]);
var ba, Os, Dr, gt, Ot, pi, Ca, Nr, oo, st, kl, Mc, Tl;
class ch extends gb.EventEmitter {
  constructor(t, r) {
    super();
    u(this, st);
    /**
     * Maps event name to a set of contexts where this event already happened.
     * Needed for getting buffered events from all the contexts in case of
     * subscripting to all contexts.
     */
    u(this, ba, new ep.DefaultMap(() => /* @__PURE__ */ new Set()));
    /**
     * Maps `eventName` + `browsingContext` to buffer. Used to get buffered events
     * during subscription. Channel-agnostic.
     */
    u(this, Os, /* @__PURE__ */ new Map());
    /**
     * Maps `eventName` + `browsingContext` to  Map of goog:channel to last id.
     * Used to avoid sending duplicated events when user
     * subscribes -> unsubscribes -> subscribes.
     */
    u(this, Dr, /* @__PURE__ */ new Map());
    u(this, gt);
    u(this, Ot);
    /**
     * Map of event name to hooks to be called when client is subscribed to the event.
     */
    u(this, pi);
    u(this, Ca);
    f(this, Ot, t), f(this, Ca, r), f(this, gt, new Dd.SubscriptionManager(t)), f(this, pi, new ep.DefaultMap(() => []));
  }
  get subscriptionManager() {
    return s(this, gt);
  }
  addSubscribeHook(t, r) {
    s(this, pi).get(t).push(r);
  }
  registerEvent(t, r) {
    this.registerPromiseEvent(Promise.resolve({
      kind: "success",
      value: t
    }), r, t.method);
  }
  registerGlobalEvent(t) {
    this.registerGlobalPromiseEvent(Promise.resolve({
      kind: "success",
      value: t
    }), t.method);
  }
  registerPromiseEvent(t, r, n) {
    const o = new sp(t, r), a = s(this, gt).getGoogChannelsSubscribedToEvent(n, r);
    m(this, st, kl).call(this, o, n);
    for (const c of a)
      this.emit("event", {
        message: Td.OutgoingMessage.createFromPromise(t, c),
        event: n
      }), m(this, st, Mc).call(this, o, c, n);
  }
  registerGlobalPromiseEvent(t, r) {
    const n = new sp(t, null), o = s(this, gt).getGoogChannelsSubscribedToEventGlobally(r);
    m(this, st, kl).call(this, n, r);
    for (const a of o)
      this.emit("event", {
        message: Td.OutgoingMessage.createFromPromise(t, a),
        event: r
      }), m(this, st, Mc).call(this, n, a, r);
  }
  async subscribe(t, r, n, o) {
    for (const d of t)
      (0, tp.assertSupportedEvent)(d);
    if (n.length && r.length)
      throw new _l.InvalidArgumentException("Both userContexts and contexts cannot be specified.");
    s(this, Ot).verifyContextsList(r), await s(this, Ca).verifyUserContextIdList(n);
    const a = new Set((0, Dd.unrollEvents)(t)), c = /* @__PURE__ */ new Map(), p = new Set(r.length ? r.map((d) => {
      const h = s(this, Ot).findTopLevelContextId(d);
      if (!h)
        throw new _l.InvalidArgumentException("Invalid context id");
      return h;
    }) : s(this, Ot).getTopLevelContexts().map((d) => d.id));
    for (const d of a) {
      const h = new Set(s(this, Ot).getTopLevelContexts().map((g) => g.id).filter((g) => s(this, gt).isSubscribedTo(d, g)));
      c.set(d, (0, Dd.difference)(p, h));
    }
    const l = s(this, gt).subscribe(t, r, n, o);
    for (const d of l.eventNames)
      for (const h of p)
        for (const g of m(this, st, Tl).call(this, d, h, o))
          this.emit("event", {
            message: Td.OutgoingMessage.createFromPromise(g.event, o),
            event: d
          }), m(this, st, Mc).call(this, g, o, d);
    for (const [d, h] of c)
      for (const g of h)
        s(this, pi).get(d).forEach((x) => x(g));
    return await this.toggleModulesIfNeeded(), l.id;
  }
  async unsubscribe(t, r) {
    for (const n of t)
      (0, tp.assertSupportedEvent)(n);
    s(this, gt).unsubscribe(t, r), await this.toggleModulesIfNeeded();
  }
  async unsubscribeByIds(t) {
    s(this, gt).unsubscribeById(t), await this.toggleModulesIfNeeded();
  }
  async toggleModulesIfNeeded() {
    await Promise.all(s(this, Ot).getAllContexts().map(async (t) => await t.toggleModulesIfNeeded()));
  }
  clearBufferedEvents(t) {
    var r;
    for (const n of yc.keys()) {
      const o = m(r = io, Nr, oo).call(r, n, t);
      s(this, Os).delete(o);
    }
  }
}
ba = new WeakMap(), Os = new WeakMap(), Dr = new WeakMap(), gt = new WeakMap(), Ot = new WeakMap(), pi = new WeakMap(), Ca = new WeakMap(), Nr = new WeakSet(), oo = function(t, r) {
  return JSON.stringify({ eventName: t, browsingContext: r });
}, st = new WeakSet(), /**
 * If the event is buffer-able, put it in the buffer.
 */
kl = function(t, r) {
  var o;
  if (!yc.has(r))
    return;
  const n = m(o = io, Nr, oo).call(o, r, t.contextId);
  s(this, Os).has(n) || s(this, Os).set(n, new mb.Buffer(yc.get(r))), s(this, Os).get(n).add(t), s(this, ba).get(r).add(t.contextId);
}, /**
 * If the event is buffer-able, mark it as sent to the given contextId and goog:channel.
 */
Mc = function(t, r, n) {
  var p, l;
  if (!yc.has(n))
    return;
  const o = m(p = io, Nr, oo).call(p, n, t.contextId), a = Math.max(((l = s(this, Dr).get(o)) == null ? void 0 : l.get(r)) ?? 0, t.id), c = s(this, Dr).get(o);
  c ? c.set(r, a) : s(this, Dr).set(o, /* @__PURE__ */ new Map([[r, a]]));
}, /**
 * Returns events which are buffered and not yet sent to the given goog:channel events.
 */
Tl = function(t, r, n) {
  var p, l, d;
  const o = m(p = io, Nr, oo).call(p, t, r), a = ((l = s(this, Dr).get(o)) == null ? void 0 : l.get(n)) ?? -1 / 0, c = ((d = s(this, Os).get(o)) == null ? void 0 : d.get().filter((h) => h.id > a)) ?? [];
  return r === null && Array.from(s(this, ba).get(t).keys()).filter((h) => (
    // Events without context are already in the result.
    h !== null && // Events from deleted contexts should not be sent.
    s(this, Ot).hasContext(h)
  )).map((h) => m(this, st, Tl).call(this, t, h, n)).forEach((h) => c.push(...h)), c.sort((h, g) => h.id - g.id);
}, u(ch, Nr);
dd.EventManager = ch;
io = ch;
var fd = {};
Object.defineProperty(fd, "__esModule", { value: !0 });
fd.SpeculationProcessor = void 0;
const yb = Te;
var xa, Ea;
class vb {
  constructor(e, t) {
    u(this, xa);
    u(this, Ea);
    f(this, xa, e), f(this, Ea, t);
  }
  onCdpTargetCreated(e) {
    e.cdpClient.on("Preload.prefetchStatusUpdated", (t) => {
      var n;
      let r;
      switch (t.status) {
        case "Running":
          r = "pending";
          break;
        case "Ready":
          r = "ready";
          break;
        case "Success":
          r = "success";
          break;
        case "Failure":
          r = "failure";
          break;
        default:
          (n = s(this, Ea)) == null || n.call(this, yb.LogType.debugWarn, `Unknown prefetch status: ${t.status}`);
          return;
      }
      s(this, xa).registerEvent({
        type: "event",
        method: "speculation.prefetchStatusUpdated",
        params: {
          context: t.initiatingFrameId,
          url: t.prefetchUrl,
          status: r
        }
      }, e.id);
    });
  }
}
xa = new WeakMap(), Ea = new WeakMap();
fd.SpeculationProcessor = vb;
Object.defineProperty(Du, "__esModule", { value: !0 });
Du.BidiServer = void 0;
const bb = qs, Cb = Te, xb = Nu, Eb = Ou, Sb = Xu, Pb = Ju, Ib = Zu, _b = Qu, kb = ad, Tb = ah, Db = cd, Nb = ud, Ob = dd, Rb = fd;
var Sa, Or, fi, Rt, ss, Pa, Ia, mi, _a, Rs, hu, pu, fu, pm, mu, fm;
const gu = class gu extends bb.EventEmitter {
  constructor(t, r, n, o, a, c, p, l) {
    super();
    u(this, mu);
    u(this, Sa);
    u(this, Or);
    u(this, fi);
    u(this, Rt);
    u(this, ss, new kb.BrowsingContextStorage());
    u(this, Pa, new Nb.RealmStorage());
    u(this, Ia, new Db.PreloadScriptStorage());
    u(this, mi);
    u(this, _a);
    u(this, Rs);
    u(this, hu, (t) => {
      s(this, fi).processCommand(t).catch((r) => {
        var n;
        (n = s(this, Rs)) == null || n.call(this, Cb.LogType.debugError, r);
      });
    });
    u(this, pu, async (t) => {
      const r = t.message;
      t.googChannel !== null && (r["goog:channel"] = t.googChannel), await s(this, Or).sendMessage(r);
    });
    f(this, Rs, l), f(this, Sa, new xb.ProcessingQueue(s(this, pu), s(this, Rs))), f(this, Or, t), s(this, Or).setOnMessage(s(this, hu));
    const d = new Pb.ContextConfigStorage(), h = new Ib.UserContextStorage(n);
    f(this, Rt, new Ob.EventManager(s(this, ss), h));
    const g = new Tb.NetworkStorage(s(this, Rt), s(this, ss), n, l);
    f(this, mi, new Sb.BluetoothProcessor(s(this, Rt), s(this, ss))), f(this, _a, new Rb.SpeculationProcessor(s(this, Rt), s(this, Rs))), f(this, fi, new Eb.CommandProcessor(r, n, s(this, Rt), s(this, ss), s(this, Pa), s(this, Ia), g, d, s(this, mi), h, p, async (x) => {
      await n.sendCommand("Security.setIgnoreCertificateErrors", {
        ignore: x.acceptInsecureCerts ?? !1
      }), d.updateGlobalConfig({
        acceptInsecureCerts: x.acceptInsecureCerts ?? !1,
        userPromptHandler: x.unhandledPromptBehavior,
        prerenderingDisabled: (x == null ? void 0 : x["goog:prerenderingDisabled"]) ?? !1,
        disableNetworkDurableMessages: x == null ? void 0 : x["goog:disableNetworkDurableMessages"]
      }), new _b.CdpTargetManager(r, n, o, s(this, Rt), s(this, ss), s(this, Pa), g, d, s(this, mi), s(this, _a), s(this, Ia), a, c, l), await n.sendCommand("Target.setDiscoverTargets", {
        discover: !0
      }), await n.sendCommand("Target.setAutoAttach", {
        autoAttach: !0,
        waitForDebuggerOnStart: !0,
        flatten: !0,
        // Browser session should attach to tab instead of the page, so that
        // prerendering is not blocked.
        filter: [
          {
            type: "page",
            exclude: !0
          },
          {}
        ]
      }), await m(this, mu, fm).call(this);
    }, s(this, Rs))), s(this, Rt).on("event", ({ message: x, event: E }) => {
      this.emitOutgoingMessage(x, E);
    }), s(this, fi).on("response", ({ message: x, event: E }) => {
      this.emitOutgoingMessage(x, E);
    });
  }
  /**
   * Creates and starts BiDi Mapper instance.
   */
  static async createAndStart(t, r, n, o, a, c) {
    const [p, l] = await Promise.all([
      m(this, fu, pm).call(this, n),
      // Fetch the default User Agent to be used in `CdpTarget`. This allows to avoid
      // round trips to the browser for every target override.
      n.sendCommand("Browser.getVersion"),
      // Required for `Browser.downloadWillBegin` events.
      n.sendCommand("Browser.setDownloadBehavior", {
        behavior: "default",
        eventsEnabled: !0
      })
    ]);
    return new gu(t, r, n, o, p, l.userAgent, a, c);
  }
  /**
   * Sends BiDi message.
   */
  emitOutgoingMessage(t, r) {
    s(this, Sa).add(t, r);
  }
  close() {
    s(this, Or).close();
  }
};
Sa = new WeakMap(), Or = new WeakMap(), fi = new WeakMap(), Rt = new WeakMap(), ss = new WeakMap(), Pa = new WeakMap(), Ia = new WeakMap(), mi = new WeakMap(), _a = new WeakMap(), Rs = new WeakMap(), hu = new WeakMap(), pu = new WeakMap(), fu = new WeakSet(), pm = async function(t) {
  const [{ defaultBrowserContextId: r, browserContextIds: n }, { targetInfos: o }] = await Promise.all([
    t.sendCommand("Target.getBrowserContexts"),
    t.sendCommand("Target.getTargets")
  ]);
  if (r)
    return r;
  for (const a of o)
    if (a.browserContextId && !n.includes(a.browserContextId))
      return a.browserContextId;
  return "default";
}, mu = new WeakSet(), fm = async function() {
  await Promise.all(s(this, ss).getTopLevelContexts().map((t) => t.lifecycleLoaded()));
}, u(gu, fu);
let Dl = gu;
Du.BidiServer = Dl;
(function(i) {
  Object.defineProperty(i, "__esModule", { value: !0 }), i.OutgoingMessage = i.EventEmitter = i.BidiServer = void 0;
  var e = Du;
  Object.defineProperty(i, "BidiServer", { enumerable: !0, get: function() {
    return e.BidiServer;
  } });
  var t = qs;
  Object.defineProperty(i, "EventEmitter", { enumerable: !0, get: function() {
    return t.EventEmitter;
  } });
  var r = ji;
  Object.defineProperty(i, "OutgoingMessage", { enumerable: !0, get: function() {
    return r.OutgoingMessage;
  } });
})(Tu);
var Rr, As, rs;
const Zs = class Zs extends og {
  constructor(t, r) {
    super();
    u(this, Rr, !1);
    u(this, As);
    u(this, rs, Jl.create());
    O(this, "frame");
    /**
     * @internal
     */
    O(this, "onClose", () => {
      Zs.sessions.delete(this.id()), f(this, Rr, !0);
    });
    if (this.frame = t, !this.frame.page().browser().cdpSupported)
      return;
    const n = this.frame.page().browser().connection;
    f(this, As, n), r ? (s(this, rs).resolve(r), Zs.sessions.set(r, this)) : (async () => {
      try {
        const { result: o } = await n.send("goog:cdp.getSession", {
          context: t._id
        });
        s(this, rs).resolve(o.session), Zs.sessions.set(o.session, this);
      } catch (o) {
        s(this, rs).reject(o);
      }
    })(), Zs.sessions.set(s(this, rs).value(), this);
  }
  connection() {
  }
  get detached() {
    return s(this, Rr);
  }
  async send(t, r, n) {
    if (s(this, As) === void 0)
      throw new q("CDP support is required for this feature. The current browser does not support CDP.");
    if (s(this, Rr))
      throw new Yl(`Protocol error (${t}): Session closed. Most likely the page has been closed.`);
    const o = await s(this, rs).valueOrThrow(), { result: a } = await s(this, As).send("goog:cdp.sendCommand", {
      method: t,
      params: r,
      session: o
    }, n == null ? void 0 : n.timeout);
    return a.result;
  }
  async detach() {
    if (!(s(this, As) === void 0 || s(this, As).closed || s(this, Rr)))
      try {
        await this.frame.client.send("Target.detachFromTarget", {
          sessionId: this.id()
        });
      } finally {
        this.onClose();
      }
  }
  id() {
    const t = s(this, rs).value();
    return typeof t == "string" ? t : "";
  }
};
Rr = new WeakMap(), As = new WeakMap(), rs = new WeakMap(), O(Zs, "sessions", /* @__PURE__ */ new Map());
let lo = Zs;
/**
 * @license
 * Copyright 2017 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
const Ab = Zl("puppeteer:webDriverBiDi:SEND ►"), Bb = Zl("puppeteer:webDriverBiDi:RECV ◀");
var ka, At, gi, Ta, Ar, Bt, Da, Na, Nl;
class Fb extends Z {
  constructor(t, r, n, o = 0, a) {
    super();
    u(this, Na);
    u(this, ka);
    u(this, At);
    u(this, gi);
    u(this, Ta, 0);
    u(this, Ar, !1);
    u(this, Bt);
    u(this, Da, []);
    f(this, ka, t), f(this, gi, o), f(this, Ta, a ?? 18e4), f(this, Bt, new ag(n)), f(this, At, r), s(this, At).onmessage = this.onMessage.bind(this), s(this, At).onclose = this.unbind.bind(this);
  }
  get closed() {
    return s(this, Ar);
  }
  get url() {
    return s(this, ka);
  }
  pipeTo(t) {
    s(this, Da).push(t);
  }
  emit(t, r) {
    process.env.PUPPETEER_WEBDRIVER_BIDI_ONLY === "true" && m(this, Na, Nl).call(this, r);
    for (const n of s(this, Da))
      n.emit(t, r);
    return super.emit(t, r);
  }
  send(t, r, n) {
    return s(this, Ar) ? Promise.reject(new cg("Connection closed.")) : s(this, Bt).create(t, n ?? s(this, Ta), (o) => {
      const a = JSON.stringify({
        id: o,
        method: t,
        params: r
      });
      Ab(a), s(this, At).send(a);
    });
  }
  /**
   * @internal
   */
  async onMessage(t) {
    var n;
    s(this, gi) && await new Promise((o) => setTimeout(o, s(this, gi))), Bb(t);
    const r = JSON.parse(t);
    if ("type" in r)
      switch (r.type) {
        case "success":
          s(this, Bt).resolve(r.id, r);
          return;
        case "error":
          if (r.id === null)
            break;
          s(this, Bt).reject(r.id, Mb(r), `${r.error}: ${r.message}`);
          return;
        case "event":
          if (jb(r)) {
            (n = lo.sessions.get(r.params.session)) == null || n.emit(r.params.event, r.params.params);
            return;
          }
          this.emit(r.method, r.params);
          return;
      }
    "id" in r && s(this, Bt).reject(r.id, `Protocol Error. Message is not in BiDi protocol format: '${t}'`, r.message), Ee(r);
  }
  /**
   * Unbinds the connection, but keeps the transport open. Useful when the transport will
   * be reused by other connection e.g. with different protocol.
   * @internal
   */
  unbind() {
    s(this, Ar) || (f(this, Ar, !0), s(this, At).onmessage = () => {
    }, s(this, At).onclose = () => {
    }, s(this, Bt).clear());
  }
  /**
   * Unbinds the connection and closes the transport.
   */
  dispose() {
    this.unbind(), s(this, At).close();
  }
  getPendingProtocolErrors() {
    return s(this, Bt).getPendingProtocolErrors();
  }
}
ka = new WeakMap(), At = new WeakMap(), gi = new WeakMap(), Ta = new WeakMap(), Ar = new WeakMap(), Bt = new WeakMap(), Da = new WeakMap(), Na = new WeakSet(), Nl = function(t) {
  for (const r in t)
    r.startsWith("goog:") ? delete t[r] : typeof t[r] == "object" && t[r] !== null && m(this, Na, Nl).call(this, t[r]);
};
function Mb(i) {
  let e = `${i.error} ${i.message}`;
  return i.stacktrace && (e += ` ${i.stacktrace}`), e;
}
function jb(i) {
  return i.method.startsWith("goog:cdp.");
}
/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
const Ub = (i, ...e) => {
  Zl(`bidi:${i}`)(e);
};
async function JC(i) {
  const e = new Lb(), t = new $b(i), r = {
    send(a) {
      e.emitMessage(JSON.parse(a));
    },
    close() {
      o.close(), t.close(), i.dispose();
    },
    onmessage(a) {
    }
  };
  e.on("bidiResponse", (a) => {
    r.onmessage(JSON.stringify(a));
  });
  const n = new Fb(i.url(), r, i._idGenerator, i.delay, i.timeout), o = await Tu.BidiServer.createAndStart(
    e,
    t,
    t.browserClient(),
    /* selfTargetId= */
    "",
    void 0,
    Ub
  );
  return n;
}
var Oa, Br, Fr;
class $b {
  constructor(e) {
    u(this, Oa);
    u(this, Br, /* @__PURE__ */ new Map());
    u(this, Fr);
    f(this, Oa, e), f(this, Fr, new rp(e));
  }
  browserClient() {
    return s(this, Fr);
  }
  getCdpClient(e) {
    const t = s(this, Oa).session(e);
    if (!t)
      throw new Error(`Unknown CDP session with id ${e}`);
    if (!s(this, Br).has(t)) {
      const r = new rp(t, e, s(this, Fr));
      return s(this, Br).set(t, r), r;
    }
    return s(this, Br).get(t);
  }
  close() {
    s(this, Fr).close();
    for (const e of s(this, Br).values())
      e.close();
  }
}
Oa = new WeakMap(), Br = new WeakMap(), Fr = new WeakMap();
var wi, Mr, Ra, Aa;
class rp extends Tu.EventEmitter {
  constructor(t, r, n) {
    super();
    u(this, wi, !1);
    u(this, Mr);
    O(this, "sessionId");
    u(this, Ra);
    u(this, Aa, (t, r) => {
      this.emit(t, r);
    });
    f(this, Mr, t), this.sessionId = r, f(this, Ra, n), s(this, Mr).on("*", s(this, Aa));
  }
  browserClient() {
    return s(this, Ra);
  }
  async sendCommand(t, ...r) {
    if (!s(this, wi))
      try {
        return await s(this, Mr).send(t, ...r);
      } catch (n) {
        if (s(this, wi))
          return;
        throw n;
      }
  }
  close() {
    s(this, Mr).off("*", s(this, Aa)), f(this, wi, !0);
  }
  isCloseError(t) {
    return t instanceof Yl;
  }
}
wi = new WeakMap(), Mr = new WeakMap(), Ra = new WeakMap(), Aa = new WeakMap();
var yi;
class Lb extends Tu.EventEmitter {
  constructor() {
    super(...arguments);
    u(this, yi, async (t) => {
    });
  }
  emitMessage(t) {
    s(this, yi).call(this, t);
  }
  setOnMessage(t) {
    f(this, yi, t);
  }
  async sendMessage(t) {
    this.emit("bidiResponse", t);
  }
  close() {
    f(this, yi, async (t) => {
    });
  }
}
yi = new WeakMap();
/**
 * @license
 * Copyright 2025 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var jr, Ur;
class qb {
  constructor(e, t) {
    u(this, jr);
    u(this, Ur);
    f(this, Ur, e), f(this, jr, t);
  }
  async emulateAdapter(e, t = !0) {
    await s(this, jr).send("bluetooth.simulateAdapter", {
      context: s(this, Ur),
      state: e,
      leSupported: t
    });
  }
  async disableEmulation() {
    await s(this, jr).send("bluetooth.disableSimulation", {
      context: s(this, Ur)
    });
  }
  async simulatePreconnectedPeripheral(e) {
    await s(this, jr).send("bluetooth.simulatePreconnectedPeripheral", {
      context: s(this, Ur),
      address: e.address,
      name: e.name,
      manufacturerData: e.manufacturerData,
      knownServiceUuids: e.knownServiceUuids
    });
  }
}
jr = new WeakMap(), Ur = new WeakMap();
/**
 * @license
 * Copyright 2025 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var Bs, $r, Ba, wu, mm;
class Hb {
  constructor(e, t) {
    u(this, wu);
    u(this, Bs);
    u(this, $r);
    u(this, Ba, !1);
    f(this, Bs, t), f(this, $r, e);
  }
  async waitForDevicePrompt(e, t) {
    const r = Jl.create({
      message: `Waiting for \`DeviceRequestPrompt\` failed: ${e}ms exceeded`,
      timeout: e
    }), n = (o) => {
      o.context === s(this, $r) && (r.resolve(new zb(s(this, $r), o.prompt, s(this, Bs), o.devices)), s(this, Bs).off("bluetooth.requestDevicePromptUpdated", n));
    };
    return s(this, Bs).on("bluetooth.requestDevicePromptUpdated", n), t && t.addEventListener("abort", () => {
      r.reject(t.reason);
    }, { once: !0 }), await m(this, wu, mm).call(this), await r.valueOrThrow();
  }
}
Bs = new WeakMap(), $r = new WeakMap(), Ba = new WeakMap(), wu = new WeakSet(), mm = async function() {
  s(this, Ba) || (f(this, Ba, !0), await s(this, Bs).subscribe(["bluetooth.requestDevicePromptUpdated"], [s(this, $r)]));
};
var vi, bi, Ci;
class zb extends ug {
  constructor(t, r, n, o) {
    super();
    u(this, vi);
    u(this, bi);
    u(this, Ci);
    f(this, vi, n), f(this, bi, r), f(this, Ci, t), this.devices.push(...o.map((a) => ({
      id: a.id,
      name: a.name ?? "UNKNOWN"
    })));
  }
  async cancel() {
    await s(this, vi).send("bluetooth.handleRequestDevicePrompt", {
      context: s(this, Ci),
      prompt: s(this, bi),
      accept: !1
    });
  }
  async select(t) {
    await s(this, vi).send("bluetooth.handleRequestDevicePrompt", {
      context: s(this, Ci),
      prompt: s(this, bi),
      accept: !0,
      device: t.id
    });
  }
  waitForDevice() {
    throw new q();
  }
}
vi = new WeakMap(), bi = new WeakMap(), Ci = new WeakMap();
/**
 * @license
 * Copyright 2024 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var Wb = function(i, e, t) {
  for (var r = arguments.length > 2, n = 0; n < e.length; n++)
    t = r ? e[n].call(i, t) : e[n].call(i);
  return r ? t : void 0;
}, Kb = function(i, e, t, r, n, o) {
  function a(b) {
    if (b !== void 0 && typeof b != "function") throw new TypeError("Function expected");
    return b;
  }
  for (var c = r.kind, p = c === "getter" ? "get" : c === "setter" ? "set" : "value", l = !e && i ? r.static ? i : i.prototype : null, d = e || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), h, g = !1, x = t.length - 1; x >= 0; x--) {
    var E = {};
    for (var P in r) E[P] = P === "access" ? {} : r[P];
    for (var P in r.access) E.access[P] = r.access[P];
    E.addInitializer = function(b) {
      if (g) throw new TypeError("Cannot add initializers after decoration has completed");
      o.push(a(b || null));
    };
    var C = (0, t[x])(c === "accessor" ? { get: d.get, set: d.set } : d[p], E);
    if (c === "accessor") {
      if (C === void 0) continue;
      if (C === null || typeof C != "object") throw new TypeError("Object expected");
      (h = a(C.get)) && (d.get = h), (h = a(C.set)) && (d.set = h), (h = a(C.init)) && n.unshift(h);
    } else (h = a(C)) && (c === "field" ? n.unshift(h) : d[p] = h);
  }
  l && Object.defineProperty(l, r.name, d), g = !0;
};
let Vb = (() => {
  var r, n, o, a, c, p, gm, jc, wm, g;
  let i = Z, e = [], t;
  return g = class extends i {
    constructor(P) {
      super();
      u(this, p);
      u(this, r, Wb(this, e));
      u(this, n);
      u(this, o);
      u(this, a, new $t());
      u(this, c);
      f(this, o, P);
    }
    static from(P) {
      var b;
      const C = new g(P);
      return m(b = C, p, gm).call(b), C;
    }
    get disposed() {
      return s(this, a).disposed;
    }
    get request() {
      return s(this, r);
    }
    get navigation() {
      return s(this, n);
    }
    dispose() {
      this[pe]();
    }
    [(t = [Ls], pe)]() {
      s(this, a).dispose(), super[pe]();
    }
  }, r = new WeakMap(), n = new WeakMap(), o = new WeakMap(), a = new WeakMap(), c = new WeakMap(), p = new WeakSet(), gm = function() {
    const P = s(this, a).use(new Z(s(this, o)));
    P.once("closed", () => {
      this.emit("failed", {
        url: s(this, o).url,
        timestamp: /* @__PURE__ */ new Date()
      }), this.dispose();
    }), P.on("request", ({ request: b }) => {
      if (b.navigation === void 0 || // If a request with a navigation ID comes in, then the navigation ID is
      // for this navigation.
      !m(this, p, jc).call(this, b.navigation))
        return;
      f(this, r, b), this.emit("request", b), s(this, a).use(new Z(s(this, r))).on("redirect", (v) => {
        f(this, r, v);
      });
    });
    const C = s(this, a).use(new Z(s(this, p, wm)));
    C.on("browsingContext.navigationStarted", (b) => {
      b.context !== s(this, o).id || s(this, n) !== void 0 || f(this, n, g.from(s(this, o)));
    });
    for (const b of [
      "browsingContext.domContentLoaded",
      "browsingContext.load",
      "browsingContext.navigationCommitted"
    ])
      C.on(b, (N) => {
        N.context !== s(this, o).id || N.navigation === null || !m(this, p, jc).call(this, N.navigation) || this.dispose();
      });
    for (const [b, N] of [
      ["browsingContext.fragmentNavigated", "fragment"],
      ["browsingContext.navigationFailed", "failed"],
      ["browsingContext.navigationAborted", "aborted"]
    ])
      C.on(b, (v) => {
        v.context !== s(this, o).id || // Note we don't check if `navigation` is null since `null` means the
        // fragment navigated.
        !m(this, p, jc).call(this, v.navigation) || (this.emit(N, {
          url: v.url,
          timestamp: new Date(v.timestamp)
        }), this.dispose());
      });
  }, jc = function(P) {
    return s(this, n) !== void 0 && !s(this, n).disposed ? !1 : s(this, c) === void 0 ? (f(this, c, P), !0) : s(this, c) === P;
  }, wm = function() {
    return s(this, o).userContext.browser.session;
  }, (() => {
    const P = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
    Kb(g, null, t, { kind: "method", name: "dispose", static: !1, private: !1, access: { has: (C) => "dispose" in C, get: (C) => C.dispose }, metadata: P }, null, e), P && Object.defineProperty(g, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: P });
  })(), g;
})();
/**
 * @license
 * Copyright 2024 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var Gb = function(i, e, t) {
  for (var r = arguments.length > 2, n = 0; n < e.length; n++)
    t = r ? e[n].call(i, t) : e[n].call(i);
  return r ? t : void 0;
}, Ji = function(i, e, t, r, n, o) {
  function a(b) {
    if (b !== void 0 && typeof b != "function") throw new TypeError("Function expected");
    return b;
  }
  for (var c = r.kind, p = c === "getter" ? "get" : c === "setter" ? "set" : "value", l = !e && i ? r.static ? i : i.prototype : null, d = e || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), h, g = !1, x = t.length - 1; x >= 0; x--) {
    var E = {};
    for (var P in r) E[P] = P === "access" ? {} : r[P];
    for (var P in r.access) E.access[P] = r.access[P];
    E.addInitializer = function(b) {
      if (g) throw new TypeError("Cannot add initializers after decoration has completed");
      o.push(a(b || null));
    };
    var C = (0, t[x])(c === "accessor" ? { get: d.get, set: d.set } : d[p], E);
    if (c === "accessor") {
      if (C === void 0) continue;
      if (C === null || typeof C != "object") throw new TypeError("Object expected");
      (h = a(C.get)) && (d.get = h), (h = a(C.set)) && (d.set = h), (h = a(C.init)) && n.unshift(h);
    } else (h = a(C)) && (c === "field" ? n.unshift(h) : d[p] = h);
  }
  l && Object.defineProperty(l, r.name, d), g = !0;
}, Ol;
let uh = (() => {
  var c, p;
  let i = Z, e = [], t, r, n, o, a;
  return p = class extends i {
    constructor(h, g) {
      super();
      u(this, c, Gb(this, e));
      O(this, "disposables", new $t());
      O(this, "id");
      O(this, "origin");
      O(this, "executionContextId");
      this.id = h, this.origin = g;
    }
    get disposed() {
      return s(this, c) !== void 0;
    }
    get target() {
      return { realm: this.id };
    }
    dispose(h) {
      f(this, c, h), this[pe]();
    }
    async disown(h) {
      await this.session.send("script.disown", {
        target: this.target,
        handles: h
      });
    }
    async callFunction(h, g, x = {}) {
      const { result: E } = await this.session.send("script.callFunction", {
        functionDeclaration: h,
        awaitPromise: g,
        target: this.target,
        ...x
      });
      return E;
    }
    async evaluate(h, g, x = {}) {
      const { result: E } = await this.session.send("script.evaluate", {
        expression: h,
        awaitPromise: g,
        target: this.target,
        ...x
      });
      return E;
    }
    async resolveExecutionContextId() {
      if (!this.executionContextId) {
        const { result: h } = await this.session.connection.send("goog:cdp.resolveRealm", { realm: this.id });
        this.executionContextId = h.executionContextId;
      }
      return this.executionContextId;
    }
    [(t = [Ls], r = [L((h) => s(h, c))], n = [L((h) => s(h, c))], o = [L((h) => s(h, c))], a = [L((h) => s(h, c))], pe)]() {
      s(this, c) ?? f(this, c, "Realm already destroyed, probably because all associated browsing contexts closed."), this.emit("destroyed", { reason: s(this, c) }), this.disposables.dispose(), super[pe]();
    }
  }, c = new WeakMap(), (() => {
    const h = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
    Ji(p, null, t, { kind: "method", name: "dispose", static: !1, private: !1, access: { has: (g) => "dispose" in g, get: (g) => g.dispose }, metadata: h }, null, e), Ji(p, null, r, { kind: "method", name: "disown", static: !1, private: !1, access: { has: (g) => "disown" in g, get: (g) => g.disown }, metadata: h }, null, e), Ji(p, null, n, { kind: "method", name: "callFunction", static: !1, private: !1, access: { has: (g) => "callFunction" in g, get: (g) => g.callFunction }, metadata: h }, null, e), Ji(p, null, o, { kind: "method", name: "evaluate", static: !1, private: !1, access: { has: (g) => "evaluate" in g, get: (g) => g.evaluate }, metadata: h }, null, e), Ji(p, null, a, { kind: "method", name: "resolveExecutionContextId", static: !1, private: !1, access: { has: (g) => "resolveExecutionContextId" in g, get: (g) => g.resolveExecutionContextId }, metadata: h }, null, e), h && Object.defineProperty(p, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: h });
  })(), p;
})();
var Fa, yu, ym;
const hh = class hh extends uh {
  constructor(t, r) {
    super("", "");
    u(this, yu);
    O(this, "browsingContext");
    O(this, "sandbox");
    u(this, Fa, /* @__PURE__ */ new Map());
    this.browsingContext = t, this.sandbox = r;
  }
  static from(t, r) {
    var o;
    const n = new hh(t, r);
    return m(o = n, yu, ym).call(o), n;
  }
  get session() {
    return this.browsingContext.userContext.browser.session;
  }
  get target() {
    return { context: this.browsingContext.id, sandbox: this.sandbox };
  }
};
Fa = new WeakMap(), yu = new WeakSet(), ym = function() {
  this.disposables.use(new Z(this.browsingContext)).on("closed", ({ reason: n }) => {
    this.dispose(n);
  });
  const r = this.disposables.use(new Z(this.session));
  r.on("script.realmCreated", (n) => {
    n.type !== "window" || n.context !== this.browsingContext.id || n.sandbox !== this.sandbox || (this.id = n.realm, this.origin = n.origin, this.executionContextId = void 0, this.emit("updated", this));
  }), r.on("script.realmCreated", (n) => {
    if (n.type !== "dedicated-worker" || !n.owners.includes(this.id))
      return;
    const o = dh.from(this, n.realm, n.origin);
    s(this, Fa).set(o.id, o);
    const a = this.disposables.use(new Z(o));
    a.once("destroyed", () => {
      a.removeAllListeners(), s(this, Fa).delete(o.id);
    }), this.emit("worker", o);
  });
};
let Rl = hh;
var Ma, vu, vm;
class dh extends uh {
  constructor(t, r, n) {
    super(r, n);
    u(this, vu);
    u(this, Ma, /* @__PURE__ */ new Map());
    O(this, "owners");
    this.owners = /* @__PURE__ */ new Set([t]);
  }
  static from(t, r, n) {
    var a;
    const o = new Ol(t, r, n);
    return m(a = o, vu, vm).call(a), o;
  }
  get session() {
    return this.owners.values().next().value.session;
  }
}
Ma = new WeakMap(), vu = new WeakSet(), vm = function() {
  const t = this.disposables.use(new Z(this.session));
  t.on("script.realmDestroyed", (r) => {
    r.realm === this.id && this.dispose("Realm already destroyed.");
  }), t.on("script.realmCreated", (r) => {
    if (r.type !== "dedicated-worker" || !r.owners.includes(this.id))
      return;
    const n = Ol.from(this, r.realm, r.origin);
    s(this, Ma).set(n.id, n), this.disposables.use(new Z(n)).once("destroyed", () => {
      s(this, Ma).delete(n.id);
    }), this.emit("worker", n);
  });
};
Ol = dh;
var ja, bu, bm;
const ph = class ph extends uh {
  constructor(t, r, n) {
    super(r, n);
    u(this, bu);
    u(this, ja, /* @__PURE__ */ new Map());
    O(this, "browser");
    this.browser = t;
  }
  static from(t, r, n) {
    var a;
    const o = new ph(t, r, n);
    return m(a = o, bu, bm).call(a), o;
  }
  get session() {
    return this.browser.session;
  }
};
ja = new WeakMap(), bu = new WeakSet(), bm = function() {
  const t = this.disposables.use(new Z(this.session));
  t.on("script.realmDestroyed", (r) => {
    r.realm === this.id && this.dispose("Realm already destroyed.");
  }), t.on("script.realmCreated", (r) => {
    if (r.type !== "dedicated-worker" || !r.owners.includes(this.id))
      return;
    const n = dh.from(this, r.realm, r.origin);
    s(this, ja).set(n.id, n), this.disposables.use(new Z(n)).once("destroyed", () => {
      s(this, ja).delete(n.id);
    }), this.emit("worker", n);
  });
};
let Al = ph;
/**
 * @license
 * Copyright 2024 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var Xb = function(i, e, t) {
  for (var r = arguments.length > 2, n = 0; n < e.length; n++)
    t = r ? e[n].call(i, t) : e[n].call(i);
  return r ? t : void 0;
}, Jb = function(i, e, t, r, n, o) {
  function a(b) {
    if (b !== void 0 && typeof b != "function") throw new TypeError("Function expected");
    return b;
  }
  for (var c = r.kind, p = c === "getter" ? "get" : c === "setter" ? "set" : "value", l = !e && i ? r.static ? i : i.prototype : null, d = e || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), h, g = !1, x = t.length - 1; x >= 0; x--) {
    var E = {};
    for (var P in r) E[P] = P === "access" ? {} : r[P];
    for (var P in r.access) E.access[P] = r.access[P];
    E.addInitializer = function(b) {
      if (g) throw new TypeError("Cannot add initializers after decoration has completed");
      o.push(a(b || null));
    };
    var C = (0, t[x])(c === "accessor" ? { get: d.get, set: d.set } : d[p], E);
    if (c === "accessor") {
      if (C === void 0) continue;
      if (C === null || typeof C != "object") throw new TypeError("Object expected");
      (h = a(C.get)) && (d.get = h), (h = a(C.set)) && (d.set = h), (h = a(C.init)) && n.unshift(h);
    } else (h = a(C)) && (c === "field" ? n.unshift(h) : d[p] = h);
  }
  l && Object.defineProperty(l, r.name, d), g = !0;
};
let Yb = (() => {
  var r, n, o, a, c, p, l, d, h, Cm, Wt, E;
  let i = Z, e = [], t;
  return E = class extends i {
    constructor(b, N) {
      super();
      u(this, h);
      u(this, r, (Xb(this, e), null));
      u(this, n, null);
      u(this, o);
      u(this, a);
      u(this, c);
      u(this, p);
      u(this, l, new $t());
      u(this, d);
      f(this, p, b), f(this, d, N);
    }
    static from(b, N) {
      var T;
      const v = new E(b, N);
      return m(T = v, h, Cm).call(T), v;
    }
    get disposed() {
      return s(this, l).disposed;
    }
    get error() {
      return s(this, o);
    }
    get headers() {
      return s(this, d).request.headers;
    }
    get id() {
      return s(this, d).request.request;
    }
    get initiator() {
      var b, N;
      return {
        ...s(this, d).initiator,
        // Initiator URL is not specified in BiDi.
        // @ts-expect-error non-standard property.
        url: (b = s(this, d).request["goog:resourceInitiator"]) == null ? void 0 : b.url,
        // @ts-expect-error non-standard property.
        stack: (N = s(this, d).request["goog:resourceInitiator"]) == null ? void 0 : N.stack
      };
    }
    get method() {
      return s(this, d).request.method;
    }
    get navigation() {
      return s(this, d).navigation ?? void 0;
    }
    get redirect() {
      return s(this, a);
    }
    get lastRedirect() {
      let b = s(this, a);
      for (; b; ) {
        if (b && !s(b, a))
          return b;
        b = s(b, a);
      }
      return b;
    }
    get response() {
      return s(this, c);
    }
    get url() {
      return s(this, d).request.url;
    }
    get isBlocked() {
      return s(this, d).isBlocked;
    }
    get resourceType() {
      return s(this, d).request["goog:resourceType"] ?? void 0;
    }
    get postData() {
      return s(this, d).request["goog:postData"] ?? void 0;
    }
    get hasPostData() {
      return (s(this, d).request.bodySize ?? 0) > 0;
    }
    async continueRequest({ url: b, method: N, headers: v, cookies: T, body: R }) {
      await s(this, h, Wt).send("network.continueRequest", {
        request: this.id,
        url: b,
        method: N,
        headers: v,
        body: R,
        cookies: T
      });
    }
    async failRequest() {
      await s(this, h, Wt).send("network.failRequest", {
        request: this.id
      });
    }
    async provideResponse({ statusCode: b, reasonPhrase: N, headers: v, body: T }) {
      await s(this, h, Wt).send("network.provideResponse", {
        request: this.id,
        statusCode: b,
        reasonPhrase: N,
        headers: v,
        body: T
      });
    }
    async fetchPostData() {
      if (this.hasPostData)
        return s(this, n) || f(this, n, (async () => {
          const b = await s(this, h, Wt).send("network.getData", {
            dataType: "request",
            request: this.id
          });
          if (b.result.bytes.type === "string")
            return b.result.bytes.value;
          throw new q(`Collected request body data of type ${b.result.bytes.type} is not supported`);
        })()), await s(this, n);
    }
    async getResponseContent() {
      return s(this, r) || f(this, r, (async () => {
        try {
          const b = await s(this, h, Wt).send("network.getData", {
            dataType: "response",
            request: this.id
          });
          return bp(b.result.bytes.value, b.result.bytes.type === "base64");
        } catch (b) {
          throw b instanceof uo && b.originalMessage.includes("No resource with given identifier found") ? new uo("Could not load response body for this request. This might happen if the request is a preflight request.") : b;
        }
      })()), await s(this, r);
    }
    async continueWithAuth(b) {
      b.action === "provideCredentials" ? await s(this, h, Wt).send("network.continueWithAuth", {
        request: this.id,
        action: b.action,
        credentials: b.credentials
      }) : await s(this, h, Wt).send("network.continueWithAuth", {
        request: this.id,
        action: b.action
      });
    }
    dispose() {
      this[pe]();
    }
    [(t = [Ls], pe)]() {
      s(this, l).dispose(), super[pe]();
    }
    timing() {
      return s(this, d).request.timings;
    }
  }, r = new WeakMap(), n = new WeakMap(), o = new WeakMap(), a = new WeakMap(), c = new WeakMap(), p = new WeakMap(), l = new WeakMap(), d = new WeakMap(), h = new WeakSet(), Cm = function() {
    s(this, l).use(new Z(s(this, p))).once("closed", ({ reason: v }) => {
      f(this, o, v), this.emit("error", s(this, o)), this.dispose();
    });
    const N = s(this, l).use(new Z(s(this, h, Wt)));
    N.on("network.beforeRequestSent", (v) => {
      if (v.context !== s(this, p).id || v.request.request !== this.id)
        return;
      const T = s(this, d).request.headers.find((D) => D.name.toLowerCase() === "authorization"), w = v.request.headers.find((D) => D.name.toLowerCase() === "authorization") && !T;
      v.redirectCount !== s(this, d).redirectCount + 1 && !w || (f(this, a, E.from(s(this, p), v)), this.emit("redirect", s(this, a)), this.dispose());
    }), N.on("network.authRequired", (v) => {
      v.context !== s(this, p).id || v.request.request !== this.id || // Don't try to authenticate for events that are not blocked
      !v.isBlocked || this.emit("authenticate", void 0);
    }), N.on("network.fetchError", (v) => {
      v.context !== s(this, p).id || v.request.request !== this.id || s(this, d).redirectCount !== v.redirectCount || (f(this, o, v.errorText), this.emit("error", s(this, o)), this.dispose());
    }), N.on("network.responseStarted", (v) => {
      v.context !== s(this, p).id || v.request.request !== this.id || s(this, d).redirectCount !== v.redirectCount || (f(this, c, v.response), s(this, d).request.timings = v.request.timings, this.emit("response", s(this, c)));
    }), N.on("network.responseCompleted", (v) => {
      v.context !== s(this, p).id || v.request.request !== this.id || s(this, d).redirectCount !== v.redirectCount || (f(this, c, v.response), s(this, d).request.timings = v.request.timings, this.emit("success", s(this, c)), !(s(this, c).status >= 300 && s(this, c).status < 400) && this.dispose());
    });
  }, Wt = function() {
    return s(this, p).userContext.browser.session;
  }, (() => {
    const b = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
    Jb(E, null, t, { kind: "method", name: "dispose", static: !1, private: !1, access: { has: (N) => "dispose" in N, get: (N) => N.dispose }, metadata: b }, null, e), b && Object.defineProperty(E, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: b });
  })(), E;
})();
/**
 * @license
 * Copyright 2024 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var Zb = function(i, e, t) {
  for (var r = arguments.length > 2, n = 0; n < e.length; n++)
    t = r ? e[n].call(i, t) : e[n].call(i);
  return r ? t : void 0;
}, np = function(i, e, t, r, n, o) {
  function a(b) {
    if (b !== void 0 && typeof b != "function") throw new TypeError("Function expected");
    return b;
  }
  for (var c = r.kind, p = c === "getter" ? "get" : c === "setter" ? "set" : "value", l = !e && i ? r.static ? i : i.prototype : null, d = e || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), h, g = !1, x = t.length - 1; x >= 0; x--) {
    var E = {};
    for (var P in r) E[P] = P === "access" ? {} : r[P];
    for (var P in r.access) E.access[P] = r.access[P];
    E.addInitializer = function(b) {
      if (g) throw new TypeError("Cannot add initializers after decoration has completed");
      o.push(a(b || null));
    };
    var C = (0, t[x])(c === "accessor" ? { get: d.get, set: d.set } : d[p], E);
    if (c === "accessor") {
      if (C === void 0) continue;
      if (C === null || typeof C != "object") throw new TypeError("Object expected");
      (h = a(C.get)) && (d.get = h), (h = a(C.set)) && (d.set = h), (h = a(C.init)) && n.unshift(h);
    } else (h = a(C)) && (c === "field" ? n.unshift(h) : d[p] = h);
  }
  l && Object.defineProperty(l, r.name, d), g = !0;
};
let Qb = (() => {
  var n, o, a, c, xm, Bl, d;
  let i = Z, e = [], t, r;
  return d = class extends i {
    constructor(x, E) {
      super();
      u(this, c);
      u(this, n, Zb(this, e));
      u(this, o);
      u(this, a, new $t());
      O(this, "browsingContext");
      O(this, "info");
      this.browsingContext = x, this.info = E;
    }
    static from(x, E) {
      var C;
      const P = new d(x, E);
      return m(C = P, c, xm).call(C), P;
    }
    get closed() {
      return s(this, n) !== void 0;
    }
    get disposed() {
      return this.closed;
    }
    get handled() {
      return this.info.handler === "accept" || this.info.handler === "dismiss" ? !0 : s(this, o) !== void 0;
    }
    get result() {
      return s(this, o);
    }
    dispose(x) {
      f(this, n, x), this[pe]();
    }
    async handle(x = {}) {
      return await s(this, c, Bl).send("browsingContext.handleUserPrompt", {
        ...x,
        context: this.info.context
      }), s(this, o);
    }
    [(t = [Ls], r = [L((x) => s(x, n))], pe)]() {
      s(this, n) ?? f(this, n, "User prompt already closed, probably because the associated browsing context was destroyed."), this.emit("closed", { reason: s(this, n) }), s(this, a).dispose(), super[pe]();
    }
  }, n = new WeakMap(), o = new WeakMap(), a = new WeakMap(), c = new WeakSet(), xm = function() {
    s(this, a).use(new Z(this.browsingContext)).once("closed", ({ reason: P }) => {
      this.dispose(`User prompt already closed: ${P}`);
    }), s(this, a).use(new Z(s(this, c, Bl))).on("browsingContext.userPromptClosed", (P) => {
      P.context === this.browsingContext.id && (f(this, o, P), this.emit("handled", P), this.dispose("User prompt already handled."));
    });
  }, Bl = function() {
    return this.browsingContext.userContext.browser.session;
  }, (() => {
    const x = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
    np(d, null, t, { kind: "method", name: "dispose", static: !1, private: !1, access: { has: (E) => "dispose" in E, get: (E) => E.dispose }, metadata: x }, null, e), np(d, null, r, { kind: "method", name: "handle", static: !1, private: !1, access: { has: (E) => "handle" in E, get: (E) => E.handle }, metadata: x }, null, e), x && Object.defineProperty(d, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: x });
  })(), d;
})();
/**
 * @license
 * Copyright 2024 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var eC = function(i, e, t) {
  for (var r = arguments.length > 2, n = 0; n < e.length; n++)
    t = r ? e[n].call(i, t) : e[n].call(i);
  return r ? t : void 0;
}, oe = function(i, e, t, r, n, o) {
  function a(b) {
    if (b !== void 0 && typeof b != "function") throw new TypeError("Function expected");
    return b;
  }
  for (var c = r.kind, p = c === "getter" ? "get" : c === "setter" ? "set" : "value", l = !e && i ? r.static ? i : i.prototype : null, d = e || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), h, g = !1, x = t.length - 1; x >= 0; x--) {
    var E = {};
    for (var P in r) E[P] = P === "access" ? {} : r[P];
    for (var P in r.access) E.access[P] = r.access[P];
    E.addInitializer = function(b) {
      if (g) throw new TypeError("Cannot add initializers after decoration has completed");
      o.push(a(b || null));
    };
    var C = (0, t[x])(c === "accessor" ? { get: d.get, set: d.set } : d[p], E);
    if (c === "accessor") {
      if (C === void 0) continue;
      if (C === null || typeof C != "object") throw new TypeError("Object expected");
      (h = a(C.get)) && (d.get = h), (h = a(C.set)) && (d.set = h), (h = a(C.init)) && n.unshift(h);
    } else (h = a(C)) && (c === "field" ? n.unshift(h) : d[p] = h);
  }
  l && Object.defineProperty(l, r.name, d), g = !0;
};
let tC = (() => {
  var X, V, rt, Hs, Ht, nt, ac, zs, $i, Li, qi, Q, Em, ne, Fl, ee;
  let i = Z, e = [], t, r, n, o, a, c, p, l, d, h, g, x, E, P, C, b, N, v, T, R, w, D, S, y, k, B, $, W;
  return ee = class extends i {
    constructor(I, _, H, Se, bt, Ws) {
      super();
      u(this, Q);
      u(this, X, eC(this, e));
      u(this, V);
      u(this, rt);
      // Indicated whether client hints have been set to non-default.
      u(this, Hs, !1);
      u(this, Ht, /* @__PURE__ */ new Map());
      u(this, nt, new $t());
      u(this, ac, /* @__PURE__ */ new Map());
      u(this, zs, /* @__PURE__ */ new Map());
      O(this, "defaultRealm");
      O(this, "id");
      O(this, "parent");
      O(this, "userContext");
      O(this, "originalOpener");
      O(this, "windowId");
      u(this, $i, { javaScriptEnabled: !0 });
      u(this, Li);
      u(this, qi);
      f(this, rt, Se), this.id = H, this.parent = _, this.userContext = I, this.originalOpener = bt, this.windowId = Ws, this.defaultRealm = m(this, Q, Fl).call(this), f(this, Li, new qb(this.id, s(this, Q, ne))), f(this, qi, new Hb(this.id, s(this, Q, ne)));
    }
    static from(I, _, H, Se, bt, Ws) {
      var bh;
      const vh = new ee(I, _, H, Se, bt, Ws);
      return m(bh = vh, Q, Em).call(bh), vh;
    }
    get children() {
      return s(this, Ht).values();
    }
    get closed() {
      return s(this, V) !== void 0;
    }
    get disposed() {
      return this.closed;
    }
    get realms() {
      const I = this;
      return function* () {
        yield I.defaultRealm, yield* s(I, ac).values();
      }();
    }
    get top() {
      let I = this;
      for (let { parent: _ } = I; _; { parent: _ } = I)
        I = _;
      return I;
    }
    get url() {
      return s(this, rt);
    }
    dispose(I) {
      f(this, V, I);
      for (const _ of s(this, Ht).values())
        _.dispose("Parent browsing context was disposed");
      this[pe]();
    }
    async activate() {
      await s(this, Q, ne).send("browsingContext.activate", {
        context: this.id
      });
    }
    async captureScreenshot(I = {}) {
      const { result: { data: _ } } = await s(this, Q, ne).send("browsingContext.captureScreenshot", {
        context: this.id,
        ...I
      });
      return _;
    }
    async close(I) {
      await s(this, Q, ne).send("browsingContext.close", {
        context: this.id,
        promptUnload: I
      });
    }
    async traverseHistory(I) {
      await s(this, Q, ne).send("browsingContext.traverseHistory", {
        context: this.id,
        delta: I
      });
    }
    async navigate(I, _) {
      await s(this, Q, ne).send("browsingContext.navigate", {
        context: this.id,
        url: I,
        wait: _
      });
    }
    async reload(I = {}) {
      await s(this, Q, ne).send("browsingContext.reload", {
        context: this.id,
        ...I
      });
    }
    async setCacheBehavior(I) {
      await s(this, Q, ne).send("network.setCacheBehavior", {
        contexts: [this.id],
        cacheBehavior: I
      });
    }
    async print(I = {}) {
      const { result: { data: _ } } = await s(this, Q, ne).send("browsingContext.print", {
        context: this.id,
        ...I
      });
      return _;
    }
    async handleUserPrompt(I = {}) {
      await s(this, Q, ne).send("browsingContext.handleUserPrompt", {
        context: this.id,
        ...I
      });
    }
    async setViewport(I = {}) {
      await s(this, Q, ne).send("browsingContext.setViewport", {
        context: this.id,
        ...I
      });
    }
    async setTouchOverride(I) {
      await s(this, Q, ne).send("emulation.setTouchOverride", {
        contexts: [this.id],
        maxTouchPoints: I
      });
    }
    async performActions(I) {
      await s(this, Q, ne).send("input.performActions", {
        context: this.id,
        actions: I
      });
    }
    async releaseActions() {
      await s(this, Q, ne).send("input.releaseActions", {
        context: this.id
      });
    }
    createWindowRealm(I) {
      return m(this, Q, Fl).call(this, I);
    }
    async addPreloadScript(I, _ = {}) {
      return await this.userContext.browser.addPreloadScript(I, {
        ..._,
        contexts: [this]
      });
    }
    async addIntercept(I) {
      const { result: { intercept: _ } } = await this.userContext.browser.session.send("network.addIntercept", {
        ...I,
        contexts: [this.id]
      });
      return _;
    }
    async removePreloadScript(I) {
      await this.userContext.browser.removePreloadScript(I);
    }
    async setGeolocationOverride(I) {
      if (!("coordinates" in I))
        throw new Error("Missing coordinates");
      await this.userContext.browser.session.send("emulation.setGeolocationOverride", {
        coordinates: I.coordinates,
        contexts: [this.id]
      });
    }
    async setTimezoneOverride(I) {
      I != null && I.startsWith("GMT") && (I = I == null ? void 0 : I.replace("GMT", "")), await this.userContext.browser.session.send("emulation.setTimezoneOverride", {
        timezone: I ?? null,
        contexts: [this.id]
      });
    }
    async setScreenOrientationOverride(I) {
      await s(this, Q, ne).send("emulation.setScreenOrientationOverride", {
        screenOrientation: I,
        contexts: [this.id]
      });
    }
    async getCookies(I = {}) {
      const { result: { cookies: _ } } = await s(this, Q, ne).send("storage.getCookies", {
        ...I,
        partition: {
          type: "context",
          context: this.id
        }
      });
      return _;
    }
    async setCookie(I) {
      await s(this, Q, ne).send("storage.setCookie", {
        cookie: I,
        partition: {
          type: "context",
          context: this.id
        }
      });
    }
    async setFiles(I, _) {
      await s(this, Q, ne).send("input.setFiles", {
        context: this.id,
        element: I,
        files: _
      });
    }
    async subscribe(I) {
      await s(this, Q, ne).subscribe(I, [this.id]);
    }
    async addInterception(I) {
      await s(this, Q, ne).subscribe(I, [this.id]);
    }
    [(t = [Ls], r = [L((I) => s(I, V))], n = [L((I) => s(I, V))], o = [L((I) => s(I, V))], a = [L((I) => s(I, V))], c = [L((I) => s(I, V))], p = [L((I) => s(I, V))], l = [L((I) => s(I, V))], d = [L((I) => s(I, V))], h = [L((I) => s(I, V))], g = [L((I) => s(I, V))], x = [L((I) => s(I, V))], E = [L((I) => s(I, V))], P = [L((I) => s(I, V))], C = [L((I) => s(I, V))], b = [L((I) => s(I, V))], N = [L((I) => s(I, V))], v = [L((I) => s(I, V))], T = [L((I) => s(I, V))], R = [L((I) => s(I, V))], w = [L((I) => s(I, V))], D = [L((I) => s(I, V))], S = [L((I) => s(I, V))], y = [L((I) => s(I, V))], k = [L((I) => s(I, V))], B = [L((I) => s(I, V))], pe)]() {
      s(this, V) ?? f(this, V, "Browsing context already closed, probably because the user context closed."), this.emit("closed", { reason: s(this, V) }), s(this, nt).dispose(), super[pe]();
    }
    async deleteCookie(...I) {
      await Promise.all(I.map(async (_) => {
        await s(this, Q, ne).send("storage.deleteCookies", {
          filter: _,
          partition: {
            type: "context",
            context: this.id
          }
        });
      }));
    }
    async locateNodes(I, _ = []) {
      return (await s(this, Q, ne).send("browsingContext.locateNodes", {
        context: this.id,
        locator: I,
        startNodes: _.length ? _ : void 0
      })).result.nodes;
    }
    async setJavaScriptEnabled(I) {
      await this.userContext.browser.session.send("emulation.setScriptingEnabled", {
        // Enabled `null` means `default`, `false` means `disabled`.
        enabled: I ? null : !1,
        contexts: [this.id]
      }), s(this, $i).javaScriptEnabled = I;
    }
    isJavaScriptEnabled() {
      return s(this, $i).javaScriptEnabled;
    }
    async setUserAgent(I) {
      await s(this, Q, ne).send("emulation.setUserAgentOverride", {
        userAgent: I,
        contexts: [this.id]
      });
    }
    async setClientHintsOverride(I) {
      I === null && !s(this, Hs) || (f(this, Hs, !0), await s(this, Q, ne).send("userAgentClientHints.setClientHintsOverride", {
        clientHints: I,
        contexts: [this.id]
      }));
    }
    async setOfflineMode(I) {
      await s(this, Q, ne).send("emulation.setNetworkConditions", {
        networkConditions: I ? {
          type: "offline"
        } : null,
        contexts: [this.id]
      });
    }
    get bluetooth() {
      return s(this, Li);
    }
    async waitForDevicePrompt(I, _) {
      return await s(this, qi).waitForDevicePrompt(I, _);
    }
    async setExtraHTTPHeaders(I) {
      await s(this, Q, ne).send("network.setExtraHeaders", {
        headers: Object.entries(I).map(([_, H]) => (Xe(Cp(H), `Expected value of header "${_}" to be String, but "${typeof H}" is found.`), {
          name: _.toLowerCase(),
          value: { type: "string", value: H }
        })),
        contexts: [this.id]
      });
    }
  }, X = new WeakMap(), V = new WeakMap(), rt = new WeakMap(), Hs = new WeakMap(), Ht = new WeakMap(), nt = new WeakMap(), ac = new WeakMap(), zs = new WeakMap(), $i = new WeakMap(), Li = new WeakMap(), qi = new WeakMap(), Q = new WeakSet(), Em = function() {
    s(this, nt).use(new Z(this.userContext)).once("closed", ({ reason: H }) => {
      this.dispose(`Browsing context already closed: ${H}`);
    });
    const _ = s(this, nt).use(new Z(s(this, Q, ne)));
    _.on("input.fileDialogOpened", (H) => {
      this.id === H.context && this.emit("filedialogopened", H);
    }), _.on("browsingContext.contextCreated", (H) => {
      if (H.parent !== this.id)
        return;
      const Se = ee.from(this.userContext, this, H.context, H.url, H.originalOpener, H.clientWindow);
      s(this, Ht).set(H.context, Se);
      const bt = s(this, nt).use(new Z(Se));
      bt.once("closed", () => {
        bt.removeAllListeners(), s(this, Ht).delete(Se.id);
      }), this.emit("browsingcontext", { browsingContext: Se });
    }), _.on("browsingContext.contextDestroyed", (H) => {
      H.context === this.id && this.dispose("Browsing context already closed.");
    }), _.on("browsingContext.historyUpdated", (H) => {
      H.context === this.id && (f(this, rt, H.url), this.emit("historyUpdated", void 0));
    }), _.on("browsingContext.domContentLoaded", (H) => {
      H.context === this.id && (f(this, rt, H.url), this.emit("DOMContentLoaded", void 0));
    }), _.on("browsingContext.load", (H) => {
      H.context === this.id && (f(this, rt, H.url), this.emit("load", void 0));
    }), _.on("browsingContext.navigationStarted", (H) => {
      if (H.context !== this.id)
        return;
      for (const [bt, Ws] of s(this, zs))
        Ws.disposed && s(this, zs).delete(bt);
      if (s(this, X) !== void 0 && !s(this, X).disposed)
        return;
      f(this, X, Vb.from(this));
      const Se = s(this, nt).use(new Z(s(this, X)));
      for (const bt of ["fragment", "failed", "aborted"])
        Se.once(bt, ({ url: Ws }) => {
          Se[pe](), f(this, rt, Ws);
        });
      this.emit("navigation", { navigation: s(this, X) });
    }), _.on("network.beforeRequestSent", (H) => {
      if (H.context !== this.id || s(this, zs).has(H.request.request))
        return;
      const Se = Yb.from(this, H);
      s(this, zs).set(Se.id, Se), this.emit("request", { request: Se });
    }), _.on("log.entryAdded", (H) => {
      H.source.context === this.id && this.emit("log", { entry: H });
    }), _.on("browsingContext.userPromptOpened", (H) => {
      if (H.context !== this.id)
        return;
      const Se = Qb.from(this, H);
      this.emit("userprompt", { userPrompt: Se });
    });
  }, ne = function() {
    return this.userContext.browser.session;
  }, Fl = function(I) {
    const _ = Rl.from(this, I);
    return _.on("worker", (H) => {
      this.emit("worker", { realm: H });
    }), _;
  }, (() => {
    const I = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
    $ = [L((_) => s(_, V))], W = [L((_) => s(_, V))], oe(ee, null, t, { kind: "method", name: "dispose", static: !1, private: !1, access: { has: (_) => "dispose" in _, get: (_) => _.dispose }, metadata: I }, null, e), oe(ee, null, r, { kind: "method", name: "activate", static: !1, private: !1, access: { has: (_) => "activate" in _, get: (_) => _.activate }, metadata: I }, null, e), oe(ee, null, n, { kind: "method", name: "captureScreenshot", static: !1, private: !1, access: { has: (_) => "captureScreenshot" in _, get: (_) => _.captureScreenshot }, metadata: I }, null, e), oe(ee, null, o, { kind: "method", name: "close", static: !1, private: !1, access: { has: (_) => "close" in _, get: (_) => _.close }, metadata: I }, null, e), oe(ee, null, a, { kind: "method", name: "traverseHistory", static: !1, private: !1, access: { has: (_) => "traverseHistory" in _, get: (_) => _.traverseHistory }, metadata: I }, null, e), oe(ee, null, c, { kind: "method", name: "navigate", static: !1, private: !1, access: { has: (_) => "navigate" in _, get: (_) => _.navigate }, metadata: I }, null, e), oe(ee, null, p, { kind: "method", name: "reload", static: !1, private: !1, access: { has: (_) => "reload" in _, get: (_) => _.reload }, metadata: I }, null, e), oe(ee, null, l, { kind: "method", name: "setCacheBehavior", static: !1, private: !1, access: { has: (_) => "setCacheBehavior" in _, get: (_) => _.setCacheBehavior }, metadata: I }, null, e), oe(ee, null, d, { kind: "method", name: "print", static: !1, private: !1, access: { has: (_) => "print" in _, get: (_) => _.print }, metadata: I }, null, e), oe(ee, null, h, { kind: "method", name: "handleUserPrompt", static: !1, private: !1, access: { has: (_) => "handleUserPrompt" in _, get: (_) => _.handleUserPrompt }, metadata: I }, null, e), oe(ee, null, g, { kind: "method", name: "setViewport", static: !1, private: !1, access: { has: (_) => "setViewport" in _, get: (_) => _.setViewport }, metadata: I }, null, e), oe(ee, null, x, { kind: "method", name: "setTouchOverride", static: !1, private: !1, access: { has: (_) => "setTouchOverride" in _, get: (_) => _.setTouchOverride }, metadata: I }, null, e), oe(ee, null, E, { kind: "method", name: "performActions", static: !1, private: !1, access: { has: (_) => "performActions" in _, get: (_) => _.performActions }, metadata: I }, null, e), oe(ee, null, P, { kind: "method", name: "releaseActions", static: !1, private: !1, access: { has: (_) => "releaseActions" in _, get: (_) => _.releaseActions }, metadata: I }, null, e), oe(ee, null, C, { kind: "method", name: "createWindowRealm", static: !1, private: !1, access: { has: (_) => "createWindowRealm" in _, get: (_) => _.createWindowRealm }, metadata: I }, null, e), oe(ee, null, b, { kind: "method", name: "addPreloadScript", static: !1, private: !1, access: { has: (_) => "addPreloadScript" in _, get: (_) => _.addPreloadScript }, metadata: I }, null, e), oe(ee, null, N, { kind: "method", name: "addIntercept", static: !1, private: !1, access: { has: (_) => "addIntercept" in _, get: (_) => _.addIntercept }, metadata: I }, null, e), oe(ee, null, v, { kind: "method", name: "removePreloadScript", static: !1, private: !1, access: { has: (_) => "removePreloadScript" in _, get: (_) => _.removePreloadScript }, metadata: I }, null, e), oe(ee, null, T, { kind: "method", name: "setGeolocationOverride", static: !1, private: !1, access: { has: (_) => "setGeolocationOverride" in _, get: (_) => _.setGeolocationOverride }, metadata: I }, null, e), oe(ee, null, R, { kind: "method", name: "setTimezoneOverride", static: !1, private: !1, access: { has: (_) => "setTimezoneOverride" in _, get: (_) => _.setTimezoneOverride }, metadata: I }, null, e), oe(ee, null, w, { kind: "method", name: "setScreenOrientationOverride", static: !1, private: !1, access: { has: (_) => "setScreenOrientationOverride" in _, get: (_) => _.setScreenOrientationOverride }, metadata: I }, null, e), oe(ee, null, D, { kind: "method", name: "getCookies", static: !1, private: !1, access: { has: (_) => "getCookies" in _, get: (_) => _.getCookies }, metadata: I }, null, e), oe(ee, null, S, { kind: "method", name: "setCookie", static: !1, private: !1, access: { has: (_) => "setCookie" in _, get: (_) => _.setCookie }, metadata: I }, null, e), oe(ee, null, y, { kind: "method", name: "setFiles", static: !1, private: !1, access: { has: (_) => "setFiles" in _, get: (_) => _.setFiles }, metadata: I }, null, e), oe(ee, null, k, { kind: "method", name: "subscribe", static: !1, private: !1, access: { has: (_) => "subscribe" in _, get: (_) => _.subscribe }, metadata: I }, null, e), oe(ee, null, B, { kind: "method", name: "addInterception", static: !1, private: !1, access: { has: (_) => "addInterception" in _, get: (_) => _.addInterception }, metadata: I }, null, e), oe(ee, null, $, { kind: "method", name: "deleteCookie", static: !1, private: !1, access: { has: (_) => "deleteCookie" in _, get: (_) => _.deleteCookie }, metadata: I }, null, e), oe(ee, null, W, { kind: "method", name: "locateNodes", static: !1, private: !1, access: { has: (_) => "locateNodes" in _, get: (_) => _.locateNodes }, metadata: I }, null, e), I && Object.defineProperty(ee, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: I });
  })(), ee;
})();
/**
 * @license
 * Copyright 2024 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var sC = function(i, e, t) {
  for (var r = arguments.length > 2, n = 0; n < e.length; n++)
    t = r ? e[n].call(i, t) : e[n].call(i);
  return r ? t : void 0;
}, an = function(i, e, t, r, n, o) {
  function a(b) {
    if (b !== void 0 && typeof b != "function") throw new TypeError("Function expected");
    return b;
  }
  for (var c = r.kind, p = c === "getter" ? "get" : c === "setter" ? "set" : "value", l = !e && i ? r.static ? i : i.prototype : null, d = e || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), h, g = !1, x = t.length - 1; x >= 0; x--) {
    var E = {};
    for (var P in r) E[P] = P === "access" ? {} : r[P];
    for (var P in r.access) E.access[P] = r.access[P];
    E.addInitializer = function(b) {
      if (g) throw new TypeError("Cannot add initializers after decoration has completed");
      o.push(a(b || null));
    };
    var C = (0, t[x])(c === "accessor" ? { get: d.get, set: d.set } : d[p], E);
    if (c === "accessor") {
      if (C === void 0) continue;
      if (C === null || typeof C != "object") throw new TypeError("Object expected");
      (h = a(C.get)) && (d.get = h), (h = a(C.set)) && (d.set = h), (h = a(C.init)) && n.unshift(h);
    } else (h = a(C)) && (c === "field" ? n.unshift(h) : d[p] = h);
  }
  l && Object.defineProperty(l, r.name, d), g = !0;
};
let Kc = (() => {
  var p, l, d, h, g, x, Sm, Xs;
  let i = Z, e = [], t, r, n, o, a, c;
  return p = class extends i {
    constructor(N, v) {
      super();
      u(this, x);
      u(this, l, sC(this, e));
      // Note these are only top-level contexts.
      u(this, d, /* @__PURE__ */ new Map());
      u(this, h, new $t());
      u(this, g);
      O(this, "browser");
      f(this, g, v), this.browser = N;
    }
    static create(N, v) {
      var R;
      const T = new p(N, v);
      return m(R = T, x, Sm).call(R), T;
    }
    get browsingContexts() {
      return s(this, d).values();
    }
    get closed() {
      return s(this, l) !== void 0;
    }
    get disposed() {
      return this.closed;
    }
    get id() {
      return s(this, g);
    }
    dispose(N) {
      f(this, l, N), this[pe]();
    }
    async createBrowsingContext(N, v = {}) {
      var w;
      const { result: { context: T } } = await s(this, x, Xs).send("browsingContext.create", {
        type: N,
        ...v,
        referenceContext: (w = v.referenceContext) == null ? void 0 : w.id,
        background: v.background,
        userContext: s(this, g)
      }), R = s(this, d).get(T);
      return Xe(R, "The WebDriver BiDi implementation is failing to create a browsing context correctly."), R;
    }
    async remove() {
      try {
        await s(this, x, Xs).send("browser.removeUserContext", {
          userContext: s(this, g)
        });
      } finally {
        this.dispose("User context already closed.");
      }
    }
    async getCookies(N = {}, v = void 0) {
      const { result: { cookies: T } } = await s(this, x, Xs).send("storage.getCookies", {
        ...N,
        partition: {
          type: "storageKey",
          userContext: s(this, g),
          sourceOrigin: v
        }
      });
      return T;
    }
    async setCookie(N, v) {
      await s(this, x, Xs).send("storage.setCookie", {
        cookie: N,
        partition: {
          type: "storageKey",
          sourceOrigin: v,
          userContext: this.id
        }
      });
    }
    async setPermissions(N, v, T) {
      await s(this, x, Xs).send("permissions.setPermission", {
        origin: N,
        descriptor: v,
        state: T,
        userContext: s(this, g)
      });
    }
    [(t = [Ls], r = [L((N) => s(N, l))], n = [L((N) => s(N, l))], o = [L((N) => s(N, l))], a = [L((N) => s(N, l))], c = [L((N) => s(N, l))], pe)]() {
      s(this, l) ?? f(this, l, "User context already closed, probably because the browser disconnected/closed."), this.emit("closed", { reason: s(this, l) }), s(this, h).dispose(), super[pe]();
    }
  }, l = new WeakMap(), d = new WeakMap(), h = new WeakMap(), g = new WeakMap(), x = new WeakSet(), Sm = function() {
    const N = s(this, h).use(new Z(this.browser));
    N.once("closed", ({ reason: T }) => {
      this.dispose(`User context was closed: ${T}`);
    }), N.once("disconnected", ({ reason: T }) => {
      this.dispose(`User context was closed: ${T}`);
    }), s(this, h).use(new Z(s(this, x, Xs))).on("browsingContext.contextCreated", (T) => {
      if (T.parent || T.userContext !== s(this, g))
        return;
      const R = tC.from(this, void 0, T.context, T.url, T.originalOpener, T.clientWindow);
      s(this, d).set(R.id, R);
      const w = s(this, h).use(new Z(R));
      w.on("closed", () => {
        w.removeAllListeners(), s(this, d).delete(R.id);
      }), this.emit("browsingcontext", { browsingContext: R });
    });
  }, Xs = function() {
    return this.browser.session;
  }, (() => {
    const N = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
    an(p, null, t, { kind: "method", name: "dispose", static: !1, private: !1, access: { has: (v) => "dispose" in v, get: (v) => v.dispose }, metadata: N }, null, e), an(p, null, r, { kind: "method", name: "createBrowsingContext", static: !1, private: !1, access: { has: (v) => "createBrowsingContext" in v, get: (v) => v.createBrowsingContext }, metadata: N }, null, e), an(p, null, n, { kind: "method", name: "remove", static: !1, private: !1, access: { has: (v) => "remove" in v, get: (v) => v.remove }, metadata: N }, null, e), an(p, null, o, { kind: "method", name: "getCookies", static: !1, private: !1, access: { has: (v) => "getCookies" in v, get: (v) => v.getCookies }, metadata: N }, null, e), an(p, null, a, { kind: "method", name: "setCookie", static: !1, private: !1, access: { has: (v) => "setCookie" in v, get: (v) => v.setCookie }, metadata: N }, null, e), an(p, null, c, { kind: "method", name: "setPermissions", static: !1, private: !1, access: { has: (v) => "setPermissions" in v, get: (v) => v.setPermissions }, metadata: N }, null, e), N && Object.defineProperty(p, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: N });
  })(), O(p, "DEFAULT", "default"), p;
})();
/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var Gr, Pm, Ml;
class oc {
  static deserialize(e) {
    var t, r, n, o;
    if (!e) {
      Ee("Service did not produce a result.");
      return;
    }
    switch (e.type) {
      case "array":
        return (t = e.value) == null ? void 0 : t.map((a) => this.deserialize(a));
      case "set":
        return (r = e.value) == null ? void 0 : r.reduce((a, c) => a.add(this.deserialize(c)), /* @__PURE__ */ new Set());
      case "object":
        return (n = e.value) == null ? void 0 : n.reduce((a, c) => {
          const { key: p, value: l } = m(this, Gr, Ml).call(this, c);
          return a[p] = l, a;
        }, {});
      case "map":
        return (o = e.value) == null ? void 0 : o.reduce((a, c) => {
          const { key: p, value: l } = m(this, Gr, Ml).call(this, c);
          return a.set(p, l);
        }, /* @__PURE__ */ new Map());
      case "promise":
        return {};
      case "regexp":
        return new RegExp(e.value.pattern, e.value.flags);
      case "date":
        return new Date(e.value);
      case "undefined":
        return;
      case "null":
        return null;
      case "number":
        return m(this, Gr, Pm).call(this, e.value);
      case "bigint":
        return BigInt(e.value);
      case "boolean":
        return !!e.value;
      case "string":
        return e.value;
    }
    Ee(`Deserialization of type ${e.type} not supported.`);
  }
}
Gr = new WeakSet(), Pm = function(e) {
  switch (e) {
    case "-0":
      return -0;
    case "NaN":
      return NaN;
    case "Infinity":
      return 1 / 0;
    case "-Infinity":
      return -1 / 0;
    default:
      return e;
  }
}, Ml = function([e, t]) {
  const r = typeof e == "string" ? e : this.deserialize(e), n = this.deserialize(t);
  return { key: r, value: n };
}, u(oc, Gr);
/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var Ft, xi;
const fh = class fh extends dg {
  constructor(t, r) {
    super();
    u(this, Ft);
    O(this, "realm");
    u(this, xi, !1);
    f(this, Ft, t), this.realm = r;
  }
  static from(t, r) {
    return new fh(t, r);
  }
  get disposed() {
    return s(this, xi);
  }
  async jsonValue() {
    return await this.evaluate((t) => t);
  }
  asElement() {
    return null;
  }
  async dispose() {
    s(this, xi) || (f(this, xi, !0), await this.realm.destroyHandles([this]));
  }
  get isPrimitiveValue() {
    switch (s(this, Ft).type) {
      case "string":
      case "number":
      case "bigint":
      case "boolean":
      case "undefined":
      case "null":
        return !0;
      default:
        return !1;
    }
  }
  toString() {
    return this.isPrimitiveValue ? "JSHandle:" + oc.deserialize(s(this, Ft)) : "JSHandle@" + s(this, Ft).type;
  }
  get id() {
    return "handle" in s(this, Ft) ? s(this, Ft).handle : void 0;
  }
  remoteValue() {
    return s(this, Ft);
  }
  remoteObject() {
    throw new q("Not available in WebDriver BiDi");
  }
};
Ft = new WeakMap(), xi = new WeakMap();
let Kr = fh;
/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var rC = function(i, e, t) {
  for (var r = arguments.length > 2, n = 0; n < e.length; n++)
    t = r ? e[n].call(i, t) : e[n].call(i);
  return r ? t : void 0;
}, ip = function(i, e, t, r, n, o) {
  function a(b) {
    if (b !== void 0 && typeof b != "function") throw new TypeError("Function expected");
    return b;
  }
  for (var c = r.kind, p = c === "getter" ? "get" : c === "setter" ? "set" : "value", l = !e && i ? r.static ? i : i.prototype : null, d = e || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), h, g = !1, x = t.length - 1; x >= 0; x--) {
    var E = {};
    for (var P in r) E[P] = P === "access" ? {} : r[P];
    for (var P in r.access) E.access[P] = r.access[P];
    E.addInitializer = function(b) {
      if (g) throw new TypeError("Cannot add initializers after decoration has completed");
      o.push(a(b || null));
    };
    var C = (0, t[x])(c === "accessor" ? { get: d.get, set: d.set } : d[p], E);
    if (c === "accessor") {
      if (C === void 0) continue;
      if (C === null || typeof C != "object") throw new TypeError("Object expected");
      (h = a(C.get)) && (d.get = h), (h = a(C.set)) && (d.set = h), (h = a(C.init)) && n.unshift(h);
    } else (h = a(C)) && (c === "field" ? n.unshift(h) : d[p] = h);
  }
  l && Object.defineProperty(l, r.name, d), g = !0;
}, nC = function(i, e, t) {
  if (e != null) {
    if (typeof e != "object" && typeof e != "function") throw new TypeError("Object expected.");
    var r, n;
    if (t) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      r = e[Symbol.asyncDispose];
    }
    if (r === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      r = e[Symbol.dispose], t && (n = r);
    }
    if (typeof r != "function") throw new TypeError("Object not disposable.");
    n && (r = function() {
      try {
        n.call(this);
      } catch (o) {
        return Promise.reject(o);
      }
    }), i.stack.push({ value: e, dispose: r, async: t });
  } else t && i.stack.push({ async: !0 });
  return e;
}, iC = /* @__PURE__ */ function(i) {
  return function(e) {
    function t(a) {
      e.error = e.hasError ? new i(a, e.error, "An error was suppressed during disposal.") : a, e.hasError = !0;
    }
    var r, n = 0;
    function o() {
      for (; r = e.stack.pop(); )
        try {
          if (!r.async && n === 1) return n = 0, e.stack.push(r), Promise.resolve().then(o);
          if (r.dispose) {
            var a = r.dispose.call(r.value);
            if (r.async) return n |= 2, Promise.resolve(a).then(o, function(c) {
              return t(c), o();
            });
          } else n |= 1;
        } catch (c) {
          t(c);
        }
      if (n === 1) return e.hasError ? Promise.reject(e.error) : Promise.resolve();
      if (e.hasError) throw e.error;
    }
    return o();
  };
}(typeof SuppressedError == "function" ? SuppressedError : function(i, e, t) {
  var r = new Error(t);
  return r.name = "SuppressedError", r.error = i, r.suppressed = e, r;
});
let Oi = (() => {
  var n, o;
  let i = lg, e = [], t, r;
  return o = class extends i {
    constructor(p, l) {
      super(Kr.from(p, l));
      u(this, n, rC(this, e));
    }
    static from(p, l) {
      return new o(p, l);
    }
    get realm() {
      return this.handle.realm;
    }
    get frame() {
      return this.realm.environment;
    }
    remoteValue() {
      return this.handle.remoteValue();
    }
    async autofill(p) {
      const l = this.frame.client, h = (await l.send("DOM.describeNode", {
        objectId: this.handle.id
      })).node.backendNodeId, g = this.frame._id;
      await l.send("Autofill.trigger", {
        fieldId: h,
        frameId: g,
        card: p.creditCard
      });
    }
    async contentFrame() {
      const p = { stack: [], error: void 0, hasError: !1 };
      try {
        const d = nC(p, await this.evaluateHandle((h) => {
          if (h instanceof HTMLIFrameElement || h instanceof HTMLFrameElement)
            return h.contentWindow;
        }), !1).remoteValue();
        return d.type === "window" ? this.frame.page().frames().find((h) => h._id === d.value.context) ?? null : null;
      } catch (l) {
        p.error = l, p.hasError = !0;
      } finally {
        iC(p);
      }
    }
    async uploadFile(...p) {
      const l = hg.value.path;
      l && (p = p.map((d) => l.win32.isAbsolute(d) || l.posix.isAbsolute(d) ? d : l.resolve(d))), await this.frame.setFiles(this, p);
    }
    async *queryAXTree(p, l) {
      const d = await this.frame.locateNodes(this, {
        type: "accessibility",
        value: {
          role: l,
          name: p
        }
      });
      return yield* xp.map(d, (h) => Promise.resolve(o.from(h, this.realm)));
    }
    async backendNodeId() {
      if (!this.frame.page().browser().cdpSupported)
        throw new q();
      if (s(this, n))
        return s(this, n);
      const { node: p } = await this.frame.client.send("DOM.describeNode", {
        objectId: this.handle.id
      });
      return f(this, n, p.backendNodeId), s(this, n);
    }
  }, n = new WeakMap(), (() => {
    const p = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
    t = [L()], r = [L(), pg], ip(o, null, t, { kind: "method", name: "autofill", static: !1, private: !1, access: { has: (l) => "autofill" in l, get: (l) => l.autofill }, metadata: p }, null, e), ip(o, null, r, { kind: "method", name: "contentFrame", static: !1, private: !1, access: { has: (l) => "contentFrame" in l, get: (l) => l.contentFrame }, metadata: p }, null, e), p && Object.defineProperty(o, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: p });
  })(), o;
})();
/**
 * @license
 * Copyright 2017 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var Ua;
const mh = class mh extends fg {
  constructor(t) {
    super(t.info.type, t.info.message, t.info.defaultValue);
    u(this, Ua);
    f(this, Ua, t), this.handled = t.handled;
  }
  static from(t) {
    return new mh(t);
  }
  async handle(t) {
    await s(this, Ua).handle({
      accept: t.accept,
      userText: t.text
    });
  }
};
Ua = new WeakMap();
let jl = mh;
/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var Nd = function(i, e, t) {
  if (e != null) {
    if (typeof e != "object" && typeof e != "function") throw new TypeError("Object expected.");
    var r, n;
    if (t) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      r = e[Symbol.asyncDispose];
    }
    if (r === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      r = e[Symbol.dispose], t && (n = r);
    }
    if (typeof r != "function") throw new TypeError("Object not disposable.");
    n && (r = function() {
      try {
        n.call(this);
      } catch (o) {
        return Promise.reject(o);
      }
    }), i.stack.push({ value: e, dispose: r, async: t });
  } else t && i.stack.push({ async: !0 });
  return e;
}, op = /* @__PURE__ */ function(i) {
  return function(e) {
    function t(a) {
      e.error = e.hasError ? new i(a, e.error, "An error was suppressed during disposal.") : a, e.hasError = !0;
    }
    var r, n = 0;
    function o() {
      for (; r = e.stack.pop(); )
        try {
          if (!r.async && n === 1) return n = 0, e.stack.push(r), Promise.resolve().then(o);
          if (r.dispose) {
            var a = r.dispose.call(r.value);
            if (r.async) return n |= 2, Promise.resolve(a).then(o, function(c) {
              return t(c), o();
            });
          } else n |= 1;
        } catch (c) {
          t(c);
        }
      if (n === 1) return e.hasError ? Promise.reject(e.error) : Promise.resolve();
      if (e.hasError) throw e.error;
    }
    return o();
  };
}(typeof SuppressedError == "function" ? SuppressedError : function(i, e, t) {
  var r = new Error(t);
  return r.name = "SuppressedError", r.error = i, r.suppressed = e, r;
}), Fs, $a, Ei, Si, La, qa, Lt, Im, _m, Cu, km, Tm;
const gh = class gh {
  constructor(e, t, r, n = !1) {
    u(this, Lt);
    u(this, Fs);
    O(this, "name");
    u(this, $a);
    u(this, Ei);
    u(this, Si);
    u(this, La, []);
    u(this, qa, new $t());
    u(this, Cu, async (e) => {
      const t = { stack: [], error: void 0, hasError: !1 };
      try {
        if (e.channel !== s(this, Si))
          return;
        const r = m(this, Lt, km).call(this, e.source);
        if (!r)
          return;
        const n = Nd(t, Kr.from(e.data, r), !1), o = Nd(t, new $t(), !1), a = [];
        let c;
        try {
          const p = { stack: [], error: void 0, hasError: !1 };
          try {
            const l = Nd(p, await n.evaluateHandle(([, , d]) => d), !1);
            for (const [d, h] of await l.getProperties()) {
              if (o.use(h), h instanceof Oi) {
                a[+d] = h, o.use(h);
                continue;
              }
              a[+d] = h.jsonValue();
            }
            c = await s(this, $a).call(this, ...await Promise.all(a));
          } catch (l) {
            p.error = l, p.hasError = !0;
          } finally {
            op(p);
          }
        } catch (p) {
          try {
            p instanceof Error ? await n.evaluate(([, l], d, h, g) => {
              const x = new Error(h);
              x.name = d, g && (x.stack = g), l(x);
            }, p.name, p.message, p.stack) : await n.evaluate(([, l], d) => {
              l(d);
            }, p);
          } catch (l) {
            Ee(l);
          }
          return;
        }
        try {
          await n.evaluate(([p], l) => {
            p(l);
          }, c);
        } catch (p) {
          Ee(p);
        }
      } catch (r) {
        t.error = r, t.hasError = !0;
      } finally {
        op(t);
      }
    });
    f(this, Fs, e), this.name = t, f(this, $a, r), f(this, Ei, n), f(this, Si, `__puppeteer__${s(this, Fs)._id}_page_exposeFunction_${this.name}`);
  }
  static async from(e, t, r, n = !1) {
    var a;
    const o = new gh(e, t, r, n);
    return await m(a = o, Lt, Im).call(a), o;
  }
  [Symbol.dispose]() {
    this[Symbol.asyncDispose]().catch(Ee);
  }
  async [Symbol.asyncDispose]() {
    s(this, qa).dispose(), await Promise.all(s(this, La).map(async ([e, t]) => {
      const r = s(this, Ei) ? e.isolatedRealm() : e.mainRealm();
      try {
        await Promise.all([
          r.evaluate((n) => {
            delete globalThis[n];
          }, this.name),
          ...e.childFrames().map((n) => n.evaluate((o) => {
            delete globalThis[o];
          }, this.name)),
          e.browsingContext.removePreloadScript(t)
        ]);
      } catch (n) {
        Ee(n);
      }
    }));
  }
};
Fs = new WeakMap(), $a = new WeakMap(), Ei = new WeakMap(), Si = new WeakMap(), La = new WeakMap(), qa = new WeakMap(), Lt = new WeakSet(), Im = async function() {
  const e = s(this, Lt, _m), t = {
    type: "channel",
    value: {
      channel: s(this, Si),
      ownership: "root"
    }
  };
  s(this, qa).use(new Z(e)).on("script.message", s(this, Cu));
  const n = Ep(mg((a) => {
    Object.assign(globalThis, {
      [PLACEHOLDER("name")]: function(...c) {
        return new Promise((p, l) => {
          a([p, l, c]);
        });
      }
    });
  }, { name: JSON.stringify(this.name) })), o = [s(this, Fs)];
  for (const a of o)
    o.push(...a.childFrames());
  await Promise.all(o.map(async (a) => {
    const c = s(this, Ei) ? a.isolatedRealm() : a.mainRealm();
    try {
      const [p] = await Promise.all([
        a.browsingContext.addPreloadScript(n, {
          arguments: [t],
          sandbox: c.sandbox
        }),
        c.realm.callFunction(n, !1, {
          arguments: [t]
        })
      ]);
      s(this, La).push([a, p]);
    } catch (p) {
      Ee(p);
    }
  }));
}, _m = function() {
  return s(this, Fs).page().browser().connection;
}, Cu = new WeakMap(), km = function(e) {
  const t = m(this, Lt, Tm).call(this, e.context);
  if (t)
    return t.realm(e.realm);
}, Tm = function(e) {
  const t = [s(this, Fs)];
  for (const r of t) {
    if (r._id === e)
      return r;
    t.push(...r.childFrames());
  }
};
let ho = gh;
var oC = function(i, e, t) {
  for (var r = arguments.length > 2, n = 0; n < e.length; n++)
    t = r ? e[n].call(i, t) : e[n].call(i);
  return r ? t : void 0;
}, aC = function(i, e, t, r, n, o) {
  function a(b) {
    if (b !== void 0 && typeof b != "function") throw new TypeError("Function expected");
    return b;
  }
  for (var c = r.kind, p = c === "getter" ? "get" : c === "setter" ? "set" : "value", l = !e && i ? r.static ? i : i.prototype : null, d = e || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), h, g = !1, x = t.length - 1; x >= 0; x--) {
    var E = {};
    for (var P in r) E[P] = P === "access" ? {} : r[P];
    for (var P in r.access) E.access[P] = r.access[P];
    E.addInitializer = function(b) {
      if (g) throw new TypeError("Cannot add initializers after decoration has completed");
      o.push(a(b || null));
    };
    var C = (0, t[x])(c === "accessor" ? { get: d.get, set: d.set } : d[p], E);
    if (c === "accessor") {
      if (C === void 0) continue;
      if (C === null || typeof C != "object") throw new TypeError("Object expected");
      (h = a(C.get)) && (d.get = h), (h = a(C.set)) && (d.set = h), (h = a(C.init)) && n.unshift(h);
    } else (h = a(C)) && (c === "field" ? n.unshift(h) : d[p] = h);
  }
  l && Object.defineProperty(l, r.name, d), g = !0;
};
let ap = (() => {
  var r, n, o, a, c, Dm, l;
  let i = wg, e = [], t;
  return l = class extends i {
    constructor(g, x, E) {
      super();
      u(this, c);
      u(this, r, oC(this, e));
      u(this, n);
      u(this, o);
      u(this, a, !1);
      f(this, r, g), f(this, n, x), f(this, a, E);
      const P = g["goog:securityDetails"];
      E && P && f(this, o, new gg(P));
    }
    /**
     * Returns a new BidiHTTPResponse or updates the existing one if it already exists.
     */
    static from(g, x, E) {
      var b;
      const P = x.response();
      if (P)
        return f(P, r, g), P;
      const C = new l(g, x, E);
      return m(b = C, c, Dm).call(b), C;
    }
    remoteAddress() {
      return {
        ip: "",
        port: -1
      };
    }
    url() {
      return s(this, r).url;
    }
    status() {
      return s(this, r).status;
    }
    statusText() {
      return s(this, r).statusText;
    }
    headers() {
      const g = {};
      for (const x of s(this, r).headers)
        x.value.type === "string" && (g[x.name.toLowerCase()] = x.value.value);
      return g;
    }
    request() {
      return s(this, n);
    }
    fromCache() {
      return s(this, r).fromCache;
    }
    timing() {
      const g = s(this, n).timing();
      return {
        requestTime: g.requestTime,
        proxyStart: -1,
        proxyEnd: -1,
        dnsStart: g.dnsStart,
        dnsEnd: g.dnsEnd,
        connectStart: g.connectStart,
        connectEnd: g.connectEnd,
        sslStart: g.tlsStart,
        sslEnd: -1,
        workerStart: -1,
        workerReady: -1,
        workerFetchStart: -1,
        workerRespondWithSettled: -1,
        workerRouterEvaluationStart: -1,
        workerCacheLookupStart: -1,
        sendStart: g.requestStart,
        sendEnd: -1,
        pushStart: -1,
        pushEnd: -1,
        receiveHeadersStart: g.responseStart,
        receiveHeadersEnd: g.responseEnd
      };
    }
    frame() {
      return s(this, n).frame();
    }
    fromServiceWorker() {
      return !1;
    }
    securityDetails() {
      if (!s(this, a))
        throw new q();
      return s(this, o) ?? null;
    }
    async content() {
      return await s(this, n).getResponseContent();
    }
  }, r = new WeakMap(), n = new WeakMap(), o = new WeakMap(), a = new WeakMap(), c = new WeakSet(), Dm = function() {
    var g, x;
    s(this, r).fromCache && (s(this, n)._fromMemoryCache = !0, (g = s(this, n).frame()) == null || g.page().trustedEmitter.emit("requestservedfromcache", s(this, n))), (x = s(this, n).frame()) == null || x.page().trustedEmitter.emit("response", this);
  }, (() => {
    const g = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
    t = [yg], aC(l, null, t, { kind: "method", name: "remoteAddress", static: !1, private: !1, access: { has: (x) => "remoteAddress" in x, get: (x) => x.remoteAddress }, metadata: g }, null, e), g && Object.defineProperty(l, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: g });
  })(), l;
})();
var Ul;
const Nm = /* @__PURE__ */ new WeakMap();
var Lr, Pi, Ae, ie, xu, Rm, Ha, Eu;
class Om extends Eh {
  constructor(t, r, n, o) {
    super();
    u(this, xu);
    u(this, Lr);
    u(this, Pi, null);
    O(this, "id");
    u(this, Ae);
    u(this, ie);
    u(this, Ha, !1);
    u(this, Eu, async () => {
      if (!s(this, Ae))
        return;
      const t = s(this, Ae).page()._credentials;
      t && !s(this, Ha) ? (f(this, Ha, !0), s(this, ie).continueWithAuth({
        action: "provideCredentials",
        credentials: {
          type: "password",
          username: t.username,
          password: t.password
        }
      })) : s(this, ie).continueWithAuth({
        action: "cancel"
      });
    });
    Nm.set(t, this), this.interception.enabled = n, f(this, ie, t), f(this, Ae, r), f(this, Lr, o ? s(o, Lr) : []), this.id = t.id;
  }
  static from(t, r, n, o) {
    var c;
    const a = new Ul(t, r, n, o);
    return m(c = a, xu, Rm).call(c), a;
  }
  get client() {
    return s(this, Ae).client;
  }
  canBeIntercepted() {
    return s(this, ie).isBlocked;
  }
  interceptResolutionState() {
    return s(this, ie).isBlocked ? super.interceptResolutionState() : { action: vg.Disabled };
  }
  url() {
    return s(this, ie).url;
  }
  resourceType() {
    if (!s(this, Ae).page().browser().cdpSupported)
      throw new q();
    return (s(this, ie).resourceType || "other").toLowerCase();
  }
  method() {
    return s(this, ie).method;
  }
  postData() {
    if (!s(this, Ae).page().browser().cdpSupported)
      throw new q();
    return s(this, ie).postData;
  }
  hasPostData() {
    return s(this, ie).hasPostData;
  }
  async fetchPostData() {
    return await s(this, ie).fetchPostData();
  }
  headers() {
    const t = {};
    for (const r of s(this, ie).headers)
      t[r.name.toLowerCase()] = r.value.value;
    return {
      ...t
    };
  }
  response() {
    return s(this, Pi);
  }
  failure() {
    return s(this, ie).error === void 0 ? null : { errorText: s(this, ie).error };
  }
  isNavigationRequest() {
    return s(this, ie).navigation !== void 0;
  }
  initiator() {
    var t;
    return {
      ...s(this, ie).initiator,
      type: ((t = s(this, ie).initiator) == null ? void 0 : t.type) ?? "other"
    };
  }
  redirectChain() {
    return s(this, Lr).slice();
  }
  frame() {
    return s(this, Ae);
  }
  async _continue(t = {}) {
    const r = cp(t.headers);
    return this.interception.handled = !0, await s(this, ie).continueRequest({
      url: t.url,
      method: t.method,
      body: t.postData ? {
        type: "base64",
        value: bg(t.postData)
      } : void 0,
      headers: r.length > 0 ? r : void 0
    }).catch((n) => (this.interception.handled = !1, Cg(n)));
  }
  async _abort() {
    return this.interception.handled = !0, await s(this, ie).failRequest().catch((t) => {
      throw this.interception.handled = !1, t;
    });
  }
  async _respond(t, r) {
    this.interception.handled = !0;
    let n;
    t.body && (n = Eh.getResponse(t.body));
    const o = cp(t.headers), a = o.some((p) => p.name === "content-length");
    t.contentType && o.push({
      name: "content-type",
      value: {
        type: "string",
        value: t.contentType
      }
    }), n != null && n.contentLength && !a && o.push({
      name: "content-length",
      value: {
        type: "string",
        value: String(n.contentLength)
      }
    });
    const c = t.status || 200;
    return await s(this, ie).provideResponse({
      statusCode: c,
      headers: o.length > 0 ? o : void 0,
      reasonPhrase: xg[c],
      body: n != null && n.base64 ? {
        type: "base64",
        value: n == null ? void 0 : n.base64
      } : void 0
    }).catch((p) => {
      throw this.interception.handled = !1, p;
    });
  }
  timing() {
    return s(this, ie).timing();
  }
  getResponseContent() {
    return s(this, ie).getResponseContent();
  }
}
Lr = new WeakMap(), Pi = new WeakMap(), Ae = new WeakMap(), ie = new WeakMap(), xu = new WeakSet(), Rm = function() {
  s(this, ie).on("redirect", (t) => {
    const r = Ul.from(t, s(this, Ae), this.interception.enabled, this);
    s(this, Lr).push(this), t.once("success", () => {
      s(this, Ae).page().trustedEmitter.emit("requestfinished", r);
    }), t.once("error", () => {
      s(this, Ae).page().trustedEmitter.emit("requestfailed", r);
    }), r.finalizeInterceptions();
  }), s(this, ie).once("response", (t) => {
    f(this, Pi, ap.from(t, this, s(this, Ae).page().browser().cdpSupported));
  }), s(this, ie).once("success", (t) => {
    f(this, Pi, ap.from(t, this, s(this, Ae).page().browser().cdpSupported));
  }), s(this, ie).on("authenticate", s(this, Eu)), s(this, Ae).page().trustedEmitter.emit("request", this);
}, Ha = new WeakMap(), Eu = new WeakMap();
Ul = Om;
function cp(i) {
  const e = [];
  for (const [t, r] of Object.entries(i ?? []))
    if (!Object.is(r, void 0)) {
      const n = Array.isArray(r) ? r : [r];
      for (const o of n)
        e.push({
          name: t.toLowerCase(),
          value: {
            type: "string",
            value: String(o)
          }
        });
    }
  return e;
}
/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
class up extends Error {
}
var Fi, Bm, Fm;
class Am {
  static serialize(e) {
    switch (typeof e) {
      case "symbol":
      case "function":
        throw new up(`Unable to serializable ${typeof e}`);
      case "object":
        return m(this, Fi, Fm).call(this, e);
      case "undefined":
        return {
          type: "undefined"
        };
      case "number":
        return m(this, Fi, Bm).call(this, e);
      case "bigint":
        return {
          type: "bigint",
          value: e.toString()
        };
      case "string":
        return {
          type: "string",
          value: e
        };
      case "boolean":
        return {
          type: "boolean",
          value: e
        };
    }
  }
}
Fi = new WeakSet(), Bm = function(e) {
  let t;
  return Object.is(e, -0) ? t = "-0" : Object.is(e, 1 / 0) ? t = "Infinity" : Object.is(e, -1 / 0) ? t = "-Infinity" : Object.is(e, NaN) ? t = "NaN" : t = e, {
    type: "number",
    value: t
  };
}, Fm = function(e) {
  if (e === null)
    return {
      type: "null"
    };
  if (Array.isArray(e))
    return {
      type: "array",
      value: e.map((r) => this.serialize(r))
    };
  if (Eg(e)) {
    try {
      JSON.stringify(e);
    } catch (r) {
      throw r instanceof TypeError && r.message.startsWith("Converting circular structure to JSON") && (r.message += " Recursive objects are not allowed."), r;
    }
    const t = [];
    for (const r in e)
      t.push([this.serialize(r), this.serialize(e[r])]);
    return {
      type: "object",
      value: t
    };
  } else {
    if (Sg(e))
      return {
        type: "regexp",
        value: {
          pattern: e.source,
          flags: e.flags
        }
      };
    if (Pg(e))
      return {
        type: "date",
        value: e.toISOString()
      };
  }
  throw new up("Custom object serialization not possible. Use plain objects instead.");
}, u(Am, Fi);
/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
function cC(i) {
  if (i.exception.type === "object" && !("value" in i.exception))
    return new Error(i.text);
  if (i.exception.type !== "error")
    return oc.deserialize(i.exception);
  const [e = "", ...t] = i.text.split(": "), r = t.join(": "), n = new Error(r);
  n.name = e;
  const o = [];
  if (i.stackTrace && o.length < Error.stackTraceLimit)
    for (const a of i.stackTrace.callFrames.reverse()) {
      if (vc.isPuppeteerURL(a.url) && a.url !== vc.INTERNAL_URL) {
        const c = vc.parse(a.url);
        o.unshift(`    at ${a.functionName || c.functionName} (${c.functionName} at ${c.siteString}, <anonymous>:${a.lineNumber}:${a.columnNumber})`);
      } else
        o.push(`    at ${a.functionName || "<anonymous>"} (${a.url}:${a.lineNumber}:${a.columnNumber})`);
      if (o.length >= Error.stackTraceLimit)
        break;
    }
  return n.stack = [i.text, ...o].join(`
`), n;
}
function Mm(i, e) {
  return (t) => {
    throw t instanceof uo ? t.message += ` at ${i}` : t instanceof Ig && (t.message = `Navigation timeout of ${e} ms exceeded`), t;
  };
}
function uC(i) {
  throw i instanceof Error && (i.message.includes("ExecutionContext was destroyed") || i.message.includes("Inspected target navigated or closed")) ? new Error("Execution context was destroyed, most likely because of a navigation.") : i;
}
var dC = function(i, e, t) {
  if (e != null) {
    if (typeof e != "object" && typeof e != "function") throw new TypeError("Object expected.");
    var r, n;
    if (t) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      r = e[Symbol.asyncDispose];
    }
    if (r === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      r = e[Symbol.dispose], t && (n = r);
    }
    if (typeof r != "function") throw new TypeError("Object not disposable.");
    n && (r = function() {
      try {
        n.call(this);
      } catch (o) {
        return Promise.reject(o);
      }
    }), i.stack.push({ value: e, dispose: r, async: t });
  } else t && i.stack.push({ async: !0 });
  return e;
}, lC = /* @__PURE__ */ function(i) {
  return function(e) {
    function t(a) {
      e.error = e.hasError ? new i(a, e.error, "An error was suppressed during disposal.") : a, e.hasError = !0;
    }
    var r, n = 0;
    function o() {
      for (; r = e.stack.pop(); )
        try {
          if (!r.async && n === 1) return n = 0, e.stack.push(r), Promise.resolve().then(o);
          if (r.dispose) {
            var a = r.dispose.call(r.value);
            if (r.async) return n |= 2, Promise.resolve(a).then(o, function(c) {
              return t(c), o();
            });
          } else n |= 1;
        } catch (c) {
          t(c);
        }
      if (n === 1) return e.hasError ? Promise.reject(e.error) : Promise.resolve();
      if (e.hasError) throw e.error;
    }
    return o();
  };
}(typeof SuppressedError == "function" ? SuppressedError : function(i, e, t) {
  var r = new Error(t);
  return r.name = "SuppressedError", r.error = i, r.suppressed = e, r;
}), za, $l;
class jm extends _g {
  constructor(t, r) {
    super(r);
    u(this, za);
    O(this, "realm");
    O(this, "internalPuppeteerUtil");
    this.realm = t;
  }
  initialize() {
    this.realm.on("destroyed", ({ reason: t }) => {
      this.taskManager.terminateAll(new Error(t)), this.dispose();
    }), this.realm.on("updated", () => {
      this.internalPuppeteerUtil = void 0, this.taskManager.rerunAll();
    });
  }
  get puppeteerUtil() {
    const t = Promise.resolve();
    return kg.inject((r) => {
      this.internalPuppeteerUtil && this.internalPuppeteerUtil.then((n) => {
        n.dispose();
      }), this.internalPuppeteerUtil = t.then(() => this.evaluateHandle(r));
    }, !this.internalPuppeteerUtil), this.internalPuppeteerUtil;
  }
  async evaluateHandle(t, ...r) {
    return await m(this, za, $l).call(this, !1, t, ...r);
  }
  async evaluate(t, ...r) {
    return await m(this, za, $l).call(this, !0, t, ...r);
  }
  createHandle(t) {
    return (t.type === "node" || t.type === "window") && this instanceof Wr ? Oi.from(t, this) : Kr.from(t, this);
  }
  async serializeAsync(t) {
    return t instanceof Ph && (t = await t.get(this)), this.serialize(t);
  }
  serialize(t) {
    if (t instanceof Kr || t instanceof Oi) {
      if (t.realm !== this) {
        if (!(t.realm instanceof Wr) || !(this instanceof Wr))
          throw new Error("Trying to evaluate JSHandle from different global types. Usually this means you're using a handle from a worker in a page or vice versa.");
        if (t.realm.environment !== this.environment)
          throw new Error("Trying to evaluate JSHandle from different frames. Usually this means you're using a handle from a page on a different page.");
      }
      if (t.disposed)
        throw new Error("JSHandle is disposed!");
      return t.remoteValue();
    }
    return Am.serialize(t);
  }
  async destroyHandles(t) {
    if (this.disposed)
      return;
    const r = t.map(({ id: n }) => n).filter((n) => n !== void 0);
    r.length !== 0 && await this.realm.disown(r).catch((n) => {
      Ee(n);
    });
  }
  async adoptHandle(t) {
    return await this.evaluateHandle((r) => r, t);
  }
  async transferHandle(t) {
    if (t.realm === this)
      return t;
    const r = this.adoptHandle(t);
    return await t.dispose(), await r;
  }
}
za = new WeakSet(), $l = async function(t, r, ...n) {
  var d;
  const o = Tg(((d = Dg(r)) == null ? void 0 : d.toString()) ?? vc.INTERNAL_URL);
  let a;
  const c = t ? "none" : "root", p = t ? {} : {
    maxObjectDepth: 0,
    maxDomDepth: 0
  };
  if (Cp(r)) {
    const h = Ih.test(r) ? r : `${r}
${o}
`;
    a = this.realm.evaluate(h, !0, {
      resultOwnership: c,
      userActivation: !0,
      serializationOptions: p
    });
  } else {
    let h = Ep(r);
    h = Ih.test(h) ? h : `${h}
${o}
`, a = this.realm.callFunction(
      h,
      /* awaitPromise= */
      !0,
      {
        // LazyArgs are used only internally and should not affect the order
        // evaluate calls for the public APIs.
        arguments: n.some((g) => g instanceof Ph) ? await Promise.all(n.map((g) => this.serializeAsync(g))) : n.map((g) => this.serialize(g)),
        resultOwnership: c,
        userActivation: !0,
        serializationOptions: p
      }
    );
  }
  const l = await a.catch(uC);
  if ("type" in l && l.type === "exception")
    throw cC(l.exceptionDetails);
  return t ? oc.deserialize(l.result) : this.createHandle(l.result);
};
var Ii, Su, Um, _i;
const Pu = class Pu extends jm {
  constructor(t, r) {
    super(t, r.timeoutSettings);
    u(this, Su);
    u(this, Ii);
    u(this, _i, !1);
    f(this, Ii, r);
  }
  static from(t, r) {
    var o;
    const n = new Pu(t, r);
    return m(o = n, Su, Um).call(o), n;
  }
  get puppeteerUtil() {
    let t = Promise.resolve();
    return s(this, _i) || (t = Promise.all([
      ho.from(this.environment, "__ariaQuerySelector", Sh.queryOne, !!this.sandbox),
      ho.from(this.environment, "__ariaQuerySelectorAll", async (r, n) => {
        const o = Sh.queryAll(r, n);
        return await r.realm.evaluateHandle((...a) => a, ...await xp.collect(o));
      }, !!this.sandbox)
    ]), f(this, _i, !0)), t.then(() => super.puppeteerUtil);
  }
  get sandbox() {
    return this.realm.sandbox;
  }
  get environment() {
    return s(this, Ii);
  }
  async adoptBackendNode(t) {
    const r = { stack: [], error: void 0, hasError: !1 };
    try {
      const { object: n } = await s(this, Ii).client.send("DOM.resolveNode", {
        backendNodeId: t,
        executionContextId: await this.realm.resolveExecutionContextId()
      });
      return await dC(r, Oi.from({
        handle: n.objectId,
        type: "node"
      }, this), !1).evaluateHandle((a) => a);
    } catch (n) {
      r.error = n, r.hasError = !0;
    } finally {
      lC(r);
    }
  }
};
Ii = new WeakMap(), Su = new WeakSet(), Um = function() {
  xh(Pu.prototype, this, "initialize").call(this), this.realm.on("updated", () => {
    this.environment.clearDocumentHandle(), f(this, _i, !1);
  });
}, _i = new WeakMap();
let Wr = Pu;
var Wa;
const wh = class wh extends jm {
  constructor(t, r) {
    super(t, r.timeoutSettings);
    u(this, Wa);
    f(this, Wa, r);
  }
  static from(t, r) {
    const n = new wh(t, r);
    return n.initialize(), n;
  }
  get environment() {
    return s(this, Wa);
  }
  async adoptBackendNode() {
    throw new Error("Cannot adopt DOM nodes into a worker.");
  }
};
Wa = new WeakMap();
let Ll = wh;
/**
 * @license
 * Copyright 2024 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var Ka, Va;
const yh = class yh extends Ng {
  constructor(t, r) {
    super(r.origin);
    u(this, Ka);
    u(this, Va);
    f(this, Ka, t), f(this, Va, Ll.from(r, this));
  }
  static from(t, r) {
    return new yh(t, r);
  }
  get frame() {
    return s(this, Ka);
  }
  mainRealm() {
    return s(this, Va);
  }
  get client() {
    throw new q();
  }
};
Ka = new WeakMap(), Va = new WeakMap();
let ql = yh;
/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var hC = function(i, e, t) {
  for (var r = arguments.length > 2, n = 0; n < e.length; n++)
    t = r ? e[n].call(i, t) : e[n].call(i);
  return r ? t : void 0;
}, fs = function(i, e, t, r, n, o) {
  function a(b) {
    if (b !== void 0 && typeof b != "function") throw new TypeError("Function expected");
    return b;
  }
  for (var c = r.kind, p = c === "getter" ? "get" : c === "setter" ? "set" : "value", l = !e && i ? r.static ? i : i.prototype : null, d = e || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), h, g = !1, x = t.length - 1; x >= 0; x--) {
    var E = {};
    for (var P in r) E[P] = P === "access" ? {} : r[P];
    for (var P in r.access) E.access[P] = r.access[P];
    E.addInitializer = function(b) {
      if (g) throw new TypeError("Cannot add initializers after decoration has completed");
      o.push(a(b || null));
    };
    var C = (0, t[x])(c === "accessor" ? { get: d.get, set: d.set } : d[p], E);
    if (c === "accessor") {
      if (C === void 0) continue;
      if (C === null || typeof C != "object") throw new TypeError("Object expected");
      (h = a(C.get)) && (d.get = h), (h = a(C.set)) && (d.set = h), (h = a(C.init)) && n.unshift(h);
    } else (h = a(C)) && (c === "field" ? n.unshift(h) : d[p] = h);
  }
  l && Object.defineProperty(l, r.name, d), g = !0;
}, dp = function(i, e, t) {
  return typeof e == "symbol" && (e = e.description ? "[".concat(e.description, "]") : ""), Object.defineProperty(i, "name", { configurable: !0, value: t ? "".concat(t, " ", e) : e });
};
function pC(i) {
  switch (i) {
    case "group":
      return "startGroup";
    case "groupCollapsed":
      return "startGroupCollapsed";
    case "groupEnd":
      return "endGroup";
    default:
      return i;
  }
}
let fC = (() => {
  var g, x, E, $m, Hl, Uc, N, $c, Lc, R;
  let i = Og, e = [], t, r, n, o, a, c, p, l, d, h;
  return R = class extends i {
    constructor(S, y) {
      super();
      u(this, E);
      u(this, g, hC(this, e));
      O(this, "browsingContext");
      u(this, x, /* @__PURE__ */ new WeakMap());
      O(this, "realms");
      O(this, "_id");
      O(this, "client");
      O(this, "accessibility");
      u(this, N, /* @__PURE__ */ new Map());
      f(this, g, S), this.browsingContext = y, this._id = y.id, this.client = new lo(this), this.realms = {
        default: Wr.from(this.browsingContext.defaultRealm, this),
        internal: Wr.from(this.browsingContext.createWindowRealm(`__puppeteer_internal_${Math.ceil(Math.random() * 1e4)}`), this)
      }, this.accessibility = new Rg(this.realms.default, this._id);
    }
    static from(S, y) {
      var B;
      const k = new R(S, y);
      return m(B = k, E, $m).call(B), k;
    }
    get timeoutSettings() {
      return this.page()._timeoutSettings;
    }
    mainRealm() {
      return this.realms.default;
    }
    isolatedRealm() {
      return this.realms.internal;
    }
    realm(S) {
      for (const y of Object.values(this.realms))
        if (y.realm.id === S)
          return y;
    }
    page() {
      let S = s(this, g);
      for (; S instanceof R; )
        S = s(S, g);
      return S;
    }
    url() {
      return this.browsingContext.url;
    }
    parentFrame() {
      return s(this, g) instanceof R ? s(this, g) : null;
    }
    childFrames() {
      return [...this.browsingContext.children].map((S) => s(this, x).get(S));
    }
    async goto(S, y = {}) {
      const [k] = await Promise.all([
        this.waitForNavigation(y),
        // Some implementations currently only report errors when the
        // readiness=interactive.
        //
        // Related: https://bugzilla.mozilla.org/show_bug.cgi?id=1846601
        this.browsingContext.navigate(
          S,
          "interactive"
          /* Bidi.BrowsingContext.ReadinessState.Interactive */
        ).catch((B) => {
          if (!(Mg(B) && B.message.includes("net::ERR_HTTP_RESPONSE_CODE_FAILURE")) && !B.message.includes("navigation canceled") && !B.message.includes("Navigation was aborted by another navigation"))
            throw B;
        })
      ]).catch(Mm(S, y.timeout ?? this.timeoutSettings.navigationTimeout()));
      return k;
    }
    async setContent(S, y = {}) {
      await Promise.all([
        this.setFrameContent(S),
        Hc(uc([
          s(this, E, $c).call(this, y),
          s(this, E, Lc).call(this, y)
        ]))
      ]);
    }
    async waitForNavigation(S = {}) {
      const { timeout: y = this.timeoutSettings.navigationTimeout(), signal: k } = S, B = this.childFrames().map(($) => {
        var W;
        return m(W = $, E, Uc).call(W);
      });
      return await Hc(uc([
        jg(Ct(this.browsingContext, "navigation"), Ct(this.browsingContext, "historyUpdated").pipe(Hi(() => ({ navigation: null })))).pipe(_h()).pipe(wd(({ navigation: $ }) => $ === null ? ds(null) : s(this, E, $c).call(this, S).pipe(Ug(() => B.length === 0 ? ds(void 0) : uc(B)), Ys(Ct($, "fragment"), Ct($, "failed"), Ct($, "aborted")), wd(() => {
          if ($.request) {
            let W = function(X) {
              return $ === null ? ds(null) : X.response || X.error ? ds($) : X.redirect ? W(X.redirect) : Ct(X, "success").pipe(Ys(Ct(X, "error")), Ys(Ct(X, "redirect"))).pipe(wd(() => W(X)));
            };
            return W($.request);
          }
          return ds($);
        })))),
        s(this, E, Lc).call(this, S)
      ]).pipe(Hi(([$]) => {
        if (!$)
          return null;
        const W = $.request;
        if (!W)
          return null;
        const X = W.lastRedirect ?? W;
        return Nm.get(X).response();
      }), Ys(qc(y), $g(k), m(this, E, Uc).call(this).pipe(Hi(() => {
        throw new Yl("Frame detached.");
      })))));
    }
    waitForDevicePrompt(S = {}) {
      const { timeout: y = this.timeoutSettings.timeout(), signal: k } = S;
      return this.browsingContext.waitForDevicePrompt(y, k);
    }
    get detached() {
      return this.browsingContext.closed;
    }
    async exposeFunction(S, y) {
      if (s(this, N).has(S))
        throw new Error(`Failed to add page binding with name ${S}: globalThis['${S}'] already exists!`);
      const k = await ho.from(this, S, y);
      s(this, N).set(S, k);
    }
    async removeExposedFunction(S) {
      const y = s(this, N).get(S);
      if (!y)
        throw new Error(`Failed to remove page binding with name ${S}: window['${S}'] does not exists!`);
      s(this, N).delete(S), await y[Symbol.asyncDispose]();
    }
    async createCDPSession() {
      if (!this.page().browser().cdpSupported)
        throw new q();
      return await this.page().browser().cdpConnection._createSession({ targetId: this._id });
    }
    async setFiles(S, y) {
      await this.browsingContext.setFiles(
        // SAFETY: ElementHandles are always remote references.
        S.remoteValue(),
        y
      );
    }
    async frameElement() {
      const S = this.parentFrame();
      if (!S)
        return null;
      const [y] = await S.browsingContext.locateNodes({
        type: "context",
        value: {
          context: this._id
        }
      });
      return y ? Oi.from(y, S.mainRealm()) : null;
    }
    async locateNodes(S, y) {
      return await this.browsingContext.locateNodes(
        y,
        // SAFETY: ElementHandles are always remote references.
        [S.remoteValue()]
      );
    }
  }, g = new WeakMap(), x = new WeakMap(), E = new WeakSet(), $m = function() {
    for (const S of this.browsingContext.children)
      m(this, E, Hl).call(this, S);
    this.browsingContext.on("browsingcontext", ({ browsingContext: S }) => {
      m(this, E, Hl).call(this, S);
    }), this.browsingContext.on("closed", () => {
      for (const S of lo.sessions.values())
        S.frame === this && S.onClose();
      this.page().trustedEmitter.emit("framedetached", this);
    }), this.browsingContext.on("request", ({ request: S }) => {
      const y = Om.from(S, this, this.page().isNetworkInterceptionEnabled);
      S.once("success", () => {
        this.page().trustedEmitter.emit("requestfinished", y);
      }), S.once("error", () => {
        this.page().trustedEmitter.emit("requestfailed", y);
      }), y.finalizeInterceptions();
    }), this.browsingContext.on("navigation", ({ navigation: S }) => {
      S.once("fragment", () => {
        this.page().trustedEmitter.emit("framenavigated", this);
      });
    }), this.browsingContext.on("load", () => {
      this.page().trustedEmitter.emit("load", void 0);
    }), this.browsingContext.on("DOMContentLoaded", () => {
      this._hasStartedLoading = !0, this.page().trustedEmitter.emit("domcontentloaded", void 0), this.page().trustedEmitter.emit("framenavigated", this);
    }), this.browsingContext.on("userprompt", ({ userPrompt: S }) => {
      this.page().trustedEmitter.emit("dialog", jl.from(S));
    }), this.browsingContext.on("log", ({ entry: S }) => {
      if (this._id === S.source.context)
        if (mC(S)) {
          const y = S.args.map((B) => this.mainRealm().createHandle(B)), k = y.reduce((B, $) => {
            const W = $ instanceof Kr && $.isPrimitiveValue ? oc.deserialize($.remoteValue()) : $.toString();
            return `${B} ${W}`;
          }, "").slice(1);
          this.page().trustedEmitter.emit("console", new Ag(pC(S.method), k, y, wC(S.stackTrace), this, void 0));
        } else if (gC(S)) {
          const y = new Error(S.text ?? ""), k = y.message.split(`
`).length, B = y.stack.split(`
`).splice(0, k), $ = [];
          if (S.stackTrace) {
            for (const W of S.stackTrace.callFrames)
              if ($.push(`    at ${W.functionName || "<anonymous>"} (${W.url}:${W.lineNumber + 1}:${W.columnNumber + 1})`), $.length >= Error.stackTraceLimit)
                break;
          }
          y.stack = [...B, ...$].join(`
`), this.page().trustedEmitter.emit("pageerror", y);
        } else
          Ee(`Unhandled LogEntry with type "${S.type}", text "${S.text}" and level "${S.level}"`);
    }), this.browsingContext.on("worker", ({ realm: S }) => {
      const y = ql.from(this, S);
      S.on("destroyed", () => {
        this.page().trustedEmitter.emit("workerdestroyed", y);
      }), this.page().trustedEmitter.emit("workercreated", y);
    });
  }, Hl = function(S) {
    const y = R.from(this, S);
    return s(this, x).set(S, y), this.page().trustedEmitter.emit("frameattached", y), S.on("closed", () => {
      s(this, x).delete(S);
    }), y;
  }, Uc = function() {
    return Bg(() => this.detached ? ds(this) : Ct(
      this.page().trustedEmitter,
      "framedetached"
      /* PageEvent.FrameDetached */
    ).pipe(Fg((S) => S === this)));
  }, N = new WeakMap(), $c = function() {
    return a.value;
  }, Lc = function() {
    return p.value;
  }, (() => {
    const S = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
    t = [ls], r = [ls], n = [ls], o = [ls], c = [ls], l = [ls], d = [ls], h = [ls], fs(R, null, t, { kind: "method", name: "goto", static: !1, private: !1, access: { has: (y) => "goto" in y, get: (y) => y.goto }, metadata: S }, null, e), fs(R, null, r, { kind: "method", name: "setContent", static: !1, private: !1, access: { has: (y) => "setContent" in y, get: (y) => y.setContent }, metadata: S }, null, e), fs(R, null, n, { kind: "method", name: "waitForNavigation", static: !1, private: !1, access: { has: (y) => "waitForNavigation" in y, get: (y) => y.waitForNavigation }, metadata: S }, null, e), fs(R, a = { value: dp(function(y = {}) {
      let { waitUntil: k = "load" } = y;
      const { timeout: B = this.timeoutSettings.navigationTimeout() } = y;
      Array.isArray(k) || (k = [k]);
      const $ = /* @__PURE__ */ new Set();
      for (const W of k)
        switch (W) {
          case "load": {
            $.add("load");
            break;
          }
          case "domcontentloaded": {
            $.add("DOMContentLoaded");
            break;
          }
        }
      return $.size === 0 ? ds(void 0) : uc([...$].map((W) => Ct(this.browsingContext, W))).pipe(Hi(() => {
      }), _h(), Ys(qc(B), m(this, E, Uc).call(this).pipe(Hi(() => {
        throw new Error("Frame detached.");
      }))));
    }, "#waitForLoad$") }, o, { kind: "method", name: "#waitForLoad$", static: !1, private: !0, access: { has: (y) => cc(E, y), get: (y) => s(y, E, $c) }, metadata: S }, null, e), fs(R, p = { value: dp(function(y = {}) {
      let { waitUntil: k = "load" } = y;
      Array.isArray(k) || (k = [k]);
      let B = 1 / 0;
      for (const $ of k)
        switch ($) {
          case "networkidle0": {
            B = Math.min(0, B);
            break;
          }
          case "networkidle2": {
            B = Math.min(2, B);
            break;
          }
        }
      return B === 1 / 0 ? ds(void 0) : this.page().waitForNetworkIdle$({
        idleTime: 500,
        timeout: y.timeout ?? this.timeoutSettings.timeout(),
        concurrency: B
      });
    }, "#waitForNetworkIdle$") }, c, { kind: "method", name: "#waitForNetworkIdle$", static: !1, private: !0, access: { has: (y) => cc(E, y), get: (y) => s(y, E, Lc) }, metadata: S }, null, e), fs(R, null, l, { kind: "method", name: "setFiles", static: !1, private: !1, access: { has: (y) => "setFiles" in y, get: (y) => y.setFiles }, metadata: S }, null, e), fs(R, null, d, { kind: "method", name: "frameElement", static: !1, private: !1, access: { has: (y) => "frameElement" in y, get: (y) => y.frameElement }, metadata: S }, null, e), fs(R, null, h, { kind: "method", name: "locateNodes", static: !1, private: !1, access: { has: (y) => "locateNodes" in y, get: (y) => y.locateNodes }, metadata: S }, null, e), S && Object.defineProperty(R, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: S });
  })(), R;
})();
function mC(i) {
  return i.type === "console";
}
function gC(i) {
  return i.type === "javascript";
}
function wC(i) {
  const e = [];
  if (i)
    for (const t of i.callFrames)
      e.push({
        url: t.url,
        lineNumber: t.lineNumber,
        columnNumber: t.columnNumber
      });
  return e;
}
/**
 * @license
 * Copyright 2017 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var Ue;
(function(i) {
  i.None = "none", i.Key = "key", i.Pointer = "pointer", i.Wheel = "wheel";
})(Ue || (Ue = {}));
var he;
(function(i) {
  i.Pause = "pause", i.KeyDown = "keyDown", i.KeyUp = "keyUp", i.PointerUp = "pointerUp", i.PointerDown = "pointerDown", i.PointerMove = "pointerMove", i.Scroll = "scroll";
})(he || (he = {}));
const Yi = (i) => {
  switch (i) {
    case "\r":
    case `
`:
      i = "Enter";
      break;
  }
  if ([...i].length === 1)
    return i;
  switch (i) {
    case "Cancel":
      return "";
    case "Help":
      return "";
    case "Backspace":
      return "";
    case "Tab":
      return "";
    case "Clear":
      return "";
    case "Enter":
      return "";
    case "Shift":
    case "ShiftLeft":
      return "";
    case "Control":
    case "ControlLeft":
      return "";
    case "Alt":
    case "AltLeft":
      return "";
    case "Pause":
      return "";
    case "Escape":
      return "";
    case "PageUp":
      return "";
    case "PageDown":
      return "";
    case "End":
      return "";
    case "Home":
      return "";
    case "ArrowLeft":
      return "";
    case "ArrowUp":
      return "";
    case "ArrowRight":
      return "";
    case "ArrowDown":
      return "";
    case "Insert":
      return "";
    case "Delete":
      return "";
    case "NumpadEqual":
      return "";
    case "Numpad0":
      return "";
    case "Numpad1":
      return "";
    case "Numpad2":
      return "";
    case "Numpad3":
      return "";
    case "Numpad4":
      return "";
    case "Numpad5":
      return "";
    case "Numpad6":
      return "";
    case "Numpad7":
      return "";
    case "Numpad8":
      return "";
    case "Numpad9":
      return "";
    case "NumpadMultiply":
      return "";
    case "NumpadAdd":
      return "";
    case "NumpadSubtract":
      return "";
    case "NumpadDecimal":
      return "";
    case "NumpadDivide":
      return "";
    case "F1":
      return "";
    case "F2":
      return "";
    case "F3":
      return "";
    case "F4":
      return "";
    case "F5":
      return "";
    case "F6":
      return "";
    case "F7":
      return "";
    case "F8":
      return "";
    case "F9":
      return "";
    case "F10":
      return "";
    case "F11":
      return "";
    case "F12":
      return "";
    case "Meta":
    case "MetaLeft":
      return "";
    case "ShiftRight":
      return "";
    case "ControlRight":
      return "";
    case "AltRight":
      return "";
    case "MetaRight":
      return "";
    case "Digit0":
      return "0";
    case "Digit1":
      return "1";
    case "Digit2":
      return "2";
    case "Digit3":
      return "3";
    case "Digit4":
      return "4";
    case "Digit5":
      return "5";
    case "Digit6":
      return "6";
    case "Digit7":
      return "7";
    case "Digit8":
      return "8";
    case "Digit9":
      return "9";
    case "KeyA":
      return "a";
    case "KeyB":
      return "b";
    case "KeyC":
      return "c";
    case "KeyD":
      return "d";
    case "KeyE":
      return "e";
    case "KeyF":
      return "f";
    case "KeyG":
      return "g";
    case "KeyH":
      return "h";
    case "KeyI":
      return "i";
    case "KeyJ":
      return "j";
    case "KeyK":
      return "k";
    case "KeyL":
      return "l";
    case "KeyM":
      return "m";
    case "KeyN":
      return "n";
    case "KeyO":
      return "o";
    case "KeyP":
      return "p";
    case "KeyQ":
      return "q";
    case "KeyR":
      return "r";
    case "KeyS":
      return "s";
    case "KeyT":
      return "t";
    case "KeyU":
      return "u";
    case "KeyV":
      return "v";
    case "KeyW":
      return "w";
    case "KeyX":
      return "x";
    case "KeyY":
      return "y";
    case "KeyZ":
      return "z";
    case "Semicolon":
      return ";";
    case "Equal":
      return "=";
    case "Comma":
      return ",";
    case "Minus":
      return "-";
    case "Period":
      return ".";
    case "Slash":
      return "/";
    case "Backquote":
      return "`";
    case "BracketLeft":
      return "[";
    case "Backslash":
      return "\\";
    case "BracketRight":
      return "]";
    case "Quote":
      return '"';
    default:
      throw new Error(`Unknown key: "${i}"`);
  }
};
var ns;
class yC extends Lg {
  constructor(t) {
    super();
    u(this, ns);
    f(this, ns, t);
  }
  async down(t, r) {
    await s(this, ns).mainFrame().browsingContext.performActions([
      {
        type: Ue.Key,
        id: "__puppeteer_keyboard",
        actions: [
          {
            type: he.KeyDown,
            value: Yi(t)
          }
        ]
      }
    ]);
  }
  async up(t) {
    await s(this, ns).mainFrame().browsingContext.performActions([
      {
        type: Ue.Key,
        id: "__puppeteer_keyboard",
        actions: [
          {
            type: he.KeyUp,
            value: Yi(t)
          }
        ]
      }
    ]);
  }
  async press(t, r = {}) {
    const { delay: n = 0 } = r, o = [
      {
        type: he.KeyDown,
        value: Yi(t)
      }
    ];
    n > 0 && o.push({
      type: he.Pause,
      duration: n
    }), o.push({
      type: he.KeyUp,
      value: Yi(t)
    }), await s(this, ns).mainFrame().browsingContext.performActions([
      {
        type: Ue.Key,
        id: "__puppeteer_keyboard",
        actions: o
      }
    ]);
  }
  async type(t, r = {}) {
    const { delay: n = 0 } = r, o = [...t].map(Yi), a = [];
    if (n <= 0)
      for (const c of o)
        a.push({
          type: he.KeyDown,
          value: c
        }, {
          type: he.KeyUp,
          value: c
        });
    else
      for (const c of o)
        a.push({
          type: he.KeyDown,
          value: c
        }, {
          type: he.Pause,
          duration: n
        }, {
          type: he.KeyUp,
          value: c
        });
    await s(this, ns).mainFrame().browsingContext.performActions([
      {
        type: Ue.Key,
        id: "__puppeteer_keyboard",
        actions: a
      }
    ]);
  }
  async sendCharacter(t) {
    if ([...t].length > 1)
      throw new Error("Cannot send more than 1 character.");
    await (await s(this, ns).focusedFrame()).isolatedRealm().evaluate(async (n) => {
      document.execCommand("insertText", !1, n);
    }, t);
  }
}
ns = new WeakMap();
const Od = (i) => {
  switch (i) {
    case ms.Left:
      return 0;
    case ms.Middle:
      return 1;
    case ms.Right:
      return 2;
    case ms.Back:
      return 3;
    case ms.Forward:
      return 4;
  }
};
var Mt, qr;
class vC extends qg {
  constructor(t) {
    super();
    u(this, Mt);
    u(this, qr, { x: 0, y: 0 });
    f(this, Mt, t);
  }
  async reset() {
    f(this, qr, { x: 0, y: 0 }), await s(this, Mt).mainFrame().browsingContext.releaseActions();
  }
  async move(t, r, n = {}) {
    const o = s(this, qr), a = {
      x: Math.round(t),
      y: Math.round(r)
    }, c = [], p = n.steps ?? 0;
    for (let l = 0; l < p; ++l)
      c.push({
        type: he.PointerMove,
        x: o.x + (a.x - o.x) * (l / p),
        y: o.y + (a.y - o.y) * (l / p),
        origin: n.origin
      });
    c.push({
      type: he.PointerMove,
      ...a,
      origin: n.origin
    }), f(this, qr, a), await s(this, Mt).mainFrame().browsingContext.performActions([
      {
        type: Ue.Pointer,
        id: "__puppeteer_mouse",
        actions: c
      }
    ]);
  }
  async down(t = {}) {
    await s(this, Mt).mainFrame().browsingContext.performActions([
      {
        type: Ue.Pointer,
        id: "__puppeteer_mouse",
        actions: [
          {
            type: he.PointerDown,
            button: Od(t.button ?? ms.Left)
          }
        ]
      }
    ]);
  }
  async up(t = {}) {
    await s(this, Mt).mainFrame().browsingContext.performActions([
      {
        type: Ue.Pointer,
        id: "__puppeteer_mouse",
        actions: [
          {
            type: he.PointerUp,
            button: Od(t.button ?? ms.Left)
          }
        ]
      }
    ]);
  }
  async click(t, r, n = {}) {
    const o = [
      {
        type: he.PointerMove,
        x: Math.round(t),
        y: Math.round(r),
        origin: n.origin
      }
    ], a = {
      type: he.PointerDown,
      button: Od(n.button ?? ms.Left)
    }, c = {
      type: he.PointerUp,
      button: a.button
    };
    for (let p = 1; p < (n.count ?? 1); ++p)
      o.push(a, c);
    o.push(a), n.delay && o.push({
      type: he.Pause,
      duration: n.delay
    }), o.push(c), await s(this, Mt).mainFrame().browsingContext.performActions([
      {
        type: Ue.Pointer,
        id: "__puppeteer_mouse",
        actions: o
      }
    ]);
  }
  async wheel(t = {}) {
    await s(this, Mt).mainFrame().browsingContext.performActions([
      {
        type: Ue.Wheel,
        id: "__puppeteer_wheel",
        actions: [
          {
            type: he.Scroll,
            ...s(this, qr) ?? {
              x: 0,
              y: 0
            },
            deltaX: t.deltaX ?? 0,
            deltaY: t.deltaY ?? 0
          }
        ]
      }
    ]);
  }
  drag() {
    throw new q();
  }
  dragOver() {
    throw new q();
  }
  dragEnter() {
    throw new q();
  }
  drop() {
    throw new q();
  }
  dragAndDrop() {
    throw new q();
  }
}
Mt = new WeakMap(), qr = new WeakMap();
var Ga, Xa, Ja, Hr, zr, Ya, ki;
class bC {
  constructor(e, t, r, n, o, a) {
    u(this, Ga, !1);
    u(this, Xa);
    u(this, Ja);
    u(this, Hr);
    u(this, zr);
    u(this, Ya);
    u(this, ki);
    f(this, zr, e), f(this, Ya, t), f(this, Xa, Math.round(n)), f(this, Ja, Math.round(o)), f(this, ki, a), f(this, Hr, `__puppeteer_finger_${r}`);
  }
  async start(e = {}) {
    if (s(this, Ga))
      throw new zg("Touch has already started");
    await s(this, zr).mainFrame().browsingContext.performActions([
      {
        type: Ue.Pointer,
        id: s(this, Hr),
        parameters: {
          pointerType: "touch"
        },
        actions: [
          {
            type: he.PointerMove,
            x: s(this, Xa),
            y: s(this, Ja),
            origin: e.origin
          },
          {
            ...s(this, ki),
            type: he.PointerDown,
            button: 0
          }
        ]
      }
    ]), f(this, Ga, !0);
  }
  move(e, t) {
    const r = Math.round(e), n = Math.round(t);
    return s(this, zr).mainFrame().browsingContext.performActions([
      {
        type: Ue.Pointer,
        id: s(this, Hr),
        parameters: {
          pointerType: "touch"
        },
        actions: [
          {
            ...s(this, ki),
            type: he.PointerMove,
            x: r,
            y: n
          }
        ]
      }
    ]);
  }
  async end() {
    await s(this, zr).mainFrame().browsingContext.performActions([
      {
        type: Ue.Pointer,
        id: s(this, Hr),
        parameters: {
          pointerType: "touch"
        },
        actions: [
          {
            type: he.PointerUp,
            button: 0
          }
        ]
      }
    ]), s(this, Ya).removeHandle(this);
  }
}
Ga = new WeakMap(), Xa = new WeakMap(), Ja = new WeakMap(), Hr = new WeakMap(), zr = new WeakMap(), Ya = new WeakMap(), ki = new WeakMap();
var Za;
class CC extends Hg {
  constructor(t) {
    super();
    u(this, Za);
    f(this, Za, t);
  }
  async touchStart(t, r, n = {}) {
    const o = this.idGenerator(), a = {
      width: 0.5 * 2,
      // 2 times default touch radius.
      height: 0.5 * 2,
      // 2 times default touch radius.
      pressure: 0.5,
      altitudeAngle: Math.PI / 2
    }, c = new bC(s(this, Za), this, o, t, r, a);
    return await c.start(n), this.touches.push(c), c;
  }
}
Za = new WeakMap();
/**
 * @license
 * Copyright 2022 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var xC = function(i, e, t, r, n, o) {
  function a(b) {
    if (b !== void 0 && typeof b != "function") throw new TypeError("Function expected");
    return b;
  }
  for (var c = r.kind, p = c === "getter" ? "get" : c === "setter" ? "set" : "value", l = !e && i ? r.static ? i : i.prototype : null, d = e || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), h, g = !1, x = t.length - 1; x >= 0; x--) {
    var E = {};
    for (var P in r) E[P] = P === "access" ? {} : r[P];
    for (var P in r.access) E.access[P] = r.access[P];
    E.addInitializer = function(b) {
      if (g) throw new TypeError("Cannot add initializers after decoration has completed");
      o.push(a(b || null));
    };
    var C = (0, t[x])(c === "accessor" ? { get: d.get, set: d.set } : d[p], E);
    if (c === "accessor") {
      if (C === void 0) continue;
      if (C === null || typeof C != "object") throw new TypeError("Object expected");
      (h = a(C.get)) && (d.get = h), (h = a(C.set)) && (d.set = h), (h = a(C.init)) && n.unshift(h);
    } else (h = a(C)) && (c === "field" ? n.unshift(h) : d[p] = h);
  }
  l && Object.defineProperty(l, r.name, d), g = !0;
}, lp = function(i, e, t) {
  for (var r = arguments.length > 2, n = 0; n < e.length; n++)
    t = r ? e[n].call(i, t) : e[n].call(i);
  return r ? t : void 0;
}, hp = function(i, e, t) {
  if (e != null) {
    if (typeof e != "object" && typeof e != "function") throw new TypeError("Object expected.");
    var r, n;
    if (t) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      r = e[Symbol.asyncDispose];
    }
    if (r === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      r = e[Symbol.dispose], t && (n = r);
    }
    if (typeof r != "function") throw new TypeError("Object not disposable.");
    n && (r = function() {
      try {
        n.call(this);
      } catch (o) {
        return Promise.reject(o);
      }
    }), i.stack.push({ value: e, dispose: r, async: t });
  } else t && i.stack.push({ async: !0 });
  return e;
}, pp = /* @__PURE__ */ function(i) {
  return function(e) {
    function t(a) {
      e.error = e.hasError ? new i(a, e.error, "An error was suppressed during disposal.") : a, e.hasError = !0;
    }
    var r, n = 0;
    function o() {
      for (; r = e.stack.pop(); )
        try {
          if (!r.async && n === 1) return n = 0, e.stack.push(r), Promise.resolve().then(o);
          if (r.dispose) {
            var a = r.dispose.call(r.value);
            if (r.async) return n |= 2, Promise.resolve(a).then(o, function(c) {
              return t(c), o();
            });
          } else n |= 1;
        } catch (c) {
          t(c);
        }
      if (n === 1) return e.hasError ? Promise.reject(e.error) : Promise.resolve();
      if (e.hasError) throw e.error;
    }
    return o();
  };
}(typeof SuppressedError == "function" ? SuppressedError : function(i, e, t) {
  var r = new Error(t);
  return r.name = "SuppressedError", r.error = i, r.suppressed = e, r;
});
let Vc = (() => {
  var n, o, a, c, p, l, d, h, g, Lm, E, P, zl, Wl, Kl, v;
  let i = Wg, e, t = [], r = [];
  return v = class extends i {
    constructor(w, D) {
      super();
      u(this, g);
      u(this, n, lp(this, t, new Z()));
      u(this, o, lp(this, r));
      u(this, a);
      u(this, c, null);
      u(this, p, /* @__PURE__ */ new Set());
      O(this, "keyboard");
      O(this, "mouse");
      O(this, "touchscreen");
      O(this, "tracing");
      O(this, "coverage");
      u(this, l);
      u(this, d);
      u(this, h, /* @__PURE__ */ new Set());
      u(this, E);
      /**
       * @internal
       */
      O(this, "_credentials", null);
      u(this, P);
      f(this, o, w), f(this, a, fC.from(this, D)), f(this, l, new Kg(s(this, a).client)), this.tracing = new Vg(s(this, a).client), this.coverage = new Gg(s(this, a).client), this.keyboard = new yC(this), this.mouse = new vC(this), this.touchscreen = new CC(this);
    }
    static from(w, D) {
      var y;
      const S = new v(w, D);
      return m(y = S, g, Lm).call(y), S;
    }
    get trustedEmitter() {
      return s(this, n);
    }
    set trustedEmitter(w) {
      f(this, n, w);
    }
    _client() {
      return s(this, a).client;
    }
    /**
     * @internal
     */
    async setUserAgent(w, D) {
      let S, y, k;
      typeof w == "string" ? (S = w, y = D) : (S = w.userAgent ?? null, y = w.userAgentMetadata, k = w.platform === "" ? void 0 : w.platform), S === "" && (S = null), await s(this, a).browsingContext.setUserAgent(S), k && k !== "" && (y = y ?? {}, y.platform = k), await s(this, a).browsingContext.setClientHintsOverride(y ?? null);
    }
    async setBypassCSP(w) {
      await this._client().send("Page.setBypassCSP", { enabled: w });
    }
    async queryObjects(w) {
      Xe(!w.disposed, "Prototype JSHandle is disposed!"), Xe(w.id, "Prototype JSHandle must not be referencing primitive value");
      const D = await s(this, a).client.send("Runtime.queryObjects", {
        prototypeObjectId: w.id
      });
      return s(this, a).mainRealm().createHandle({
        type: "array",
        handle: D.objects.objectId
      });
    }
    browser() {
      return this.browserContext().browser();
    }
    browserContext() {
      return s(this, o);
    }
    mainFrame() {
      return s(this, a);
    }
    async emulateFocusedPage(w) {
      return await s(this, l).emulateFocus(w);
    }
    resize(w) {
      throw new q();
    }
    async windowId() {
      return s(this, a).browsingContext.windowId;
    }
    openDevTools() {
      throw new q();
    }
    hasDevTools() {
      throw new q();
    }
    async focusedFrame() {
      const w = { stack: [], error: void 0, hasError: !1 };
      try {
        const S = hp(w, await this.mainFrame().isolatedRealm().evaluateHandle(() => {
          let k = window;
          for (; (k.document.activeElement instanceof k.HTMLIFrameElement || k.document.activeElement instanceof k.HTMLFrameElement) && k.document.activeElement.contentWindow !== null; )
            k = k.document.activeElement.contentWindow;
          return k;
        }), !1).remoteValue();
        Xe(S.type === "window");
        const y = this.frames().find((k) => k._id === S.value.context);
        return Xe(y), y;
      } catch (D) {
        w.error = D, w.hasError = !0;
      } finally {
        pp(w);
      }
    }
    frames() {
      const w = [s(this, a)];
      for (const D of w)
        w.push(...D.childFrames());
      return w;
    }
    isClosed() {
      return s(this, a).detached;
    }
    async close(w) {
      const D = { stack: [], error: void 0, hasError: !1 };
      try {
        const S = hp(D, await s(this, o).waitForScreenshotOperations(), !1);
        try {
          await s(this, a).browsingContext.close(w == null ? void 0 : w.runBeforeUnload);
        } catch {
          return;
        }
      } catch (S) {
        D.error = S, D.hasError = !0;
      } finally {
        pp(D);
      }
    }
    async reload(w = {}) {
      const [D] = await Promise.all([
        s(this, a).waitForNavigation(w),
        s(this, a).browsingContext.reload({
          ignoreCache: w.ignoreCache ? !0 : void 0
        })
      ]).catch(Mm(this.url(), w.timeout ?? this._timeoutSettings.navigationTimeout()));
      return D;
    }
    setDefaultNavigationTimeout(w) {
      this._timeoutSettings.setDefaultNavigationTimeout(w);
    }
    setDefaultTimeout(w) {
      this._timeoutSettings.setDefaultTimeout(w);
    }
    getDefaultTimeout() {
      return this._timeoutSettings.timeout();
    }
    getDefaultNavigationTimeout() {
      return this._timeoutSettings.navigationTimeout();
    }
    isJavaScriptEnabled() {
      return s(this, a).browsingContext.isJavaScriptEnabled();
    }
    async setGeolocation(w) {
      const { longitude: D, latitude: S, accuracy: y = 0 } = w;
      if (D < -180 || D > 180)
        throw new Error(`Invalid longitude "${D}": precondition -180 <= LONGITUDE <= 180 failed.`);
      if (S < -90 || S > 90)
        throw new Error(`Invalid latitude "${S}": precondition -90 <= LATITUDE <= 90 failed.`);
      if (y < 0)
        throw new Error(`Invalid accuracy "${y}": precondition 0 <= ACCURACY failed.`);
      return await s(this, a).browsingContext.setGeolocationOverride({
        coordinates: {
          latitude: w.latitude,
          longitude: w.longitude,
          accuracy: w.accuracy
        }
      });
    }
    async setJavaScriptEnabled(w) {
      return await s(this, a).browsingContext.setJavaScriptEnabled(w);
    }
    async emulateMediaType(w) {
      return await s(this, l).emulateMediaType(w);
    }
    async emulateCPUThrottling(w) {
      return await s(this, l).emulateCPUThrottling(w);
    }
    async emulateMediaFeatures(w) {
      return await s(this, l).emulateMediaFeatures(w);
    }
    async emulateTimezone(w) {
      return await s(this, a).browsingContext.setTimezoneOverride(w);
    }
    async emulateIdleState(w) {
      return await s(this, l).emulateIdleState(w);
    }
    async emulateVisionDeficiency(w) {
      return await s(this, l).emulateVisionDeficiency(w);
    }
    async setViewport(w) {
      var S;
      let D = !1;
      if (this.browser().cdpSupported)
        D = await s(this, l).emulateViewport(w);
      else {
        const y = w != null && w.width && (w != null && w.height) ? {
          width: w.width,
          height: w.height
        } : null, k = w != null && w.deviceScaleFactor ? w.deviceScaleFactor : null, B = w ? w.isLandscape ? {
          natural: "landscape",
          type: "landscape-primary"
        } : {
          natural: "portrait",
          type: "portrait-primary"
        } : null, $ = [
          s(this, a).browsingContext.setViewport({
            viewport: y,
            devicePixelRatio: k
          }),
          s(this, a).browsingContext.setScreenOrientationOverride(B)
        ];
        if ((((S = s(this, c)) == null ? void 0 : S.hasTouch) ?? !1) !== ((w == null ? void 0 : w.hasTouch) ?? !1)) {
          D = !0;
          const W = w != null && w.hasTouch ? 1 : null;
          $.push(s(this, a).browsingContext.setTouchOverride(W).catch((X) => {
            if (!(X instanceof uo && (X.message.includes("unknown command") || X.message.includes("unsupported operation"))))
              throw X;
          }));
        }
        await Promise.all($);
      }
      f(this, c, w), D && await this.reload();
    }
    viewport() {
      return s(this, c);
    }
    async pdf(w = {}) {
      const { timeout: D = this._timeoutSettings.timeout(), path: S = void 0 } = w, { printBackground: y, margin: k, landscape: B, width: $, height: W, pageRanges: X, scale: V, preferCSSPageSize: rt } = Xg(w, "cm"), Hs = X ? X.split(", ") : [];
      await Hc(kh(this.mainFrame().isolatedRealm().evaluate(() => document.fonts.ready)).pipe(Ys(qc(D))));
      const Ht = await Hc(kh(s(this, a).browsingContext.print({
        background: y,
        margin: k,
        orientation: B ? "landscape" : "portrait",
        page: {
          width: $,
          height: W
        },
        pageRanges: Hs,
        scale: V,
        shrinkToFit: !rt
      })).pipe(Ys(qc(D)))), nt = bp(Ht, !0);
      return await this._maybeWriteTypedArrayToFile(S, nt), nt;
    }
    async createPDFStream(w) {
      const D = await this.pdf(w);
      return new ReadableStream({
        start(S) {
          S.enqueue(D), S.close();
        }
      });
    }
    async _screenshot(w) {
      const { clip: D, type: S, captureBeyondViewport: y, quality: k } = w;
      if (w.omitBackground !== void 0 && w.omitBackground)
        throw new q("BiDi does not support 'omitBackground'.");
      if (w.optimizeForSpeed !== void 0 && w.optimizeForSpeed)
        throw new q("BiDi does not support 'optimizeForSpeed'.");
      if (w.fromSurface !== void 0 && !w.fromSurface)
        throw new q("BiDi does not support 'fromSurface'.");
      if (D !== void 0 && D.scale !== void 0 && D.scale !== 1)
        throw new q("BiDi does not support 'scale' in 'clip'.");
      let B;
      if (D)
        if (y)
          B = D;
        else {
          const [W, X] = await this.evaluate(() => {
            if (!window.visualViewport)
              throw new Error("window.visualViewport is not supported.");
            return [
              window.visualViewport.pageLeft,
              window.visualViewport.pageTop
            ];
          });
          B = {
            ...D,
            x: D.x - W,
            y: D.y - X
          };
        }
      return await s(this, a).browsingContext.captureScreenshot({
        origin: y ? "document" : "viewport",
        format: {
          type: `image/${S}`,
          ...k !== void 0 ? { quality: k / 100 } : {}
        },
        ...B ? { clip: { type: "box", ...B } } : {}
      });
    }
    async createCDPSession() {
      return await s(this, a).createCDPSession();
    }
    async bringToFront() {
      await s(this, a).browsingContext.activate();
    }
    async evaluateOnNewDocument(w, ...D) {
      const S = EC(w, ...D);
      return { identifier: await s(this, a).browsingContext.addPreloadScript(S) };
    }
    async removeScriptToEvaluateOnNewDocument(w) {
      await s(this, a).browsingContext.removePreloadScript(w);
    }
    async exposeFunction(w, D) {
      return await this.mainFrame().exposeFunction(w, "default" in D ? D.default : D);
    }
    isDragInterceptionEnabled() {
      return !1;
    }
    async setCacheEnabled(w) {
      if (!s(this, o).browser().cdpSupported) {
        await s(this, a).browsingContext.setCacheBehavior(w ? "default" : "bypass");
        return;
      }
      await this._client().send("Network.setCacheDisabled", {
        cacheDisabled: !w
      });
    }
    async cookies(...w) {
      const D = (w.length ? w : [this.url()]).map((y) => new URL(y));
      return (await s(this, a).browsingContext.getCookies()).map((y) => qm(y)).filter((y) => D.some((k) => IC(y, k)));
    }
    isServiceWorkerBypassed() {
      throw new q();
    }
    target() {
      throw new q();
    }
    async waitForFileChooser(w = {}) {
      const { timeout: D = this._timeoutSettings.timeout() } = w, S = Jl.create({
        message: `Waiting for \`FileChooser\` failed: ${D}ms exceeded`,
        timeout: D
      });
      s(this, h).add(S), w.signal && w.signal.addEventListener("abort", () => {
        var y;
        S.reject((y = w.signal) == null ? void 0 : y.reason);
      }, { once: !0 }), s(this, a).browsingContext.once("filedialogopened", (y) => {
        if (!y.element)
          return;
        const k = new Jg(Oi.from({
          sharedId: y.element.sharedId,
          handle: y.element.handle,
          type: "node"
        }, s(this, a).mainRealm()), y.multiple);
        for (const B of s(this, h))
          B.resolve(k), s(this, h).delete(B);
      });
      try {
        return await S.valueOrThrow();
      } catch (y) {
        throw s(this, h).delete(S), y;
      }
    }
    workers() {
      return [...s(this, p)];
    }
    get isNetworkInterceptionEnabled() {
      return !!s(this, E) || !!s(this, P);
    }
    async setRequestInterception(w) {
      f(this, E, await m(this, g, zl).call(this, [
        "beforeRequestSent"
        /* Bidi.Network.InterceptPhase.BeforeRequestSent */
      ], s(this, E), w));
    }
    /**
     * @internal
     */
    async setExtraHTTPHeaders(w) {
      await s(this, a).browsingContext.setExtraHTTPHeaders(w);
    }
    async authenticate(w) {
      f(this, P, await m(this, g, zl).call(this, [
        "authRequired"
        /* Bidi.Network.InterceptPhase.AuthRequired */
      ], s(this, P), !!w)), this._credentials = w;
    }
    setDragInterception() {
      throw new q();
    }
    setBypassServiceWorker() {
      throw new q();
    }
    async setOfflineMode(w) {
      return s(this, o).browser().cdpSupported ? (s(this, d) || f(this, d, {
        offline: !1,
        upload: -1,
        download: -1,
        latency: 0
      }), s(this, d).offline = w, await m(this, g, Wl).call(this)) : await s(this, a).browsingContext.setOfflineMode(w);
    }
    async emulateNetworkConditions(w) {
      if (!s(this, o).browser().cdpSupported) {
        if (!(w != null && w.offline) && (((w == null ? void 0 : w.upload) ?? -1) >= 0 || ((w == null ? void 0 : w.download) ?? -1) >= 0 || ((w == null ? void 0 : w.latency) ?? 0) > 0))
          throw new q();
        return await s(this, a).browsingContext.setOfflineMode((w == null ? void 0 : w.offline) ?? !1);
      }
      return s(this, d) || f(this, d, {
        offline: (w == null ? void 0 : w.offline) ?? !1,
        upload: -1,
        download: -1,
        latency: 0
      }), s(this, d).upload = w ? w.upload : -1, s(this, d).download = w ? w.download : -1, s(this, d).latency = w ? w.latency : 0, s(this, d).offline = (w == null ? void 0 : w.offline) ?? !1, await m(this, g, Wl).call(this);
    }
    async setCookie(...w) {
      const D = this.url(), S = D.startsWith("http");
      for (const y of w) {
        let k = y.url || "";
        !k && S && (k = D), Xe(k !== "about:blank", `Blank page can not have cookie "${y.name}"`), Xe(!String.prototype.startsWith.call(k || "", "data:"), `Data URL page can not have cookie "${y.name}"`), Xe(y.partitionKey === void 0 || typeof y.partitionKey == "string", "BiDi only allows domain partition keys");
        const B = URL.canParse(k) ? new URL(k) : void 0, $ = y.domain ?? (B == null ? void 0 : B.hostname);
        Xe($ !== void 0, "At least one of the url and domain needs to be specified");
        const W = {
          domain: $,
          name: y.name,
          value: {
            type: "string",
            value: y.value
          },
          ...y.path !== void 0 ? { path: y.path } : {},
          ...y.httpOnly !== void 0 ? { httpOnly: y.httpOnly } : {},
          ...y.secure !== void 0 ? { secure: y.secure } : {},
          ...y.sameSite !== void 0 ? { sameSite: zm(y.sameSite) } : {},
          expiry: Wm(y.expires),
          // Chrome-specific properties.
          ...Hm(y, "sameParty", "sourceScheme", "priority", "url")
        };
        y.partitionKey !== void 0 ? await this.browserContext().userContext.setCookie(W, y.partitionKey) : await s(this, a).browsingContext.setCookie(W);
      }
    }
    async deleteCookie(...w) {
      await Promise.all(w.map(async (D) => {
        const S = D.url ?? this.url(), y = URL.canParse(S) ? new URL(S) : void 0, k = D.domain ?? (y == null ? void 0 : y.hostname);
        Xe(k !== void 0, "At least one of the url and domain needs to be specified");
        const B = {
          domain: k,
          name: D.name,
          ...D.path !== void 0 ? { path: D.path } : {}
        };
        await s(this, a).browsingContext.deleteCookie(B);
      }));
    }
    async removeExposedFunction(w) {
      await s(this, a).removeExposedFunction(w);
    }
    metrics() {
      throw new q();
    }
    async captureHeapSnapshot(w) {
      throw new q();
    }
    async goBack(w = {}) {
      return await m(this, g, Kl).call(this, -1, w);
    }
    async goForward(w = {}) {
      return await m(this, g, Kl).call(this, 1, w);
    }
    async waitForDevicePrompt(w = {}) {
      return await this.mainFrame().waitForDevicePrompt(w);
    }
    get bluetooth() {
      return this.mainFrame().browsingContext.bluetooth;
    }
  }, n = new WeakMap(), o = new WeakMap(), a = new WeakMap(), c = new WeakMap(), p = new WeakMap(), l = new WeakMap(), d = new WeakMap(), h = new WeakMap(), g = new WeakSet(), Lm = function() {
    s(this, a).browsingContext.on("closed", () => {
      this.trustedEmitter.emit("close", void 0), this.trustedEmitter.removeAllListeners();
    }), this.trustedEmitter.on("workercreated", (w) => {
      s(this, p).add(w);
    }), this.trustedEmitter.on("workerdestroyed", (w) => {
      s(this, p).delete(w);
    });
  }, E = new WeakMap(), P = new WeakMap(), zl = async function(w, D, S) {
    if (S && !D)
      return await s(this, a).browsingContext.addIntercept({
        phases: w
      });
    if (!S && D) {
      await s(this, a).browsingContext.userContext.browser.removeIntercept(D);
      return;
    }
    return D;
  }, Wl = async function() {
    s(this, d) && await this._client().send("Network.emulateNetworkConditions", {
      offline: s(this, d).offline,
      latency: s(this, d).latency,
      uploadThroughput: s(this, d).upload,
      downloadThroughput: s(this, d).download
    });
  }, Kl = async function(w, D) {
    const S = new AbortController();
    try {
      const [y] = await Promise.all([
        this.waitForNavigation({
          ...D,
          signal: S.signal
        }),
        s(this, a).browsingContext.traverseHistory(w)
      ]);
      return y;
    } catch (y) {
      throw S.abort(), y;
    }
  }, (() => {
    const w = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
    e = [Iu()], xC(v, null, e, { kind: "accessor", name: "trustedEmitter", static: !1, private: !1, access: { has: (D) => "trustedEmitter" in D, get: (D) => D.trustedEmitter, set: (D, S) => {
      D.trustedEmitter = S;
    } }, metadata: w }, t, r), w && Object.defineProperty(v, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: w });
  })(), v;
})();
function EC(i, ...e) {
  return `() => {${Yg(i, ...e)}}`;
}
function SC(i, e) {
  const t = i.domain.toLowerCase(), r = e.hostname.toLowerCase();
  return t === r ? !0 : t.startsWith(".") && r.endsWith(t);
}
function PC(i, e) {
  const t = e.pathname, r = i.path;
  return !!(t === r || t.startsWith(r) && (r.endsWith("/") || t[r.length] === "/"));
}
function IC(i, e) {
  const t = new URL(e);
  return Xe(i !== void 0), SC(i, t) ? PC(i, t) : !1;
}
function qm(i, e = !1) {
  const t = i[Gc + "partitionKey"];
  function r() {
    return typeof t == "string" ? { partitionKey: t } : typeof t == "object" && t !== null ? e ? {
      partitionKey: {
        sourceOrigin: t.topLevelSite,
        hasCrossSiteAncestor: t.hasCrossSiteAncestor ?? !1
      }
    } : {
      // TODO: a breaking change in Puppeteer is required to change
      // partitionKey type and report the composite partition key.
      partitionKey: t.topLevelSite
    } : {};
  }
  return {
    name: i.name,
    // Presents binary value as base64 string.
    value: i.value.value,
    domain: i.domain,
    path: i.path,
    size: i.size,
    httpOnly: i.httpOnly,
    secure: i.secure,
    sameSite: kC(i.sameSite),
    expires: i.expiry ?? -1,
    session: i.expiry === void 0 || i.expiry <= 0,
    // Extending with CDP-specific properties with `goog:` prefix.
    ..._C(i, "sameParty", "sourceScheme", "partitionKeyOpaque", "priority"),
    ...r()
  };
}
const Gc = "goog:";
function _C(i, ...e) {
  const t = {};
  for (const r of e)
    i[Gc + r] !== void 0 && (t[r] = i[Gc + r]);
  return t.sameParty || (t.sameParty = !1), t;
}
function Hm(i, ...e) {
  const t = {};
  for (const r of e)
    i[r] !== void 0 && (t[Gc + r] = i[r]);
  return t;
}
function kC(i) {
  switch (i) {
    case "strict":
      return "Strict";
    case "lax":
      return "Lax";
    case "none":
      return "None";
    default:
      return "Default";
  }
}
function zm(i) {
  switch (i) {
    case "Strict":
      return "strict";
    case "Lax":
      return "lax";
    case "None":
      return "none";
    default:
      return "default";
  }
}
function Wm(i) {
  return [void 0, -1].includes(i) ? void 0 : i;
}
function TC(i) {
  if (i === void 0 || typeof i == "string")
    return i;
  if (i.hasCrossSiteAncestor)
    throw new q("WebDriver BiDi does not support `hasCrossSiteAncestor` yet.");
  return i.sourceOrigin;
}
/**
 * @license
 * Copyright 2023 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var Ti;
class DC extends _u {
  constructor(t) {
    super();
    u(this, Ti);
    f(this, Ti, t);
  }
  asPage() {
    throw new q();
  }
  url() {
    return "";
  }
  createCDPSession() {
    throw new q();
  }
  type() {
    return ku.BROWSER;
  }
  browser() {
    return s(this, Ti);
  }
  browserContext() {
    return s(this, Ti).defaultBrowserContext();
  }
  opener() {
    throw new q();
  }
}
Ti = new WeakMap();
var is;
class NC extends _u {
  constructor(t) {
    super();
    u(this, is);
    f(this, is, t);
  }
  async page() {
    return s(this, is);
  }
  async asPage() {
    return Vc.from(this.browserContext(), s(this, is).mainFrame().browsingContext);
  }
  url() {
    return s(this, is).url();
  }
  createCDPSession() {
    return s(this, is).createCDPSession();
  }
  type() {
    return ku.PAGE;
  }
  browser() {
    return this.browserContext().browser();
  }
  browserContext() {
    return s(this, is).browserContext();
  }
  opener() {
    throw new q();
  }
}
is = new WeakMap();
var os, Di;
class OC extends _u {
  constructor(t) {
    super();
    u(this, os);
    u(this, Di);
    f(this, os, t);
  }
  async page() {
    return s(this, Di) === void 0 && f(this, Di, Vc.from(this.browserContext(), s(this, os).browsingContext)), s(this, Di);
  }
  async asPage() {
    return Vc.from(this.browserContext(), s(this, os).browsingContext);
  }
  url() {
    return s(this, os).url();
  }
  createCDPSession() {
    return s(this, os).createCDPSession();
  }
  type() {
    return ku.PAGE;
  }
  browser() {
    return this.browserContext().browser();
  }
  browserContext() {
    return s(this, os).page().browserContext();
  }
  opener() {
    throw new q();
  }
}
os = new WeakMap(), Di = new WeakMap();
var Ni;
class RC extends _u {
  constructor(t) {
    super();
    u(this, Ni);
    f(this, Ni, t);
  }
  async page() {
    throw new q();
  }
  async asPage() {
    throw new q();
  }
  url() {
    return s(this, Ni).url();
  }
  createCDPSession() {
    throw new q();
  }
  type() {
    return ku.OTHER;
  }
  browser() {
    return this.browserContext().browser();
  }
  browserContext() {
    return s(this, Ni).frame.page().browserContext();
  }
  opener() {
    throw new q();
  }
}
Ni = new WeakMap();
/**
 * @license
 * Copyright 2022 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var AC = function(i, e, t, r, n, o) {
  function a(b) {
    if (b !== void 0 && typeof b != "function") throw new TypeError("Function expected");
    return b;
  }
  for (var c = r.kind, p = c === "getter" ? "get" : c === "setter" ? "set" : "value", l = !e && i ? r.static ? i : i.prototype : null, d = e || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), h, g = !1, x = t.length - 1; x >= 0; x--) {
    var E = {};
    for (var P in r) E[P] = P === "access" ? {} : r[P];
    for (var P in r.access) E.access[P] = r.access[P];
    E.addInitializer = function(b) {
      if (g) throw new TypeError("Cannot add initializers after decoration has completed");
      o.push(a(b || null));
    };
    var C = (0, t[x])(c === "accessor" ? { get: d.get, set: d.set } : d[p], E);
    if (c === "accessor") {
      if (C === void 0) continue;
      if (C === null || typeof C != "object") throw new TypeError("Object expected");
      (h = a(C.get)) && (d.get = h), (h = a(C.set)) && (d.set = h), (h = a(C.init)) && n.unshift(h);
    } else (h = a(C)) && (c === "field" ? n.unshift(h) : d[p] = h);
  }
  l && Object.defineProperty(l, r.name, d), g = !0;
}, fp = function(i, e, t) {
  for (var r = arguments.length > 2, n = 0; n < e.length; n++)
    t = r ? e[n].call(i, t) : e[n].call(i);
  return r ? t : void 0;
}, BC = function(i, e, t) {
  if (e != null) {
    if (typeof e != "object" && typeof e != "function") throw new TypeError("Object expected.");
    var r, n;
    if (t) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      r = e[Symbol.asyncDispose];
    }
    if (r === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      r = e[Symbol.dispose], t && (n = r);
    }
    if (typeof r != "function") throw new TypeError("Object not disposable.");
    n && (r = function() {
      try {
        n.call(this);
      } catch (o) {
        return Promise.reject(o);
      }
    }), i.stack.push({ value: e, dispose: r, async: t });
  } else t && i.stack.push({ async: !0 });
  return e;
}, FC = /* @__PURE__ */ function(i) {
  return function(e) {
    function t(a) {
      e.error = e.hasError ? new i(a, e.error, "An error was suppressed during disposal.") : a, e.hasError = !0;
    }
    var r, n = 0;
    function o() {
      for (; r = e.stack.pop(); )
        try {
          if (!r.async && n === 1) return n = 0, e.stack.push(r), Promise.resolve().then(o);
          if (r.dispose) {
            var a = r.dispose.call(r.value);
            if (r.async) return n |= 2, Promise.resolve(a).then(o, function(c) {
              return t(c), o();
            });
          } else n |= 1;
        } catch (c) {
          t(c);
        }
      if (n === 1) return e.hasError ? Promise.reject(e.error) : Promise.resolve();
      if (e.hasError) throw e.error;
    }
    return o();
  };
}(typeof SuppressedError == "function" ? SuppressedError : function(i, e, t) {
  var r = new Error(t);
  return r.name = "SuppressedError", r.error = i, r.suppressed = e, r;
});
let MC = (() => {
  var n, o, a, c, p, l, d, Km, Vl, x;
  let i = Zg, e, t = [], r = [];
  return x = class extends i {
    constructor(C, b, N) {
      super();
      u(this, d);
      u(this, n, fp(this, t, new Z()));
      u(this, o, fp(this, r));
      u(this, a);
      // This is public because of cookies.
      O(this, "userContext");
      u(this, c, /* @__PURE__ */ new WeakMap());
      u(this, p, /* @__PURE__ */ new Map());
      u(this, l, []);
      f(this, o, C), this.userContext = b, f(this, a, N.defaultViewport);
    }
    static from(C, b, N) {
      var T;
      const v = new x(C, b, N);
      return m(T = v, d, Km).call(T), v;
    }
    get trustedEmitter() {
      return s(this, n);
    }
    set trustedEmitter(C) {
      f(this, n, C);
    }
    targets() {
      return [...s(this, p).values()].flatMap(([C, b]) => [C, ...b.values()]);
    }
    async newPage(C) {
      const b = { stack: [], error: void 0, hasError: !1 };
      try {
        const N = BC(b, await this.waitForScreenshotOperations(), !1), v = (C == null ? void 0 : C.type) === "window" ? "window" : "tab", T = await this.userContext.createBrowsingContext(v, {
          background: C == null ? void 0 : C.background
        }), R = s(this, c).get(T);
        if (!R)
          throw new Error("Page is not found");
        if (s(this, a))
          try {
            await R.setViewport(s(this, a));
          } catch (w) {
            Ee(w);
          }
        if ((C == null ? void 0 : C.type) === "window" && (C == null ? void 0 : C.windowBounds) !== void 0)
          try {
            await this.browser().setWindowBounds(T.windowId, C.windowBounds);
          } catch (w) {
            Ee(w);
          }
        return R;
      } catch (N) {
        b.error = N, b.hasError = !0;
      } finally {
        FC(b);
      }
    }
    async close() {
      Xe(this.userContext.id !== Kc.DEFAULT, "Default BrowserContext cannot be closed!");
      try {
        await this.userContext.remove();
      } catch (C) {
        Ee(C);
      }
      s(this, p).clear();
    }
    browser() {
      return s(this, o);
    }
    async pages(C = !1) {
      return [...this.userContext.browsingContexts].map((b) => s(this, c).get(b));
    }
    async overridePermissions(C, b) {
      const N = new Set(b.map((v) => {
        if (!Th.get(v))
          throw new Error("Unknown permission: " + v);
        return v;
      }));
      await Promise.all(Array.from(Th.keys()).map((v) => {
        const T = this.userContext.setPermissions(
          C,
          {
            name: v
          },
          N.has(v) ? "granted" : "denied"
          /* Bidi.Permissions.PermissionState.Denied */
        );
        return s(this, l).push({ origin: C, permission: v }), N.has(v) ? T : T.catch(Ee);
      }));
    }
    async setPermission(C, ...b) {
      if (C === "*")
        throw new q("Origin (*) is not supported by WebDriver BiDi");
      await Promise.all(b.map((N) => {
        if (N.permission.allowWithoutSanitization)
          throw new q("allowWithoutSanitization is not supported by WebDriver BiDi");
        if (N.permission.panTiltZoom)
          throw new q("panTiltZoom is not supported by WebDriver BiDi");
        if (N.permission.userVisibleOnly)
          throw new q("userVisibleOnly is not supported by WebDriver BiDi");
        return this.userContext.setPermissions(C, {
          name: N.permission.name
        }, N.state);
      }));
    }
    async clearPermissionOverrides() {
      const C = s(this, l).map(({ permission: b, origin: N }) => this.userContext.setPermissions(
        N,
        {
          name: b
        },
        "prompt"
        /* Bidi.Permissions.PermissionState.Prompt */
      ).catch(Ee));
      f(this, l, []), await Promise.all(C);
    }
    get id() {
      if (this.userContext.id !== Kc.DEFAULT)
        return this.userContext.id;
    }
    async cookies() {
      return (await this.userContext.getCookies()).map((b) => qm(b, !0));
    }
    async setCookie(...C) {
      await Promise.all(C.map(async (b) => {
        const N = {
          domain: b.domain,
          name: b.name,
          value: {
            type: "string",
            value: b.value
          },
          ...b.path !== void 0 ? { path: b.path } : {},
          ...b.httpOnly !== void 0 ? { httpOnly: b.httpOnly } : {},
          ...b.secure !== void 0 ? { secure: b.secure } : {},
          ...b.sameSite !== void 0 ? { sameSite: zm(b.sameSite) } : {},
          expiry: Wm(b.expires),
          // Chrome-specific properties.
          ...Hm(b, "sameParty", "sourceScheme", "priority", "url")
        };
        return await this.userContext.setCookie(N, TC(b.partitionKey));
      }));
    }
  }, n = new WeakMap(), o = new WeakMap(), a = new WeakMap(), c = new WeakMap(), p = new WeakMap(), l = new WeakMap(), d = new WeakSet(), Km = function() {
    for (const C of this.userContext.browsingContexts)
      m(this, d, Vl).call(this, C);
    this.userContext.on("browsingcontext", ({ browsingContext: C }) => {
      const b = m(this, d, Vl).call(this, C);
      if (C.originalOpener)
        for (const N of this.userContext.browsingContexts)
          N.id === C.originalOpener && s(this, c).get(N).trustedEmitter.emit("popup", b);
    }), this.userContext.on("closed", () => {
      this.trustedEmitter.removeAllListeners();
    });
  }, Vl = function(C) {
    const b = Vc.from(this, C);
    s(this, c).set(C, b), b.trustedEmitter.on("close", () => {
      s(this, c).delete(C);
    });
    const N = new NC(b), v = /* @__PURE__ */ new Map();
    return s(this, p).set(b, [N, v]), b.trustedEmitter.on("frameattached", (T) => {
      const R = T, w = new OC(R);
      v.set(R, w), this.trustedEmitter.emit("targetcreated", w);
    }), b.trustedEmitter.on("framenavigated", (T) => {
      const R = T, w = v.get(R);
      w === void 0 ? this.trustedEmitter.emit("targetchanged", N) : this.trustedEmitter.emit("targetchanged", w);
    }), b.trustedEmitter.on("framedetached", (T) => {
      const R = T, w = v.get(R);
      w !== void 0 && (v.delete(R), this.trustedEmitter.emit("targetdestroyed", w));
    }), b.trustedEmitter.on("workercreated", (T) => {
      const R = T, w = new RC(R);
      v.set(R, w), this.trustedEmitter.emit("targetcreated", w);
    }), b.trustedEmitter.on("workerdestroyed", (T) => {
      const R = T, w = v.get(R);
      w !== void 0 && (v.delete(T), this.trustedEmitter.emit("targetdestroyed", w));
    }), b.trustedEmitter.on("close", () => {
      s(this, p).delete(b), this.trustedEmitter.emit("targetdestroyed", N);
    }), this.trustedEmitter.emit("targetcreated", N), b;
  }, (() => {
    const C = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
    e = [Iu()], AC(x, null, e, { kind: "accessor", name: "trustedEmitter", static: !1, private: !1, access: { has: (b) => "trustedEmitter" in b, get: (b) => b.trustedEmitter, set: (b, N) => {
      b.trustedEmitter = N;
    } }, metadata: C }, t, r), C && Object.defineProperty(x, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: C });
  })(), x;
})();
/**
 * @license
 * Copyright 2024 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var jC = function(i, e, t) {
  for (var r = arguments.length > 2, n = 0; n < e.length; n++)
    t = r ? e[n].call(i, t) : e[n].call(i);
  return r ? t : void 0;
}, xt = function(i, e, t, r, n, o) {
  function a(b) {
    if (b !== void 0 && typeof b != "function") throw new TypeError("Function expected");
    return b;
  }
  for (var c = r.kind, p = c === "getter" ? "get" : c === "setter" ? "set" : "value", l = !e && i ? r.static ? i : i.prototype : null, d = e || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), h, g = !1, x = t.length - 1; x >= 0; x--) {
    var E = {};
    for (var P in r) E[P] = P === "access" ? {} : r[P];
    for (var P in r.access) E.access[P] = r.access[P];
    E.addInitializer = function(b) {
      if (g) throw new TypeError("Cannot add initializers after decoration has completed");
      o.push(a(b || null));
    };
    var C = (0, t[x])(c === "accessor" ? { get: d.get, set: d.set } : d[p], E);
    if (c === "accessor") {
      if (C === void 0) continue;
      if (C === null || typeof C != "object") throw new TypeError("Object expected");
      (h = a(C.get)) && (d.get = h), (h = a(C.set)) && (d.set = h), (h = a(C.init)) && n.unshift(h);
    } else (h = a(C)) && (c === "field" ? n.unshift(h) : d[p] = h);
  }
  l && Object.defineProperty(l, r.name, d), g = !0;
}, UC = function(i, e, t) {
  if (e != null) {
    if (typeof e != "object" && typeof e != "function") throw new TypeError("Object expected.");
    var r, n;
    if (t) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      r = e[Symbol.asyncDispose];
    }
    if (r === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      r = e[Symbol.dispose], t && (n = r);
    }
    if (typeof r != "function") throw new TypeError("Object not disposable.");
    n && (r = function() {
      try {
        n.call(this);
      } catch (o) {
        return Promise.reject(o);
      }
    }), i.stack.push({ value: e, dispose: r, async: t });
  } else t && i.stack.push({ async: !0 });
  return e;
}, $C = /* @__PURE__ */ function(i) {
  return function(e) {
    function t(a) {
      e.error = e.hasError ? new i(a, e.error, "An error was suppressed during disposal.") : a, e.hasError = !0;
    }
    var r, n = 0;
    function o() {
      for (; r = e.stack.pop(); )
        try {
          if (!r.async && n === 1) return n = 0, e.stack.push(r), Promise.resolve().then(o);
          if (r.dispose) {
            var a = r.dispose.call(r.value);
            if (r.async) return n |= 2, Promise.resolve(a).then(o, function(c) {
              return t(c), o();
            });
          } else n |= 1;
        } catch (c) {
          t(c);
        }
      if (n === 1) return e.hasError ? Promise.reject(e.error) : Promise.resolve();
      if (e.hasError) throw e.error;
    }
    return o();
  };
}(typeof SuppressedError == "function" ? SuppressedError : function(i, e, t) {
  var r = new Error(t);
  return r.name = "SuppressedError", r.error = i, r.suppressed = e, r;
});
let LC = (() => {
  var g, x, E, P, C, b, Vm, Gm, Xm, Gl, w;
  let i = Z, e = [], t, r, n, o, a, c, p, l, d, h;
  return w = class extends i {
    constructor(y) {
      super();
      u(this, b);
      u(this, g, (jC(this, e), !1));
      u(this, x);
      u(this, E, new $t());
      u(this, P, /* @__PURE__ */ new Map());
      O(this, "session");
      u(this, C, /* @__PURE__ */ new Map());
      this.session = y;
    }
    static async from(y) {
      var B;
      const k = new w(y);
      return await m(B = k, b, Vm).call(B), k;
    }
    get closed() {
      return s(this, g);
    }
    get defaultUserContext() {
      return s(this, P).get(Kc.DEFAULT);
    }
    get disconnected() {
      return s(this, x) !== void 0;
    }
    get disposed() {
      return this.disconnected;
    }
    get userContexts() {
      return s(this, P).values();
    }
    dispose(y, k = !1) {
      f(this, g, k), f(this, x, y), this[pe]();
    }
    async close() {
      try {
        await this.session.send("browser.close", {});
      } finally {
        this.dispose("Browser already closed.", !0);
      }
    }
    async addPreloadScript(y, k = {}) {
      var $;
      const { result: { script: B } } = await this.session.send("script.addPreloadScript", {
        functionDeclaration: y,
        ...k,
        contexts: ($ = k.contexts) == null ? void 0 : $.map((W) => W.id)
      });
      return B;
    }
    async removeIntercept(y) {
      await this.session.send("network.removeIntercept", {
        intercept: y
      });
    }
    async removePreloadScript(y) {
      await this.session.send("script.removePreloadScript", {
        script: y
      });
    }
    async createUserContext(y) {
      var $, W, X;
      const k = y.proxyServer === void 0 ? void 0 : {
        proxyType: "manual",
        httpProxy: y.proxyServer,
        sslProxy: y.proxyServer,
        noProxy: y.proxyBypassList
      }, { result: { userContext: B } } = await this.session.send("browser.createUserContext", {
        proxy: k
      });
      if ((($ = y.downloadBehavior) == null ? void 0 : $.policy) === "allowAndName")
        throw new q("`allowAndName` is not supported in WebDriver BiDi");
      if (((W = y.downloadBehavior) == null ? void 0 : W.policy) === "allow") {
        if (y.downloadBehavior.downloadPath === void 0)
          throw new q("`downloadPath` is required in `allow` download behavior");
        await this.session.send("browser.setDownloadBehavior", {
          downloadBehavior: {
            type: "allowed",
            destinationFolder: y.downloadBehavior.downloadPath
          },
          userContexts: [B]
        });
      }
      return ((X = y.downloadBehavior) == null ? void 0 : X.policy) === "deny" && await this.session.send("browser.setDownloadBehavior", {
        downloadBehavior: { type: "denied" },
        userContexts: [B]
      }), m(this, b, Gl).call(this, B);
    }
    async installExtension(y) {
      const { result: { extension: k } } = await this.session.send("webExtension.install", {
        extensionData: { type: "path", path: y }
      });
      return k;
    }
    async uninstallExtension(y) {
      await this.session.send("webExtension.uninstall", { extension: y });
    }
    async setClientWindowState(y) {
      await this.session.send("browser.setClientWindowState", y);
    }
    async getClientWindowInfo(y) {
      const { result: { clientWindows: k } } = await this.session.send("browser.getClientWindows", {}), B = k.find(($) => $.clientWindow === y);
      if (!B)
        throw new Error("Window not found");
      return B;
    }
    [(t = [Ls], r = [L((y) => s(y, x))], n = [L((y) => s(y, x))], o = [L((y) => s(y, x))], a = [L((y) => s(y, x))], c = [L((y) => s(y, x))], p = [L((y) => s(y, x))], l = [L((y) => s(y, x))], d = [L((y) => s(y, x))], h = [L((y) => s(y, x))], pe)]() {
      s(this, x) ?? f(this, x, "Browser was disconnected, probably because the session ended."), this.closed && this.emit("closed", { reason: s(this, x) }), this.emit("disconnected", { reason: s(this, x) }), s(this, E).dispose(), super[pe]();
    }
  }, g = new WeakMap(), x = new WeakMap(), E = new WeakMap(), P = new WeakMap(), C = new WeakMap(), b = new WeakSet(), Vm = async function() {
    const y = s(this, E).use(new Z(this.session));
    y.once("ended", ({ reason: k }) => {
      this.dispose(k);
    }), y.on("script.realmCreated", (k) => {
      k.type === "shared-worker" && s(this, C).set(k.realm, Al.from(this, k.realm, k.origin));
    }), await m(this, b, Gm).call(this), await m(this, b, Xm).call(this);
  }, Gm = async function() {
    const { result: { userContexts: y } } = await this.session.send("browser.getUserContexts", {});
    for (const k of y)
      m(this, b, Gl).call(this, k.userContext);
  }, Xm = async function() {
    const y = /* @__PURE__ */ new Set();
    let k;
    {
      const B = { stack: [], error: void 0, hasError: !1 };
      try {
        UC(B, new Z(this.session), !1).on("browsingContext.contextCreated", (X) => {
          y.add(X.context);
        });
        const { result: W } = await this.session.send("browsingContext.getTree", {});
        k = W.contexts;
      } catch ($) {
        B.error = $, B.hasError = !0;
      } finally {
        $C(B);
      }
    }
    for (const B of k)
      y.has(B.context) || this.session.emit("browsingContext.contextCreated", B), B.children && k.push(...B.children);
  }, Gl = function(y) {
    const k = Kc.create(this, y);
    s(this, P).set(k.id, k);
    const B = s(this, E).use(new Z(k));
    return B.once("closed", () => {
      B.removeAllListeners(), s(this, P).delete(k.id);
    }), k;
  }, (() => {
    const y = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
    xt(w, null, t, { kind: "method", name: "dispose", static: !1, private: !1, access: { has: (k) => "dispose" in k, get: (k) => k.dispose }, metadata: y }, null, e), xt(w, null, r, { kind: "method", name: "close", static: !1, private: !1, access: { has: (k) => "close" in k, get: (k) => k.close }, metadata: y }, null, e), xt(w, null, n, { kind: "method", name: "addPreloadScript", static: !1, private: !1, access: { has: (k) => "addPreloadScript" in k, get: (k) => k.addPreloadScript }, metadata: y }, null, e), xt(w, null, o, { kind: "method", name: "removeIntercept", static: !1, private: !1, access: { has: (k) => "removeIntercept" in k, get: (k) => k.removeIntercept }, metadata: y }, null, e), xt(w, null, a, { kind: "method", name: "removePreloadScript", static: !1, private: !1, access: { has: (k) => "removePreloadScript" in k, get: (k) => k.removePreloadScript }, metadata: y }, null, e), xt(w, null, c, { kind: "method", name: "createUserContext", static: !1, private: !1, access: { has: (k) => "createUserContext" in k, get: (k) => k.createUserContext }, metadata: y }, null, e), xt(w, null, p, { kind: "method", name: "installExtension", static: !1, private: !1, access: { has: (k) => "installExtension" in k, get: (k) => k.installExtension }, metadata: y }, null, e), xt(w, null, l, { kind: "method", name: "uninstallExtension", static: !1, private: !1, access: { has: (k) => "uninstallExtension" in k, get: (k) => k.uninstallExtension }, metadata: y }, null, e), xt(w, null, d, { kind: "method", name: "setClientWindowState", static: !1, private: !1, access: { has: (k) => "setClientWindowState" in k, get: (k) => k.setClientWindowState }, metadata: y }, null, e), xt(w, null, h, { kind: "method", name: "getClientWindowInfo", static: !1, private: !1, access: { has: (k) => "getClientWindowInfo" in k, get: (k) => k.getClientWindowInfo }, metadata: y }, null, e), y && Object.defineProperty(w, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: y });
  })(), w;
})();
/**
 * @license
 * Copyright 2024 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var Rd = function(i, e, t) {
  for (var r = arguments.length > 2, n = 0; n < e.length; n++)
    t = r ? e[n].call(i, t) : e[n].call(i);
  return r ? t : void 0;
}, cn = function(i, e, t, r, n, o) {
  function a(b) {
    if (b !== void 0 && typeof b != "function") throw new TypeError("Function expected");
    return b;
  }
  for (var c = r.kind, p = c === "getter" ? "get" : c === "setter" ? "set" : "value", l = !e && i ? r.static ? i : i.prototype : null, d = e || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), h, g = !1, x = t.length - 1; x >= 0; x--) {
    var E = {};
    for (var P in r) E[P] = P === "access" ? {} : r[P];
    for (var P in r.access) E.access[P] = r.access[P];
    E.addInitializer = function(b) {
      if (g) throw new TypeError("Cannot add initializers after decoration has completed");
      o.push(a(b || null));
    };
    var C = (0, t[x])(c === "accessor" ? { get: d.get, set: d.set } : d[p], E);
    if (c === "accessor") {
      if (C === void 0) continue;
      if (C === null || typeof C != "object") throw new TypeError("Object expected");
      (h = a(C.get)) && (d.get = h), (h = a(C.set)) && (d.set = h), (h = a(C.init)) && n.unshift(h);
    } else (h = a(C)) && (c === "field" ? n.unshift(h) : d[p] = h);
  }
  l && Object.defineProperty(l, r.name, d), g = !0;
};
let qC = (() => {
  var d, h, g, x, E, Jm, C;
  let i = Z, e = [], t, r = [], n = [], o, a, c, p, l;
  return C = class extends i {
    constructor(v, T) {
      super();
      u(this, E);
      u(this, d, Rd(this, e));
      u(this, h, new $t());
      u(this, g);
      O(this, "browser");
      u(this, x, Rd(this, r, void 0));
      Rd(this, n), f(this, g, T), this.connection = v;
    }
    static async from(v, T) {
      var D;
      const { result: R } = await v.send("session.new", {
        capabilities: T
      }), w = new C(v, R);
      return await m(D = w, E, Jm).call(D), w;
    }
    get connection() {
      return s(this, x);
    }
    set connection(v) {
      f(this, x, v);
    }
    get capabilities() {
      return s(this, g).capabilities;
    }
    get disposed() {
      return this.ended;
    }
    get ended() {
      return s(this, d) !== void 0;
    }
    get id() {
      return s(this, g).sessionId;
    }
    dispose(v) {
      f(this, d, v), this[pe]();
    }
    /**
     * Currently, there is a 1:1 relationship between the session and the
     * session. In the future, we might support multiple sessions and in that
     * case we always needs to make sure that the session for the right session
     * object is used, so we implement this method here, although it's not defined
     * in the spec.
     */
    async send(v, T) {
      return await this.connection.send(v, T);
    }
    async subscribe(v, T) {
      await this.send("session.subscribe", {
        events: v,
        contexts: T
      });
    }
    async addIntercepts(v, T) {
      await this.send("session.subscribe", {
        events: v,
        contexts: T
      });
    }
    async end() {
      try {
        await this.send("session.end", {});
      } finally {
        this.dispose("Session already ended.");
      }
    }
    [(t = [Iu()], o = [Ls], a = [L((v) => s(v, d))], c = [L((v) => s(v, d))], p = [L((v) => s(v, d))], l = [L((v) => s(v, d))], pe)]() {
      s(this, d) ?? f(this, d, "Session already destroyed, probably because the connection broke."), this.emit("ended", { reason: s(this, d) }), s(this, h).dispose(), super[pe]();
    }
  }, d = new WeakMap(), h = new WeakMap(), g = new WeakMap(), x = new WeakMap(), E = new WeakSet(), Jm = async function() {
    this.browser = await LC.from(this), s(this, h).use(this.browser).once("closed", ({ reason: R }) => {
      this.dispose(R);
    });
    const T = /* @__PURE__ */ new WeakSet();
    this.on("browsingContext.fragmentNavigated", (R) => {
      T.has(R) || (T.add(R), this.emit("browsingContext.navigationStarted", R), this.emit("browsingContext.fragmentNavigated", R));
    });
  }, (() => {
    const v = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
    cn(C, null, t, { kind: "accessor", name: "connection", static: !1, private: !1, access: { has: (T) => "connection" in T, get: (T) => T.connection, set: (T, R) => {
      T.connection = R;
    } }, metadata: v }, r, n), cn(C, null, o, { kind: "method", name: "dispose", static: !1, private: !1, access: { has: (T) => "dispose" in T, get: (T) => T.dispose }, metadata: v }, null, e), cn(C, null, a, { kind: "method", name: "send", static: !1, private: !1, access: { has: (T) => "send" in T, get: (T) => T.send }, metadata: v }, null, e), cn(C, null, c, { kind: "method", name: "subscribe", static: !1, private: !1, access: { has: (T) => "subscribe" in T, get: (T) => T.subscribe }, metadata: v }, null, e), cn(C, null, p, { kind: "method", name: "addIntercepts", static: !1, private: !1, access: { has: (T) => "addIntercepts" in T, get: (T) => T.addIntercepts }, metadata: v }, null, e), cn(C, null, l, { kind: "method", name: "end", static: !1, private: !1, access: { has: (T) => "end" in T, get: (T) => T.end }, metadata: v }, null, e), v && Object.defineProperty(C, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: v });
  })(), C;
})();
/**
 * @license
 * Copyright 2022 Google Inc.
 * SPDX-License-Identifier: Apache-2.0
 */
var HC = function(i, e, t, r, n, o) {
  function a(b) {
    if (b !== void 0 && typeof b != "function") throw new TypeError("Function expected");
    return b;
  }
  for (var c = r.kind, p = c === "getter" ? "get" : c === "setter" ? "set" : "value", l = !e && i ? r.static ? i : i.prototype : null, d = e || (l ? Object.getOwnPropertyDescriptor(l, r.name) : {}), h, g = !1, x = t.length - 1; x >= 0; x--) {
    var E = {};
    for (var P in r) E[P] = P === "access" ? {} : r[P];
    for (var P in r.access) E.access[P] = r.access[P];
    E.addInitializer = function(b) {
      if (g) throw new TypeError("Cannot add initializers after decoration has completed");
      o.push(a(b || null));
    };
    var C = (0, t[x])(c === "accessor" ? { get: d.get, set: d.set } : d[p], E);
    if (c === "accessor") {
      if (C === void 0) continue;
      if (C === null || typeof C != "object") throw new TypeError("Object expected");
      (h = a(C.get)) && (d.get = h), (h = a(C.set)) && (d.set = h), (h = a(C.init)) && n.unshift(h);
    } else (h = a(C)) && (c === "field" ? n.unshift(h) : d[p] = h);
  }
  l && Object.defineProperty(l, r.name, d), g = !0;
}, mp = function(i, e, t) {
  for (var r = arguments.length > 2, n = 0; n < e.length; n++)
    t = r ? e[n].call(i, t) : e[n].call(i);
  return r ? t : void 0;
}, gp = function(i, e, t) {
  return typeof e == "symbol" && (e = e.description ? "[".concat(e.description, "]") : ""), Object.defineProperty(i, "name", { configurable: !0, value: t ? "".concat(t, " ", e) : e });
};
let YC = (() => {
  var o, a, c, Js, Ym, d, h, g, x, E, P, C, b, Zm, Qm, eg, Xl;
  let i = Qg, e, t = [], r = [], n;
  return o = class extends i {
    constructor(S, y) {
      super();
      u(this, c);
      O(this, "protocol", "webDriverBiDi");
      u(this, a, mp(this, t, new Z()));
      u(this, d, mp(this, r));
      u(this, h);
      u(this, g);
      u(this, x);
      u(this, E, /* @__PURE__ */ new WeakMap());
      u(this, P, new DC(this));
      u(this, C);
      u(this, b);
      f(this, d, y.process), f(this, h, y.closeCallback), f(this, g, S), f(this, x, y.defaultViewport), f(this, C, y.cdpConnection), f(this, b, y.networkEnabled);
    }
    static async create(S) {
      var B, $, W;
      const y = await qC.from(S.connection, {
        firstMatch: (B = S.capabilities) == null ? void 0 : B.firstMatch,
        alwaysMatch: {
          ...($ = S.capabilities) == null ? void 0 : $.alwaysMatch,
          // Capabilities that come from Puppeteer's API take precedence.
          acceptInsecureCerts: S.acceptInsecureCerts,
          unhandledPromptBehavior: {
            default: "ignore"
          },
          webSocketUrl: !0,
          // Puppeteer with WebDriver BiDi does not support prerendering
          // yet because WebDriver BiDi behavior is not specified. See
          // https://github.com/w3c/webdriver-bidi/issues/321.
          "goog:prerenderingDisabled": !0,
          // TODO: remove after Puppeteer rolled Chrome to 142 after Oct 28, 2025.
          "goog:disableNetworkDurableMessages": !0
        }
      });
      await y.subscribe((S.cdpConnection ? [...o.subscribeModules, ...o.subscribeCdpEvents] : o.subscribeModules).filter((X) => S.networkEnabled ? !0 : X !== "network" && X !== "goog:cdp.Network.requestWillBeSent")), await Promise.all([
        "request",
        "response"
        /* Bidi.Network.DataType.Response */
      ].map(
        // Data collectors might be not implemented for specific data type, so create them
        // separately and ignore protocol errors.
        async (X) => {
          try {
            await y.send("network.addDataCollector", {
              dataTypes: [X],
              // Buffer size of 20 MB is equivalent to the CDP:
              maxEncodedDataSize: 2e7
            });
          } catch (V) {
            if (V instanceof uo)
              Ee(V);
            else
              throw V;
          }
        }
      ));
      const k = new o(y.browser, S);
      return m(W = k, c, Zm).call(W), k;
    }
    get cdpSupported() {
      return s(this, C) !== void 0;
    }
    get cdpConnection() {
      return s(this, C);
    }
    async userAgent() {
      return s(this, g).session.capabilities.userAgent;
    }
    get connection() {
      return s(this, g).session.connection;
    }
    wsEndpoint() {
      return this.connection.url;
    }
    async close() {
      var S;
      if (!this.connection.closed)
        try {
          await s(this, g).close(), await ((S = s(this, h)) == null ? void 0 : S.call(null));
        } catch (y) {
          Ee(y);
        } finally {
          this.connection.dispose();
        }
    }
    get connected() {
      return !s(this, g).disconnected;
    }
    process() {
      return s(this, d) ?? null;
    }
    async createBrowserContext(S = {}) {
      const y = await s(this, g).createUserContext(S);
      return m(this, c, Xl).call(this, y);
    }
    async version() {
      return `${s(this, c, Qm)}/${s(this, c, eg)}`;
    }
    browserContexts() {
      return [...s(this, g).userContexts].map((S) => s(this, E).get(S));
    }
    defaultBrowserContext() {
      return s(this, E).get(s(this, g).defaultUserContext);
    }
    newPage(S) {
      return this.defaultBrowserContext().newPage(S);
    }
    installExtension(S) {
      return s(this, g).installExtension(S);
    }
    async uninstallExtension(S) {
      await s(this, g).uninstallExtension(S);
    }
    screens() {
      throw new q();
    }
    addScreen(S) {
      throw new q();
    }
    removeScreen(S) {
      throw new q();
    }
    async getWindowBounds(S) {
      const y = await s(this, g).getClientWindowInfo(S);
      return {
        left: y.x,
        top: y.y,
        width: y.width,
        height: y.height,
        windowState: y.state
      };
    }
    async setWindowBounds(S, y) {
      let k;
      const B = y.windowState ?? "normal";
      B === "normal" ? k = {
        clientWindow: S,
        state: "normal",
        x: y.left,
        y: y.top,
        width: y.width,
        height: y.height
      } : k = {
        clientWindow: S,
        state: B
      }, await s(this, g).setClientWindowState(k);
    }
    targets() {
      return [
        s(this, P),
        ...this.browserContexts().flatMap((S) => S.targets())
      ];
    }
    target() {
      return s(this, P);
    }
    async disconnect() {
      try {
        await s(this, g).session.end();
      } catch (S) {
        Ee(S);
      } finally {
        this.connection.dispose();
      }
    }
    get debugInfo() {
      return {
        pendingProtocolErrors: this.connection.getPendingProtocolErrors()
      };
    }
    isNetworkEnabled() {
      return s(this, b);
    }
  }, a = new WeakMap(), c = new WeakSet(), Js = function() {
    return n.get.call(this);
  }, Ym = function(S) {
    return n.set.call(this, S);
  }, d = new WeakMap(), h = new WeakMap(), g = new WeakMap(), x = new WeakMap(), E = new WeakMap(), P = new WeakMap(), C = new WeakMap(), b = new WeakMap(), Zm = function() {
    var S;
    for (const y of s(this, g).userContexts)
      m(this, c, Xl).call(this, y);
    s(this, g).once("disconnected", () => {
      s(this, c, Js).emit("disconnected", void 0), s(this, c, Js).removeAllListeners();
    }), (S = s(this, d)) == null || S.once("close", () => {
      s(this, g).dispose("Browser process exited.", !0), this.connection.dispose();
    });
  }, Qm = function() {
    return s(this, g).session.capabilities.browserName;
  }, eg = function() {
    return s(this, g).session.capabilities.browserVersion;
  }, Xl = function(S) {
    const y = MC.from(this, S, {
      defaultViewport: s(this, x)
    });
    return s(this, E).set(S, y), y.trustedEmitter.on("targetcreated", (k) => {
      s(this, c, Js).emit("targetcreated", k);
    }), y.trustedEmitter.on("targetchanged", (k) => {
      s(this, c, Js).emit("targetchanged", k);
    }), y.trustedEmitter.on("targetdestroyed", (k) => {
      s(this, c, Js).emit("targetdestroyed", k);
    }), y;
  }, (() => {
    const S = typeof Symbol == "function" && Symbol.metadata ? Object.create(i[Symbol.metadata] ?? null) : void 0;
    e = [Iu()], HC(o, n = { get: gp(function() {
      return s(this, a);
    }, "#trustedEmitter", "get"), set: gp(function(y) {
      f(this, a, y);
    }, "#trustedEmitter", "set") }, e, { kind: "accessor", name: "#trustedEmitter", static: !1, private: !0, access: { has: (y) => cc(c, y), get: (y) => s(y, c, Js), set: (y, k) => {
      f(y, c, k, Ym);
    } }, metadata: S }, t, r), S && Object.defineProperty(o, Symbol.metadata, { enumerable: !0, configurable: !0, writable: !0, value: S });
  })(), O(o, "subscribeModules", [
    "browsingContext",
    "network",
    "log",
    "script",
    "input"
  ]), O(o, "subscribeCdpEvents", [
    // Coverage
    "goog:cdp.Debugger.scriptParsed",
    "goog:cdp.CSS.styleSheetAdded",
    "goog:cdp.Runtime.executionContextsCleared",
    // Tracing
    "goog:cdp.Tracing.tracingComplete",
    // TODO: subscribe to all CDP events in the future.
    "goog:cdp.Network.requestWillBeSent",
    "goog:cdp.Debugger.scriptParsed",
    "goog:cdp.Page.screencastFrame"
  ]), o;
})();
export {
  YC as BidiBrowser,
  MC as BidiBrowserContext,
  Fb as BidiConnection,
  Oi as BidiElementHandle,
  fC as BidiFrame,
  Wr as BidiFrameRealm,
  Om as BidiHTTPRequest,
  ap as BidiHTTPResponse,
  Kr as BidiJSHandle,
  yC as BidiKeyboard,
  vC as BidiMouse,
  Vc as BidiPage,
  jm as BidiRealm,
  CC as BidiTouchscreen,
  Ll as BidiWorkerRealm,
  qm as bidiToPuppeteerCookie,
  Hm as cdpSpecificCookiePropertiesFromPuppeteerToBidi,
  JC as connectBidiOverCdp,
  Wm as convertCookiesExpiryCdpToBiDi,
  TC as convertCookiesPartitionKeyFromPuppeteerToBiDi,
  zm as convertCookiesSameSiteCdpToBiDi,
  Nm as requests
};
