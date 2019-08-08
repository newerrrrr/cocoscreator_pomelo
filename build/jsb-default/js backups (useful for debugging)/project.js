window.__require = function e(t, n, c) {
function o(r, s) {
if (!n[r]) {
if (!t[r]) {
var a = r.split("/");
a = a[a.length - 1];
if (!t[a]) {
var u = "function" == typeof __require && __require;
if (!s && u) return u(a, !0);
if (i) return i(a, !0);
throw new Error("Cannot find module '" + r + "'");
}
}
var l = n[r] = {
exports: {}
};
t[r][0].call(l.exports, function(e) {
return o(t[r][1][e] || e);
}, l, l.exports, e, t, n, c);
}
return n[r].exports;
}
for (var i = "function" == typeof __require && __require, r = 0; r < c.length; r++) o(c[r]);
return o;
}({
AudioMgr: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "ee900XUtWxP6qw9Krwd/aX2", "AudioMgr");
var c = {}, o = 1, i = 1, r = null;
c.init = function() {
o = gt.getLocal("bgmVolume", 1);
i = gt.getLocal("effVolume", 1);
};
c.playMusic = function(e, t) {
this.stopMusic();
var n = "sound/" + e;
cc.loader.loadRes(n, cc.AudioClip, function(n, c) {
n ? cc.log("xxx invalid audio file:", e) : r = cc.audioEngine.playMusic(c, t, o);
}.bind(this));
};
c.stopMusic = function() {
if (null != r) {
cc.audioEngine.stopMusic(r);
r = null;
}
};
c.pauseMusic = function() {
null != r && cc.audioEngine.pauseMusic();
};
c.resumeMusic = function() {
null != r && cc.audioEngine.resumeMusic();
};
c.setMusicVolume = function(e) {
if (null != r) {
cc.audioEngine.setMusicVolume(e);
o != e && gt.setLocal("bgmVolume", e);
}
};
c.getMusicVolume = function() {
return o;
};
c.playEffect = function(e, t) {
var n = "sound/" + e;
cc.loader.loadRes(n, cc.AudioClip, function(n, c) {
n ? cc.log("### invalid audio file:", e) : i > 0 && cc.audioEngine.playEffect(c, t, i);
}.bind(this));
};
c.pauseAllEffects = function() {
cc.audioEngine.pauseAllEffects();
};
c.resumeAllEffects = function() {
cc.audioEngine.resumeAllEffects();
};
c.stopAllEffects = function() {
cc.audioEngine.stopAllEffects();
};
c.setEffectVolume = function(e) {
if (i != e) {
i = e;
gt.setLocal("effVolume", e);
}
};
c.getEffectVolume = function() {
return i;
};
c.pauseAll = function() {
this.pauseMusic();
this.pauseAllEffects();
};
c.resumeAll = function() {
this.resumeMusic();
this.resumeAllEffects();
};
c.init();
t.exports = c;
cc._RF.pop();
}, {} ],
Debug: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "813e5NqnPtCBJZe9lWTW0AO", "Debug");
var c = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
return typeof e;
} : function(e) {
return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
};
t.exports.init = function(e) {
e.dump = function(t, n) {
if (e.debug) {
var o = (n || "var") + " = " + function e(t, n) {
var o = "undefined" == typeof t ? "undefined" : c(t), i = "";
if (Array.isArray(t)) {
i = (i += "\n") + n + "[\n";
var r = n + " . . ";
for (var s in t) i += r + s + " = " + e(t[s], r) + "\n";
i = i + n + "]";
} else if ("object" == o) {
i = (i += "\n") + n + "{\n";
var a = n + " . . ";
for (var u in t) i = i + a + u + " = " + e(t[u], a) + "\n";
i = i + n + "}";
} else "string" == o ? i = i + '"' + t + '"' : "number" == o ? i += t : "function" == o && (i += "*function");
return i;
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
var c = {}, o = "org/cocos2dx/javascript/SystemAPI", i = {};
c.execCallback = function(e, t) {
cc.log("DeviceApi.execCallback: ", e, t);
i[e] && i[e](t);
};
c.copyToClipboard = function(e) {
cc.sys.os == cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod(o, "copyToClipboard", "(Ljava/lang/String;)V", e) : (cc.sys.os, 
cc.sys.OS_IOS);
};
c.getClipboardText = function(e, t) {
if (e) {
i.Tag_Clipboard = e;
var n = t ? "true" : "false";
cc.sys.os == cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod(o, "getClipboardContent", "(Ljava/lang/String;Ljava/lang/String;)V", "Tag_Clipboard", n) : (cc.sys.os, 
cc.sys.OS_IOS);
}
};
c.getBattery = function(e) {
if (e) {
i.Tag_Battery = e;
cc.sys.os == cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod(o, "getBattery", "(Ljava/lang/String;)V", "Tag_Battery") : (cc.sys.os, 
cc.sys.OS_IOS);
}
};
c.getUUID = function() {
var e = "";
cc.sys.os == cc.sys.OS_ANDROID ? e = jsb.reflection.callStaticMethod(o, "getUUID", "()Ljava/lang/String;") : (cc.sys.os, 
cc.sys.OS_IOS);
return e;
};
c.getShareCode = function() {
var e = "";
cc.sys.os == cc.sys.OS_ANDROID ? e = jsb.reflection.callStaticMethod(o, "getShareCode", "()Ljava/lang/String;") : (cc.sys.os, 
cc.sys.OS_IOS);
return e;
};
c.isGpsOpen = function() {
var e = !1;
cc.sys.os == cc.sys.OS_ANDROID ? e = jsb.reflection.callStaticMethod(o, "isGpsOPen", "()Z") : (cc.sys.os, 
cc.sys.OS_IOS);
return e;
};
c.gotoOpenGps = function() {
var e = !1;
cc.sys.os == cc.sys.OS_ANDROID ? e = jsb.reflection.callStaticMethod(o, "gotoOpenGps", "()V") : (cc.sys.os, 
cc.sys.OS_IOS);
return e;
};
c.vibrate = function(e) {
cc.sys.os == cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod(o, "vibrate", "(I)V", e) : (cc.sys.os, 
cc.sys.OS_IOS);
};
t.exports = c;
cc._RF.pop();
}, {} ],
EventMgr: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "ef14bOV1xRPNKtbnsvYFUbM", "EventMgr");
var c = {}, o = {};
c.addEventHandler = function(e, t, n) {
(o = o || {})[e] = o[e] || [];
for (var c = o[e], i = 0, r = c.length; i < r; i++) if (c[i].obj == t && c[i].func == n) return;
c.push({
obj: t,
func: n
});
};
c.removeEventHandler = function(e, t) {
(o = o || {})[e] = o[e] || [];
for (var n = o[e], c = 0, i = n.length; c < i; c++) if (n[c].obj == t) {
n.splice(c, 1);
return;
}
};
c.removeAllEventHandler = function(e) {
o = o || {};
for (var t in o) for (var n = o[t], c = n.length; c--; ) n[c].obj == e && n.splice(c, 1);
};
c.dispatchEvent = function(e, t, n) {
var c = (o = o || {})[e];
if (c) for (var i = 0, r = c.length; i < r; i++) c[i].func && c[i].func.call(this, t, n);
};
t.exports = c;
cc._RF.pop();
}, {} ],
EventType: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "3de6f/lhX9IC6tnn+pTa4d2", "EventType");
var c = {
ZZMJ: "ZZMJ",
NZMJ: "NZMJ",
PDK: "PDK",
NET_CONNECTED: "NET_CONNECTED",
NET_DISCONNECTED: "NET_DISCONNECTED",
RELOGIN: "RELOGIN",
WALLET_CHANGE: "WALLET_CHANGE",
SCENE_RESET: "SCENE_RESET"
};
t.exports = c;
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
var c = {}, o = {}, i = 0, r = 0;
c.init = function() {
c.registerMsg();
};
c.registerMsg = function() {
gt.tcp.registerMsg(gt.WALLET_INFO, c, c.onRcvWalletInfo);
gt.tcp.registerMsg(gt.REPLAY_BY_SHARE_CODE, c, c.onRcvReplayByShareCode);
gt.tcp.registerMsg(gt.SYSTEM_NOTICE, c, c.onRcvSysNotice);
gt.tcp.registerMsg(gt.SYNC_TIME, c, c.onRcvSyncTime);
cc.game.on(cc.game.EVENT_HIDE, c.onEnterBackground, c);
cc.game.on(cc.game.EVENT_SHOW, c.onEnterForeground, c);
};
c.unregisterMsg = function() {
gt.tcp.unregisterAllMsg(c);
cc.game.off(cc.game.EVENT_HIDE, c.onEnterBackground, c);
cc.game.off(cc.game.EVENT_SHOW, c.onEnterForeground, c);
};
c.savePlayerNickHead = function(e, t, n) {
o[e] = {
nick: t,
icon: n
};
};
c.getPlayerNickHead = function(e) {
return o[e];
};
c.onRcvWalletInfo = function(t) {
if (t.code && t.code < 0) e("Toast").show(t.error || ""); else {
gt.playerData.wallet = t;
gt.dispatchEvent(gt.EventType.WALLET_CHANGE);
}
};
c.reqReplayByShareCode = function(e) {
gt.tcp.sendMessage(gt.REPLAY_BY_SHARE_CODE, {
share_code: e
});
gt.showLoadingTips("请稍后。。。", 10);
};
c.onRcvReplayByShareCode = function(e) {
cc.log("=== onRcvReplayByShareCode");
gt.removeLoadingTips();
};
c.checkReplayShareCode = function() {
var e = extension.getURLShareCode();
if (e && "" != e) {
cc.log("---get replay code : ", e);
this.reqReplayByShareCode(e);
return !0;
}
return !1;
};
c.checkRoomCodeFromUrl = function() {
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
c.onRcvDuplicateLogin = function(t) {
cc.log("=== onRcvDuplicateLogin");
gt.tcp.disconnect();
e("NoticeTips").show("您的账号已在其他地方登录", function() {
cc.director.loadScene("LoadingScene");
}, null, !0);
};
c.backMainScene = function() {};
c.onTcpLoginSuccess = function() {
cc.log("@@@@ ---onTcpLoginSuccess");
};
c.onRcvSysNotice = function() {};
c.reqSyncTime = function() {
gt.tcp.sendMessage(gt.SYNC_TIME, {});
};
c.onRcvSyncTime = function(e) {
cc.log("=== onRcvSyncTime");
e.code && e.code < 0 || (i = e.utc_time - new Date());
};
c.getServerTime = function() {
return new Date() + i;
};
c.onEnterBackground = function() {
cc.log("@@@@@@@@@@@ === onEnterBackground");
r = new Date();
gt.audio.pauseAll();
};
c.onEnterForeground = function() {
var e = new Date();
0 == r && (r = e);
var t = e - r;
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
t.exports = c;
cc._RF.pop();
}, {
NoticeTips: "NoticeTips",
Toast: "Toast"
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
cc.log("-----------------loading...");
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
var c = {
timeoutId: null,
showLoadingTips: function(e, t, n) {
cc.director.getScene().getChildByName("LoadingTips") ? cc.log("-----already exist LoadingTips") : cc.loader.loadRes("prefab/LoadingTip", function(c, o) {
if (!c) {
var i = cc.instantiate(o);
i.name = "LoadingTips";
i.position = gt.center;
cc.director.getScene().addChild(i);
var r = i.getChildByName("lb_wait");
e && (r.getComponent(cc.Label).string = e);
t && (this.timeoutId = setTimeout(function() {
this.removeLoadingTips();
}.bind(this), t));
if (n) {
i.active = !1;
setTimeout(function() {
i.active = !0;
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
t.exports = c;
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
cc.log("----------LoginScene start");
},
onBtnLoginWX: function() {
cc.log("===== onBtnLoginWX");
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
start: function() {
this.node.runAction(cc.sequence(cc.delayTime(.5), cc.fadeOut(.5), cc.callFunc(function() {
cc.director.loadScene("LoadingScene");
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
NetTcp: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "450d24VPTRB1ok7LmhOkz+9", "NetTcp");
var c = {}, o = 1, i = 2, r = 3, s = null, a = {}, u = {}, l = r;
c.registerMsg = function(e, t, n) {
null != e && "undefined" != e || cc.log(" invalid msgId ");
a[e] = a[e] || [];
for (var c = a[e], o = 0, i = c.length; o < i; o++) if (c[o].obj == t && c[o].func == n) return;
c.push({
obj: t,
func: n
});
};
c.unregisterMsg = function(e, t) {
var n = a[e];
if ("undefined" != n) for (var c = 0, o = n.length; c < o; c++) if (n[c].obj == t) {
n.splice(c, 1);
break;
}
};
c.unregisterAllMsg = function(e) {
for (var t in a) for (var n = a[t], c = n.length - 1; c >= 0; c--) n[c].obj == e && n.splice(c, 1);
};
c.connect = function(e, t) {
if (l != o && l != i) {
l = o;
u = e;
s = t;
c.disconnect(function() {
pomelo.init(u, function() {
l = i;
s && s(!0);
});
});
} else cc.log("do nothing, now connect state =:", l);
};
c.disconnect = function(e) {
l = r;
pomelo.disconnect(function() {
e && e();
});
};
c.reconnect = function() {
u.reconnect = !0;
c.connect(u);
};
c.sendMessage = function(e) {};
pomelo.on("onKick", function(e) {
cc.log("---NetTcp:onKick");
});
pomelo.on("close", function(e) {
cc.log("---NetTcp:onClose, state = ", l);
l = r;
});
pomelo.on("disconnect", function(e) {
cc.log("---NetTcp:onDisconnect");
});
pomelo.on("reconnect", function() {
cc.log("---NetTcp:onReconnect");
});
t.exports = c;
cc._RF.pop();
}, {} ],
NoticeTips: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "e4b6captclCP5aVP6KnmU47", "NoticeTips");
var c = {
show: function(e, t, n, c, o) {
var i = this;
cc.loader.loadRes("prefab/NoticeTips", function(r, s) {
if (!r) {
var a = cc.instantiate(s);
a.name = "NoticeTips";
a.position = gt.center;
cc.director.getScene().addChild(a);
var u = a.getChildByName("Img_bg"), l = u.getChildByName("node_top"), g = u.getChildByName("node_bot"), f = g.getChildByName("Btn_ok"), d = g.getChildByName("Btn_cancel");
gt.addClickEvent(f, function() {
a.destroy();
t && t();
}, i);
gt.addClickEvent(d, function() {
a.destroy();
n && n();
}, i);
if (c) {
d.active = !1;
f.x = 0;
}
if (o) {
if (o.imgOkPath) {
f.active = !1;
var p = f.getComponent(cc.Sprite);
cc.loader.loadRes(o.imgOkPath, cc.SpriteFrame, function(e, t) {
p.spriteFrame = t;
f.active = !0;
});
}
if (o.imgCancelPath) {
d.active = !1;
var h = d.getComponent(cc.Sprite);
cc.loader.loadRes(o.imgCancelPath, cc.SpriteFrame, function(e, t) {
h.spriteFrame = t;
d.active = !0;
});
}
o.strOk && (f.getChildByName("Label").getComponent(cc.Label).string = o.strOk);
o.strCancel && (d.getChildByName("Label").getComponent(cc.Label).string = o.strCancel);
}
var v = u.getChildByName("Label_Tips").getComponent(cc.Label);
v.string = e;
v.node.width = u.width - 80;
v.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
v.scheduleOnce(function() {
var e = v.node.height - 200;
if (e > 0) {
u.height += e;
l.y = .5 * u.height;
g.y = .5 * -u.height;
}
}, 0);
}
});
},
isExist: function() {
return !!cc.director.getScene().getChildByName("NoticeTips");
}
};
t.exports = c;
cc._RF.pop();
}, {} ],
StrTools: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "91daahO/21Kn7Qea22v4FBk", "StrTools");
var c = {
getShortString: function(e, t, n) {
if (e.length > t) {
n = n || "...";
return e.substr(0, t) + n;
}
return e;
}
};
t.exports = c;
cc._RF.pop();
}, {} ],
Toast: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "9d27bd8AmVFZbo6ZH9ltd/g", "Toast");
var c = {
show: function(e, t) {
t = t || cc.v2(0, 0);
cc.loader.loadRes("prefab/Toast", function(n, c) {
if (!n) {
var o = cc.v2(gt.center.x, gt.center.y - 60).add(t), i = cc.instantiate(c);
i.getComponent(cc.Label).string = e;
i.position = o;
cc.director.getScene().addChild(i);
var r = cc.moveTo(1, cc.v2(o.x, o.y + 100)), s = cc.sequence(r, cc.delayTime(.4), cc.fadeOut(.5), cc.removeSelf());
i.runAction(s);
}
});
}
};
t.exports = c;
cc._RF.pop();
}, {} ],
UtilTools: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "f78344A3zxEh6MViRS1AqYk", "UtilTools");
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
var c = cc.sys.localStorage.getItem(e);
c && (c = t.decodeString(c));
(!c || c.length <= 0) && (c = n);
return c;
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
for (var t, n = [], c = 0; c < e.length; c++) {
t = e.charCodeAt(c);
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
var t = Math.floor(e / 16777216), n = Math.floor(e / 65536) % 256, c = Math.floor(e / 256) % 256, o = Math.floor(e % 256);
return String.fromCharCode(t, n, c, o);
};
t.srcSum = function(e, t) {
for (var n = 65535, c = 0; c < t; c++) {
0 == ((n ^= e[c]) && 1) ? n /= 2 : n = n / 2 ^ 28849;
}
return n;
};
t.convertGPS2GCJ = function(e, t) {
var n = 3.141592653589793, c = 6378245, o = .006693421622965943;
var i = function(e, t) {
var c = 2 * e - 100 + 3 * t + .2 * t * t + .1 * e * t + .2 * Math.sqrt(Math.abs(e));
c += 2 * (20 * Math.sin(6 * e * n) + 20 * Math.sin(2 * e * n)) / 3;
c += 2 * (20 * Math.sin(t * n) + 40 * Math.sin(t / 3 * n)) / 3;
return c += 2 * (160 * Math.sin(t / 12 * n) + 320 * Math.sin(t * n / 30)) / 3;
}((e = Number(e)) - 105, (t = Number(t)) - 35), r = function(e, t) {
var c = 300 + e + 2 * t + .1 * e * e + .1 * e * t + .1 * Math.sqrt(Math.abs(e));
c += 2 * (20 * Math.sin(6 * e * n) + 20 * Math.sin(2 * e * n)) / 3;
c += 2 * (20 * Math.sin(e * n) + 40 * Math.sin(e / 3 * n)) / 3;
return c += 2 * (150 * Math.sin(e / 12 * n) + 300 * Math.sin(e / 30 * n)) / 3;
}(e - 105, t - 35), s = t / 180 * n, a = Math.sin(s);
a = 1 - o * a * a;
var u = Math.sqrt(a);
return {
lat: t + (i = 180 * i / (c * (1 - o) / (a * u) * n)),
lng: e + (r = 180 * r / (c / u * Math.cos(s) * n))
};
};
t.gcj02towgs84 = function(e, t) {
if (out_of_china(e, t)) return [ e, t ];
var n = transformlat(e - 105, t - 35), c = transformlng(e - 105, t - 35), o = t / 180 * PI, i = Math.sin(o);
i = 1 - ee * i * i;
var r = Math.sqrt(i);
n = 180 * n / (a * (1 - ee) / (i * r) * PI);
c = 180 * c / (a / r * Math.cos(o) * PI);
mglat = t + n;
mglng = e + c;
return [ 2 * e - mglng, 2 * t - mglat ];
};
t.getDistanceOfTwoPoint = function(e, t, n, c) {
var o = function(e) {
return e * Math.PI / 180;
}, i = o(e), r = o(n), s = i - r, a = o(t) - o(c), u = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(s / 2), 2) + Math.cos(i) * Math.cos(r) * Math.pow(Math.sin(a / 2), 2)));
u *= 6378.137;
return Math.abs(u);
};
t.convertNumToShort = function(e, t, n, c) {
var o = [ "", "万", "亿", "万亿" ], i = 0 != e ? e / Math.abs(e) : 1;
e = Math.abs(e);
c && (o = c);
t = null == t ? 1e4 : t;
n = null == n ? 1 : n;
for (var r = 0; e >= t; ) {
r++;
e /= t;
}
return (e = Math.floor(e * Math.pow(10, n)) / Math.pow(10, n)) * i + o[r];
};
t.captureScreen = function(e, t) {
var n = Math.floor(e.width), c = Math.floor(e.height), o = jsb.fileUtils.getWritablePath() + "hlbtest.jpg";
jsb.fileUtils.isFileExist(o) && jsb.fileUtils.removeFile(o);
var i = new cc.Node();
i.position = cc.v2(.5 * n, .5 * c);
i.parent = e.parent;
var r = i.addComponent(cc.Camera);
r.cullingMask = 4294967295;
var s = new cc.RenderTexture(), a = cc.game._renderContext;
s.initWithSize(n, c, a.STENCIL_INDEX8);
r.targetTexture = s;
r.render(e);
for (var u = s.readPixels(), l = new Uint8Array(n * c * 4), g = 4 * n, f = 0; f < c; f++) for (var d = c - 1 - f, p = Math.floor(d * n * 4), h = f * n * 4, v = 0; v < g; v++) l[h + v] = u[p + v];
jsb.saveImageData(l, n, c, o);
console.log("截图成功，图片保存在 ====>", o);
e.parent.removeChild(r);
t && t(o);
};
t.WXShareLink = function(e, n, c, o, i) {
var r = t.webShareIcon;
o >= 0 && e && n && c && t.WxMgr.wxShareWeb(o, n, c, r, e, i);
};
t.WXShareImage = function(e, n, c) {
n >= 0 && e && t.WxMgr.wxShareImg(n, e, c);
};
t.isUserWSS = function() {
var e = !1;
-1 === t.loginServerAddress.indexOf(":") && cc.sys.isBrowser && (e = !0);
return e;
};
t.btnClickEvent = function(e, n, c, o) {
if (null == e) return null;
e.on("click", n, c);
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
var c = t.getChildByName(n), o = function() {
if (c) {
var e = c.getComponent(cc.Widget);
e.top = 0;
e.bottom = 0;
e.left = 0;
e.right = 0;
}
};
if (cc.sys.isNative && cc.sys.platform == cc.sys.IPHONE) {
var i = cc.view.getFrameSize();
2436 == i.width && 1125 == i.height || 1125 == i.width && 2436 == i.height || o();
} else o();
};
t.checkIpAndGps = function(e, n) {
var c = function(e) {
return !(0 === e.lat && 0 === e.lng);
}, o = function(e, t) {
return e.ip.split(":")[0] == t.ip.split(":")[0];
}, i = function(e, n) {
return !!c(e) && (!!c(n) && t.getDistanceOfTwoPoint(e.lat, e.lng, n.lat, n.lng) <= .2);
};
if (n) {
for (r = 0; r < e.length; r++) if (e[r] && e[r].uid != n.uid && o(e[r], n)) return !0;
for (r = 0; r < e.length; r++) if (e[r] && e[r].uid != n.uid && i(e[r], n)) return !0;
} else {
for (var r = 0; r < e.length - 1; r++) if (e[r]) for (var s = r + 1; s < e.length; s++) if (e[s] && o(e[r], e[s])) return !0;
for (var r = 0; r < e.length - 1; r++) if (e[r]) for (s = r + 1; s < e.length; s++) if (e[s] && i(e[r], e[s])) return !0;
}
return !1;
};
t.showAlertAction = function(e, t, n, c, o) {
var i = n, r = c;
if (t) {
e.scale = null == i ? 0 : i;
null == r && (r = 1);
} else {
null == i && (e.scale = 1);
null == r && (r = 0);
}
var s = cc.scaleTo(.2, r);
t ? s.easing(cc.easeBackOut()) : s.easing(cc.easeSineIn());
e.runAction(cc.sequence(s, cc.callFunc(function() {
o && o();
})));
};
t.createrSpriteAni = function(e, t, n, c, o, i, r, s) {
var a = new cc.Node("node_eff");
a.addComponent(cc.Sprite);
this.addSpriteAni(a, e, t, n, c, o, i, r, s);
return a;
};
t.addSpriteAni = function(e, t, n, c, o, i, r, s, a) {
a || (a = 1);
for (var u = function(e, t) {
if (t) {
return e < 10 ? "0" + e : e;
}
return e;
}, l = [], g = 0; g < c; g++) {
var f = n + u(g + a, !0);
s && (f = n + s + u(g + a, !0));
t._spriteFrames[f] && l.push(t._spriteFrames[f]);
}
var d = e.addComponent(cc.Animation), p = cc.AnimationClip.createWithSpriteFrames(l, 30);
i && (p.wrapMode = cc.WrapMode.Loop);
p.speed = o;
d.addClip(p, n);
d.on("finished", function() {
r && r();
});
d.play(n);
};
t.isEmptyObject = function(e) {
for (var t in e) return !1;
return !0;
};
t.addClickEvent = function(e, t, n, c) {
if (null == e) return null;
e.on("click", function() {
t && t.call(n);
}, n);
};
var n = e("LoadingTips");
t.showLoadingTips = n.showLoadingTips;
t.removeLoadingTips = n.removeLoadingTips;
var c = e("EventMgr");
t.addEventHandler = c.addEventHandler;
t.removeEventHandler = c.removeEventHandler;
t.removeAllEventHandler = c.removeAllEventHandler;
t.dispatchEvent = c.dispatchEvent;
};
cc._RF.pop();
}, {
EventMgr: "EventMgr",
LoadingTips: "LoadingTips"
} ],
WxMgr: [ function(e, t, n) {
"use strict";
cc._RF.push(t, "f7c61Tvs/1Mtah+1S8FQQFp", "WxMgr");
var c = {}, o = e("DeviceApi");
c.isWXAppInstalled = function() {
var e = !1, t = o.isInstallWXApp();
1 == Number(t) && (e = !0);
return e;
};
c.wxShareText = function(e, t, n) {
this._shareEndCall = n;
var c = {};
c.shareScene = e;
c.shareType = 1;
c.textMsg = t;
o.addCallback(this.shareResultCall.bind(this), "shareResultCall");
cDeviceApi.wxShare(JSON.stringify(c));
};
c.wxShareImg = function(e, t, n) {
this._shareEndCall = n;
var c = {};
c.shareScene = e;
c.shareType = 2;
c.imgPath = t;
o.addCallback(this.shareResultCall.bind(this), "shareResultCall");
o.wxShare(JSON.stringify(c));
};
c.wxShareWeb = function(e, t, n, c, i, r) {
this._shareEndCall = r;
var s = {};
s.shareScene = e;
s.shareType = 3;
s.linkUrl = i;
s.imgUrl = c;
s.title = t;
s.des = n;
o.addCallback(this.shareResultCall.bind(this), "shareResultCall");
o.wxShare(JSON.stringify(s));
};
c.shareResultCall = function(e) {
this._shareEndCall && this._shareEndCall(e);
};
c.openWxApp = function() {
return o.openWXApp();
};
c.getWXToken = function() {
var e = gt.getLocal("wxToken");
return e && e.length > 0 ? e : null;
};
c.saveWXToken = function(e) {
e && gt.setLocal("wxToken", e);
};
c.delWXToken = function() {
this.saveWXToken("");
};
t.exports = c;
cc._RF.pop();
}, {
DeviceApi: "DeviceApi"
} ]
}, {}, [ "InitGame", "EventType", "GameConfig", "MsgConfig", "GameMode", "NetTcp", "AudioMgr", "Debug", "DeviceApi", "EventMgr", "KeyBackExit", "StrTools", "UtilTools", "WxMgr", "LoadingTips", "NoticeTips", "Toast", "LoadingScene", "LoginScene", "LogoScene" ]);