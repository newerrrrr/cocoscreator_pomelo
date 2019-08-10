window.__require = function e(t, n, i) {
function o(c, s) {
if (!n[c]) {
if (!t[c]) {
var a = c.split("/");
a = a[a.length - 1];
if (!t[a]) {
var l = "function" == typeof __require && __require;
if (!s && l) return l(a, !0);
if (r) return r(a, !0);
throw new Error("Cannot find module '" + c + "'");
}
}
var u = n[c] = {
exports: {}
};
t[c][0].call(u.exports, function(e) {
return o(t[c][1][e] || e);
}, u, u.exports, e, t, n, i);
}
return n[c].exports;
}
for (var r = "function" == typeof __require && __require, c = 0; c < i.length; c++) o(i[c]);
return o;
}({
AudioMgr: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "ee900XUtWxP6qw9Krwd/aX2", "AudioMgr");
var i = {}, o = 1, r = 1, c = null;
i.init = function() {
o = gt.getLocal("bgmVolume", 1);
r = gt.getLocal("effVolume", 1);
};
i.playMusic = function(e, t) {
this.stopMusic();
var n = "sound/" + e;
cc.loader.loadRes(n, cc.AudioClip, function(n, i) {
n ? cc.log("xxx invalid audio file:", e) : c = cc.audioEngine.playMusic(i, t, o);
}.bind(this));
};
i.stopMusic = function() {
if (null != c) {
cc.audioEngine.stopMusic(c);
c = null;
}
};
i.pauseMusic = function() {
null != c && cc.audioEngine.pauseMusic();
};
i.resumeMusic = function() {
null != c && cc.audioEngine.resumeMusic();
};
i.setMusicVolume = function(e) {
if (null != c) {
cc.audioEngine.setMusicVolume(e);
o != e && gt.setLocal("bgmVolume", e);
}
};
i.getMusicVolume = function() {
return o;
};
i.playEffect = function(e, t) {
var n = "sound/" + e;
cc.loader.loadRes(n, cc.AudioClip, function(n, i) {
n ? cc.log("### invalid audio file:", e) : r > 0 && cc.audioEngine.playEffect(i, t, r);
}.bind(this));
};
i.pauseAllEffects = function() {
cc.audioEngine.pauseAllEffects();
};
i.resumeAllEffects = function() {
cc.audioEngine.resumeAllEffects();
};
i.stopAllEffects = function() {
cc.audioEngine.stopAllEffects();
};
i.setEffectVolume = function(e) {
if (r != e) {
r = e;
gt.setLocal("effVolume", e);
}
};
i.getEffectVolume = function() {
return r;
};
i.pauseAll = function() {
this.pauseMusic();
this.pauseAllEffects();
};
i.resumeAll = function() {
this.resumeMusic();
this.resumeAllEffects();
};
i.init();
t.exports = i;
cc._RF.pop();
}, {} ],
1: [ function(e, t, n) {
var i, o, r = t.exports = {};
function c() {
throw new Error("setTimeout has not been defined");
}
function s() {
throw new Error("clearTimeout has not been defined");
}
(function() {
try {
i = "function" == typeof setTimeout ? setTimeout : c;
} catch (e) {
i = c;
}
try {
o = "function" == typeof clearTimeout ? clearTimeout : s;
} catch (e) {
o = s;
}
})();
function a(e) {
if (i === setTimeout) return setTimeout(e, 0);
if ((i === c || !i) && setTimeout) {
i = setTimeout;
return setTimeout(e, 0);
}
try {
return i(e, 0);
} catch (t) {
try {
return i.call(null, e, 0);
} catch (t) {
return i.call(this, e, 0);
}
}
}
function l(e) {
if (o === clearTimeout) return clearTimeout(e);
if ((o === s || !o) && clearTimeout) {
o = clearTimeout;
return clearTimeout(e);
}
try {
return o(e);
} catch (t) {
try {
return o.call(null, e);
} catch (t) {
return o.call(this, e);
}
}
}
var u, f = [], d = !1, p = -1;
function h() {
if (d && u) {
d = !1;
u.length ? f = u.concat(f) : p = -1;
f.length && g();
}
}
function g() {
if (!d) {
var e = a(h);
d = !0;
for (var t = f.length; t; ) {
u = f;
f = [];
for (;++p < t; ) u && u[p].run();
p = -1;
t = f.length;
}
u = null;
d = !1;
l(e);
}
}
r.nextTick = function(e) {
var t = new Array(arguments.length - 1);
if (arguments.length > 1) for (var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n];
f.push(new v(e, t));
1 !== f.length || d || a(g);
};
function v(e, t) {
this.fun = e;
this.array = t;
}
v.prototype.run = function() {
this.fun.apply(null, this.array);
};
r.title = "browser";
r.browser = !0;
r.env = {};
r.argv = [];
r.version = "";
r.versions = {};
function y() {}
r.on = y;
r.addListener = y;
r.once = y;
r.off = y;
r.removeListener = y;
r.removeAllListeners = y;
r.emit = y;
r.prependListener = y;
r.prependOnceListener = y;
r.listeners = function(e) {
return [];
};
r.binding = function(e) {
throw new Error("process.binding is not supported");
};
r.cwd = function() {
return "/";
};
r.chdir = function(e) {
throw new Error("process.chdir is not supported");
};
r.umask = function() {
return 0;
};
}, {} ],
Debug: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "813e5NqnPtCBJZe9lWTW0AO", "Debug");
var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
return typeof e;
} : function(e) {
return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};
t.exports.init = function(e) {
e.dump = function(t, n) {
if (e.debug) {
var o = (n || "var") + " = " + function e(t, n) {
var o = "undefined" == typeof t ? "undefined" : i(t), r = "";
if (Array.isArray(t)) {
r = (r += "\n") + n + "[\n";
var c = n + " . . ";
for (var s in t) r += c + s + " = " + e(t[s], c) + "\n";
r = r + n + "]";
} else if ("object" == o) {
r = (r += "\n") + n + "{\n";
var a = n + " . . ";
for (var l in t) r = r + a + l + " = " + e(t[l], a) + "\n";
r = r + n + "}";
} else "string" == o ? r = r + '"' + t + '"' : "number" == o ? r += t : "function" == o && (r += "*function");
return r;
}(t, "");
cc.log(o);
}
};
};
cc._RF.pop();
}, {} ],
DeviceApi: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "a9daeO7Wk1L6riR4i2Srwul", "DeviceApi");
var i = {}, o = "org/cocos2dx/javascript/SystemAPI", r = {}, c = "Tag_Clipboard", s = "Tag_Battery";
i.execCallback = function(e, t) {
cc.log("DeviceApi.execCallback: ", e, t);
r[e] && r[e](t);
};
i.copyToClipboard = function(e) {
cc.sys.os == cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod(o, "copyToClipboard", "(Ljava/lang/String;)V", e) : (cc.sys.os, 
cc.sys.OS_IOS);
};
i.getClipboardText = function(e, t) {
if (e) {
r[c] = e;
var n = t ? "true" : "false";
cc.sys.os == cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod(o, "getClipboardContent", "(Ljava/lang/String;Ljava/lang/String;)V", c, n) : (cc.sys.os, 
cc.sys.OS_IOS);
}
};
i.getBattery = function(e) {
if (e) {
r[s] = e;
cc.sys.os == cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod(o, "getBattery", "(Ljava/lang/String;)V", s) : (cc.sys.os, 
cc.sys.OS_IOS);
}
};
i.getUUID = function() {
var e = "";
cc.sys.os == cc.sys.OS_ANDROID ? e = jsb.reflection.callStaticMethod(o, "getUUID", "()Ljava/lang/String;") : (cc.sys.os, 
cc.sys.OS_IOS);
return e;
};
i.getShareCode = function() {
var e = "";
cc.sys.os == cc.sys.OS_ANDROID ? e = jsb.reflection.callStaticMethod(o, "getShareCode", "()Ljava/lang/String;") : (cc.sys.os, 
cc.sys.OS_IOS);
return e;
};
i.isGpsOpen = function() {
var e = !1;
cc.sys.os == cc.sys.OS_ANDROID ? e = jsb.reflection.callStaticMethod(o, "isGpsOPen", "()Z") : (cc.sys.os, 
cc.sys.OS_IOS);
return e;
};
i.gotoOpenGps = function() {
var e = !1;
cc.sys.os == cc.sys.OS_ANDROID ? e = jsb.reflection.callStaticMethod(o, "gotoOpenGps", "()V") : (cc.sys.os, 
cc.sys.OS_IOS);
return e;
};
i.vibrate = function(e) {
cc.sys.os == cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod(o, "vibrate", "(I)V", e) : (cc.sys.os, 
cc.sys.OS_IOS);
};
t.exports = i;
cc._RF.pop();
}, {} ],
EventMgr: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "ef14bOV1xRPNKtbnsvYFUbM", "EventMgr");
var i = {}, o = {};
i.addEventHandler = function(e, t, n) {
(o = o || {})[e] = o[e] || [];
for (var i = o[e], r = 0, c = i.length; r < c; r++) if (i[r].obj == t && i[r].func == n) return;
i.push({
obj: t,
func: n
});
};
i.removeEventHandler = function(e, t) {
(o = o || {})[e] = o[e] || [];
for (var n = o[e], i = 0, r = n.length; i < r; i++) if (n[i].obj == t) {
n.splice(i, 1);
return;
}
};
i.removeAllEventHandler = function(e) {
o = o || {};
for (var t in o) for (var n = o[t], i = n.length; i--; ) n[i].obj == e && n.splice(i, 1);
};
i.dispatchEvent = function(e, t, n) {
var i = (o = o || {})[e];
if (i) for (var r = 0, c = i.length; r < c; r++) i[r].func && i[r].func.call(this, t, n);
};
t.exports = i;
cc._RF.pop();
}, {} ],
EventType: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "3de6f/lhX9IC6tnn+pTa4d2", "EventType");
var i = {
ZZMJ: "ZZMJ",
NZMJ: "NZMJ",
PDK: "PDK",
NET_CONNECTED: "NET_CONNECTED",
NET_DISCONNECTED: "NET_DISCONNECTED",
RELOGIN: "RELOGIN",
WALLET_CHANGE: "WALLET_CHANGE",
SCENE_RESET: "SCENE_RESET"
};
t.exports = i;
cc._RF.pop();
}, {} ],
GameConfig: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "57443h9S4FNGbJfaN2bpIVg", "GameConfig");
t.exports.init = function(e) {
e.gateServer = {
ip: "192.168.198.128",
port: 3014
};
e.noticeUrl = "http://47.95.217.228:8090/Web/NoticeWeb/GetNotice_Friend";
e.wxAppId = "wxb64d088517456e5f";
e.wxSecret = "a6e3924c03258c2af514e6b6f395b8ca";
e.isReview = !1;
e.debug = !0;
e.open_guest = !0;
e.open_hotupdate = !1;
e.designSize = cc.size(1334, 750);
e.center = cc.v2(e.designSize.width / 2, e.designSize.height / 2);
e.GameID = {
ZZMJ: 1,
NZMJ: 2
};
};
cc._RF.pop();
}, {} ],
GameMode: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "638b0dWPllIur7lVLYI0VFN", "GameMode");
var i = {}, o = {}, r = 0, c = 0;
i.init = function() {
i.registerMsg();
};
i.registerMsg = function() {
gt.tcp.registerMsg(gt.WALLET_INFO, i, i.onRcvWalletInfo);
gt.tcp.registerMsg(gt.REPLAY_BY_SHARE_CODE, i, i.onRcvReplayByShareCode);
gt.tcp.registerMsg(gt.SYSTEM_NOTICE, i, i.onRcvSysNotice);
gt.tcp.registerMsg(gt.SYNC_TIME, i, i.onRcvSyncTime);
cc.game.on(cc.game.EVENT_HIDE, i.onEnterBackground, i);
cc.game.on(cc.game.EVENT_SHOW, i.onEnterForeground, i);
};
i.unregisterMsg = function() {
gt.tcp.unregisterAllMsg(i);
cc.game.off(cc.game.EVENT_HIDE, i.onEnterBackground, i);
cc.game.off(cc.game.EVENT_SHOW, i.onEnterForeground, i);
};
i.savePlayerNickHead = function(e, t, n) {
o[e] = {
nick: t,
icon: n
};
};
i.getPlayerNickHead = function(e) {
return o[e];
};
i.onRcvWalletInfo = function(t) {
if (t.code && t.code < 0) e("Toast").show(t.error || ""); else {
gt.playerData.wallet = t;
gt.dispatchEvent(gt.EventType.WALLET_CHANGE);
}
};
i.reqReplayByShareCode = function(e) {
gt.tcp.sendMessage(gt.REPLAY_BY_SHARE_CODE, {
share_code: e
});
gt.showLoadingTips("请稍后。。。", 10);
};
i.onRcvReplayByShareCode = function(e) {
cc.log("=== onRcvReplayByShareCode");
gt.removeLoadingTips();
};
i.checkReplayShareCode = function() {
var e = extension.getURLShareCode();
if (e && "" != e) {
cc.log("---get replay code : ", e);
this.reqReplayByShareCode(e);
return !0;
}
return !1;
};
i.checkRoomCodeFromUrl = function() {
var e = tonumber(extension.getURLRoomID());
if (e && e > 0) {
gt.tcp.sendMessage(gt.JOIN_ROOM, {
room_id: e
});
gt.showLoadingTips(gt.tr("please_wait"), 10);
return !0;
}
return !1;
};
i.onRcvDuplicateLogin = function(t) {
cc.log("=== onRcvDuplicateLogin");
gt.tcp.disconnect();
e("NoticeTips").show("您的账号已在其他地方登录", function() {
cc.director.loadScene("LoadingScene");
}, null, !0);
};
i.backMainScene = function() {};
i.onTcpLoginSuccess = function() {
cc.log("@@@@ ---onTcpLoginSuccess");
};
i.onRcvSysNotice = function() {};
i.reqSyncTime = function() {
gt.tcp.sendMessage(gt.SYNC_TIME, {});
};
i.onRcvSyncTime = function(e) {
cc.log("=== onRcvSyncTime");
e.code && e.code < 0 || (r = e.utc_time - new Date());
};
i.getServerTime = function() {
return new Date() + r;
};
i.onEnterBackground = function() {
cc.log("@@@@@@@@@@@ === onEnterBackground");
c = new Date();
gt.audio.pauseAll();
};
i.onEnterForeground = function() {
var e = new Date();
0 == c && (c = e);
var t = e - c;
if (t > 15e3) {
cc.log("@@@@@@@@@@ === onEnterForeground, reconnect...");
gt.tcp.reconnect();
} else if (t > 3e3) {
cc.log("@@@@@@@@@@@ === onEnterForeground ");
gt.showLoadingTips("请稍后。。。", 3e3);
gt.dispatchEvent(gt.EventType.SCENE_RESET);
}
gt.audio.resumeAll();
};
t.exports = i;
cc._RF.pop();
}, {
NoticeTips: "NoticeTips",
Toast: "Toast"
} ],
HotUpdate: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "6b271EMyoZGIZS2rqRikaMW", "HotUpdate");
var i = 2, o = 3, r = 4, c = 1, s = 2, a = 3, l = 5, u = 6, f = 7, d = 0, p = 0, h = 0, g = null, v = null, y = null, m = null, S = !1, b = (cc.sys.isNative && jsb ? jsb.fileUtils.getWritablePath() : "/") + "ResUpdate/", E = "version.manifest", _ = "project.manifest", A = b + E, R = A + ".tmp", T = b + _, C = T + ".tmp", M = b + "download.list", w = [ b, b + "res/", b + "src/" ], F = e("md5");
cc.Class({
extends: cc.Component,
properties: {
progressBar: cc.ProgressBar,
lbTips: cc.Label,
lbPercent: cc.Label,
versionManifestUrl: {
type: cc.Asset,
default: null
},
projectManifestUrl: {
type: cc.Asset,
default: null
}
},
onLoad: function() {
this.updatePercent(0);
},
onDestroy: function() {
this.downloader = null;
this.progressBar.node.active = !1;
this.lbPercent.node.active = !1;
},
start: function() {
this.init();
this.downloadVersion();
},
init: function() {
this.downloader = new jsb.Downloader();
this.downloader.setOnFileTaskSuccess(this.onFileSuccess.bind(this));
this.downloader.setOnTaskError(this.onFileError.bind(this));
d = 0;
h = 0;
this.zipList = [];
jsb.fileUtils.isDirectoryExist(b) || jsb.fileUtils.createDirectory(b);
v = this.loadJsonFile(this.versionManifestUrl.nativeUrl, !0);
y = this.loadJsonFile(this.projectManifestUrl.nativeUrl, !0);
var e = this.loadJsonFile(E, !1), t = this.loadJsonFile(_, !1);
if (e && t) {
var n = this.compareVersion(e.version, v.version);
if (n[0] > 0 || n[1] > 0) {
v = e;
y = t;
} else if (n[0] < 0 || n[1] < 0) {
cc.log("### apk version > cache version !!!, clear cache data...");
this.clearStorage();
}
}
},
downloadVersion: function() {
this.state = i;
var e = v.manifestUrl + E, t = b + E + ".tmp";
this.requestOneFile(e, t, "VERSION_ID");
},
parseVersion: function(t) {
cc.log("### parseVersion");
var n = this.loadJsonFile(t, !1);
if (n) {
cc.log("xxx remote version, local version =", n.version, v.version);
var i = this.compareVersion(n.version, v.version);
if (i[0] > 0) e("NoticeTips").show("游戏有新版本，请前往更新", function() {
cc.sys.openURL(n.appDownLoadUrl);
this.clearStorage();
this.exitGame();
}.bind(this), this.exitGame); else if (0 === i[0] && i[1] > 0) {
cc.log("xxx need to update...");
if (jsb.fileUtils.isFileExist(C) && jsb.fileUtils.isFileExist(M)) {
var o = this.loadJsonFile(C, !1);
if (o.version == n.version) {
m = o;
this.genDownloadList(!0);
if (g) {
cc.log("xxx resume last download ...");
this.downloadAssets();
return;
}
} else {
jsb.fileUtils.removeFile(C);
jsb.fileUtils.removeFile(M);
}
}
this.downloadManifest();
} else i[0] < 0 || i[1] < 0 ? this.handleEvents(a) : this.handleEvents(s);
} else this.handleEvents(u);
},
downloadManifest: function() {
this.state = o;
jsb.fileUtils.isFileExist(C) && jsb.fileUtils.removeFile(C);
jsb.fileUtils.isFileExist(M) && jsb.fileUtils.removeFile(M);
var e = v.manifestUrl + _, t = b + _ + ".tmp";
this.requestOneFile(e, t, "MANIFEST_ID");
},
parseManifest: function(e) {
if (m = this.loadJsonFile(e, !1)) {
this.genDownloadList(!1);
this.downloadAssets();
} else this.handleEvents(f);
},
genDownloadList: function(e) {
if (e) g = this.loadJsonFile(M, !1); else {
g = [];
var t = y.assets, n = m.assets;
for (var i in t) if (n[i]) t[i].md5 != n[i].md5 && g.push({
key: i,
val: n[i]
}); else {
var o = b + i;
jsb.fileUtils.isFileExist(o) && jsb.fileUtils.removeFile(o);
}
for (var r in n) t[r] || g.push({
key: r,
val: n[r]
});
this.saveToJsonFile(g, M);
}
p = g ? g.length : 0;
cc.log("------totalCount:", p);
},
downloadAssets: function() {
S = !1;
var e = g.length;
if (0 == e && 0 == h) this.handleEvents(l); else {
this.state = r;
for (;e > 0 && h < 1; ) {
var t = g[e - 1];
if (!t) break;
var n = m.packageUrl + t.key, i = b + t.key + ".tmp";
this.requestOneFile(n, i, t.key);
e--;
h++;
}
}
},
retryDownload: function() {
cc.log("### : retryDownload: retryCount = ", d);
++d > 3 ? e("NoticeTips").show("网络连接失败，是否再次尝试连接？", this.resumeDownload.bind(this), this.exitGame.bind(this)) : this.resumeDownload();
},
resumeDownload: function() {
this.state == i ? this.downloadVersion() : this.state == o ? this.downloadManifest() : this.state == r && this.downloadAssets();
},
requestOneFile: function(e, t, n) {
cc.log("------requestOneFile: ", n);
this.downloader.createDownloadFileTask(e, t, n);
},
onFileSuccess: function(e) {
if (this.state == i) this.parseVersion(e.storagePath); else if (this.state == o) this.parseManifest(e.storagePath); else if (this.state == r) {
h--;
if (this.checkFile(e.storagePath, e.identifier)) {
var t = e.storagePath, n = t.replace(".tmp", "");
jsb.fileUtils.renameFile(t, n);
var c = e.identifier;
if (".zip" == /\.[^\.]+$/.exec(c)) {
var s = b + c;
if (!GameTools.getInstance().decompress(s)) {
cc.log("@@@@ decompress file fail: ", c);
S = !0;
}
jsb.fileUtils.removeFile(s);
}
if (!S) {
for (var a = g.length - 1; a >= 0; a--) if (g[a].key == c) {
g.splice(a, 1);
break;
}
var u = 100 * (p - g.length) / p;
this.updatePercent(u);
}
} else S = !0;
if (h <= 0) {
if (S) {
this.retryDownload();
return;
}
this.saveToJsonFile(g, M);
0 == g.length ? this.handleEvents(l) : this.downloadAssets();
}
}
},
onFileError: function(e) {
cc.log("### : onFileError: identifier = ", e.identifier);
S = !0;
this.state == r ? --h <= 0 && this.retryDownload() : this.retryDownload();
},
handleEvents: function(e) {
switch (e) {
case c:
case s:
this.enterGame();
break;

case a:
this.clearStorage();
this.enterGame();
break;

case l:
jsb.fileUtils.removeFile(M);
jsb.fileUtils.renameFile(R, A);
jsb.fileUtils.renameFile(C, T);
this.enterGame();
break;

case u:
case f:
this.retryDownload();
}
},
loadJsonFile: function(e, t) {
var n;
if (t) {
for (var i = jsb.fileUtils.getSearchPaths(), o = [], r = 0, c = i.length; r < c; r++) {
var s = i[r];
-1 == w.indexOf(s) && -1 == o.indexOf(s) && o.push(s);
}
jsb.fileUtils.setSearchPaths(o);
jsb.fileUtils.isFileExist(e) && (n = jsb.fileUtils.getStringFromFile(e));
jsb.fileUtils.setSearchPaths(i);
} else jsb.fileUtils.isFileExist(e) && (n = jsb.fileUtils.getStringFromFile(e));
n && "string" == typeof n && (n = JSON.parse(n));
return n;
},
saveToJsonFile: function(e, t) {
var n = JSON.stringify(e);
jsb.fileUtils.writeStringToFile(n, t);
},
compareVersion: function(e, t) {
var n = e.split("."), i = t.split("."), o = 0;
parseInt(n[0]) > parseInt(i[0]) || parseInt(n[1]) > parseInt(i[1]) ? o = 1 : (parseInt(n[0]) < parseInt(i[0]) || parseInt(n[1]) < parseInt(i[1])) && (o = -1);
var r = 0;
parseInt(n[2]) > parseInt(i[2]) || parseInt(n[3]) > parseInt(i[3]) ? r = 1 : (parseInt(n[2]) < parseInt(i[2]) || parseInt(n[3]) < parseInt(i[3])) && (r = -1);
return [ o, r ];
},
clearStorage: function() {
cc.log("### : clearStorage");
jsb.fileUtils.removeFile(A);
jsb.fileUtils.removeFile(T);
jsb.fileUtils.removeFile(C);
jsb.fileUtils.removeFile(M);
jsb.fileUtils.removeDirectory(b);
},
updatePercent: function(e) {
e > 100 && (e = 100);
this.progressBar.progress = e / 100;
this.lbPercent.string = Math.ceil(e) + "%";
},
checkFile: function(e, t) {
for (var n = null, i = null, o = 0, r = g.length; o < r; o++) if (g[o].key == t) {
n = g[o].val.md5;
break;
}
var c = jsb.fileUtils.getDataFromFile(e);
c && (i = F.create().update(c).hex());
return n === i;
},
enterGame: function() {
if (p > 0) {
cc.log("### xxxxxxxxxxxxxxxxxxx restart ...");
this.restartGame();
} else {
cc.log("### ---------------- enterGame");
cc.director.loadScene("LoadingScene");
}
},
exitGame: function() {
cc.game.end();
},
restartGame: function() {
this.onDestroy();
this.lbTips.string = "资源重新加载中...";
for (var e = jsb.fileUtils.getSearchPaths(), t = [].concat(w), n = 0, i = e.length; n < i; n++) {
var o = e[n];
-1 == t.indexOf(o) && t.push(o);
}
cc.sys.localStorage.setItem("HotUpdateSearchPaths", JSON.stringify(t));
cc.sys.localStorage.setItem("RestartAfterHotUpdate", "true");
jsb.fileUtils.setSearchPaths(t);
cc.log("searchPaths: ", t);
cc.audioEngine.stopAll();
setTimeout(function() {
cc.game.restart();
}, 0);
}
});
cc._RF.pop();
}, {
NoticeTips: "NoticeTips",
md5: "md5"
} ],
InitGame: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "9505cGTmIBEhLKBO0D3M3n8", "InitGame");
(function() {
window.gt = {};
gt.playerData = {};
e("./config/GameConfig").init(gt);
e("./config/MsgConfig").init(gt);
e("./public/utils/UtilTools").init(gt);
e("./public/utils/Debug").init(gt);
gt.EventType = e("./config/EventType");
gt.tcp = e("./public/net/NetTcp");
gt.http = e("./public/net/NetHttp");
gt.deviceApi = e("./public/utils/DeviceApi");
gt.wxMgr = e("./public/utils/WxMgr");
gt.audio = e("./public/utils/AudioMgr");
gt.gameMode = e("./public/GameMode");
gt.ui = {};
gt.ui.toast = e("./views/msgbox/Toast");
gt.ui.noticeTips = e("./views/msgbox/NoticeTips");
})();
cc._RF.pop();
}, {
"./config/EventType": "EventType",
"./config/GameConfig": "GameConfig",
"./config/MsgConfig": "MsgConfig",
"./public/GameMode": "GameMode",
"./public/net/NetHttp": "NetHttp",
"./public/net/NetTcp": "NetTcp",
"./public/utils/AudioMgr": "AudioMgr",
"./public/utils/Debug": "Debug",
"./public/utils/DeviceApi": "DeviceApi",
"./public/utils/UtilTools": "UtilTools",
"./public/utils/WxMgr": "WxMgr",
"./views/msgbox/NoticeTips": "NoticeTips",
"./views/msgbox/Toast": "Toast"
} ],
KeyBackExit: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "209bbR3yVNJJ6nlC9UQ0v/y", "KeyBackExit");
cc.Class({
extends: cc.Component,
onLoad: function() {
cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
},
onKeyDown: function(e) {
switch (e.keyCode) {
case cc.macro.KEY.back:
gt.ui.noticeTips.show("是否退出游戏", function() {
cc.game.end();
}, null);
}
},
onDestroy: function() {
cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
}
});
cc._RF.pop();
}, {} ],
LoadingScene: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "a57daXIWTJEE6MKU4TaNpgy", "LoadingScene");
cc.Class({
extends: cc.Component,
properties: {},
onLoad: function() {},
start: function() {
cc.log("[loadingScene]: -----------------loading...");
e("InitGame");
var t = 0;
t += 1;
cc.loader.loadResDir("texture/common", function() {
(t -= 1) <= 0 && this.showLogin();
}.bind(this));
t += 1;
cc.loader.loadRes("prefab/NoticeTips", function(e, n) {
(t -= 1) <= 0 && this.showLogin();
}.bind(this));
},
showLogin: function() {
this.node.runAction(cc.sequence(cc.delayTime(.5), cc.fadeOut(.5), cc.callFunc(function() {
cc.director.loadScene("LoginScene");
})));
}
});
cc._RF.pop();
}, {
InitGame: "InitGame"
} ],
LoadingTips: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "06965G1CCFN4r72nINcbQFa", "LoadingTips");
var i = {
timeoutId: null,
showLoadingTips: function(e, t, n) {
cc.director.getScene().getChildByName("LoadingTips") ? cc.log("-----already exist LoadingTips") : cc.loader.loadRes("prefab/LoadingTip", function(i, o) {
if (!i) {
var r = cc.instantiate(o);
r.name = "LoadingTips";
r.position = gt.center;
cc.director.getScene().addChild(r);
var c = r.getChildByName("lb_wait");
e && (c.getComponent(cc.Label).string = e);
t && (this.timeoutId = setTimeout(function() {
this.removeLoadingTips();
}.bind(this), t));
if (n) {
r.active = !1;
setTimeout(function() {
r.active = !0;
}, n);
}
}
}.bind(this));
},
removeLoadingTips: function() {
if (this.timeoutId) {
clearTimeout(this.timeoutId);
this.timeoutId = null;
}
var e = cc.director.getScene().getChildByName("LoadingTips");
e && e.destroy();
}
};
t.exports = i;
cc._RF.pop();
}, {} ],
LoginScene: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "10622vpCXRIOpdjNT+kFHai", "LoginScene");
cc.Class({
extends: cc.Component,
properties: {
btnWX: cc.Button,
btnTel: cc.Button,
btnGuest: cc.Button,
editbox: cc.EditBox
},
onLoad: function() {
this.node.opacity = 0;
this.node.runAction(cc.fadeIn(.5));
gt.autoAdaptDevices();
this.addComponent("KeyBackExit");
},
start: function() {
cc.log("----------LoginScene");
},
onBtnLoginWX: function() {
cc.log("===== onBtnLoginWX");
gt.wxMgr.getWeixinToken(function(e) {
cc.log("============getWeixinToken:", e);
});
},
onBtnLoginTel: function() {
cc.log("===== onBtnLoginTel");
gt.deviceApi.gotoOpenGps();
},
onBtnLoginGuest: function() {
gt.tcp.connect({
host: gt.gateServer.ip,
port: gt.gateServer.port
}, function(e) {
cc.log("---------connect result:", e);
});
}
});
cc._RF.pop();
}, {} ],
LogoScene: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "dad16ZIk71Nfrjtog68E+NS", "LogoScene");
cc.Class({
extends: cc.Component,
properties: {},
onLoad: function() {},
onDestroy: function() {},
start: function() {
this.node.runAction(cc.sequence(cc.delayTime(.3), cc.fadeOut(.5), cc.callFunc(function() {
if (jsb && gt.open_hotupdate && "true" != cc.sys.localStorage.getItem("RestartAfterHotUpdate")) cc.director.loadScene("HotUpdate"); else {
cc.log("[LogoScene] :  skip hotUpdate -------\x3e");
cc.sys.localStorage.setItem("RestartAfterHotUpdate", "false");
cc.director.loadScene("LoadingScene");
}
})));
}
});
cc._RF.pop();
}, {} ],
MsgConfig: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "dd1abpl28dE7KnHJp59v5ZQ", "MsgConfig");
t.exports.init = function(e) {
e.LOGIN = 1001;
e.LOGOUT = 1002;
e.JOIN_ROOM = 1003;
e.SYNC_TIME = 1004;
e.SYSTEM_NOTICE = 1005;
e.WALLET_INFO = 1006;
e.REPLAY_BY_SHARE_CODE = 2003;
};
cc._RF.pop();
}, {} ],
NetHttp: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "5128eD+lM9Fwqzg/qIDR9UF", "NetHttp");
var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
return typeof e;
} : function(e) {
return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
}, o = {
postData: function(e, t, n, i) {
var r = cc.loader.getXMLHttpRequest();
r.onreadystatechange = function() {
if (4 === r.readyState && r.status >= 200 && r.status < 300) try {
var e = r.responseText;
i || (e = JSON.parse(e));
n && n(!0, e);
} catch (e) {
cc.log("HTTP Error: " + e);
n && n(!1);
} else cc.log("http error: readyState=" + r.readyState + ",  xhr.status=" + r.status);
};
r.open("POST", e, !0);
r.setRequestHeader("Access-Control-Allow-Origin", "*");
r.setRequestHeader("Access-Control-Allow-Methods", "GET, POST");
r.setRequestHeader("Access-Control-Allow-Headers", "x-requested-with,content-type");
i ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "application/json");
r.timeout = 8e3;
o.isJson(t) && (t = JSON.stringify(t));
r.send(t);
},
getData: function(e, t) {
var n = cc.loader.getXMLHttpRequest();
n.onreadystatechange = function() {
if (4 === n.readyState && n.status >= 200 && n.status < 300) {
var e = n.responseText;
t && t(!0, e);
} else 4 === n.readyState && 401 == n.status && t(!1, {
status: 401
});
};
n.withCredentials = !0;
n.open("GET", e, !0);
n.timeout = 8e3;
n.send();
},
isJson: function(e) {
return "object" == ("undefined" == typeof e ? "undefined" : i(e)) && "[object object]" == Object.prototype.toString.call(e).toLowerCase() && !e.length;
}
};
t.exports = o;
cc._RF.pop();
}, {} ],
NetTcp: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "450d24VPTRB1ok7LmhOkz+9", "NetTcp");
var i = {}, o = 1, r = 2, c = 3, s = null, a = {}, l = {}, u = c;
i.registerMsg = function(e, t, n) {
null != e && "undefined" != e || cc.log(" invalid msgId ");
a[e] = a[e] || [];
for (var i = a[e], o = 0, r = i.length; o < r; o++) if (i[o].obj == t && i[o].func == n) return;
i.push({
obj: t,
func: n
});
};
i.unregisterMsg = function(e, t) {
var n = a[e];
if ("undefined" != n) for (var i = 0, o = n.length; i < o; i++) if (n[i].obj == t) {
n.splice(i, 1);
break;
}
};
i.unregisterAllMsg = function(e) {
for (var t in a) for (var n = a[t], i = n.length - 1; i >= 0; i--) n[i].obj == e && n.splice(i, 1);
};
i.connect = function(e, t) {
if (u != o && u != r) {
u = o;
l = e;
s = t;
i.disconnect(function() {
pomelo.init(l, function() {
u = r;
s && s(!0);
});
});
} else cc.log("do nothing, now connect state =:", u);
};
i.disconnect = function(e) {
u = c;
pomelo.disconnect(function() {
e && e();
});
};
i.reconnect = function() {
l.reconnect = !0;
i.connect(l);
};
i.sendMessage = function(e) {};
pomelo.on("onKick", function(e) {
cc.log("---NetTcp:onKick");
});
pomelo.on("close", function(e) {
cc.log("---NetTcp:onClose, state = ", u);
u = c;
});
pomelo.on("disconnect", function(e) {
cc.log("---NetTcp:onDisconnect");
});
pomelo.on("reconnect", function() {
cc.log("---NetTcp:onReconnect");
});
t.exports = i;
cc._RF.pop();
}, {} ],
NoticeTips: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "e4b6captclCP5aVP6KnmU47", "NoticeTips");
var i = {
show: function(e, t, n, i, o) {
var r = this;
cc.loader.loadRes("prefab/NoticeTips", function(c, s) {
if (!c) {
var a = cc.instantiate(s);
a.name = "NoticeTips";
a.position = gt.center;
cc.director.getScene().addChild(a);
var l = a.getChildByName("Img_bg"), u = l.getChildByName("node_top"), f = l.getChildByName("node_bot"), d = f.getChildByName("Btn_ok"), p = f.getChildByName("Btn_cancel");
gt.addClickEvent(d, function() {
a.destroy();
t && t();
}, r);
gt.addClickEvent(p, function() {
a.destroy();
n && n();
}, r);
if (i) {
p.active = !1;
d.x = 0;
}
if (o) {
if (o.imgOkPath) {
d.active = !1;
var h = d.getComponent(cc.Sprite);
cc.loader.loadRes(o.imgOkPath, cc.SpriteFrame, function(e, t) {
h.spriteFrame = t;
d.active = !0;
});
}
if (o.imgCancelPath) {
p.active = !1;
var g = p.getComponent(cc.Sprite);
cc.loader.loadRes(o.imgCancelPath, cc.SpriteFrame, function(e, t) {
g.spriteFrame = t;
p.active = !0;
});
}
o.strOk && (d.getChildByName("Label").getComponent(cc.Label).string = o.strOk);
o.strCancel && (p.getChildByName("Label").getComponent(cc.Label).string = o.strCancel);
}
var v = l.getChildByName("Label_Tips").getComponent(cc.Label);
v.string = e;
v.node.width = l.width - 80;
v.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
v.scheduleOnce(function() {
var e = v.node.height - 200;
if (e > 0) {
l.height += e;
u.y = .5 * l.height;
f.y = .5 * -l.height;
}
}, 0);
}
});
},
isExist: function() {
return !!cc.director.getScene().getChildByName("NoticeTips");
}
};
t.exports = i;
cc._RF.pop();
}, {} ],
StrTools: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "91daahO/21Kn7Qea22v4FBk", "StrTools");
var i = {
getShortString: function(e, t, n) {
if (e.length > t) {
n = n || "...";
return e.substr(0, t) + n;
}
return e;
},
stringToByte: function(e) {
for (var t = new Array(), n = 0, i = e.length; n < i; n++) {
var o = e.charCodeAt(n);
if (o >= 65536 && o <= 1114111) {
t.push(o >> 18 & 7 | 240);
t.push(o >> 12 & 63 | 128);
t.push(o >> 6 & 63 | 128);
t.push(63 & o | 128);
} else if (o >= 2048 && o <= 65535) {
t.push(o >> 12 & 15 | 224);
t.push(o >> 6 & 63 | 128);
t.push(63 & o | 128);
} else if (o >= 128 && o <= 2047) {
t.push(o >> 6 & 31 | 192);
t.push(63 & o | 128);
} else t.push(255 & o);
}
return t;
},
byteToString: function(e) {
if ("string" == typeof e) return e;
for (var t = "", n = e, i = 0; i < n.length; i++) {
var o = n[i].toString(2), r = o.match(/^1+?(?=0)/);
if (r && 8 == o.length) {
for (var c = r[0].length, s = n[i].toString(2).slice(7 - c), a = 1; a < c; a++) s += n[a + i].toString(2).slice(2);
t += String.fromCharCode(parseInt(s, 2));
i += c - 1;
} else t += String.fromCharCode(n[i]);
}
return t;
}
};
t.exports = i;
cc._RF.pop();
}, {} ],
Toast: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "9d27bd8AmVFZbo6ZH9ltd/g", "Toast");
var i = {
show: function(e, t) {
t = t || cc.v2(0, 0);
cc.loader.loadRes("prefab/Toast", function(n, i) {
if (!n) {
var o = cc.v2(gt.center.x, gt.center.y - 60).add(t), r = cc.instantiate(i);
r.getComponent(cc.Label).string = e;
r.position = o;
cc.director.getScene().addChild(r);
var c = cc.moveTo(1, cc.v2(o.x, o.y + 100)), s = cc.sequence(c, cc.delayTime(.4), cc.fadeOut(.5), cc.removeSelf());
r.runAction(s);
}
});
}
};
t.exports = i;
cc._RF.pop();
}, {} ],
UtilTools: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "f78344A3zxEh6MViRS1AqYk", "UtilTools");
var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
return typeof e;
} : function(e) {
return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};
t.exports.init = function(t) {
t.isNative = function() {
return cc.sys.isNative && jsb;
};
t.isAndroid = function() {
return cc.sys.os == cc.sys.OS_ANDROID;
};
t.isIOS = function() {
return cc.sys.os == cc.sys.OS_IOS;
};
t.isIOSReview = function() {
return !!t.isIOS() && t.isReview;
};
t.getDeviceId = function() {
return t.deviceApi.getDeviceId();
};
t.retain = function(e) {
cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS || e.retain();
};
t.release = function(e) {
e && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS && e.release();
};
t.addPersistNode = function(e) {
cc.game.addPersistRootNode(e);
};
t.removePersistNode = function(e) {
cc.game.removePersistRootNode(e);
};
t.setLocal = function(e, n) {
e += "";
n += "";
cc.sys.localStorage.setItem(e, t.encodeString(n));
};
t.getLocal = function(e, n) {
e += "";
var i = cc.sys.localStorage.getItem(e);
i && (i = t.decodeString(i));
(!i || i.length <= 0) && (i = n);
return i;
};
t.deleteLocal = function(e) {
e += "";
cc.sys.localStorage.removeItem(t.encodeString(e));
};
t.encodeString = function(e) {
for (var t = String.fromCharCode(e.charCodeAt(0) + e.length), n = 1; n < e.length; n++) t += String.fromCharCode(e.charCodeAt(n) + e.charCodeAt(n - 1));
return t = escape(t);
};
t.decodeString = function(e) {
e = unescape(e);
for (var t = String.fromCharCode(e.charCodeAt(0) - e.length), n = 1; n < e.length; n++) t += String.fromCharCode(e.charCodeAt(n) - t.charCodeAt(n - 1));
return t;
};
t.bindParams = function() {
var e = Array.prototype.slice.call(arguments), t = e.shift();
if ("function" == typeof t) return function() {
return t.apply(null, e.concat(Array.prototype.slice.call(arguments)));
};
};
t.random = function(e, t) {
return Math.floor(Math.random() * (t - e + 1) + e);
};
t.stringToBytes = function(e) {
for (var t, n = [], i = 0; i < e.length; i++) {
t = e.charCodeAt(i);
var o = [];
do {
o.push(255 & t);
t >>= 8;
} while (t);
n = n.concat(o.reverse());
}
return n;
};
t.jsToCByShort = function(e) {
var t = Math.floor(e / 256), n = Math.floor(e % 256);
return String.fromCharCode(t, n);
};
t.jsToCByInt = function(e) {
var t = Math.floor(e / 16777216), n = Math.floor(e / 65536) % 256, i = Math.floor(e / 256) % 256, o = Math.floor(e % 256);
return String.fromCharCode(t, n, i, o);
};
t.srcSum = function(e, t) {
for (var n = 65535, i = 0; i < t; i++) {
0 == ((n ^= e[i]) && 1) ? n /= 2 : n = n / 2 ^ 28849;
}
return n;
};
t.convertGPS2GCJ = function(e, t) {
var n = 3.141592653589793, i = .006693421622965943;
var o = function(e, t) {
var i = 2 * e - 100 + 3 * t + .2 * t * t + .1 * e * t + .2 * Math.sqrt(Math.abs(e));
i += 2 * (20 * Math.sin(6 * e * n) + 20 * Math.sin(2 * e * n)) / 3;
i += 2 * (20 * Math.sin(t * n) + 40 * Math.sin(t / 3 * n)) / 3;
return i += 2 * (160 * Math.sin(t / 12 * n) + 320 * Math.sin(t * n / 30)) / 3;
}((e = Number(e)) - 105, (t = Number(t)) - 35), r = function(e, t) {
var i = 300 + e + 2 * t + .1 * e * e + .1 * e * t + .1 * Math.sqrt(Math.abs(e));
i += 2 * (20 * Math.sin(6 * e * n) + 20 * Math.sin(2 * e * n)) / 3;
i += 2 * (20 * Math.sin(e * n) + 40 * Math.sin(e / 3 * n)) / 3;
return i += 2 * (150 * Math.sin(e / 12 * n) + 300 * Math.sin(e / 30 * n)) / 3;
}(e - 105, t - 35), c = t / 180 * n, s = Math.sin(c);
s = 1 - i * s * s;
var a = Math.sqrt(s);
return {
lat: t + (o = 180 * o / (6378245 * (1 - i) / (s * a) * n)),
lng: e + (r = 180 * r / (6378245 / a * Math.cos(c) * n))
};
};
t.gcj02towgs84 = function(e, t) {
if (out_of_china(e, t)) return [ e, t ];
var n = transformlat(e - 105, t - 35), i = transformlng(e - 105, t - 35), o = t / 180 * PI, r = Math.sin(o);
r = 1 - ee * r * r;
var c = Math.sqrt(r);
n = 180 * n / (a * (1 - ee) / (r * c) * PI);
i = 180 * i / (a / c * Math.cos(o) * PI);
mglat = t + n;
mglng = e + i;
return [ 2 * e - mglng, 2 * t - mglat ];
};
t.getDistanceOfTwoPoint = function(e, t, n, i) {
var o = function(e) {
return e * Math.PI / 180;
}, r = o(e), c = o(n), s = r - c, a = o(t) - o(i), l = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(s / 2), 2) + Math.cos(r) * Math.cos(c) * Math.pow(Math.sin(a / 2), 2)));
l *= 6378.137;
return Math.abs(l);
};
t.convertNumToShort = function(e, t, n, i) {
var o = [ "", "万", "亿", "万亿" ], r = 0 != e ? e / Math.abs(e) : 1;
e = Math.abs(e);
i && (o = i);
t = null == t ? 1e4 : t;
n = null == n ? 1 : n;
for (var c = 0; e >= t; ) {
c++;
e /= t;
}
return (e = Math.floor(e * Math.pow(10, n)) / Math.pow(10, n)) * r + o[c];
};
t.captureScreen = function(e, t) {
var n = Math.floor(e.width), i = Math.floor(e.height), o = jsb.fileUtils.getWritablePath() + "hlbtest.jpg";
jsb.fileUtils.isFileExist(o) && jsb.fileUtils.removeFile(o);
var r = new cc.Node();
r.position = cc.v2(.5 * n, .5 * i);
r.parent = e.parent;
var c = r.addComponent(cc.Camera);
c.cullingMask = 4294967295;
var s = new cc.RenderTexture(), a = cc.game._renderContext;
s.initWithSize(n, i, a.STENCIL_INDEX8);
c.targetTexture = s;
c.render(e);
for (var l = s.readPixels(), u = new Uint8Array(n * i * 4), f = 4 * n, d = 0; d < i; d++) for (var p = i - 1 - d, h = Math.floor(p * n * 4), g = d * n * 4, v = 0; v < f; v++) u[g + v] = l[h + v];
jsb.saveImageData(u, n, i, o);
console.log("截图成功，图片保存在 ====>", o);
e.parent.removeChild(c);
t && t(o);
};
t.WXShareLink = function(e, n, i, o, r) {
var c = t.webShareIcon;
o >= 0 && e && n && i && t.WxMgr.wxShareWeb(o, n, i, c, e, r);
};
t.WXShareImage = function(e, n, i) {
n >= 0 && e && t.WxMgr.wxShareImg(n, e, i);
};
t.isUserWSS = function() {
var e = !1;
-1 === t.loginServerAddress.indexOf(":") && cc.sys.isBrowser && (e = !0);
return e;
};
t.btnClickEvent = function(e, n, i, o) {
if (null == e) return null;
e.on("click", n, i);
e.on("touchstart", function() {
t.audio.playEffect(o || "common/btn_click", !1);
});
return e;
};
t.autoAdaptDevices = function() {
var e = cc.find("Canvas"), n = e.getComponent(cc.Canvas);
if (e.width / e.height < n.designResolution.width / n.designResolution.height) {
n.fitWidth = !0;
n.fitHeight = !1;
} else {
n.fitWidth = !1;
n.fitHeight = !0;
}
t.setAdaptIphoneX();
};
t.setAdaptIphoneX = function(e) {
var t = cc.find("Canvas"), n = "node_root";
e && (n = e);
var i = t.getChildByName(n), o = function() {
if (i) {
var e = i.getComponent(cc.Widget);
e.top = 0;
e.bottom = 0;
e.left = 0;
e.right = 0;
}
};
if (cc.sys.isNative && cc.sys.platform == cc.sys.IPHONE) {
var r = cc.view.getFrameSize();
2436 == r.width && 1125 == r.height || 1125 == r.width && 2436 == r.height || o();
} else o();
};
t.checkIpAndGps = function(e, n) {
var i = function(e) {
return !(0 === e.lat && 0 === e.lng);
}, o = function(e, t) {
return e.ip.split(":")[0] == t.ip.split(":")[0];
}, r = function(e, n) {
return !!i(e) && (!!i(n) && t.getDistanceOfTwoPoint(e.lat, e.lng, n.lat, n.lng) <= .2);
};
if (n) {
for (c = 0; c < e.length; c++) if (e[c] && e[c].uid != n.uid && o(e[c], n)) return !0;
for (c = 0; c < e.length; c++) if (e[c] && e[c].uid != n.uid && r(e[c], n)) return !0;
} else {
for (var c = 0; c < e.length - 1; c++) if (e[c]) for (var s = c + 1; s < e.length; s++) if (e[s] && o(e[c], e[s])) return !0;
for (var c = 0; c < e.length - 1; c++) if (e[c]) for (s = c + 1; s < e.length; s++) if (e[s] && r(e[c], e[s])) return !0;
}
return !1;
};
t.showAlertAction = function(e, t, n, i, o) {
var r = n, c = i;
if (t) {
e.scale = null == r ? 0 : r;
null == c && (c = 1);
} else {
null == r && (e.scale = 1);
null == c && (c = 0);
}
var s = cc.scaleTo(.2, c);
t ? s.easing(cc.easeBackOut()) : s.easing(cc.easeSineIn());
e.runAction(cc.sequence(s, cc.callFunc(function() {
o && o();
})));
};
t.createrSpriteAni = function(e, t, n, i, o, r, c, s) {
var a = new cc.Node("node_eff");
a.addComponent(cc.Sprite);
this.addSpriteAni(a, e, t, n, i, o, r, c, s);
return a;
};
t.addSpriteAni = function(e, t, n, i, o, r, c, s, a) {
a || (a = 1);
for (var l = function(e, t) {
if (t) {
return e < 10 ? "0" + e : e;
}
return e;
}, u = [], f = 0; f < i; f++) {
var d = n + l(f + a, !0);
s && (d = n + s + l(f + a, !0));
t._spriteFrames[d] && u.push(t._spriteFrames[d]);
}
var p = e.addComponent(cc.Animation), h = cc.AnimationClip.createWithSpriteFrames(u, 30);
r && (h.wrapMode = cc.WrapMode.Loop);
h.speed = o;
p.addClip(h, n);
p.on("finished", function() {
c && c();
});
p.play(n);
};
t.isEmptyObject = function(e) {
for (var t in e) return !1;
return !0;
};
t.cloneObj = function e(t) {
var n = {};
t instanceof Array && (n = []);
for (var o in t) {
var r = t[o];
n[o] = "object" === ("undefined" == typeof r ? "undefined" : i(r)) ? e(r) : r;
}
return n;
};
t.addClickEvent = function(e, t, n, i) {
if (null == e) return null;
e.on("click", function() {
t && t.call(n);
}, n);
};
var n = e("LoadingTips");
t.showLoadingTips = n.showLoadingTips;
t.removeLoadingTips = n.removeLoadingTips;
var o = e("EventMgr");
t.addEventHandler = o.addEventHandler;
t.removeEventHandler = o.removeEventHandler;
t.removeAllEventHandler = o.removeAllEventHandler;
t.dispatchEvent = o.dispatchEvent;
};
cc._RF.pop();
}, {
EventMgr: "EventMgr",
LoadingTips: "LoadingTips"
} ],
WxMgr: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "f7c61Tvs/1Mtah+1S8FQQFp", "WxMgr");
var i = {}, o = {};
i.execCallback = function(e, t) {
o[e] && o[e](t);
};
i.getWeixinToken = function(e) {
o.weixin_token = e;
cc.sys.os == cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod("com/happy9/pyqps/wxapi/WXUtils", "getWeixinToken", "(Ljava/lang/String;)V", gt.wxAppId) : (cc.sys.os, 
cc.sys.OS_IOS);
};
t.exports = i;
cc._RF.pop();
}, {} ],
md5: [ function(require, module, exports) {
(function(process, global) {
"use strict";
cc._RF.push(module, "07c3fMmeolNQ7tzGiAy3a4I", "md5");
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
return typeof e;
} : function(e) {
return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};
(function() {
var ERROR = "input is invalid type", WINDOW = "object" === ("undefined" == typeof window ? "undefined" : _typeof(window)), root = WINDOW ? window : {};
root.JS_MD5_NO_WINDOW && (WINDOW = !1);
var WEB_WORKER = !WINDOW && "object" === ("undefined" == typeof self ? "undefined" : _typeof(self)), NODE_JS = !root.JS_MD5_NO_NODE_JS && "object" === ("undefined" == typeof process ? "undefined" : _typeof(process)) && process.versions && process.versions.node;
NODE_JS ? root = global : WEB_WORKER && (root = self);
var COMMON_JS = !root.JS_MD5_NO_COMMON_JS && "object" === ("undefined" == typeof module ? "undefined" : _typeof(module)) && module.exports, AMD = "function" == typeof define && define.amd, ARRAY_BUFFER = !root.JS_MD5_NO_ARRAY_BUFFER && "undefined" != typeof ArrayBuffer, HEX_CHARS = "0123456789abcdef".split(""), EXTRA = [ 128, 32768, 8388608, -2147483648 ], SHIFT = [ 0, 8, 16, 24 ], OUTPUT_TYPES = [ "hex", "array", "digest", "buffer", "arrayBuffer", "base64" ], BASE64_ENCODE_CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""), blocks = [], buffer8;
if (ARRAY_BUFFER) {
var buffer = new ArrayBuffer(68);
buffer8 = new Uint8Array(buffer);
blocks = new Uint32Array(buffer);
}
!root.JS_MD5_NO_NODE_JS && Array.isArray || (Array.isArray = function(e) {
return "[object Array]" === Object.prototype.toString.call(e);
});
!ARRAY_BUFFER || !root.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW && ArrayBuffer.isView || (ArrayBuffer.isView = function(e) {
return "object" === ("undefined" == typeof e ? "undefined" : _typeof(e)) && e.buffer && e.buffer.constructor === ArrayBuffer;
});
var createOutputMethod = function(e) {
return function(t) {
return new Md5(!0).update(t)[e]();
};
}, createMethod = function() {
var e = createOutputMethod("hex");
NODE_JS && (e = nodeWrap(e));
e.create = function() {
return new Md5();
};
e.update = function(t) {
return e.create().update(t);
};
for (var t = 0; t < OUTPUT_TYPES.length; ++t) {
var n = OUTPUT_TYPES[t];
e[n] = createOutputMethod(n);
}
return e;
}, nodeWrap = function nodeWrap(method) {
var crypto = eval("require('crypto')"), Buffer = eval("require('buffer').Buffer"), nodeMethod = function(e) {
if ("string" == typeof e) return crypto.createHash("md5").update(e, "utf8").digest("hex");
if (null === e || void 0 === e) throw ERROR;
e.constructor === ArrayBuffer && (e = new Uint8Array(e));
return Array.isArray(e) || ArrayBuffer.isView(e) || e.constructor === Buffer ? crypto.createHash("md5").update(new Buffer(e)).digest("hex") : method(e);
};
return nodeMethod;
};
function Md5(e) {
if (e) {
blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
this.blocks = blocks;
this.buffer8 = buffer8;
} else if (ARRAY_BUFFER) {
var t = new ArrayBuffer(68);
this.buffer8 = new Uint8Array(t);
this.blocks = new Uint32Array(t);
} else this.blocks = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
this.h0 = this.h1 = this.h2 = this.h3 = this.start = this.bytes = this.hBytes = 0;
this.finalized = this.hashed = !1;
this.first = !0;
}
Md5.prototype.update = function(e) {
if (!this.finalized) {
var t, n = "undefined" == typeof e ? "undefined" : _typeof(e);
if ("string" !== n) {
if ("object" !== n) throw ERROR;
if (null === e) throw ERROR;
if (ARRAY_BUFFER && e.constructor === ArrayBuffer) e = new Uint8Array(e); else if (!(Array.isArray(e) || ARRAY_BUFFER && ArrayBuffer.isView(e))) throw ERROR;
t = !0;
}
for (var i, o, r = 0, c = e.length, s = this.blocks, a = this.buffer8; r < c; ) {
if (this.hashed) {
this.hashed = !1;
s[0] = s[16];
s[16] = s[1] = s[2] = s[3] = s[4] = s[5] = s[6] = s[7] = s[8] = s[9] = s[10] = s[11] = s[12] = s[13] = s[14] = s[15] = 0;
}
if (t) if (ARRAY_BUFFER) for (o = this.start; r < c && o < 64; ++r) a[o++] = e[r]; else for (o = this.start; r < c && o < 64; ++r) s[o >> 2] |= e[r] << SHIFT[3 & o++]; else if (ARRAY_BUFFER) for (o = this.start; r < c && o < 64; ++r) if ((i = e.charCodeAt(r)) < 128) a[o++] = i; else if (i < 2048) {
a[o++] = 192 | i >> 6;
a[o++] = 128 | 63 & i;
} else if (i < 55296 || i >= 57344) {
a[o++] = 224 | i >> 12;
a[o++] = 128 | i >> 6 & 63;
a[o++] = 128 | 63 & i;
} else {
i = 65536 + ((1023 & i) << 10 | 1023 & e.charCodeAt(++r));
a[o++] = 240 | i >> 18;
a[o++] = 128 | i >> 12 & 63;
a[o++] = 128 | i >> 6 & 63;
a[o++] = 128 | 63 & i;
} else for (o = this.start; r < c && o < 64; ++r) if ((i = e.charCodeAt(r)) < 128) s[o >> 2] |= i << SHIFT[3 & o++]; else if (i < 2048) {
s[o >> 2] |= (192 | i >> 6) << SHIFT[3 & o++];
s[o >> 2] |= (128 | 63 & i) << SHIFT[3 & o++];
} else if (i < 55296 || i >= 57344) {
s[o >> 2] |= (224 | i >> 12) << SHIFT[3 & o++];
s[o >> 2] |= (128 | i >> 6 & 63) << SHIFT[3 & o++];
s[o >> 2] |= (128 | 63 & i) << SHIFT[3 & o++];
} else {
i = 65536 + ((1023 & i) << 10 | 1023 & e.charCodeAt(++r));
s[o >> 2] |= (240 | i >> 18) << SHIFT[3 & o++];
s[o >> 2] |= (128 | i >> 12 & 63) << SHIFT[3 & o++];
s[o >> 2] |= (128 | i >> 6 & 63) << SHIFT[3 & o++];
s[o >> 2] |= (128 | 63 & i) << SHIFT[3 & o++];
}
this.lastByteIndex = o;
this.bytes += o - this.start;
if (o >= 64) {
this.start = o - 64;
this.hash();
this.hashed = !0;
} else this.start = o;
}
if (this.bytes > 4294967295) {
this.hBytes += this.bytes / 4294967296 << 0;
this.bytes = this.bytes % 4294967296;
}
return this;
}
};
Md5.prototype.finalize = function() {
if (!this.finalized) {
this.finalized = !0;
var e = this.blocks, t = this.lastByteIndex;
e[t >> 2] |= EXTRA[3 & t];
if (t >= 56) {
this.hashed || this.hash();
e[0] = e[16];
e[16] = e[1] = e[2] = e[3] = e[4] = e[5] = e[6] = e[7] = e[8] = e[9] = e[10] = e[11] = e[12] = e[13] = e[14] = e[15] = 0;
}
e[14] = this.bytes << 3;
e[15] = this.hBytes << 3 | this.bytes >>> 29;
this.hash();
}
};
Md5.prototype.hash = function() {
var e, t, n, i, o, r, c = this.blocks;
if (this.first) t = ((t = ((e = ((e = c[0] - 680876937) << 7 | e >>> 25) - 271733879 << 0) ^ (n = ((n = (-271733879 ^ (i = ((i = (-1732584194 ^ 2004318071 & e) + c[1] - 117830708) << 12 | i >>> 20) + e << 0) & (-271733879 ^ e)) + c[2] - 1126478375) << 17 | n >>> 15) + i << 0) & (i ^ e)) + c[3] - 1316259209) << 22 | t >>> 10) + n << 0; else {
e = this.h0;
t = this.h1;
n = this.h2;
t = ((t += ((e = ((e += ((i = this.h3) ^ t & (n ^ i)) + c[0] - 680876936) << 7 | e >>> 25) + t << 0) ^ (n = ((n += (t ^ (i = ((i += (n ^ e & (t ^ n)) + c[1] - 389564586) << 12 | i >>> 20) + e << 0) & (e ^ t)) + c[2] + 606105819) << 17 | n >>> 15) + i << 0) & (i ^ e)) + c[3] - 1044525330) << 22 | t >>> 10) + n << 0;
}
t = ((t += ((e = ((e += (i ^ t & (n ^ i)) + c[4] - 176418897) << 7 | e >>> 25) + t << 0) ^ (n = ((n += (t ^ (i = ((i += (n ^ e & (t ^ n)) + c[5] + 1200080426) << 12 | i >>> 20) + e << 0) & (e ^ t)) + c[6] - 1473231341) << 17 | n >>> 15) + i << 0) & (i ^ e)) + c[7] - 45705983) << 22 | t >>> 10) + n << 0;
t = ((t += ((e = ((e += (i ^ t & (n ^ i)) + c[8] + 1770035416) << 7 | e >>> 25) + t << 0) ^ (n = ((n += (t ^ (i = ((i += (n ^ e & (t ^ n)) + c[9] - 1958414417) << 12 | i >>> 20) + e << 0) & (e ^ t)) + c[10] - 42063) << 17 | n >>> 15) + i << 0) & (i ^ e)) + c[11] - 1990404162) << 22 | t >>> 10) + n << 0;
t = ((t += ((e = ((e += (i ^ t & (n ^ i)) + c[12] + 1804603682) << 7 | e >>> 25) + t << 0) ^ (n = ((n += (t ^ (i = ((i += (n ^ e & (t ^ n)) + c[13] - 40341101) << 12 | i >>> 20) + e << 0) & (e ^ t)) + c[14] - 1502002290) << 17 | n >>> 15) + i << 0) & (i ^ e)) + c[15] + 1236535329) << 22 | t >>> 10) + n << 0;
t = ((t += ((i = ((i += (t ^ n & ((e = ((e += (n ^ i & (t ^ n)) + c[1] - 165796510) << 5 | e >>> 27) + t << 0) ^ t)) + c[6] - 1069501632) << 9 | i >>> 23) + e << 0) ^ e & ((n = ((n += (e ^ t & (i ^ e)) + c[11] + 643717713) << 14 | n >>> 18) + i << 0) ^ i)) + c[0] - 373897302) << 20 | t >>> 12) + n << 0;
t = ((t += ((i = ((i += (t ^ n & ((e = ((e += (n ^ i & (t ^ n)) + c[5] - 701558691) << 5 | e >>> 27) + t << 0) ^ t)) + c[10] + 38016083) << 9 | i >>> 23) + e << 0) ^ e & ((n = ((n += (e ^ t & (i ^ e)) + c[15] - 660478335) << 14 | n >>> 18) + i << 0) ^ i)) + c[4] - 405537848) << 20 | t >>> 12) + n << 0;
t = ((t += ((i = ((i += (t ^ n & ((e = ((e += (n ^ i & (t ^ n)) + c[9] + 568446438) << 5 | e >>> 27) + t << 0) ^ t)) + c[14] - 1019803690) << 9 | i >>> 23) + e << 0) ^ e & ((n = ((n += (e ^ t & (i ^ e)) + c[3] - 187363961) << 14 | n >>> 18) + i << 0) ^ i)) + c[8] + 1163531501) << 20 | t >>> 12) + n << 0;
t = ((t += ((i = ((i += (t ^ n & ((e = ((e += (n ^ i & (t ^ n)) + c[13] - 1444681467) << 5 | e >>> 27) + t << 0) ^ t)) + c[2] - 51403784) << 9 | i >>> 23) + e << 0) ^ e & ((n = ((n += (e ^ t & (i ^ e)) + c[7] + 1735328473) << 14 | n >>> 18) + i << 0) ^ i)) + c[12] - 1926607734) << 20 | t >>> 12) + n << 0;
t = ((t += ((r = (i = ((i += ((o = t ^ n) ^ (e = ((e += (o ^ i) + c[5] - 378558) << 4 | e >>> 28) + t << 0)) + c[8] - 2022574463) << 11 | i >>> 21) + e << 0) ^ e) ^ (n = ((n += (r ^ t) + c[11] + 1839030562) << 16 | n >>> 16) + i << 0)) + c[14] - 35309556) << 23 | t >>> 9) + n << 0;
t = ((t += ((r = (i = ((i += ((o = t ^ n) ^ (e = ((e += (o ^ i) + c[1] - 1530992060) << 4 | e >>> 28) + t << 0)) + c[4] + 1272893353) << 11 | i >>> 21) + e << 0) ^ e) ^ (n = ((n += (r ^ t) + c[7] - 155497632) << 16 | n >>> 16) + i << 0)) + c[10] - 1094730640) << 23 | t >>> 9) + n << 0;
t = ((t += ((r = (i = ((i += ((o = t ^ n) ^ (e = ((e += (o ^ i) + c[13] + 681279174) << 4 | e >>> 28) + t << 0)) + c[0] - 358537222) << 11 | i >>> 21) + e << 0) ^ e) ^ (n = ((n += (r ^ t) + c[3] - 722521979) << 16 | n >>> 16) + i << 0)) + c[6] + 76029189) << 23 | t >>> 9) + n << 0;
t = ((t += ((r = (i = ((i += ((o = t ^ n) ^ (e = ((e += (o ^ i) + c[9] - 640364487) << 4 | e >>> 28) + t << 0)) + c[12] - 421815835) << 11 | i >>> 21) + e << 0) ^ e) ^ (n = ((n += (r ^ t) + c[15] + 530742520) << 16 | n >>> 16) + i << 0)) + c[2] - 995338651) << 23 | t >>> 9) + n << 0;
t = ((t += ((i = ((i += (t ^ ((e = ((e += (n ^ (t | ~i)) + c[0] - 198630844) << 6 | e >>> 26) + t << 0) | ~n)) + c[7] + 1126891415) << 10 | i >>> 22) + e << 0) ^ ((n = ((n += (e ^ (i | ~t)) + c[14] - 1416354905) << 15 | n >>> 17) + i << 0) | ~e)) + c[5] - 57434055) << 21 | t >>> 11) + n << 0;
t = ((t += ((i = ((i += (t ^ ((e = ((e += (n ^ (t | ~i)) + c[12] + 1700485571) << 6 | e >>> 26) + t << 0) | ~n)) + c[3] - 1894986606) << 10 | i >>> 22) + e << 0) ^ ((n = ((n += (e ^ (i | ~t)) + c[10] - 1051523) << 15 | n >>> 17) + i << 0) | ~e)) + c[1] - 2054922799) << 21 | t >>> 11) + n << 0;
t = ((t += ((i = ((i += (t ^ ((e = ((e += (n ^ (t | ~i)) + c[8] + 1873313359) << 6 | e >>> 26) + t << 0) | ~n)) + c[15] - 30611744) << 10 | i >>> 22) + e << 0) ^ ((n = ((n += (e ^ (i | ~t)) + c[6] - 1560198380) << 15 | n >>> 17) + i << 0) | ~e)) + c[13] + 1309151649) << 21 | t >>> 11) + n << 0;
t = ((t += ((i = ((i += (t ^ ((e = ((e += (n ^ (t | ~i)) + c[4] - 145523070) << 6 | e >>> 26) + t << 0) | ~n)) + c[11] - 1120210379) << 10 | i >>> 22) + e << 0) ^ ((n = ((n += (e ^ (i | ~t)) + c[2] + 718787259) << 15 | n >>> 17) + i << 0) | ~e)) + c[9] - 343485551) << 21 | t >>> 11) + n << 0;
if (this.first) {
this.h0 = e + 1732584193 << 0;
this.h1 = t - 271733879 << 0;
this.h2 = n - 1732584194 << 0;
this.h3 = i + 271733878 << 0;
this.first = !1;
} else {
this.h0 = this.h0 + e << 0;
this.h1 = this.h1 + t << 0;
this.h2 = this.h2 + n << 0;
this.h3 = this.h3 + i << 0;
}
};
Md5.prototype.hex = function() {
this.finalize();
var e = this.h0, t = this.h1, n = this.h2, i = this.h3;
return HEX_CHARS[e >> 4 & 15] + HEX_CHARS[15 & e] + HEX_CHARS[e >> 12 & 15] + HEX_CHARS[e >> 8 & 15] + HEX_CHARS[e >> 20 & 15] + HEX_CHARS[e >> 16 & 15] + HEX_CHARS[e >> 28 & 15] + HEX_CHARS[e >> 24 & 15] + HEX_CHARS[t >> 4 & 15] + HEX_CHARS[15 & t] + HEX_CHARS[t >> 12 & 15] + HEX_CHARS[t >> 8 & 15] + HEX_CHARS[t >> 20 & 15] + HEX_CHARS[t >> 16 & 15] + HEX_CHARS[t >> 28 & 15] + HEX_CHARS[t >> 24 & 15] + HEX_CHARS[n >> 4 & 15] + HEX_CHARS[15 & n] + HEX_CHARS[n >> 12 & 15] + HEX_CHARS[n >> 8 & 15] + HEX_CHARS[n >> 20 & 15] + HEX_CHARS[n >> 16 & 15] + HEX_CHARS[n >> 28 & 15] + HEX_CHARS[n >> 24 & 15] + HEX_CHARS[i >> 4 & 15] + HEX_CHARS[15 & i] + HEX_CHARS[i >> 12 & 15] + HEX_CHARS[i >> 8 & 15] + HEX_CHARS[i >> 20 & 15] + HEX_CHARS[i >> 16 & 15] + HEX_CHARS[i >> 28 & 15] + HEX_CHARS[i >> 24 & 15];
};
Md5.prototype.toString = Md5.prototype.hex;
Md5.prototype.digest = function() {
this.finalize();
var e = this.h0, t = this.h1, n = this.h2, i = this.h3;
return [ 255 & e, e >> 8 & 255, e >> 16 & 255, e >> 24 & 255, 255 & t, t >> 8 & 255, t >> 16 & 255, t >> 24 & 255, 255 & n, n >> 8 & 255, n >> 16 & 255, n >> 24 & 255, 255 & i, i >> 8 & 255, i >> 16 & 255, i >> 24 & 255 ];
};
Md5.prototype.array = Md5.prototype.digest;
Md5.prototype.arrayBuffer = function() {
this.finalize();
var e = new ArrayBuffer(16), t = new Uint32Array(e);
t[0] = this.h0;
t[1] = this.h1;
t[2] = this.h2;
t[3] = this.h3;
return e;
};
Md5.prototype.buffer = Md5.prototype.arrayBuffer;
Md5.prototype.base64 = function() {
for (var e, t, n, i = "", o = this.array(), r = 0; r < 15; ) {
e = o[r++];
t = o[r++];
n = o[r++];
i += BASE64_ENCODE_CHAR[e >>> 2] + BASE64_ENCODE_CHAR[63 & (e << 4 | t >>> 4)] + BASE64_ENCODE_CHAR[63 & (t << 2 | n >>> 6)] + BASE64_ENCODE_CHAR[63 & n];
}
e = o[r];
return i += BASE64_ENCODE_CHAR[e >>> 2] + BASE64_ENCODE_CHAR[e << 4 & 63] + "==";
};
var exports = createMethod();
if (COMMON_JS) module.exports = exports; else {
root.md5 = exports;
AMD && define(function() {
return exports;
});
}
})();
cc._RF.pop();
}).call(this, require("_process"), "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
}, {
_process: 1
} ]
}, {}, [ "InitGame", "EventType", "GameConfig", "MsgConfig", "GameMode", "HotUpdate", "NetHttp", "NetTcp", "AudioMgr", "Debug", "DeviceApi", "EventMgr", "KeyBackExit", "StrTools", "UtilTools", "WxMgr", "md5", "LoadingTips", "NoticeTips", "Toast", "LoadingScene", "LoginScene", "LogoScene" ]);