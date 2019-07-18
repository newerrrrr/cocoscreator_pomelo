window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  AudioMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ee900XUtWxP6qw9Krwd/aX2", "AudioMgr");
    "use strict";
    var AudioMgr = {};
    var bgmVolume = 1;
    var effVolume = 1;
    var bgmAudioId = null;
    AudioMgr.init = function() {
      bgmVolume = gt.getLocal("bgmVolume", 1);
      effVolume = gt.getLocal("effVolume", 1);
    };
    AudioMgr.playMusic = function(filename, isLoop) {
      this.stopMusic();
      var filepath = "sound/" + filename;
      cc.loader.loadRes(filepath, cc.AudioClip, function(err, clip) {
        if (err) {
          cc.log("xxx invalid audio file:", filename);
          return;
        }
        bgmAudioId = cc.audioEngine.playMusic(clip, isLoop, bgmVolume);
      }.bind(this));
    };
    AudioMgr.stopMusic = function() {
      if (null != bgmAudioId) {
        cc.audioEngine.stopMusic(bgmAudioId);
        bgmAudioId = null;
      }
    };
    AudioMgr.pauseMusic = function() {
      null != bgmAudioId && cc.audioEngine.pauseMusic();
    };
    AudioMgr.resumeMusic = function() {
      null != bgmAudioId && cc.audioEngine.resumeMusic();
    };
    AudioMgr.setMusicVolume = function(volume) {
      if (null == bgmAudioId) return;
      cc.audioEngine.setMusicVolume(volume);
      bgmVolume != volume && gt.setLocal("bgmVolume", volume);
    };
    AudioMgr.getMusicVolume = function() {
      return bgmVolume;
    };
    AudioMgr.playEffect = function(filename, isLoop) {
      var filepath = "sound/" + filename;
      cc.loader.loadRes(filepath, cc.AudioClip, function(err, clip) {
        if (err) {
          cc.log("### invalid audio file:", filename);
          return;
        }
        effVolume > 0 && cc.audioEngine.playEffect(clip, isLoop, effVolume);
      }.bind(this));
    };
    AudioMgr.pauseAllEffects = function() {
      cc.audioEngine.pauseAllEffects();
    };
    AudioMgr.resumeAllEffects = function() {
      cc.audioEngine.resumeAllEffects();
    };
    AudioMgr.stopAllEffects = function() {
      cc.audioEngine.stopAllEffects();
    };
    AudioMgr.setEffectVolume = function(volume) {
      if (effVolume != volume) {
        effVolume = volume;
        gt.setLocal("effVolume", volume);
      }
    };
    AudioMgr.getEffectVolume = function() {
      return effVolume;
    };
    AudioMgr.pauseAll = function() {
      this.pauseMusic();
      this.pauseAllEffects();
    };
    AudioMgr.resumeAll = function() {
      this.resumeMusic();
      this.resumeAllEffects();
    };
    AudioMgr.init();
    module.exports = AudioMgr;
    cc._RF.pop();
  }, {} ],
  Debug: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "813e5NqnPtCBJZe9lWTW0AO", "Debug");
    "use strict";
    var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
    module.exports.init = function(gt) {
      gt.dump = function(value, description) {
        if (!gt.debug) return;
        var _dump = function _dump(value, indent) {
          var _type = "undefined" === typeof value ? "undefined" : _typeof(value);
          var tmpStr = "";
          if (Array.isArray(value)) {
            tmpStr += "\n";
            tmpStr = tmpStr + indent + "[\n";
            var indent2 = indent + " . . ";
            for (var key in value) {
              var lineStr = indent2 + key + " = " + _dump(value[key], indent2) + "\n";
              tmpStr += lineStr;
            }
            tmpStr = tmpStr + indent + "]";
          } else if ("object" == _type) {
            tmpStr += "\n";
            tmpStr = tmpStr + indent + "{\n";
            var _indent = indent + " . . ";
            for (var _key in value) tmpStr = tmpStr + _indent + _key + " = " + _dump(value[_key], _indent) + "\n";
            tmpStr = tmpStr + indent + "}";
          } else "string" == _type ? tmpStr = tmpStr + '"' + value + '"' : "number" == _type ? tmpStr += value : "function" == _type && (tmpStr += "*function");
          return tmpStr;
        };
        var str = (description || "var") + " = " + _dump(value, "");
        cc.log(str);
      };
    };
    cc._RF.pop();
  }, {} ],
  DeviceApi: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a9daeO7Wk1L6riR4i2Srwul", "DeviceApi");
    "use strict";
    var DeviceApi = {};
    DeviceApi.getDeviceId = function() {
      if (gt.isNative()) return this.callPlatformApi("getDeviceId", "()Ljava/lang/String;");
    };
    module.exports = DeviceApi;
    cc._RF.pop();
  }, {} ],
  EventMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ef14bOV1xRPNKtbnsvYFUbM", "EventMgr");
    "use strict";
    var EventMgr = {};
    var callbacks = {};
    EventMgr.addEventHandler = function(event, target, handler) {
      callbacks = callbacks || {};
      callbacks[event] = callbacks[event] || [];
      var tbl = callbacks[event];
      for (var i = 0, len = tbl.length; i < len; i++) if (tbl[i].obj == target && tbl[i].func == handler) return;
      tbl.push({
        obj: target,
        func: handler
      });
    };
    EventMgr.removeEventHandler = function(event, target) {
      callbacks = callbacks || {};
      callbacks[event] = callbacks[event] || [];
      var tbl = callbacks[event];
      for (var i = 0, len = tbl.length; i < len; i++) if (tbl[i].obj == target) {
        tbl.splice(i, 1);
        return;
      }
    };
    EventMgr.removeAllEventHandler = function(target) {
      callbacks = callbacks || {};
      for (var event in callbacks) {
        var tbl = callbacks[event];
        var i = tbl.length;
        while (i--) tbl[i].obj == target && tbl.splice(i, 1);
      }
    };
    EventMgr.dispatchEvent = function(event, arg1, arg2) {
      callbacks = callbacks || {};
      var tbl = callbacks[event];
      if (!tbl) return;
      for (var i = 0, len = tbl.length; i < len; i++) tbl[i].func && tbl[i].func.call(this, arg1, arg2);
    };
    module.exports = EventMgr;
    cc._RF.pop();
  }, {} ],
  EventType: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3de6f/lhX9IC6tnn+pTa4d2", "EventType");
    "use strict";
    var EventType = {};
    EventType.ZZMJ = "ZZMJ";
    EventType.NZMJ = "NZMJ";
    EventType.PDK = "PDK";
    EventType.NET_CONNECTED = "NET_CONNECTED";
    EventType.NET_DISCONNECTED = "NET_DISCONNECTED";
    EventType.RELOGIN = "RELOGIN";
    EventType.WALLET_CHANGE = "WALLET_CHANGE";
    EventType.SCENE_RESET = "SCENE_RESET";
    module.exports = EventType;
    cc._RF.pop();
  }, {} ],
  GameConfig: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "57443h9S4FNGbJfaN2bpIVg", "GameConfig");
    "use strict";
    module.exports.init = function(gt) {
      gt.gateServer = {
        ip: "192.168.198.128",
        port: 3014
      };
      gt.noticeUrl = "http://47.95.217.228:8090/Web/NoticeWeb/GetNotice_Friend";
      gt.wxId = "wxb64d088517456e5f";
      gt.isReview = false;
      gt.debug = true;
      gt.open_guest = true;
      gt.open_hotupdate = false;
      gt.designSize = cc.size(1334, 750);
      gt.center = cc.v2(gt.designSize.width / 2, gt.designSize.height / 2);
      gt.GameID = {
        ZZMJ: 1,
        NZMJ: 2
      };
    };
    cc._RF.pop();
  }, {} ],
  GameMode: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "638b0dWPllIur7lVLYI0VFN", "GameMode");
    "use strict";
    var M = {};
    var playerNickHead = {};
    var servTimeDelta = 0;
    var enterBackTime = 0;
    M.init = function() {
      M.registerMsg();
    };
    M.registerMsg = function() {
      gt.tcp.registerMsg(gt.WALLET_INFO, M, M.onRcvWalletInfo);
      gt.tcp.registerMsg(gt.REPLAY_BY_SHARE_CODE, M, M.onRcvReplayByShareCode);
      gt.tcp.registerMsg(gt.SYSTEM_NOTICE, M, M.onRcvSysNotice);
      gt.tcp.registerMsg(gt.SYNC_TIME, M, M.onRcvSyncTime);
      cc.game.on(cc.game.EVENT_HIDE, M.onEnterBackground, M);
      cc.game.on(cc.game.EVENT_SHOW, M.onEnterForeground, M);
    };
    M.unregisterMsg = function() {
      gt.tcp.unregisterAllMsg(M);
      cc.game.off(cc.game.EVENT_HIDE, M.onEnterBackground, M);
      cc.game.off(cc.game.EVENT_SHOW, M.onEnterForeground, M);
    };
    M.savePlayerNickHead = function(uid, nickName, headurl) {
      playerNickHead[uid] = {
        nick: nickName,
        icon: headurl
      };
    };
    M.getPlayerNickHead = function(uid) {
      return playerNickHead[uid];
    };
    M.onRcvWalletInfo = function(msgTbl) {
      if (msgTbl.code && msgTbl.code < 0) {
        require("Toast").show(msgTbl.error || "");
        return;
      }
      gt.playerData.wallet = msgTbl;
      gt.dispatchEvent(gt.EventType.WALLET_CHANGE);
    };
    M.reqReplayByShareCode = function(code) {
      gt.tcp.sendMessage(gt.REPLAY_BY_SHARE_CODE, {
        share_code: code
      });
      gt.showLoadingTips("\u8bf7\u7a0d\u540e\u3002\u3002\u3002", 10);
    };
    M.onRcvReplayByShareCode = function(msgTbl) {
      cc.log("=== onRcvReplayByShareCode");
      gt.removeLoadingTips();
    };
    M.checkReplayShareCode = function() {
      var shareCode = extension.getURLShareCode();
      if (shareCode && "" != shareCode) {
        cc.log("---get replay code : ", shareCode);
        this.reqReplayByShareCode(shareCode);
        return true;
      }
      return false;
    };
    M.checkRoomCodeFromUrl = function() {
      var roomId = tonumber(extension.getURLRoomID());
      if (roomId && roomId > 0) {
        gt.tcp.sendMessage(gt.JOIN_ROOM, {
          room_id: roomId
        });
        gt.showLoadingTips(gt.tr("please_wait"), 10);
        return true;
      }
      return false;
    };
    M.onRcvDuplicateLogin = function(msgTbl) {
      cc.log("=== onRcvDuplicateLogin");
      gt.tcp.disconnect();
      require("NoticeTips").show("\u60a8\u7684\u8d26\u53f7\u5df2\u5728\u5176\u4ed6\u5730\u65b9\u767b\u5f55", function() {
        cc.director.loadScene("LoadingScene");
      }, null, true);
    };
    M.backMainScene = function() {};
    M.onTcpLoginSuccess = function() {
      cc.log("@@@@ ---onTcpLoginSuccess");
    };
    M.onRcvSysNotice = function() {};
    M.reqSyncTime = function() {
      gt.tcp.sendMessage(gt.SYNC_TIME, {});
    };
    M.onRcvSyncTime = function(msgTbl) {
      cc.log("=== onRcvSyncTime");
      if (msgTbl.code && msgTbl.code < 0) return;
      servTimeDelta = msgTbl.utc_time - new Date();
    };
    M.getServerTime = function() {
      var time = new Date() + servTimeDelta;
      return time;
    };
    M.onEnterBackground = function() {
      cc.log("@@@@@@@@@@@ === onEnterBackground");
      enterBackTime = new Date();
      gt.audio.pauseAll();
    };
    M.onEnterForeground = function() {
      var enterForeTime = new Date();
      0 == enterBackTime && (enterBackTime = enterForeTime);
      var elapse = enterForeTime - enterBackTime;
      if (elapse > 15e3) {
        cc.log("@@@@@@@@@@ === onEnterForeground, reconnect...");
        gt.tcp.reconnect();
      } else if (elapse > 3e3) {
        cc.log("@@@@@@@@@@@ === onEnterForeground ");
        gt.showLoadingTips("\u8bf7\u7a0d\u540e\u3002\u3002\u3002", 3e3);
        gt.dispatchEvent(gt.EventType.SCENE_RESET);
      }
      gt.audio.resumeAll();
    };
    module.exports = M;
    cc._RF.pop();
  }, {
    NoticeTips: "NoticeTips",
    Toast: "Toast"
  } ],
  InitGame: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9505cGTmIBEhLKBO0D3M3n8", "InitGame");
    "use strict";
    (function() {
      window.gt = {};
      require("./config/GameConfig").init(gt);
      require("./config/MsgConfig").init(gt);
      require("./public/utils/UtilTools").init(gt);
      require("./public/utils/Debug").init(gt);
      gt.EventType = require("./config/EventType");
      gt.tcp = require("./public/net/NetTcp");
      gt.deviceApi = require("./public/utils/DeviceApi");
      gt.wxMgr = require("./public/utils/WxMgr");
      gt.audio = require("./public/utils/AudioMgr");
      gt.gameMode = require("./public/GameMode");
      gt.playerData = {};
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
    "./public/utils/WxMgr": "WxMgr"
  } ],
  LoadingScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a57daXIWTJEE6MKU4TaNpgy", "LoadingScene");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {},
      start: function start() {
        cc.log("-----------------loading...");
        require("InitGame");
        var count = 0;
        count += 1;
        cc.loader.loadResDir("texture/common", function() {
          count -= 1;
          count <= 0 && this.showLogin();
        }.bind(this));
        count += 1;
        cc.loader.loadRes("prefab/NoticeTips", function(err, prefab) {
          count -= 1;
          count <= 0 && this.showLogin();
        }.bind(this));
      },
      showLogin: function showLogin() {
        this.node.runAction(cc.sequence(cc.delayTime(.5), cc.fadeOut(.5), cc.callFunc(function() {
          cc.director.loadScene("LoginScene");
        })));
      }
    });
    cc._RF.pop();
  }, {
    InitGame: "InitGame"
  } ],
  LoadingTips: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "06965G1CCFN4r72nINcbQFa", "LoadingTips");
    "use strict";
    var LoadingTips = {
      timeoutId: null,
      showLoadingTips: function showLoadingTips(tipsText, timeout, delay) {
        if (cc.director.getScene().getChildByName("LoadingTips")) {
          cc.log("-----already exist LoadingTips");
          return;
        }
        cc.loader.loadRes("prefab/LoadingTip", function(err, prefab) {
          if (err) return;
          var node = cc.instantiate(prefab);
          node.name = "LoadingTips";
          node.position = gt.center;
          cc.director.getScene().addChild(node);
          var lbTips = node.getChildByName("lb_wait");
          tipsText && (lbTips.getComponent(cc.Label).string = tipsText);
          timeout && (this.timeoutId = setTimeout(function() {
            this.removeLoadingTips();
          }.bind(this), timeout));
          if (delay) {
            node.active = false;
            setTimeout(function() {
              node.active = true;
            }, delay);
          }
        }.bind(this));
      },
      removeLoadingTips: function removeLoadingTips() {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
          this.timeoutId = null;
        }
        var node = cc.director.getScene().getChildByName("LoadingTips");
        node && node.destroy();
      }
    };
    module.exports = LoadingTips;
    cc._RF.pop();
  }, {} ],
  LoginScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "10622vpCXRIOpdjNT+kFHai", "LoginScene");
    "use strict";
    var volume = 0;
    cc.Class({
      extends: cc.Component,
      properties: {
        btnWX: cc.Button,
        btnTel: cc.Button,
        btnGuest: cc.Button,
        editbox: cc.EditBox
      },
      onLoad: function onLoad() {
        this.node.opacity = 0;
        this.node.runAction(cc.fadeIn(.7));
        gt.autoAdaptDevices();
      },
      start: function start() {
        cc.log("----------LoginScene start");
      },
      onBtnLoginWX: function onBtnLoginWX() {
        cc.log("===== onBtnLoginWX");
        gt.audio.playEffect("common/btn_click", false);
      },
      onBtnLoginTel: function onBtnLoginTel() {
        cc.log("===== onBtnLoginTel");
        gt.tcp.connect({
          host: gt.gateServer.ip,
          port: gt.gateServer.port
        }, function(result) {
          cc.log("---------connect result:", result);
        });
      },
      onBtnLoginGuest: function onBtnLoginGuest() {
        pomelo.init({
          host: gt.gateServer.ip,
          port: gt.gateServer.port
        }, function(code) {
          if ("timeout" == code) {
            cc.log("-------connect timeout !");
            pomelo.disconnect(function() {
              cc.log("============ disconnect success");
            });
            return;
          }
          var route = "gate.gateHandler.queryEntry";
          pomelo.request(route, {
            username: "huanglibo",
            uid: 1234
          }, function(data) {
            console.log("data======================", data.host, data.port);
            "undefined" == data && null == data || pomelo.disconnect(function() {
              pomelo.init({
                host: data.host,
                port: data.port,
                reconnect: true
              }, function() {
                var route = "login.loginHandler.login";
                pomelo.request(route, {}, function(para) {
                  console.log("para======================", para.msg);
                });
              });
            });
          });
        });
      }
    });
    cc._RF.pop();
  }, {} ],
  LogoScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "dad16ZIk71Nfrjtog68E+NS", "LogoScene");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {},
      start: function start() {
        cc.log("---------------start logo");
        this.node.runAction(cc.sequence(cc.delayTime(.5), cc.fadeOut(.8), cc.callFunc(function() {
          cc.director.loadScene("LoadingScene");
        })));
      }
    });
    cc._RF.pop();
  }, {} ],
  MsgConfig: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "dd1abpl28dE7KnHJp59v5ZQ", "MsgConfig");
    "use strict";
    module.exports.init = function(gt) {
      gt.LOGIN = 1001;
      gt.LOGOUT = 1002;
      gt.JOIN_ROOM = 1003;
      gt.SYNC_TIME = 1004;
      gt.SYSTEM_NOTICE = 1005;
      gt.WALLET_INFO = 1006;
      gt.REPLAY_BY_SHARE_CODE = 2003;
    };
    cc._RF.pop();
  }, {} ],
  NetTcp: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "450d24VPTRB1ok7LmhOkz+9", "NetTcp");
    "use strict";
    var NetTcp = {};
    var NetState = {
      Connecting: 1,
      Connected: 2,
      Disconnect: 3
    };
    var connectTimeout = 8e3;
    var connectTimeoutId = null;
    var connectCallback = null;
    var handlers = {};
    var connectParams = {};
    var state = NetState.Disconnect;
    NetTcp.registerMsg = function(msgId, target, callback) {
      null != msgId && "undefined" != msgId || cc.log(" invalid msgId ");
      handlers[msgId] = handlers[msgId] || [];
      var items = handlers[msgId];
      for (var i = 0, len = items.length; i < len; i++) if (items[i].obj == target && items[i].func == callback) return;
      items.push({
        obj: target,
        func: callback
      });
    };
    NetTcp.unregisterMsg = function(msgId, target) {
      var items = handlers[msgId];
      if ("undefined" == items) return;
      for (var i = 0, len = items.length; i < len; i++) if (items[i].obj == target) {
        items.splice(i, 1);
        break;
      }
    };
    NetTcp.unregisterAllMsg = function(target) {
      for (var key in handlers) {
        var items = handlers[key];
        for (var i = items.length - 1; i >= 0; i--) items[i].obj == target && items.splice(i, 1);
      }
    };
    NetTcp.connect = function(params, callback) {
      if (state == NetState.Connecting || state == NetState.Connected) {
        cc.log("do nothing, now connect state =:", state);
        return;
      }
      state = NetState.Connecting;
      connectParams = params;
      connectCallback = callback;
      NetTcp.disconnect(function() {
        pomelo.init(connectParams, function() {
          state = NetState.Connected;
          connectCallback && connectCallback(true);
        });
      });
    };
    NetTcp.disconnect = function(cb) {
      state = NetState.Disconnect;
      pomelo.disconnect(function() {
        cb && cb();
      });
    };
    NetTcp.reconnect = function() {
      connectParams.reconnect = true;
      NetTcp.connect(connectParams);
    };
    NetTcp.sendMessage = function(data) {};
    var onKick = function onKick(data) {
      cc.log("---NetTcp:onKick");
    };
    var onClose = function onClose(event) {
      cc.log("---NetTcp:onClose, state = ", state);
      state == NetState.Connecting;
      state = NetState.Disconnect;
    };
    var onDisconnect = function onDisconnect(event) {
      cc.log("---NetTcp:onDisconnect");
    };
    var onReconnect = function onReconnect() {
      cc.log("---NetTcp:onReconnect");
    };
    pomelo.on("onKick", onKick);
    pomelo.on("close", onClose);
    pomelo.on("disconnect", onDisconnect);
    pomelo.on("reconnect", onReconnect);
    module.exports = NetTcp;
    cc._RF.pop();
  }, {} ],
  NoticeTips: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e4b6captclCP5aVP6KnmU47", "NoticeTips");
    "use strict";
    var NoticeTips = {
      show: function show(tips, okFunc, cancelFunc, isSingleBtn, btnPara) {
        var self = this;
        cc.loader.loadRes("prefab/NoticeTips", function(err, prefab) {
          if (err) return;
          var node = cc.instantiate(prefab);
          node.name = "NoticeTips";
          node.position = gt.center;
          cc.director.getScene().addChild(node);
          var imgBg = node.getChildByName("Img_bg");
          var nodeTop = imgBg.getChildByName("node_top");
          var nodeBot = imgBg.getChildByName("node_bot");
          var btnOk = nodeBot.getChildByName("Btn_ok");
          var btnCancel = nodeBot.getChildByName("Btn_cancel");
          gt.addClickEvent(btnOk, function() {
            node.destroy();
            okFunc && okFunc();
          }, self);
          gt.addClickEvent(btnCancel, function() {
            node.destroy();
            cancelFunc && cancelFunc();
          }, self);
          if (isSingleBtn) {
            btnCancel.active = false;
            btnOk.x = 0;
          }
          if (btnPara) {
            if (btnPara.imgOkPath) {
              btnOk.active = false;
              var sp = btnOk.getComponent(cc.Sprite);
              cc.loader.loadRes(btnPara.imgOkPath, cc.SpriteFrame, function(err, spriteFrame) {
                sp.spriteFrame = spriteFrame;
                btnOk.active = true;
              });
            }
            if (btnPara.imgCancelPath) {
              btnCancel.active = false;
              var _sp = btnCancel.getComponent(cc.Sprite);
              cc.loader.loadRes(btnPara.imgCancelPath, cc.SpriteFrame, function(err, spriteFrame) {
                _sp.spriteFrame = spriteFrame;
                btnCancel.active = true;
              });
            }
            btnPara.strOk && (btnOk.getChildByName("Label").getComponent(cc.Label).string = btnPara.strOk);
            btnPara.strCancel && (btnCancel.getChildByName("Label").getComponent(cc.Label).string = btnPara.strCancel);
          }
          var lbDesc = imgBg.getChildByName("Label_Tips").getComponent(cc.Label);
          lbDesc.string = tips;
          lbDesc.node.width = imgBg.width - 80;
          lbDesc.overflow = cc.Label.Overflow.RESIZE_HEIGHT;
          lbDesc.scheduleOnce(function() {
            var deltaH = lbDesc.node.height - 200;
            if (deltaH > 0) {
              imgBg.height += deltaH;
              nodeTop.y = .5 * imgBg.height;
              nodeBot.y = .5 * -imgBg.height;
            }
          }, 0);
        });
      },
      isExist: function isExist() {
        if (cc.director.getScene().getChildByName("NoticeTips")) return true;
        return false;
      }
    };
    module.exports = NoticeTips;
    cc._RF.pop();
  }, {} ],
  StrTools: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "91daahO/21Kn7Qea22v4FBk", "StrTools");
    "use strict";
    var StrTools = {};
    StrTools.getShortString = function(str, maxChnCount, ext) {
      if (str.length > maxChnCount) {
        ext = ext || "...";
        return str.substr(0, maxChnCount) + ext;
      }
      return str;
    };
    module.exports = StrTools;
    cc._RF.pop();
  }, {} ],
  Toast: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9d27bd8AmVFZbo6ZH9ltd/g", "Toast");
    "use strict";
    var Toast = {
      show: function show(tipsText, posOffset) {
        var self = this;
        posOffset = posOffset || cc.v2(0, 0);
        cc.loader.loadRes("prefab/Toast", function(err, prefab) {
          if (err) return;
          var pos = cc.v2(gt.center.x, gt.center.y - 60).add(posOffset);
          var node = cc.instantiate(prefab);
          node.getComponent(cc.Label).string = tipsText;
          node.position = pos;
          cc.director.getScene().addChild(node);
          var moveto = cc.moveTo(1, cc.v2(pos.x, pos.y + 100));
          var seq = cc.sequence(moveto, cc.delayTime(.4), cc.fadeOut(.5), cc.removeSelf());
          node.runAction(seq);
        });
      }
    };
    module.exports = Toast;
    cc._RF.pop();
  }, {} ],
  UtilTools: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f78344A3zxEh6MViRS1AqYk", "UtilTools");
    "use strict";
    module.exports.init = function(gt) {
      gt.isNative = function() {
        return cc.sys.isNative && jsb;
      };
      gt.isAndroid = function() {
        return cc.sys.os == cc.sys.OS_ANDROID;
      };
      gt.isIOS = function() {
        return cc.sys.os == cc.sys.OS_IOS;
      };
      gt.isIOSReview = function() {
        return !!gt.isIOS() && gt.isReview;
      };
      gt.getDeviceId = function() {
        return gt.deviceApi.getDeviceId();
      };
      gt.retain = function(obj) {
        cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS || obj.retain();
      };
      gt.release = function(obj) {
        obj && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS && obj.release();
      };
      gt.addPersistNode = function(node) {
        cc.game.addPersistRootNode(node);
      };
      gt.removePersistNode = function(node) {
        cc.game.removePersistRootNode(node);
      };
      gt.setLocal = function(key, str) {
        key += "";
        str += "";
        cc.sys.localStorage.setItem(key, gt.encodeString(str));
      };
      gt.getLocal = function(key, defaultStr) {
        key += "";
        var str = cc.sys.localStorage.getItem(key);
        str && (str = gt.decodeString(str));
        (!str || str.length <= 0) && (str = defaultStr);
        return str;
      };
      gt.deleteLocal = function(key) {
        key += "";
        cc.sys.localStorage.removeItem(gt.encodeString(key));
      };
      gt.encodeString = function(code) {
        var c = String.fromCharCode(code.charCodeAt(0) + code.length);
        for (var i = 1; i < code.length; i++) c += String.fromCharCode(code.charCodeAt(i) + code.charCodeAt(i - 1));
        c = escape(c);
        return c;
      };
      gt.decodeString = function(code) {
        code = unescape(code);
        var c = String.fromCharCode(code.charCodeAt(0) - code.length);
        for (var i = 1; i < code.length; i++) c += String.fromCharCode(code.charCodeAt(i) - c.charCodeAt(i - 1));
        return c;
      };
      gt.bindParams = function() {
        var args = Array.prototype.slice.call(arguments);
        var func = args.shift();
        if ("function" != typeof func) return;
        return function() {
          return func.apply(null, args.concat(Array.prototype.slice.call(arguments)));
        };
      };
      gt.random = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      };
      gt.stringToBytes = function(str) {
        var ch, re = [];
        for (var i = 0; i < str.length; i++) {
          ch = str.charCodeAt(i);
          var st = [];
          do {
            st.push(255 & ch);
            ch >>= 8;
          } while (ch);
          re = re.concat(st.reverse());
        }
        return re;
      };
      gt.jsToCByShort = function(value) {
        var low1 = Math.floor(value / 256);
        var low2 = Math.floor(value % 256);
        return String.fromCharCode(low1, low2);
      };
      gt.jsToCByInt = function(value) {
        var low1 = Math.floor(value / 16777216);
        var low2 = Math.floor(value / 65536) % 256;
        var low3 = Math.floor(value / 256) % 256;
        var low4 = Math.floor(value % 256);
        return String.fromCharCode(low1, low2, low3, low4);
      };
      gt.srcSum = function(strData, len) {
        var sum = 65535;
        for (var i = 0; i < len; i++) {
          var d = strData[i];
          sum ^= d;
          0 == (sum && 1) ? sum /= 2 : sum = sum / 2 ^ 28849;
        }
        return sum;
      };
      gt.convertGPS2GCJ = function(lng, lat) {
        lng = Number(lng);
        lat = Number(lat);
        var PI = 3.141592653589793;
        var a = 6378245;
        var ee = .006693421622965943;
        function transformlat(lng, lat) {
          var ret = 2 * lng - 100 + 3 * lat + .2 * lat * lat + .1 * lng * lat + .2 * Math.sqrt(Math.abs(lng));
          ret += 2 * (20 * Math.sin(6 * lng * PI) + 20 * Math.sin(2 * lng * PI)) / 3;
          ret += 2 * (20 * Math.sin(lat * PI) + 40 * Math.sin(lat / 3 * PI)) / 3;
          ret += 2 * (160 * Math.sin(lat / 12 * PI) + 320 * Math.sin(lat * PI / 30)) / 3;
          return ret;
        }
        function transformlng(lng, lat) {
          var ret = 300 + lng + 2 * lat + .1 * lng * lng + .1 * lng * lat + .1 * Math.sqrt(Math.abs(lng));
          ret += 2 * (20 * Math.sin(6 * lng * PI) + 20 * Math.sin(2 * lng * PI)) / 3;
          ret += 2 * (20 * Math.sin(lng * PI) + 40 * Math.sin(lng / 3 * PI)) / 3;
          ret += 2 * (150 * Math.sin(lng / 12 * PI) + 300 * Math.sin(lng / 30 * PI)) / 3;
          return ret;
        }
        function out_of_china(lng, lat) {
          return lng < 72.004 || lng > 137.8347 || lat < .8293 || lat > 55.8271 || false;
        }
        var dlat = transformlat(lng - 105, lat - 35);
        var dlng = transformlng(lng - 105, lat - 35);
        var radlat = lat / 180 * PI;
        var magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = 180 * dlat / (a * (1 - ee) / (magic * sqrtmagic) * PI);
        dlng = 180 * dlng / (a / sqrtmagic * Math.cos(radlat) * PI);
        var mglat = lat + dlat;
        var mglng = lng + dlng;
        return {
          lat: mglat,
          lng: mglng
        };
      };
      gt.gcj02towgs84 = function(lng, lat) {
        if (out_of_china(lng, lat)) return [ lng, lat ];
        var dlat = transformlat(lng - 105, lat - 35);
        var dlng = transformlng(lng - 105, lat - 35);
        var radlat = lat / 180 * PI;
        var magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = 180 * dlat / (a * (1 - ee) / (magic * sqrtmagic) * PI);
        dlng = 180 * dlng / (a / sqrtmagic * Math.cos(radlat) * PI);
        mglat = lat + dlat;
        mglng = lng + dlng;
        return [ 2 * lng - mglng, 2 * lat - mglat ];
      };
      gt.getDistanceOfTwoPoint = function(lat1, lng1, lat2, lng2) {
        var angleToRadian = function angleToRadian(angle) {
          return angle * Math.PI / 180;
        };
        var radlat1 = angleToRadian(lat1);
        var radlat2 = angleToRadian(lat2);
        var a = radlat1 - radlat2;
        var b = angleToRadian(lng1) - angleToRadian(lng2);
        var distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.pow(Math.sin(b / 2), 2)));
        var earth_radius = 6378.137;
        distance *= earth_radius;
        return Math.abs(distance);
      };
      gt.convertNumToShort = function(num, radix, decimal, costomunitArr) {
        var unitArr = [ "", "\u4e07", "\u4ebf", "\u4e07\u4ebf" ];
        var sign = 0 != num ? num / Math.abs(num) : 1;
        num = Math.abs(num);
        costomunitArr && (unitArr = costomunitArr);
        radix = null == radix ? 1e4 : radix;
        decimal = null == decimal ? 1 : decimal;
        var sum = 0;
        while (num >= radix) {
          sum++;
          num /= radix;
        }
        num = Math.floor(num * Math.pow(10, decimal)) / Math.pow(10, decimal);
        return num * sign + unitArr[sum];
      };
      gt.captureScreen = function(node, callback) {
        var width = Math.floor(node.width);
        var height = Math.floor(node.height);
        true;
        var fileName = "hlbtest.jpg";
        var fullPath = jsb.fileUtils.getWritablePath() + fileName;
        jsb.fileUtils.isFileExist(fullPath) && jsb.fileUtils.removeFile(fullPath);
        var cameraNode = new cc.Node();
        cameraNode.position = cc.v2(.5 * width, .5 * height);
        cameraNode.parent = node.parent;
        var camera = cameraNode.addComponent(cc.Camera);
        camera.cullingMask = 4294967295;
        var texture = new cc.RenderTexture();
        var gl = cc.game._renderContext;
        texture.initWithSize(width, height, gl.STENCIL_INDEX8);
        camera.targetTexture = texture;
        camera.render(node);
        var data = texture.readPixels();
        var picData = new Uint8Array(width * height * 4);
        var rowBytes = 4 * width;
        for (var row = 0; row < height; row++) {
          var srow = height - 1 - row;
          var start = Math.floor(srow * width * 4);
          var reStart = row * width * 4;
          for (var i = 0; i < rowBytes; i++) picData[reStart + i] = data[start + i];
        }
        jsb.saveImageData(picData, width, height, fullPath);
        console.log("\u622a\u56fe\u6210\u529f\uff0c\u56fe\u7247\u4fdd\u5b58\u5728 ====>", fullPath);
        node.parent.removeChild(camera);
        callback && callback(fullPath);
      };
      gt.WXShareLink = function(linkUrl, title, content, toScene, shareResultCall) {
        var iconUrl = gt.webShareIcon;
        toScene >= 0 && linkUrl && title && content && gt.WxMgr.wxShareWeb(toScene, title, content, iconUrl, linkUrl, shareResultCall);
      };
      gt.WXShareImage = function(imgPath, toScene, shareResultCall) {
        toScene >= 0 && imgPath && gt.WxMgr.wxShareImg(toScene, imgPath, shareResultCall);
      };
      gt.isUserWSS = function() {
        var res = false;
        -1 === gt.loginServerAddress.indexOf(":") && cc.sys.isBrowser && (res = true);
        return res;
      };
      gt.btnClickEvent = function(btn, func, obj, sound) {
        if (null == btn) return null;
        btn.on("click", func, obj);
        btn.on("touchstart", function() {
          gt.audio.playEffect(sound || "common/btn_click", false);
        });
        return btn;
      };
      gt.autoAdaptDevices = function() {
        var canvasNode = cc.find("Canvas");
        var canvas = canvasNode.getComponent(cc.Canvas);
        var frameWidth = canvasNode.width;
        var frameHeight = canvasNode.height;
        var designWidth = canvas.designResolution.width;
        var designHeight = canvas.designResolution.height;
        if (frameWidth / frameHeight < designWidth / designHeight) {
          canvas.fitWidth = true;
          canvas.fitHeight = false;
        } else {
          canvas.fitWidth = false;
          canvas.fitHeight = true;
        }
        gt.setAdaptIphoneX();
      };
      gt.setAdaptIphoneX = function(nodeName) {
        var canvas = cc.find("Canvas");
        var nameStr = "node_root";
        nodeName && (nameStr = nodeName);
        var nodeRoot = canvas.getChildByName(nameStr);
        var func = function func() {
          if (nodeRoot) {
            var widget = nodeRoot.getComponent(cc.Widget);
            widget.top = 0;
            widget.bottom = 0;
            widget.left = 0;
            widget.right = 0;
          }
        };
        if (cc.sys.isNative && cc.sys.platform == cc.sys.IPHONE) {
          var size = cc.view.getFrameSize();
          var isIphoneX = 2436 == size.width && 1125 == size.height || 1125 == size.width && 2436 == size.height;
          isIphoneX || func();
        } else func();
      };
      gt.checkIpAndGps = function(playersList, toPlayer) {
        var isOpenGPS = function isOpenGPS(player) {
          return !(0 === player.lat && 0 === player.lng);
        };
        var isSameIp = function isSameIp(player1, player2) {
          return player1.ip.split(":")[0] == player2.ip.split(":")[0];
        };
        var isNearlyDistance = function isNearlyDistance(player1, player2) {
          if (!isOpenGPS(player1)) return false;
          if (!isOpenGPS(player2)) return false;
          return gt.getDistanceOfTwoPoint(player1.lat, player1.lng, player2.lat, player2.lng) <= .2;
        };
        if (toPlayer) {
          for (var i = 0; i < playersList.length; i++) {
            if (!playersList[i]) continue;
            if (playersList[i].uid == toPlayer.uid) continue;
            if (isSameIp(playersList[i], toPlayer)) return true;
          }
          for (var i = 0; i < playersList.length; i++) {
            if (!playersList[i]) continue;
            if (playersList[i].uid == toPlayer.uid) continue;
            if (isNearlyDistance(playersList[i], toPlayer)) return true;
          }
        } else {
          for (var i = 0; i < playersList.length - 1; i++) {
            if (!playersList[i]) continue;
            for (var j = i + 1; j < playersList.length; j++) {
              if (!playersList[j]) continue;
              if (isSameIp(playersList[i], playersList[j])) return true;
            }
          }
          for (var i = 0; i < playersList.length - 1; i++) {
            if (!playersList[i]) continue;
            for (var j = i + 1; j < playersList.length; j++) {
              if (!playersList[j]) continue;
              if (isNearlyDistance(playersList[i], playersList[j])) return true;
            }
          }
        }
        return false;
      };
      gt.showAlertAction = function(node, isShow, startScale, endScale, callback) {
        var start_Scale = startScale;
        var end_Scale = endScale;
        if (isShow) {
          node.scale = null == start_Scale ? 0 : start_Scale;
          null == end_Scale && (end_Scale = 1);
        } else {
          null == start_Scale && (node.scale = 1);
          null == end_Scale && (end_Scale = 0);
        }
        var action = cc.scaleTo(.2, end_Scale);
        isShow ? action.easing(cc.easeBackOut()) : action.easing(cc.easeSineIn());
        node.runAction(cc.sequence(action, cc.callFunc(function() {
          callback && callback();
        })));
      };
      gt.createrSpriteAni = function(atlas, preSufix, nNum, speed, bLoop, endCall, strConn, beginDif) {
        var self = this;
        var newNode = new cc.Node("node_eff");
        var sp = newNode.addComponent(cc.Sprite);
        self.addSpriteAni(newNode, atlas, preSufix, nNum, speed, bLoop, endCall, strConn, beginDif);
        return newNode;
      };
      gt.addSpriteAni = function(newNode, atlas, preSufix, nNum, speed, bLoop, endCall, strConn, beginDif) {
        var self = this;
        beginDif || (beginDif = 1);
        var getZeroize = function getZeroize(num, isZeroize) {
          if (isZeroize) {
            var str = num < 10 ? "0" + num : num;
            return str;
          }
          return num;
        };
        var lists = [];
        for (var i = 0; i < nNum; i++) {
          var key = preSufix + getZeroize(i + beginDif, true);
          strConn && (key = preSufix + strConn + getZeroize(i + beginDif, true));
          atlas._spriteFrames[key] && lists.push(atlas._spriteFrames[key]);
        }
        var ani = newNode.addComponent(cc.Animation);
        var clip = cc.AnimationClip.createWithSpriteFrames(lists, 30);
        bLoop && (clip.wrapMode = cc.WrapMode.Loop);
        clip.speed = speed;
        ani.addClip(clip, preSufix);
        var finishCall = function finishCall() {
          endCall && endCall();
        };
        ani.on("finished", finishCall);
        ani.play(preSufix);
      };
      gt.isEmptyObject = function(obj) {
        for (var key in obj) return false;
        return true;
      };
      gt.addClickEvent = function(btn, callback, context, noSound) {
        if (null == btn) return null;
        btn.on("click", function() {
          !noSound;
          callback && callback.call(context);
        }, context);
      };
      var LoadingTips = require("LoadingTips");
      gt.showLoadingTips = LoadingTips.showLoadingTips;
      gt.removeLoadingTips = LoadingTips.removeLoadingTips;
      var EventMgr = require("EventMgr");
      gt.addEventHandler = EventMgr.addEventHandler;
      gt.removeEventHandler = EventMgr.removeEventHandler;
      gt.removeAllEventHandler = EventMgr.removeAllEventHandler;
      gt.dispatchEvent = EventMgr.dispatchEvent;
    };
    cc._RF.pop();
  }, {
    EventMgr: "EventMgr",
    LoadingTips: "LoadingTips"
  } ],
  WxMgr: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f7c61Tvs/1Mtah+1S8FQQFp", "WxMgr");
    "use strict";
    var WxMgr = {};
    var DeviceApi = require("DeviceApi");
    WxMgr.isWXAppInstalled = function() {
      var bInstall = false;
      var nResult = DeviceApi.isInstallWXApp();
      1 == Number(nResult) && (bInstall = true);
      return bInstall;
    };
    WxMgr.wxShareText = function(toScene, textStr, pCall) {
      var self = this;
      self._shareEndCall = pCall;
      var data = {};
      data.shareScene = toScene;
      data.shareType = 1;
      data.textMsg = textStr;
      DeviceApi.addCallback(self.shareResultCall.bind(this), "shareResultCall");
      cDeviceApi.wxShare(JSON.stringify(data));
    };
    WxMgr.wxShareImg = function(toScene, imgPath, pCall) {
      var self = this;
      self._shareEndCall = pCall;
      var data = {};
      data.shareScene = toScene;
      data.shareType = 2;
      data.imgPath = imgPath;
      DeviceApi.addCallback(self.shareResultCall.bind(this), "shareResultCall");
      DeviceApi.wxShare(JSON.stringify(data));
    };
    WxMgr.wxShareWeb = function(toScene, title, des, imgUrl, urlLink, pCall) {
      var self = this;
      self._shareEndCall = pCall;
      var data = {};
      data.shareScene = toScene;
      data.shareType = 3;
      data.linkUrl = urlLink;
      data.imgUrl = imgUrl;
      data.title = title;
      data.des = des;
      DeviceApi.addCallback(self.shareResultCall.bind(this), "shareResultCall");
      DeviceApi.wxShare(JSON.stringify(data));
    };
    WxMgr.shareResultCall = function(data) {
      var self = this;
      self._shareEndCall && self._shareEndCall(data);
    };
    WxMgr.openWxApp = function() {
      var bResult = false;
      bResult = DeviceApi.openWXApp();
      return bResult;
    };
    WxMgr.getWXToken = function() {
      var token = gt.getLocal("wxToken");
      if (token && token.length > 0) return token;
      return null;
    };
    WxMgr.saveWXToken = function(token) {
      token && gt.setLocal("wxToken", token);
    };
    WxMgr.delWXToken = function() {
      var self = this;
      self.saveWXToken("");
    };
    module.exports = WxMgr;
    cc._RF.pop();
  }, {
    DeviceApi: "DeviceApi"
  } ]
}, {}, [ "InitGame", "EventType", "GameConfig", "MsgConfig", "GameMode", "NetTcp", "AudioMgr", "Debug", "DeviceApi", "EventMgr", "StrTools", "UtilTools", "WxMgr", "LoadingTips", "NoticeTips", "Toast", "LoadingScene", "LoginScene", "LogoScene" ]);