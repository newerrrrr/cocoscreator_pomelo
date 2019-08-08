(function() {
function e(e) {
if (e) return n(e);
}
function n(n) {
for (var t in e.prototype) n[t] = e.prototype[t];
return n;
}
e.prototype.on = e.prototype.addEventListener = function(e, n) {
this._callbacks = this._callbacks || {};
(this._callbacks[e] = this._callbacks[e] || []).push(n);
return this;
};
e.prototype.once = function(e, n) {
var t = this;
this._callbacks = this._callbacks || {};
function o() {
t.off(e, o);
n.apply(this, arguments);
}
o.fn = n;
this.on(e, o);
return this;
};
e.prototype.off = e.prototype.removeListener = e.prototype.removeAllListeners = e.prototype.removeEventListener = function(e, n) {
this._callbacks = this._callbacks || {};
if (0 == arguments.length) {
this._callbacks = {};
return this;
}
var t, o = this._callbacks[e];
if (!o) return this;
if (1 == arguments.length) {
delete this._callbacks[e];
return this;
}
for (var r = 0; r < o.length; r++) if ((t = o[r]) === n || t.fn === n) {
o.splice(r, 1);
break;
}
return this;
};
e.prototype.emit = function(e) {
this._callbacks = this._callbacks || {};
var n = [].slice.call(arguments, 1), t = this._callbacks[e];
if (t) for (var o = 0, r = (t = t.slice(0)).length; o < r; ++o) t[o].apply(this, n);
return this;
};
e.prototype.listeners = function(e) {
this._callbacks = this._callbacks || {};
return this._callbacks[e] || [];
};
e.prototype.hasListeners = function(e) {
return !!this.listeners(e).length;
};
"undefined" != typeof window && (window.EventEmitter = e);
})();

(function(e, n, t) {
var o = e, r = o.Package = {}, i = o.Message = {};
r.TYPE_HANDSHAKE = 1;
r.TYPE_HANDSHAKE_ACK = 2;
r.TYPE_HEARTBEAT = 3;
r.TYPE_DATA = 4;
r.TYPE_KICK = 5;
i.TYPE_REQUEST = 0;
i.TYPE_NOTIFY = 1;
i.TYPE_RESPONSE = 2;
i.TYPE_PUSH = 3;
o.strencode = function(e) {
for (var t = new n(3 * e.length), o = 0, r = 0; r < e.length; r++) {
var i = e.charCodeAt(r), s = null;
s = i <= 127 ? [ i ] : i <= 2047 ? [ 192 | i >> 6, 128 | 63 & i ] : [ 224 | i >> 12, 128 | (4032 & i) >> 6, 128 | 63 & i ];
for (var u = 0; u < s.length; u++) {
t[o] = s[u];
++o;
}
}
var a = new n(o);
c(a, 0, t, 0, o);
return a;
};
o.strdecode = function(e) {
for (var t = new n(e), o = [], r = 0, i = 0, c = t.length; r < c; ) {
if (t[r] < 128) {
i = t[r];
r += 1;
} else if (t[r] < 224) {
i = ((63 & t[r]) << 6) + (63 & t[r + 1]);
r += 2;
} else {
i = ((15 & t[r]) << 12) + ((63 & t[r + 1]) << 6) + (63 & t[r + 2]);
r += 3;
}
o.push(i);
}
return String.fromCharCode.apply(null, o);
};
r.encode = function(e, t) {
var o = t ? t.length : 0, r = new n(4 + o), i = 0;
r[i++] = 255 & e;
r[i++] = o >> 16 & 255;
r[i++] = o >> 8 & 255;
r[i++] = 255 & o;
t && c(r, i, t, 0, o);
return r;
};
r.decode = function(e) {
for (var t = 0, o = new n(e), r = 0, i = []; t < o.length; ) {
var s = o[t++], u = (r = (o[t++] << 16 | o[t++] << 8 | o[t++]) >>> 0) ? new n(r) : null;
c(u, 0, o, t, r);
t += r;
i.push({
type: s,
body: u
});
}
return 1 === i.length ? i[0] : i;
};
i.encode = function(e, t, r, i, c) {
var h = 1 + (s(t) ? a(e) : 0);
if (u(t)) if (r) {
if ("number" != typeof i) throw new Error("error flag for number route!");
h += 2;
} else {
h += 1;
if (i) {
if ((i = o.strencode(i)).length > 255) throw new Error("route maxlength is overflow");
h += i.length;
}
}
c && (h += c.length);
var y = new n(h), v = 0;
v = f(t, r, y, v);
s(t) && (v = l(e, y, v));
u(t) && (v = d(r, i, y, v));
c && (v = p(c, y, v));
return y;
};
i.decode = function(e) {
var t = new n(e), r = t.length || t.byteLength, i = 0, a = 0, f = null, l = t[i++], d = 1 & l, p = l >> 1 & 7;
if (s(p)) {
var h = parseInt(t[i]), y = 0;
do {
a += (127 & (h = parseInt(t[i]))) * Math.pow(2, 7 * y);
i++;
y++;
} while (h >= 128);
}
if (u(p)) if (d) f = t[i++] << 8 | t[i++]; else {
var v = t[i++];
if (v) {
f = new n(v);
c(f, 0, t, i, v);
f = o.strdecode(f);
} else f = "";
i += v;
}
var g = r - i, w = new n(g);
c(w, 0, t, i, g);
return {
id: a,
type: p,
compressRoute: d,
route: f,
body: w
};
};
var c = function(e, n, t, o, r) {
if ("function" == typeof t.copy) t.copy(e, n, o, o + r); else for (var i = 0; i < r; i++) e[n++] = t[o++];
}, s = function(e) {
return e === i.TYPE_REQUEST || e === i.TYPE_RESPONSE;
}, u = function(e) {
return e === i.TYPE_REQUEST || e === i.TYPE_NOTIFY || e === i.TYPE_PUSH;
}, a = function(e) {
var n = 0;
do {
n += 1;
e >>= 7;
} while (e > 0);
return n;
}, f = function(e, n, t, o) {
if (e !== i.TYPE_REQUEST && e !== i.TYPE_NOTIFY && e !== i.TYPE_RESPONSE && e !== i.TYPE_PUSH) throw new Error("unkonw message type: " + e);
t[o] = e << 1 | (n ? 1 : 0);
return o + 1;
}, l = function(e, n, t) {
do {
var o = e % 128, r = Math.floor(e / 128);
0 !== r && (o += 128);
n[t++] = o;
e = r;
} while (0 !== e);
return t;
}, d = function(e, n, t, o) {
if (e) {
if (n > 65535) throw new Error("route number is overflow");
t[o++] = n >> 8 & 255;
t[o++] = 255 & n;
} else if (n) {
t[o++] = 255 & n.length;
c(t, o, n, 0, n.length);
o += n.length;
} else t[o++] = 0;
return o;
}, p = function(e, n, t) {
c(n, t, e, 0, e.length);
return t + e.length;
};
"undefined" != typeof window && (window.Protocol = o);
})("undefined" == typeof window ? module.exports : {}, "undefined" == typeof window ? Buffer : Uint8Array);

(function(e, n) {
var t = typeof window == "undefined" ? module.exports : {};
t.init = function(e) {
t.encoder.init(e.encoderProtos);
t.decoder.init(e.decoderProtos);
};
t.encode = function(e, n) {
return t.encoder.encode(e, n);
};
t.decode = function(e, n) {
return t.decoder.decode(e, n);
};
"undefined" != typeof window && (window.protobuf = t);
})();

(("undefined" != typeof protobuf ? protobuf : module.exports).constants = {}).TYPES = {
uInt32: 0,
sInt32: 0,
int32: 0,
double: 1,
string: 2,
message: 2,
float: 5
};

(("undefined" != typeof protobuf ? protobuf : module.exports).util = {}).isSimpleType = function(e) {
return "uInt32" === e || "sInt32" === e || "int32" === e || "uInt64" === e || "sInt64" === e || "float" === e || "double" === e;
};

(function(e, n) {
var t = ("undefined" !== typeof protobuf ? protobuf : module.exports).codec = {}, o = new ArrayBuffer(8), r = new Float32Array(o), i = new Float64Array(o), c = new Uint8Array(o);
t.encodeUInt32 = function(e) {
e = parseInt(e);
if (isNaN(e) || e < 0) return null;
var n = [];
do {
var t = e % 128, o = Math.floor(e / 128);
0 !== o && (t += 128);
n.push(t);
e = o;
} while (0 !== e);
return n;
};
t.encodeSInt32 = function(e) {
e = parseInt(e);
if (isNaN(e)) return null;
e = e < 0 ? 2 * Math.abs(e) - 1 : 2 * e;
return t.encodeUInt32(e);
};
t.decodeUInt32 = function(e) {
for (var n = 0, t = 0; t < e.length; t++) {
var o = parseInt(e[t]);
n += (127 & o) * Math.pow(2, 7 * t);
if (o < 128) return n;
}
return n;
};
t.decodeSInt32 = function(e) {
var n = this.decodeUInt32(e);
return n = (n % 2 + n) / 2 * (n % 2 == 1 ? -1 : 1);
};
t.encodeFloat = function(e) {
r[0] = e;
return c;
};
t.decodeFloat = function(e, n) {
if (!e || e.length < n + 4) return null;
for (var t = 0; t < 4; t++) c[t] = e[n + t];
return r[0];
};
t.encodeDouble = function(e) {
i[0] = e;
return c.subarray(0, 8);
};
t.decodeDouble = function(e, n) {
if (!e || e.length < n + 8) return null;
for (var t = 0; t < 8; t++) c[t] = e[n + t];
return i[0];
};
t.encodeStr = function(e, n, t) {
for (var o = 0; o < t.length; o++) for (var r = s(t.charCodeAt(o)), i = 0; i < r.length; i++) {
e[n] = r[i];
n++;
}
return n;
};
t.decodeStr = function(e, n, t) {
for (var o = [], r = n + t; n < r; ) {
var i = 0;
if (e[n] < 128) {
i = e[n];
n += 1;
} else if (e[n] < 224) {
i = ((63 & e[n]) << 6) + (63 & e[n + 1]);
n += 2;
} else {
i = ((15 & e[n]) << 12) + ((63 & e[n + 1]) << 6) + (63 & e[n + 2]);
n += 3;
}
o.push(i);
}
for (var c = "", s = 0; s < o.length; ) {
c += String.fromCharCode.apply(null, o.slice(s, s + 1e4));
s += 1e4;
}
return c;
};
t.byteLength = function(e) {
if ("string" != typeof e) return -1;
for (var n = 0, t = 0; t < e.length; t++) {
n += u(e.charCodeAt(t));
}
return n;
};
function s(e) {
return e <= 127 ? [ e ] : e <= 2047 ? [ 192 | e >> 6, 128 | 63 & e ] : [ 224 | e >> 12, 128 | (4032 & e) >> 6, 128 | 63 & e ];
}
function u(e) {
return e <= 127 ? 1 : e <= 2047 ? 2 : 3;
}
})();

(function(e, n) {
var t = e, o = e.encoder = {}, r = t.codec, i = t.constants, c = t.util;
o.init = function(e) {
this.protos = e || {};
};
o.encode = function(e, n) {
var t = this.protos[e];
if (!s(n, t)) return null;
var o = r.byteLength(JSON.stringify(n)), i = new ArrayBuffer(o), c = new Uint8Array(i), a = 0;
return t && (a = u(c, a, t, n)) > 0 ? c.subarray(0, a) : null;
};
function s(e, n) {
if (!n) return !1;
for (var t in n) {
var r = n[t];
switch (r.option) {
case "required":
if ("undefined" == typeof e[t]) {
console.warn("no property exist for required! name: %j, proto: %j, msg: %j", t, r, e);
return !1;
}

case "optional":
if ("undefined" != typeof e[t]) {
if ((i = n.__messages[r.type] || o.protos["message " + r.type]) && !s(e[t], i)) {
console.warn("inner proto error! name: %j, proto: %j, msg: %j", t, r, e);
return !1;
}
}
break;

case "repeated":
var i = n.__messages[r.type] || o.protos["message " + r.type];
if (e[t] && i) for (var c = 0; c < e[t].length; c++) if (!s(e[t][c], i)) return !1;
}
}
return !0;
}
function u(e, n, t, o) {
for (var r in o) if (t[r]) {
var i = t[r];
switch (i.option) {
case "required":
case "optional":
n = l(e, n, d(i.type, i.tag));
n = a(o[r], i.type, n, e, t);
break;

case "repeated":
o[r].length > 0 && (n = f(o[r], i, n, e, t));
}
}
return n;
}
function a(e, n, t, i, c) {
switch (n) {
case "uInt32":
t = l(i, t, r.encodeUInt32(e));
break;

case "int32":
case "sInt32":
t = l(i, t, r.encodeSInt32(e));
break;

case "float":
l(i, t, r.encodeFloat(e));
t += 4;
break;

case "double":
l(i, t, r.encodeDouble(e));
t += 8;
break;

case "string":
var s = r.byteLength(e);
t = l(i, t, r.encodeUInt32(s));
r.encodeStr(i, t, e);
t += s;
break;

default:
var a = c.__messages[n] || o.protos["message " + n];
if (a) {
var f = new ArrayBuffer(2 * r.byteLength(JSON.stringify(e)));
s = u(f, s = 0, a, e);
t = l(i, t, r.encodeUInt32(s));
for (var d = 0; d < s; d++) {
i[t] = f[d];
t++;
}
}
}
return t;
}
function f(e, n, t, o, i) {
var s = 0;
if (c.isSimpleType(n.type)) {
t = l(o, t = l(o, t, d(n.type, n.tag)), r.encodeUInt32(e.length));
for (s = 0; s < e.length; s++) t = a(e[s], n.type, t, o);
} else for (s = 0; s < e.length; s++) {
t = l(o, t, d(n.type, n.tag));
t = a(e[s], n.type, t, o, i);
}
return t;
}
function l(e, n, t) {
for (var o = 0; o < t.length; o++, n++) e[n] = t[o];
return n;
}
function d(e, n) {
var t = i.TYPES[e] || 2;
return r.encodeUInt32(n << 3 | t);
}
})("undefined" != typeof protobuf ? protobuf : module.exports);

(function(e, n) {
var t, o = e, r = e.decoder = {}, i = o.codec, c = o.util, s = 0;
r.init = function(e) {
this.protos = e || {};
};
r.setProtos = function(e) {
e && (this.protos = e);
};
r.decode = function(e, n) {
var o = this.protos[e];
t = n;
s = 0;
return o ? u({}, o, t.length) : null;
};
function u(e, n, t) {
for (;s < t; ) {
var o = a(), r = (o.type, o.tag), i = n.__tags[r];
switch (n[i].option) {
case "optional":
case "required":
e[i] = f(n[i].type, n);
break;

case "repeated":
e[i] || (e[i] = []);
l(e[i], n[i].type, n);
}
}
return e;
}
function a() {
var e = i.decodeUInt32(d());
return {
type: 7 & e,
tag: e >> 3
};
}
function f(e, n) {
switch (e) {
case "uInt32":
return i.decodeUInt32(d());

case "int32":
case "sInt32":
return i.decodeSInt32(d());

case "float":
var o = i.decodeFloat(t, s);
s += 4;
return o;

case "double":
var c = i.decodeDouble(t, s);
s += 8;
return c;

case "string":
var a = i.decodeUInt32(d()), f = i.decodeStr(t, s, a);
s += a;
return f;

default:
var l = n && (n.__messages[e] || r.protos["message " + e]);
if (l) {
a = i.decodeUInt32(d());
var p = {};
u(p, l, s + a);
return p;
}
}
}
function l(e, n, t) {
if (c.isSimpleType(n)) for (var o = i.decodeUInt32(d()), r = 0; r < o; r++) e.push(f(n)); else e.push(f(n, t));
}
function d(e) {
var n, o = [], r = s;
e = e || !1;
do {
n = t[r];
o.push(n);
r++;
} while (n >= 128);
e || (s = r);
return o;
}
})("undefined" != typeof protobuf ? protobuf : module.exports);

cc.Pomelo = function() {
var e = window.Protocol, n = window.protobuf, t = window.decodeIO_protobuf, o = null, r = null, i = e.Package, c = e.Message, s = window.EventEmitter, u = window.rsa, a = null;
"undefined" != typeof window && "undefined" != typeof sys && sys.localStorage && (window.localStorage = sys.localStorage);
"function" != typeof Object.create && (Object.create = function(e) {
function n() {}
n.prototype = e;
return new n();
});
window;
var f, l = Object.create(s.prototype), d = null, p = 0, h = {}, y = {}, v = {}, g = {}, w = {}, b = {}, E = {}, m = 0, _ = 0, T = 0, S = 0, P = null, I = null, k = null, A = null, Y = null, N = !1, U = null, O = null, H = 0, D = 5e3, J = {
sys: {
type: "js-websocket",
version: "0.0.1",
rsa: {}
},
user: {}
}, R = null;
l.init = function(e, n) {
R = n;
var t = e.host, o = e.port;
Y = e.encode || K;
A = e.decode || C;
var r = "ws://" + t;
o && (r += ":" + o);
J.user = e.user;
if (e.encrypt) {
f = !0;
u.generate(1024, "10001");
var i = {
rsa_n: u.n.toString(16),
rsa_e: u.e
};
J.sys.rsa = i;
}
k = e.handshakeCallback;
j(e, r, n);
};
var C = l.decode = function(e) {
var n = c.decode(e);
if (n.id > 0) {
n.route = v[n.id];
delete v[n.id];
if (!n.route) return;
}
n.body = Q(n);
return n;
}, K = l.encode = function(t, r, i) {
var s = t ? c.TYPE_REQUEST : c.TYPE_NOTIFY;
if (n && E[r]) i = n.encode(r, i); else if (o && o.lookup(r)) {
i = new (o.build(r))(i).encodeNB();
} else i = e.strencode(JSON.stringify(i));
var u = 0;
if (g && g[r]) {
r = g[r];
u = 1;
}
return c.encode(t, s, u, r, i);
}, j = function(c, s, u) {
console.log("connect to " + s);
var f = (c = c || {}).maxReconnectAttempts || 10;
O = s;
if (window.localStorage && window.localStorage.getItem("protos") && 0 === m) {
var p = JSON.parse(window.localStorage.getItem("protos"));
m = p.version || 0;
b = p.server || {};
E = p.client || {};
n && n.init({
encoderProtos: E,
decoderProtos: b
});
if (t) {
o = t.loadJson(E);
r = t.loadJson(b);
}
}
J.sys.protoVersion = m;
(d = new WebSocket(s)).binaryType = "arraybuffer";
d.onopen = function(n) {
N && l.emit("reconnect");
x();
var t = i.encode(i.TYPE_HANDSHAKE, e.strencode(JSON.stringify(J)));
L(t);
};
d.onmessage = function(e) {
M(i.decode(e.data), u);
T && (S = Date.now() + T);
};
d.onerror = function(e) {
l.emit("io-error", e);
console.error("socket error: ", e);
};
d.onclose = function(e) {
console.log(e);
l.emit("close", e);
l.emit("disconnect", e);
console.error("socket close: ", e);
if (c.reconnect && H < f) {
N = !0;
H++;
U = setTimeout(function() {
j(c, O, u);
}, D);
D *= 2;
}
d = null;
a && a();
a = null;
};
};
l.disconnect = function(e) {
a = e;
if (P) {
clearTimeout(P);
P = null;
}
if (I) {
clearTimeout(I);
I = null;
}
if (d) {
d.disconnect && d.disconnect();
d.close && d.close();
console.log("disconnect");
d = null;
} else {
a && a();
a = null;
}
};
var x = function() {
N = !1;
D = 5e3;
H = 0;
clearTimeout(U);
};
l.request = function(e, n, t) {
if (2 === arguments.length && "function" == typeof n) {
t = n;
n = {};
} else n = n || {};
if (e = e || n.route) {
F(++p, e, n);
h[p] = t;
v[p] = e;
}
};
l.notify = function(e, n) {
F(0, e, n = n || {});
};
var F = function(e, n, t) {
if (f) {
t = JSON.stringify(t);
var o = u.signString(t, "sha256");
(t = JSON.parse(t)).__crypto__ = o;
}
Y && (t = Y(e, n, t));
var r = i.encode(i.TYPE_DATA, t);
L(r);
}, L = function(e) {
null !== d && d.send(e.buffer);
}, B = function() {
var e = S - Date.now();
if (e > 100) I = setTimeout(B, e); else {
console.error("server heartbeat timeout");
l.emit("heartbeat timeout");
l.disconnect();
}
};
y[i.TYPE_HANDSHAKE] = function(n) {
if (501 !== (n = JSON.parse(e.strdecode(n))).code) if (200 === n.code) {
V(n);
var t = i.encode(i.TYPE_HANDSHAKE_ACK);
L(t);
R && R(d);
} else l.emit("error", "handshake fail"); else l.emit("error", "client version not fullfill");
};
y[i.TYPE_HEARTBEAT] = function(e) {
if (_) {
var n = i.encode(i.TYPE_HEARTBEAT);
if (I) {
clearTimeout(I);
I = null;
}
P || (P = setTimeout(function() {
P = null;
L(n);
S = Date.now() + T;
I = setTimeout(B, T);
}, _));
}
};
y[i.TYPE_DATA] = function(e) {
var n = e;
A && (n = A(n));
q(l, n);
};
y[i.TYPE_KICK] = function(n) {
n = JSON.parse(e.strdecode(n));
l.emit("onKick", n);
};
var M = function(e) {
if (Array.isArray(e)) for (var n = 0; n < e.length; n++) {
var t = e[n];
y[t.type](t.body);
} else y[e.type](e.body);
}, q = function(e, n) {
if (n.id) {
var t = h[n.id];
delete h[n.id];
"function" == typeof t && t(n.body);
} else e.emit(n.route, n.body);
}, Q = function(t) {
var o = t.route;
if (t.compressRoute) {
if (!w[o]) return {};
o = t.route = w[o];
}
return n && b[o] ? n.decode(o, t.body) : r && r.lookup(o) ? r.build(o).decode(t.body) : JSON.parse(e.strdecode(t.body));
}, V = function(e) {
if (e.sys && e.sys.heartbeat) {
_ = 1e3 * e.sys.heartbeat;
T = 2 * _;
} else {
_ = 0;
T = 0;
}
W(e);
"function" == typeof k && k(e.user);
}, W = function(e) {
if (e && e.sys) {
g = e.sys.dict;
var i = e.sys.protos;
if (g) {
g = g;
w = {};
for (var c in g) w[g[c]] = c;
}
if (i) {
m = i.version || 0;
b = i.server || {};
E = i.client || {};
window.localStorage.setItem("protos", JSON.stringify(i));
n && n.init({
encoderProtos: i.client,
decoderProtos: i.server
});
if (t) {
o = t.loadJson(E);
r = t.loadJson(b);
}
}
}
};
return l;
};

window.pomelo = new cc.Pomelo();