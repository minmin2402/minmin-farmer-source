import { m as u, s as B } from "./main-ClVzSdHD.js";
import D from "net";
import G from "tls";
import J from "assert";
import T from "http";
import R from "https";
import K from "url";
function W(e, n) {
  for (var t = 0; t < n.length; t++) {
    const o = n[t];
    if (typeof o != "string" && !Array.isArray(o)) {
      for (const s in o)
        if (s !== "default" && !(s in e)) {
          const f = Object.getOwnPropertyDescriptor(o, s);
          f && Object.defineProperty(e, s, f.get ? f : {
            enumerable: !0,
            get: () => o[s]
          });
        }
    }
  }
  return Object.freeze(Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }));
}
var x = {}, I = {}, h = {}, Q = u && u.__createBinding || (Object.create ? function(e, n, t, o) {
  o === void 0 && (o = t);
  var s = Object.getOwnPropertyDescriptor(n, t);
  (!s || ("get" in s ? !n.__esModule : s.writable || s.configurable)) && (s = { enumerable: !0, get: function() {
    return n[t];
  } }), Object.defineProperty(e, o, s);
} : function(e, n, t, o) {
  o === void 0 && (o = t), e[o] = n[t];
}), V = u && u.__setModuleDefault || (Object.create ? function(e, n) {
  Object.defineProperty(e, "default", { enumerable: !0, value: n });
} : function(e, n) {
  e.default = n;
}), L = u && u.__importStar || function(e) {
  if (e && e.__esModule) return e;
  var n = {};
  if (e != null) for (var t in e) t !== "default" && Object.prototype.hasOwnProperty.call(e, t) && Q(n, e, t);
  return V(n, e), n;
};
Object.defineProperty(h, "__esModule", { value: !0 });
h.req = h.json = h.toBuffer = void 0;
const X = L(T), Y = L(R);
async function q(e) {
  let n = 0;
  const t = [];
  for await (const o of e)
    n += o.length, t.push(o);
  return Buffer.concat(t, n);
}
h.toBuffer = q;
async function Z(e) {
  const t = (await q(e)).toString("utf8");
  try {
    return JSON.parse(t);
  } catch (o) {
    const s = o;
    throw s.message += ` (input: ${t})`, s;
  }
}
h.json = Z;
function ee(e, n = {}) {
  const o = ((typeof e == "string" ? e : e.href).startsWith("https:") ? Y : X).request(e, n), s = new Promise((f, d) => {
    o.once("response", f).once("error", d).end();
  });
  return o.then = s.then.bind(s), o;
}
h.req = ee;
(function(e) {
  var n = u && u.__createBinding || (Object.create ? function(c, r, i, a) {
    a === void 0 && (a = i);
    var l = Object.getOwnPropertyDescriptor(r, i);
    (!l || ("get" in l ? !r.__esModule : l.writable || l.configurable)) && (l = { enumerable: !0, get: function() {
      return r[i];
    } }), Object.defineProperty(c, a, l);
  } : function(c, r, i, a) {
    a === void 0 && (a = i), c[a] = r[i];
  }), t = u && u.__setModuleDefault || (Object.create ? function(c, r) {
    Object.defineProperty(c, "default", { enumerable: !0, value: r });
  } : function(c, r) {
    c.default = r;
  }), o = u && u.__importStar || function(c) {
    if (c && c.__esModule) return c;
    var r = {};
    if (c != null) for (var i in c) i !== "default" && Object.prototype.hasOwnProperty.call(c, i) && n(r, c, i);
    return t(r, c), r;
  }, s = u && u.__exportStar || function(c, r) {
    for (var i in c) i !== "default" && !Object.prototype.hasOwnProperty.call(r, i) && n(r, c, i);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.Agent = void 0;
  const f = o(D), d = o(T), y = R;
  s(h, e);
  const p = Symbol("AgentBaseInternalState");
  class _ extends d.Agent {
    constructor(r) {
      super(r), this[p] = {};
    }
    /**
     * Determine whether this is an `http` or `https` request.
     */
    isSecureEndpoint(r) {
      if (r) {
        if (typeof r.secureEndpoint == "boolean")
          return r.secureEndpoint;
        if (typeof r.protocol == "string")
          return r.protocol === "https:";
      }
      const { stack: i } = new Error();
      return typeof i != "string" ? !1 : i.split(`
`).some((a) => a.indexOf("(https.js:") !== -1 || a.indexOf("node:https:") !== -1);
    }
    // In order to support async signatures in `connect()` and Node's native
    // connection pooling in `http.Agent`, the array of sockets for each origin
    // has to be updated synchronously. This is so the length of the array is
    // accurate when `addRequest()` is next called. We achieve this by creating a
    // fake socket and adding it to `sockets[origin]` and incrementing
    // `totalSocketCount`.
    incrementSockets(r) {
      if (this.maxSockets === 1 / 0 && this.maxTotalSockets === 1 / 0)
        return null;
      this.sockets[r] || (this.sockets[r] = []);
      const i = new f.Socket({ writable: !1 });
      return this.sockets[r].push(i), this.totalSocketCount++, i;
    }
    decrementSockets(r, i) {
      if (!this.sockets[r] || i === null)
        return;
      const a = this.sockets[r], l = a.indexOf(i);
      l !== -1 && (a.splice(l, 1), this.totalSocketCount--, a.length === 0 && delete this.sockets[r]);
    }
    // In order to properly update the socket pool, we need to call `getName()` on
    // the core `https.Agent` if it is a secureEndpoint.
    getName(r) {
      return this.isSecureEndpoint(r) ? y.Agent.prototype.getName.call(this, r) : super.getName(r);
    }
    createSocket(r, i, a) {
      const l = {
        ...i,
        secureEndpoint: this.isSecureEndpoint(i)
      }, v = this.getName(l), S = this.incrementSockets(v);
      Promise.resolve().then(() => this.connect(r, l)).then((g) => {
        if (this.decrementSockets(v, S), g instanceof d.Agent)
          try {
            return g.addRequest(r, l);
          } catch (b) {
            return a(b);
          }
        this[p].currentSocket = g, super.createSocket(r, i, a);
      }, (g) => {
        this.decrementSockets(v, S), a(g);
      });
    }
    createConnection() {
      const r = this[p].currentSocket;
      if (this[p].currentSocket = void 0, !r)
        throw new Error("No socket was returned in the `connect()` function");
      return r;
    }
    get defaultPort() {
      return this[p].defaultPort ?? (this.protocol === "https:" ? 443 : 80);
    }
    set defaultPort(r) {
      this[p] && (this[p].defaultPort = r);
    }
    get protocol() {
      return this[p].protocol ?? (this.isSecureEndpoint() ? "https:" : "http:");
    }
    set protocol(r) {
      this[p] && (this[p].protocol = r);
    }
  }
  e.Agent = _;
})(I);
var j = {}, te = u && u.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(j, "__esModule", { value: !0 });
j.parseProxyResponse = void 0;
const re = te(B), w = (0, re.default)("https-proxy-agent:parse-proxy-response");
function ne(e) {
  return new Promise((n, t) => {
    let o = 0;
    const s = [];
    function f() {
      const c = e.read();
      c ? _(c) : e.once("readable", f);
    }
    function d() {
      e.removeListener("end", y), e.removeListener("error", p), e.removeListener("readable", f);
    }
    function y() {
      d(), w("onend"), t(new Error("Proxy connection ended before receiving CONNECT response"));
    }
    function p(c) {
      d(), w("onerror %o", c), t(c);
    }
    function _(c) {
      s.push(c), o += c.length;
      const r = Buffer.concat(s, o), i = r.indexOf(`\r
\r
`);
      if (i === -1) {
        w("have not received end of HTTP headers yet..."), f();
        return;
      }
      const a = r.slice(0, i).toString("ascii").split(`\r
`), l = a.shift();
      if (!l)
        return e.destroy(), t(new Error("No header received from proxy CONNECT response"));
      const v = l.split(" "), S = +v[1], g = v.slice(2).join(" "), b = {};
      for (const O of a) {
        if (!O)
          continue;
        const C = O.indexOf(":");
        if (C === -1)
          return e.destroy(), t(new Error(`Invalid header from proxy CONNECT response: "${O}"`));
        const A = O.slice(0, C).toLowerCase(), E = O.slice(C + 1).trimStart(), m = b[A];
        typeof m == "string" ? b[A] = [m, E] : Array.isArray(m) ? m.push(E) : b[A] = E;
      }
      w("got proxy server response: %o %o", l, b), d(), n({
        connect: {
          statusCode: S,
          statusText: g,
          headers: b
        },
        buffered: r
      });
    }
    e.on("error", p), e.on("end", y), f();
  });
}
j.parseProxyResponse = ne;
var oe = u && u.__createBinding || (Object.create ? function(e, n, t, o) {
  o === void 0 && (o = t);
  var s = Object.getOwnPropertyDescriptor(n, t);
  (!s || ("get" in s ? !n.__esModule : s.writable || s.configurable)) && (s = { enumerable: !0, get: function() {
    return n[t];
  } }), Object.defineProperty(e, o, s);
} : function(e, n, t, o) {
  o === void 0 && (o = t), e[o] = n[t];
}), se = u && u.__setModuleDefault || (Object.create ? function(e, n) {
  Object.defineProperty(e, "default", { enumerable: !0, value: n });
} : function(e, n) {
  e.default = n;
}), k = u && u.__importStar || function(e) {
  if (e && e.__esModule) return e;
  var n = {};
  if (e != null) for (var t in e) t !== "default" && Object.prototype.hasOwnProperty.call(e, t) && oe(n, e, t);
  return se(n, e), n;
}, U = u && u.__importDefault || function(e) {
  return e && e.__esModule ? e : { default: e };
};
Object.defineProperty(x, "__esModule", { value: !0 });
var z = x.HttpsProxyAgent = void 0;
const $ = k(D), N = k(G), ie = U(J), ce = U(B), ue = I, ae = K, fe = j, P = (0, ce.default)("https-proxy-agent"), M = (e) => e.servername === void 0 && e.host && !$.isIP(e.host) ? {
  ...e,
  servername: e.host
} : e;
class F extends ue.Agent {
  constructor(n, t) {
    super(t), this.options = { path: void 0 }, this.proxy = typeof n == "string" ? new ae.URL(n) : n, this.proxyHeaders = (t == null ? void 0 : t.headers) ?? {}, P("Creating new HttpsProxyAgent instance: %o", this.proxy.href);
    const o = (this.proxy.hostname || this.proxy.host).replace(/^\[|\]$/g, ""), s = this.proxy.port ? parseInt(this.proxy.port, 10) : this.proxy.protocol === "https:" ? 443 : 80;
    this.connectOpts = {
      // Attempt to negotiate http/1.1 for proxy servers that support http/2
      ALPNProtocols: ["http/1.1"],
      ...t ? H(t, "headers") : null,
      host: o,
      port: s
    };
  }
  /**
   * Called when the node-core HTTP client library is creating a
   * new HTTP request.
   */
  async connect(n, t) {
    const { proxy: o } = this;
    if (!t.host)
      throw new TypeError('No "host" provided');
    let s;
    o.protocol === "https:" ? (P("Creating `tls.Socket`: %o", this.connectOpts), s = N.connect(M(this.connectOpts))) : (P("Creating `net.Socket`: %o", this.connectOpts), s = $.connect(this.connectOpts));
    const f = typeof this.proxyHeaders == "function" ? this.proxyHeaders() : { ...this.proxyHeaders }, d = $.isIPv6(t.host) ? `[${t.host}]` : t.host;
    let y = `CONNECT ${d}:${t.port} HTTP/1.1\r
`;
    if (o.username || o.password) {
      const i = `${decodeURIComponent(o.username)}:${decodeURIComponent(o.password)}`;
      f["Proxy-Authorization"] = `Basic ${Buffer.from(i).toString("base64")}`;
    }
    f.Host = `${d}:${t.port}`, f["Proxy-Connection"] || (f["Proxy-Connection"] = this.keepAlive ? "Keep-Alive" : "close");
    for (const i of Object.keys(f))
      y += `${i}: ${f[i]}\r
`;
    const p = (0, fe.parseProxyResponse)(s);
    s.write(`${y}\r
`);
    const { connect: _, buffered: c } = await p;
    if (n.emit("proxyConnect", _), this.emit("proxyConnect", _, n), _.statusCode === 200)
      return n.once("socket", le), t.secureEndpoint ? (P("Upgrading socket connection to TLS"), N.connect({
        ...H(M(t), "host", "path", "port"),
        socket: s
      })) : s;
    s.destroy();
    const r = new $.Socket({ writable: !1 });
    return r.readable = !0, n.once("socket", (i) => {
      P("Replaying proxy buffer for failed request"), (0, ie.default)(i.listenerCount("data") > 0), i.push(c), i.push(null);
    }), r;
  }
}
F.protocols = ["http", "https"];
z = x.HttpsProxyAgent = F;
function le(e) {
  e.resume();
}
function H(e, ...n) {
  const t = {};
  let o;
  for (o in e)
    n.includes(o) || (t[o] = e[o]);
  return t;
}
const ve = /* @__PURE__ */ W({
  __proto__: null,
  get HttpsProxyAgent() {
    return z;
  },
  default: x
}, [x]);
export {
  ve as i
};
