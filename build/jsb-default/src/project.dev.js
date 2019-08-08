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
  1: [ function(require, module, exports) {
    var process = module.exports = {};
    var cachedSetTimeout;
    var cachedClearTimeout;
    function defaultSetTimout() {
      throw new Error("setTimeout has not been defined");
    }
    function defaultClearTimeout() {
      throw new Error("clearTimeout has not been defined");
    }
    (function() {
      try {
        cachedSetTimeout = "function" === typeof setTimeout ? setTimeout : defaultSetTimout;
      } catch (e) {
        cachedSetTimeout = defaultSetTimout;
      }
      try {
        cachedClearTimeout = "function" === typeof clearTimeout ? clearTimeout : defaultClearTimeout;
      } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
      }
    })();
    function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) return setTimeout(fun, 0);
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
      }
      try {
        return cachedSetTimeout(fun, 0);
      } catch (e) {
        try {
          return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
          return cachedSetTimeout.call(this, fun, 0);
        }
      }
    }
    function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) return clearTimeout(marker);
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
      }
      try {
        return cachedClearTimeout(marker);
      } catch (e) {
        try {
          return cachedClearTimeout.call(null, marker);
        } catch (e) {
          return cachedClearTimeout.call(this, marker);
        }
      }
    }
    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;
    function cleanUpNextTick() {
      if (!draining || !currentQueue) return;
      draining = false;
      currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1;
      queue.length && drainQueue();
    }
    function drainQueue() {
      if (draining) return;
      var timeout = runTimeout(cleanUpNextTick);
      draining = true;
      var len = queue.length;
      while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) currentQueue && currentQueue[queueIndex].run();
        queueIndex = -1;
        len = queue.length;
      }
      currentQueue = null;
      draining = false;
      runClearTimeout(timeout);
    }
    process.nextTick = function(fun) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) for (var i = 1; i < arguments.length; i++) args[i - 1] = arguments[i];
      queue.push(new Item(fun, args));
      1 !== queue.length || draining || runTimeout(drainQueue);
    };
    function Item(fun, array) {
      this.fun = fun;
      this.array = array;
    }
    Item.prototype.run = function() {
      this.fun.apply(null, this.array);
    };
    process.title = "browser";
    process.browser = true;
    process.env = {};
    process.argv = [];
    process.version = "";
    process.versions = {};
    function noop() {}
    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;
    process.prependListener = noop;
    process.prependOnceListener = noop;
    process.listeners = function(name) {
      return [];
    };
    process.binding = function(name) {
      throw new Error("process.binding is not supported");
    };
    process.cwd = function() {
      return "/";
    };
    process.chdir = function(dir) {
      throw new Error("process.chdir is not supported");
    };
    process.umask = function() {
      return 0;
    };
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
    var ANDROID_CLASS_NAME = "org/cocos2dx/javascript/SystemAPI";
    var IOS_CLASS_NAME = null;
    var callBackHandler = {};
    var Tag_Clipboard = "Tag_Clipboard";
    var Tag_Battery = "Tag_Battery";
    DeviceApi.execCallback = function(tag, para) {
      cc.log("DeviceApi.execCallback: ", tag, para);
      callBackHandler[tag] && callBackHandler[tag](para);
    };
    DeviceApi.copyToClipboard = function(str) {
      cc.sys.os == cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod(ANDROID_CLASS_NAME, "copyToClipboard", "(Ljava/lang/String;)V", str) : cc.sys.os == cc.sys.OS_IOS;
    };
    DeviceApi.getClipboardText = function(callback, clearAfterRead) {
      if (!callback) return;
      callBackHandler[Tag_Clipboard] = callback;
      var clear = clearAfterRead ? "true" : "false";
      cc.sys.os == cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod(ANDROID_CLASS_NAME, "getClipboardContent", "(Ljava/lang/String;Ljava/lang/String;)V", Tag_Clipboard, clear) : cc.sys.os == cc.sys.OS_IOS;
    };
    DeviceApi.getBattery = function(callback) {
      if (!callback) return;
      callBackHandler[Tag_Battery] = callback;
      cc.sys.os == cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod(ANDROID_CLASS_NAME, "getBattery", "(Ljava/lang/String;)V", Tag_Battery) : cc.sys.os == cc.sys.OS_IOS;
    };
    DeviceApi.getUUID = function() {
      var uuid = "";
      cc.sys.os == cc.sys.OS_ANDROID ? uuid = jsb.reflection.callStaticMethod(ANDROID_CLASS_NAME, "getUUID", "()Ljava/lang/String;") : cc.sys.os == cc.sys.OS_IOS;
      return uuid;
    };
    DeviceApi.getShareCode = function() {
      var shareCode = "";
      cc.sys.os == cc.sys.OS_ANDROID ? shareCode = jsb.reflection.callStaticMethod(ANDROID_CLASS_NAME, "getShareCode", "()Ljava/lang/String;") : cc.sys.os == cc.sys.OS_IOS;
      return shareCode;
    };
    DeviceApi.isGpsOpen = function() {
      var result = false;
      cc.sys.os == cc.sys.OS_ANDROID ? result = jsb.reflection.callStaticMethod(ANDROID_CLASS_NAME, "isGpsOPen", "()Z") : cc.sys.os == cc.sys.OS_IOS;
      return result;
    };
    DeviceApi.gotoOpenGps = function() {
      var result = false;
      cc.sys.os == cc.sys.OS_ANDROID ? result = jsb.reflection.callStaticMethod(ANDROID_CLASS_NAME, "gotoOpenGps", "()V") : cc.sys.os == cc.sys.OS_IOS;
      return result;
    };
    DeviceApi.vibrate = function(millisecond) {
      cc.sys.os == cc.sys.OS_ANDROID ? jsb.reflection.callStaticMethod(ANDROID_CLASS_NAME, "vibrate", "(I)V", millisecond) : cc.sys.os == cc.sys.OS_IOS;
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
      gt.wxAppId = "wxb64d088517456e5f";
      gt.wxSecret = "a6e3924c03258c2af514e6b6f395b8ca";
      gt.isReview = false;
      gt.debug = true;
      gt.open_guest = true;
      gt.open_hotupdate = true;
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
  HotUpdate: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6b271EMyoZGIZS2rqRikaMW", "HotUpdate");
    "use strict";
    var State = {
      None: 1,
      DownloadVersion: 2,
      DownloadManifest: 3,
      DownloadAssets: 4
    };
    var UpdateEvents = {
      SkipUpdate: 1,
      AlreadyUpToDate: 2,
      LocalVersionIsBiger: 3,
      FoundNewVersion: 4,
      UpdateSuccess: 5,
      ParseVersionError: 6,
      ParseManifestError: 7,
      DecompressError: 8,
      UpdateError: 9
    };
    var retryCount = 0;
    var totalCount = 0;
    var downloadingCount = 0;
    var download_list = null;
    var local_version = null;
    var local_manifest = null;
    var remote_manifest = null;
    var hasDownloadError = false;
    var storageDir = (cc.sys.isNative && jsb ? jsb.fileUtils.getWritablePath() : "/") + "ResUpdate/";
    var name_version = "version.manifest";
    var name_manifest = "project.manifest";
    var path_vertion = storageDir + name_version;
    var path_vertion_tmp = path_vertion + ".tmp";
    var path_manifest = storageDir + name_manifest;
    var path_manifest_tmp = path_manifest + ".tmp";
    var path_download_list = storageDir + "download.list";
    var hotSearchPath = [ storageDir, storageDir + "res/", storageDir + "src/" ];
    var md5 = require("md5");
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
      onLoad: function onLoad() {
        this.updatePercent(0);
      },
      onDestroy: function onDestroy() {
        this.downloader = null;
        this.progressBar.node.active = false;
        this.lbPercent.node.active = false;
      },
      start: function start() {
        this.init();
        this.downloadVersion();
      },
      init: function init() {
        this.downloader = new jsb.Downloader();
        this.downloader.setOnFileTaskSuccess(this.onFileSuccess.bind(this));
        this.downloader.setOnTaskError(this.onFileError.bind(this));
        retryCount = 0;
        downloadingCount = 0;
        this.zipList = [];
        jsb.fileUtils.isDirectoryExist(storageDir) || jsb.fileUtils.createDirectory(storageDir);
        local_version = this.loadJsonFile(this.versionManifestUrl.nativeUrl, true);
        local_manifest = this.loadJsonFile(this.projectManifestUrl.nativeUrl, true);
        var cache_version = this.loadJsonFile(name_version, false);
        var cache_manifest = this.loadJsonFile(name_manifest, false);
        if (cache_version && cache_manifest) {
          var cmpRet = this.compareVersion(cache_version.version, local_version.version);
          if (cmpRet[0] > 0 || cmpRet[1] > 0) {
            local_version = cache_version;
            local_manifest = cache_manifest;
          } else if (cmpRet[0] < 0 || cmpRet[1] < 0) {
            cc.log("### apk version > cache version !!!, clear cache data...");
            this.clearStorage();
          }
        }
      },
      downloadVersion: function downloadVersion() {
        this.state = State.DownloadVersion;
        var url = local_version.manifestUrl + name_version;
        var save = storageDir + name_version + ".tmp";
        this.requestOneFile(url, save, "VERSION_ID");
      },
      parseVersion: function parseVersion(filepath) {
        cc.log("### parseVersion");
        var remote_version = this.loadJsonFile(filepath, false);
        if (remote_version) {
          cc.log("xxx remote version, local version =", remote_version.version, local_version.version);
          var cmpRet = this.compareVersion(remote_version.version, local_version.version);
          if (cmpRet[0] > 0) require("NoticeTips").show("\u6e38\u620f\u6709\u65b0\u7248\u672c\uff0c\u8bf7\u524d\u5f80\u66f4\u65b0", function() {
            cc.sys.openURL(remote_version.appDownLoadUrl);
            this.clearStorage();
            this.exitGame();
          }.bind(this), this.exitGame); else if (0 === cmpRet[0] && cmpRet[1] > 0) {
            cc.log("xxx need to update...");
            if (jsb.fileUtils.isFileExist(path_manifest_tmp) && jsb.fileUtils.isFileExist(path_download_list)) {
              var tmpManifest = this.loadJsonFile(path_manifest_tmp, false);
              if (tmpManifest.version == remote_version.version) {
                remote_manifest = tmpManifest;
                this.genDownloadList(true);
                if (download_list) {
                  cc.log("xxx resume last download ...");
                  this.downloadAssets();
                  return;
                }
              } else {
                jsb.fileUtils.removeFile(path_manifest_tmp);
                jsb.fileUtils.removeFile(path_download_list);
              }
            }
            this.downloadManifest();
          } else cmpRet[0] < 0 || cmpRet[1] < 0 ? this.handleEvents(UpdateEvents.LocalVersionIsBiger) : this.handleEvents(UpdateEvents.AlreadyUpToDate);
        } else this.handleEvents(UpdateEvents.ParseVersionError);
      },
      downloadManifest: function downloadManifest() {
        this.state = State.DownloadManifest;
        jsb.fileUtils.isFileExist(path_manifest_tmp) && jsb.fileUtils.removeFile(path_manifest_tmp);
        jsb.fileUtils.isFileExist(path_download_list) && jsb.fileUtils.removeFile(path_download_list);
        var url = local_version.manifestUrl + name_manifest;
        var save = storageDir + name_manifest + ".tmp";
        this.requestOneFile(url, save, "MANIFEST_ID");
      },
      parseManifest: function parseManifest(filepath) {
        remote_manifest = this.loadJsonFile(filepath, false);
        if (remote_manifest) {
          this.genDownloadList(false);
          this.downloadAssets();
        } else this.handleEvents(UpdateEvents.ParseManifestError);
      },
      genDownloadList: function genDownloadList(isResume) {
        if (isResume) download_list = this.loadJsonFile(path_download_list, false); else {
          download_list = [];
          var assets1 = local_manifest.assets;
          var assets2 = remote_manifest.assets;
          for (var key in assets1) if (assets2[key]) assets1[key].md5 != assets2[key].md5 && download_list.push({
            key: key,
            val: assets2[key]
          }); else {
            var filepath = storageDir + key;
            jsb.fileUtils.isFileExist(filepath) && jsb.fileUtils.removeFile(filepath);
          }
          for (var _key in assets2) assets1[_key] || download_list.push({
            key: _key,
            val: assets2[_key]
          });
          this.saveToJsonFile(download_list, path_download_list);
        }
        totalCount = download_list ? download_list.length : 0;
        cc.log("------totalCount:", totalCount);
      },
      downloadAssets: function downloadAssets() {
        hasDownloadError = false;
        var length = download_list.length;
        if (0 == length && 0 == downloadingCount) this.handleEvents(UpdateEvents.UpdateSuccess); else {
          this.state = State.DownloadAssets;
          while (length > 0 && downloadingCount < 1) {
            var info = download_list[length - 1];
            if (!info) break;
            var url = remote_manifest.packageUrl + info.key;
            var saveto = storageDir + info.key + ".tmp";
            this.requestOneFile(url, saveto, info.key);
            length--;
            downloadingCount++;
          }
        }
      },
      retryDownload: function retryDownload() {
        cc.log("### : retryDownload: retryCount = ", retryCount);
        retryCount++;
        retryCount > 3 ? require("NoticeTips").show("\u7f51\u7edc\u8fde\u63a5\u5931\u8d25\uff0c\u662f\u5426\u518d\u6b21\u5c1d\u8bd5\u8fde\u63a5\uff1f", this.resumeDownload.bind(this), this.exitGame.bind(this)) : this.resumeDownload();
      },
      resumeDownload: function resumeDownload() {
        this.state == State.DownloadVersion ? this.downloadVersion() : this.state == State.DownloadManifest ? this.downloadManifest() : this.state == State.DownloadAssets && this.downloadAssets();
      },
      requestOneFile: function requestOneFile(url, storagePath, customId) {
        cc.log("------requestOneFile: ", customId);
        this.downloader.createDownloadFileTask(url, storagePath, customId);
      },
      onFileSuccess: function onFileSuccess(task) {
        if (this.state == State.DownloadVersion) this.parseVersion(task.storagePath); else if (this.state == State.DownloadManifest) this.parseManifest(task.storagePath); else if (this.state == State.DownloadAssets) {
          downloadingCount--;
          if (this.checkFile(task.storagePath, task.identifier)) {
            var oldName = task.storagePath;
            var newName = oldName.replace(".tmp", "");
            jsb.fileUtils.renameFile(oldName, newName);
            var fileName = task.identifier;
            var extName = /\.[^\.]+$/.exec(fileName);
            if (".zip" == extName) {
              var fullpath = storageDir + fileName;
              var result = GameTools.getInstance().decompress(fullpath);
              if (!result) {
                cc.log("@@@@ decompress file fail: ", fileName);
                hasDownloadError = true;
              }
              jsb.fileUtils.removeFile(fullpath);
            }
            if (!hasDownloadError) {
              for (var i = download_list.length - 1; i >= 0; i--) if (download_list[i].key == fileName) {
                download_list.splice(i, 1);
                break;
              }
              var percent = 100 * (totalCount - download_list.length) / totalCount;
              this.updatePercent(percent);
            }
          } else hasDownloadError = true;
          if (downloadingCount <= 0) {
            if (hasDownloadError) {
              this.retryDownload();
              return;
            }
            this.saveToJsonFile(download_list, path_download_list);
            0 == download_list.length ? this.handleEvents(UpdateEvents.UpdateSuccess) : this.downloadAssets();
          }
        }
      },
      onFileError: function onFileError(task) {
        cc.log("### : onFileError: identifier = ", task.identifier);
        hasDownloadError = true;
        if (this.state == State.DownloadAssets) {
          downloadingCount--;
          downloadingCount <= 0 && this.retryDownload();
        } else this.retryDownload();
      },
      handleEvents: function handleEvents(event) {
        switch (event) {
         case UpdateEvents.SkipUpdate:
         case UpdateEvents.AlreadyUpToDate:
          this.enterGame();
          break;

         case UpdateEvents.LocalVersionIsBiger:
          this.clearStorage();
          this.enterGame();
          break;

         case UpdateEvents.UpdateSuccess:
          jsb.fileUtils.removeFile(path_download_list);
          jsb.fileUtils.renameFile(path_vertion_tmp, path_vertion);
          jsb.fileUtils.renameFile(path_manifest_tmp, path_manifest);
          this.enterGame();
          break;

         case UpdateEvents.ParseVersionError:
         case UpdateEvents.ParseManifestError:
          this.retryDownload();
        }
      },
      loadJsonFile: function loadJsonFile(filepath, isInApk) {
        var content;
        if (isInApk) {
          var searchPaths = jsb.fileUtils.getSearchPaths();
          var tmpSearchPath = [];
          for (var i = 0, len = searchPaths.length; i < len; i++) {
            var v = searchPaths[i];
            -1 == hotSearchPath.indexOf(v) && -1 == tmpSearchPath.indexOf(v) && tmpSearchPath.push(v);
          }
          jsb.fileUtils.setSearchPaths(tmpSearchPath);
          jsb.fileUtils.isFileExist(filepath) && (content = jsb.fileUtils.getStringFromFile(filepath));
          jsb.fileUtils.setSearchPaths(searchPaths);
        } else jsb.fileUtils.isFileExist(filepath) && (content = jsb.fileUtils.getStringFromFile(filepath));
        content && "string" === typeof content && (content = JSON.parse(content));
        return content;
      },
      saveToJsonFile: function saveToJsonFile(objData, savePath) {
        var content = JSON.stringify(objData);
        jsb.fileUtils.writeStringToFile(content, savePath);
      },
      compareVersion: function compareVersion(strVer1, strVer2) {
        var s = strVer1.split(".");
        var t = strVer2.split(".");
        var bigRet = 0;
        parseInt(s[0]) > parseInt(t[0]) || parseInt(s[1]) > parseInt(t[1]) ? bigRet = 1 : (parseInt(s[0]) < parseInt(t[0]) || parseInt(s[1]) < parseInt(t[1])) && (bigRet = -1);
        var smallRet = 0;
        parseInt(s[2]) > parseInt(t[2]) || parseInt(s[3]) > parseInt(t[3]) ? smallRet = 1 : (parseInt(s[2]) < parseInt(t[2]) || parseInt(s[3]) < parseInt(t[3])) && (smallRet = -1);
        return [ bigRet, smallRet ];
      },
      clearStorage: function clearStorage() {
        cc.log("### : clearStorage");
        jsb.fileUtils.removeFile(path_vertion);
        jsb.fileUtils.removeFile(path_manifest);
        jsb.fileUtils.removeFile(path_manifest_tmp);
        jsb.fileUtils.removeFile(path_download_list);
        jsb.fileUtils.removeDirectory(storageDir);
      },
      updatePercent: function updatePercent(percent) {
        percent > 100 && (percent = 100);
        this.progressBar.progress = percent / 100;
        this.lbPercent.string = Math.ceil(percent) + "%";
      },
      checkFile: function checkFile(filepath, key) {
        var oldMd5 = null;
        var newMd5 = null;
        for (var i = 0, len = download_list.length; i < len; i++) if (download_list[i].key == key) {
          oldMd5 = download_list[i].val.md5;
          break;
        }
        var data = jsb.fileUtils.getDataFromFile(filepath);
        data && (newMd5 = md5.create().update(data).hex());
        return oldMd5 === newMd5;
      },
      enterGame: function enterGame() {
        if (totalCount > 0) {
          cc.log("### xxxxxxxxxxxxxxxxxxx restart ...");
          this.restartGame();
        } else {
          cc.log("### ---------------- enterGame");
          cc.director.loadScene("LoadingScene");
        }
      },
      exitGame: function exitGame() {
        cc.game.end();
      },
      restartGame: function restartGame() {
        this.onDestroy();
        this.lbTips.string = "\u8d44\u6e90\u91cd\u65b0\u52a0\u8f7d\u4e2d...";
        var searchPaths = jsb.fileUtils.getSearchPaths();
        var tmpSearchPath = [].concat(hotSearchPath);
        for (var i = 0, len = searchPaths.length; i < len; i++) {
          var v = searchPaths[i];
          -1 == tmpSearchPath.indexOf(v) && tmpSearchPath.push(v);
        }
        cc.sys.localStorage.setItem("HotUpdateSearchPaths", JSON.stringify(tmpSearchPath));
        cc.sys.localStorage.setItem("RestartAfterHotUpdate", "true");
        jsb.fileUtils.setSearchPaths(tmpSearchPath);
        cc.log("searchPaths: ", tmpSearchPath);
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
  InitGame: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9505cGTmIBEhLKBO0D3M3n8", "InitGame");
    "use strict";
    (function() {
      window.gt = {};
      gt.playerData = {};
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
      gt.ui = {};
      gt.ui.toast = require("./views/msgbox/Toast");
      gt.ui.noticeTips = require("./views/msgbox/NoticeTips");
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
  KeyBackExit: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "209bbR3yVNJJ6nlC9UQ0v/y", "KeyBackExit");
    "use strict";
    cc.Class({
      extends: cc.Component,
      onLoad: function onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
      },
      onKeyDown: function onKeyDown(event) {
        switch (event.keyCode) {
         case cc.macro.KEY.back:
          gt.ui.noticeTips.show("\u662f\u5426\u9000\u51fa\u6e38\u620f", function() {
            cc.game.end();
          }, null);
        }
      },
      onDestroy: function onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
      }
    });
    cc._RF.pop();
  }, {} ],
  LoadingScene: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a57daXIWTJEE6MKU4TaNpgy", "LoadingScene");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {},
      start: function start() {
        cc.log("[loadingScene]: -----------------loading...");
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
        this.node.runAction(cc.fadeIn(.5));
        gt.autoAdaptDevices();
        this.addComponent("KeyBackExit");
      },
      start: function start() {
        cc.log("----------LoginScene");
      },
      onBtnLoginWX: function onBtnLoginWX() {
        cc.log("===== onBtnLoginWX");
      },
      onBtnLoginTel: function onBtnLoginTel() {
        cc.log("===== onBtnLoginTel");
        gt.deviceApi.gotoOpenGps();
      },
      onBtnLoginGuest: function onBtnLoginGuest() {
        gt.tcp.connect({
          host: gt.gateServer.ip,
          port: gt.gateServer.port
        }, function(result) {
          cc.log("---------connect result:", result);
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
      onDestroy: function onDestroy() {},
      start: function start() {
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
    StrTools.stringToByte = function(str) {
      var bytes = new Array();
      for (var i = 0, len = str.length; i < len; i++) {
        var c = str.charCodeAt(i);
        if (c >= 65536 && c <= 1114111) {
          bytes.push(c >> 18 & 7 | 240);
          bytes.push(c >> 12 & 63 | 128);
          bytes.push(c >> 6 & 63 | 128);
          bytes.push(63 & c | 128);
        } else if (c >= 2048 && c <= 65535) {
          bytes.push(c >> 12 & 15 | 224);
          bytes.push(c >> 6 & 63 | 128);
          bytes.push(63 & c | 128);
        } else if (c >= 128 && c <= 2047) {
          bytes.push(c >> 6 & 31 | 192);
          bytes.push(63 & c | 128);
        } else bytes.push(255 & c);
      }
      return bytes;
    };
    StrTools.byteToString = function(arr) {
      if ("string" === typeof arr) return arr;
      var str = "", _arr = arr;
      for (var i = 0; i < _arr.length; i++) {
        var one = _arr[i].toString(2), v = one.match(/^1+?(?=0)/);
        if (v && 8 == one.length) {
          var bytesLength = v[0].length;
          var store = _arr[i].toString(2).slice(7 - bytesLength);
          for (var st = 1; st < bytesLength; st++) store += _arr[st + i].toString(2).slice(2);
          str += String.fromCharCode(parseInt(store, 2));
          i += bytesLength - 1;
        } else str += String.fromCharCode(_arr[i]);
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
    var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
      return typeof obj;
    } : function(obj) {
      return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
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
      var cloneObj = function cloneObj(obj) {
        var newObj = {};
        obj instanceof Array && (newObj = []);
        for (var key in obj) {
          var val = obj[key];
          newObj[key] = "object" === ("undefined" === typeof val ? "undefined" : _typeof(val)) ? cloneObj(val) : val;
        }
        return newObj;
      };
      gt.cloneObj = cloneObj;
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
  } ],
  md5: [ function(require, module, exports) {
    (function(process, global) {
      "use strict";
      cc._RF.push(module, "07c3fMmeolNQ7tzGiAy3a4I", "md5");
      "use strict";
      var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function(obj) {
        return typeof obj;
      } : function(obj) {
        return obj && "function" === typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
      (function() {
        var ERROR = "input is invalid type";
        var WINDOW = "object" === ("undefined" === typeof window ? "undefined" : _typeof(window));
        var root = WINDOW ? window : {};
        root.JS_MD5_NO_WINDOW && (WINDOW = false);
        var WEB_WORKER = !WINDOW && "object" === ("undefined" === typeof self ? "undefined" : _typeof(self));
        var NODE_JS = !root.JS_MD5_NO_NODE_JS && "object" === ("undefined" === typeof process ? "undefined" : _typeof(process)) && process.versions && process.versions.node;
        NODE_JS ? root = global : WEB_WORKER && (root = self);
        var COMMON_JS = !root.JS_MD5_NO_COMMON_JS && "object" === ("undefined" === typeof module ? "undefined" : _typeof(module)) && module.exports;
        var AMD = "function" === typeof define && define.amd;
        var ARRAY_BUFFER = !root.JS_MD5_NO_ARRAY_BUFFER && "undefined" !== typeof ArrayBuffer;
        var HEX_CHARS = "0123456789abcdef".split("");
        var EXTRA = [ 128, 32768, 8388608, -2147483648 ];
        var SHIFT = [ 0, 8, 16, 24 ];
        var OUTPUT_TYPES = [ "hex", "array", "digest", "buffer", "arrayBuffer", "base64" ];
        var BASE64_ENCODE_CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
        var blocks = [], buffer8;
        if (ARRAY_BUFFER) {
          var buffer = new ArrayBuffer(68);
          buffer8 = new Uint8Array(buffer);
          blocks = new Uint32Array(buffer);
        }
        !root.JS_MD5_NO_NODE_JS && Array.isArray || (Array.isArray = function(obj) {
          return "[object Array]" === Object.prototype.toString.call(obj);
        });
        !ARRAY_BUFFER || !root.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW && ArrayBuffer.isView || (ArrayBuffer.isView = function(obj) {
          return "object" === ("undefined" === typeof obj ? "undefined" : _typeof(obj)) && obj.buffer && obj.buffer.constructor === ArrayBuffer;
        });
        var createOutputMethod = function createOutputMethod(outputType) {
          return function(message) {
            return new Md5(true).update(message)[outputType]();
          };
        };
        var createMethod = function createMethod() {
          var method = createOutputMethod("hex");
          NODE_JS && (method = nodeWrap(method));
          method.create = function() {
            return new Md5();
          };
          method.update = function(message) {
            return method.create().update(message);
          };
          for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
            var type = OUTPUT_TYPES[i];
            method[type] = createOutputMethod(type);
          }
          return method;
        };
        var nodeWrap = function nodeWrap(method) {
          var crypto = eval("require('crypto')");
          var Buffer = eval("require('buffer').Buffer");
          var nodeMethod = function nodeMethod(message) {
            if ("string" === typeof message) return crypto.createHash("md5").update(message, "utf8").digest("hex");
            if (null === message || void 0 === message) throw ERROR;
            message.constructor === ArrayBuffer && (message = new Uint8Array(message));
            return Array.isArray(message) || ArrayBuffer.isView(message) || message.constructor === Buffer ? crypto.createHash("md5").update(new Buffer(message)).digest("hex") : method(message);
          };
          return nodeMethod;
        };
        function Md5(sharedMemory) {
          if (sharedMemory) {
            blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
            this.blocks = blocks;
            this.buffer8 = buffer8;
          } else if (ARRAY_BUFFER) {
            var buffer = new ArrayBuffer(68);
            this.buffer8 = new Uint8Array(buffer);
            this.blocks = new Uint32Array(buffer);
          } else this.blocks = [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ];
          this.h0 = this.h1 = this.h2 = this.h3 = this.start = this.bytes = this.hBytes = 0;
          this.finalized = this.hashed = false;
          this.first = true;
        }
        Md5.prototype.update = function(message) {
          if (this.finalized) return;
          var notString, type = "undefined" === typeof message ? "undefined" : _typeof(message);
          if ("string" !== type) {
            if ("object" !== type) throw ERROR;
            if (null === message) throw ERROR;
            if (ARRAY_BUFFER && message.constructor === ArrayBuffer) message = new Uint8Array(message); else if (!Array.isArray(message) && (!ARRAY_BUFFER || !ArrayBuffer.isView(message))) throw ERROR;
            notString = true;
          }
          var code, index = 0, i, length = message.length, blocks = this.blocks;
          var buffer8 = this.buffer8;
          while (index < length) {
            if (this.hashed) {
              this.hashed = false;
              blocks[0] = blocks[16];
              blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
            }
            if (notString) if (ARRAY_BUFFER) for (i = this.start; index < length && i < 64; ++index) buffer8[i++] = message[index]; else for (i = this.start; index < length && i < 64; ++index) blocks[i >> 2] |= message[index] << SHIFT[3 & i++]; else if (ARRAY_BUFFER) for (i = this.start; index < length && i < 64; ++index) {
              code = message.charCodeAt(index);
              if (code < 128) buffer8[i++] = code; else if (code < 2048) {
                buffer8[i++] = 192 | code >> 6;
                buffer8[i++] = 128 | 63 & code;
              } else if (code < 55296 || code >= 57344) {
                buffer8[i++] = 224 | code >> 12;
                buffer8[i++] = 128 | code >> 6 & 63;
                buffer8[i++] = 128 | 63 & code;
              } else {
                code = 65536 + ((1023 & code) << 10 | 1023 & message.charCodeAt(++index));
                buffer8[i++] = 240 | code >> 18;
                buffer8[i++] = 128 | code >> 12 & 63;
                buffer8[i++] = 128 | code >> 6 & 63;
                buffer8[i++] = 128 | 63 & code;
              }
            } else for (i = this.start; index < length && i < 64; ++index) {
              code = message.charCodeAt(index);
              if (code < 128) blocks[i >> 2] |= code << SHIFT[3 & i++]; else if (code < 2048) {
                blocks[i >> 2] |= (192 | code >> 6) << SHIFT[3 & i++];
                blocks[i >> 2] |= (128 | 63 & code) << SHIFT[3 & i++];
              } else if (code < 55296 || code >= 57344) {
                blocks[i >> 2] |= (224 | code >> 12) << SHIFT[3 & i++];
                blocks[i >> 2] |= (128 | code >> 6 & 63) << SHIFT[3 & i++];
                blocks[i >> 2] |= (128 | 63 & code) << SHIFT[3 & i++];
              } else {
                code = 65536 + ((1023 & code) << 10 | 1023 & message.charCodeAt(++index));
                blocks[i >> 2] |= (240 | code >> 18) << SHIFT[3 & i++];
                blocks[i >> 2] |= (128 | code >> 12 & 63) << SHIFT[3 & i++];
                blocks[i >> 2] |= (128 | code >> 6 & 63) << SHIFT[3 & i++];
                blocks[i >> 2] |= (128 | 63 & code) << SHIFT[3 & i++];
              }
            }
            this.lastByteIndex = i;
            this.bytes += i - this.start;
            if (i >= 64) {
              this.start = i - 64;
              this.hash();
              this.hashed = true;
            } else this.start = i;
          }
          if (this.bytes > 4294967295) {
            this.hBytes += this.bytes / 4294967296 << 0;
            this.bytes = this.bytes % 4294967296;
          }
          return this;
        };
        Md5.prototype.finalize = function() {
          if (this.finalized) return;
          this.finalized = true;
          var blocks = this.blocks, i = this.lastByteIndex;
          blocks[i >> 2] |= EXTRA[3 & i];
          if (i >= 56) {
            this.hashed || this.hash();
            blocks[0] = blocks[16];
            blocks[16] = blocks[1] = blocks[2] = blocks[3] = blocks[4] = blocks[5] = blocks[6] = blocks[7] = blocks[8] = blocks[9] = blocks[10] = blocks[11] = blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
          }
          blocks[14] = this.bytes << 3;
          blocks[15] = this.hBytes << 3 | this.bytes >>> 29;
          this.hash();
        };
        Md5.prototype.hash = function() {
          var a, b, c, d, bc, da, blocks = this.blocks;
          if (this.first) {
            a = blocks[0] - 680876937;
            a = (a << 7 | a >>> 25) - 271733879 << 0;
            d = (-1732584194 ^ 2004318071 & a) + blocks[1] - 117830708;
            d = (d << 12 | d >>> 20) + a << 0;
            c = (-271733879 ^ d & (-271733879 ^ a)) + blocks[2] - 1126478375;
            c = (c << 17 | c >>> 15) + d << 0;
            b = (a ^ c & (d ^ a)) + blocks[3] - 1316259209;
            b = (b << 22 | b >>> 10) + c << 0;
          } else {
            a = this.h0;
            b = this.h1;
            c = this.h2;
            d = this.h3;
            a += (d ^ b & (c ^ d)) + blocks[0] - 680876936;
            a = (a << 7 | a >>> 25) + b << 0;
            d += (c ^ a & (b ^ c)) + blocks[1] - 389564586;
            d = (d << 12 | d >>> 20) + a << 0;
            c += (b ^ d & (a ^ b)) + blocks[2] + 606105819;
            c = (c << 17 | c >>> 15) + d << 0;
            b += (a ^ c & (d ^ a)) + blocks[3] - 1044525330;
            b = (b << 22 | b >>> 10) + c << 0;
          }
          a += (d ^ b & (c ^ d)) + blocks[4] - 176418897;
          a = (a << 7 | a >>> 25) + b << 0;
          d += (c ^ a & (b ^ c)) + blocks[5] + 1200080426;
          d = (d << 12 | d >>> 20) + a << 0;
          c += (b ^ d & (a ^ b)) + blocks[6] - 1473231341;
          c = (c << 17 | c >>> 15) + d << 0;
          b += (a ^ c & (d ^ a)) + blocks[7] - 45705983;
          b = (b << 22 | b >>> 10) + c << 0;
          a += (d ^ b & (c ^ d)) + blocks[8] + 1770035416;
          a = (a << 7 | a >>> 25) + b << 0;
          d += (c ^ a & (b ^ c)) + blocks[9] - 1958414417;
          d = (d << 12 | d >>> 20) + a << 0;
          c += (b ^ d & (a ^ b)) + blocks[10] - 42063;
          c = (c << 17 | c >>> 15) + d << 0;
          b += (a ^ c & (d ^ a)) + blocks[11] - 1990404162;
          b = (b << 22 | b >>> 10) + c << 0;
          a += (d ^ b & (c ^ d)) + blocks[12] + 1804603682;
          a = (a << 7 | a >>> 25) + b << 0;
          d += (c ^ a & (b ^ c)) + blocks[13] - 40341101;
          d = (d << 12 | d >>> 20) + a << 0;
          c += (b ^ d & (a ^ b)) + blocks[14] - 1502002290;
          c = (c << 17 | c >>> 15) + d << 0;
          b += (a ^ c & (d ^ a)) + blocks[15] + 1236535329;
          b = (b << 22 | b >>> 10) + c << 0;
          a += (c ^ d & (b ^ c)) + blocks[1] - 165796510;
          a = (a << 5 | a >>> 27) + b << 0;
          d += (b ^ c & (a ^ b)) + blocks[6] - 1069501632;
          d = (d << 9 | d >>> 23) + a << 0;
          c += (a ^ b & (d ^ a)) + blocks[11] + 643717713;
          c = (c << 14 | c >>> 18) + d << 0;
          b += (d ^ a & (c ^ d)) + blocks[0] - 373897302;
          b = (b << 20 | b >>> 12) + c << 0;
          a += (c ^ d & (b ^ c)) + blocks[5] - 701558691;
          a = (a << 5 | a >>> 27) + b << 0;
          d += (b ^ c & (a ^ b)) + blocks[10] + 38016083;
          d = (d << 9 | d >>> 23) + a << 0;
          c += (a ^ b & (d ^ a)) + blocks[15] - 660478335;
          c = (c << 14 | c >>> 18) + d << 0;
          b += (d ^ a & (c ^ d)) + blocks[4] - 405537848;
          b = (b << 20 | b >>> 12) + c << 0;
          a += (c ^ d & (b ^ c)) + blocks[9] + 568446438;
          a = (a << 5 | a >>> 27) + b << 0;
          d += (b ^ c & (a ^ b)) + blocks[14] - 1019803690;
          d = (d << 9 | d >>> 23) + a << 0;
          c += (a ^ b & (d ^ a)) + blocks[3] - 187363961;
          c = (c << 14 | c >>> 18) + d << 0;
          b += (d ^ a & (c ^ d)) + blocks[8] + 1163531501;
          b = (b << 20 | b >>> 12) + c << 0;
          a += (c ^ d & (b ^ c)) + blocks[13] - 1444681467;
          a = (a << 5 | a >>> 27) + b << 0;
          d += (b ^ c & (a ^ b)) + blocks[2] - 51403784;
          d = (d << 9 | d >>> 23) + a << 0;
          c += (a ^ b & (d ^ a)) + blocks[7] + 1735328473;
          c = (c << 14 | c >>> 18) + d << 0;
          b += (d ^ a & (c ^ d)) + blocks[12] - 1926607734;
          b = (b << 20 | b >>> 12) + c << 0;
          bc = b ^ c;
          a += (bc ^ d) + blocks[5] - 378558;
          a = (a << 4 | a >>> 28) + b << 0;
          d += (bc ^ a) + blocks[8] - 2022574463;
          d = (d << 11 | d >>> 21) + a << 0;
          da = d ^ a;
          c += (da ^ b) + blocks[11] + 1839030562;
          c = (c << 16 | c >>> 16) + d << 0;
          b += (da ^ c) + blocks[14] - 35309556;
          b = (b << 23 | b >>> 9) + c << 0;
          bc = b ^ c;
          a += (bc ^ d) + blocks[1] - 1530992060;
          a = (a << 4 | a >>> 28) + b << 0;
          d += (bc ^ a) + blocks[4] + 1272893353;
          d = (d << 11 | d >>> 21) + a << 0;
          da = d ^ a;
          c += (da ^ b) + blocks[7] - 155497632;
          c = (c << 16 | c >>> 16) + d << 0;
          b += (da ^ c) + blocks[10] - 1094730640;
          b = (b << 23 | b >>> 9) + c << 0;
          bc = b ^ c;
          a += (bc ^ d) + blocks[13] + 681279174;
          a = (a << 4 | a >>> 28) + b << 0;
          d += (bc ^ a) + blocks[0] - 358537222;
          d = (d << 11 | d >>> 21) + a << 0;
          da = d ^ a;
          c += (da ^ b) + blocks[3] - 722521979;
          c = (c << 16 | c >>> 16) + d << 0;
          b += (da ^ c) + blocks[6] + 76029189;
          b = (b << 23 | b >>> 9) + c << 0;
          bc = b ^ c;
          a += (bc ^ d) + blocks[9] - 640364487;
          a = (a << 4 | a >>> 28) + b << 0;
          d += (bc ^ a) + blocks[12] - 421815835;
          d = (d << 11 | d >>> 21) + a << 0;
          da = d ^ a;
          c += (da ^ b) + blocks[15] + 530742520;
          c = (c << 16 | c >>> 16) + d << 0;
          b += (da ^ c) + blocks[2] - 995338651;
          b = (b << 23 | b >>> 9) + c << 0;
          a += (c ^ (b | ~d)) + blocks[0] - 198630844;
          a = (a << 6 | a >>> 26) + b << 0;
          d += (b ^ (a | ~c)) + blocks[7] + 1126891415;
          d = (d << 10 | d >>> 22) + a << 0;
          c += (a ^ (d | ~b)) + blocks[14] - 1416354905;
          c = (c << 15 | c >>> 17) + d << 0;
          b += (d ^ (c | ~a)) + blocks[5] - 57434055;
          b = (b << 21 | b >>> 11) + c << 0;
          a += (c ^ (b | ~d)) + blocks[12] + 1700485571;
          a = (a << 6 | a >>> 26) + b << 0;
          d += (b ^ (a | ~c)) + blocks[3] - 1894986606;
          d = (d << 10 | d >>> 22) + a << 0;
          c += (a ^ (d | ~b)) + blocks[10] - 1051523;
          c = (c << 15 | c >>> 17) + d << 0;
          b += (d ^ (c | ~a)) + blocks[1] - 2054922799;
          b = (b << 21 | b >>> 11) + c << 0;
          a += (c ^ (b | ~d)) + blocks[8] + 1873313359;
          a = (a << 6 | a >>> 26) + b << 0;
          d += (b ^ (a | ~c)) + blocks[15] - 30611744;
          d = (d << 10 | d >>> 22) + a << 0;
          c += (a ^ (d | ~b)) + blocks[6] - 1560198380;
          c = (c << 15 | c >>> 17) + d << 0;
          b += (d ^ (c | ~a)) + blocks[13] + 1309151649;
          b = (b << 21 | b >>> 11) + c << 0;
          a += (c ^ (b | ~d)) + blocks[4] - 145523070;
          a = (a << 6 | a >>> 26) + b << 0;
          d += (b ^ (a | ~c)) + blocks[11] - 1120210379;
          d = (d << 10 | d >>> 22) + a << 0;
          c += (a ^ (d | ~b)) + blocks[2] + 718787259;
          c = (c << 15 | c >>> 17) + d << 0;
          b += (d ^ (c | ~a)) + blocks[9] - 343485551;
          b = (b << 21 | b >>> 11) + c << 0;
          if (this.first) {
            this.h0 = a + 1732584193 << 0;
            this.h1 = b - 271733879 << 0;
            this.h2 = c - 1732584194 << 0;
            this.h3 = d + 271733878 << 0;
            this.first = false;
          } else {
            this.h0 = this.h0 + a << 0;
            this.h1 = this.h1 + b << 0;
            this.h2 = this.h2 + c << 0;
            this.h3 = this.h3 + d << 0;
          }
        };
        Md5.prototype.hex = function() {
          this.finalize();
          var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
          return HEX_CHARS[h0 >> 4 & 15] + HEX_CHARS[15 & h0] + HEX_CHARS[h0 >> 12 & 15] + HEX_CHARS[h0 >> 8 & 15] + HEX_CHARS[h0 >> 20 & 15] + HEX_CHARS[h0 >> 16 & 15] + HEX_CHARS[h0 >> 28 & 15] + HEX_CHARS[h0 >> 24 & 15] + HEX_CHARS[h1 >> 4 & 15] + HEX_CHARS[15 & h1] + HEX_CHARS[h1 >> 12 & 15] + HEX_CHARS[h1 >> 8 & 15] + HEX_CHARS[h1 >> 20 & 15] + HEX_CHARS[h1 >> 16 & 15] + HEX_CHARS[h1 >> 28 & 15] + HEX_CHARS[h1 >> 24 & 15] + HEX_CHARS[h2 >> 4 & 15] + HEX_CHARS[15 & h2] + HEX_CHARS[h2 >> 12 & 15] + HEX_CHARS[h2 >> 8 & 15] + HEX_CHARS[h2 >> 20 & 15] + HEX_CHARS[h2 >> 16 & 15] + HEX_CHARS[h2 >> 28 & 15] + HEX_CHARS[h2 >> 24 & 15] + HEX_CHARS[h3 >> 4 & 15] + HEX_CHARS[15 & h3] + HEX_CHARS[h3 >> 12 & 15] + HEX_CHARS[h3 >> 8 & 15] + HEX_CHARS[h3 >> 20 & 15] + HEX_CHARS[h3 >> 16 & 15] + HEX_CHARS[h3 >> 28 & 15] + HEX_CHARS[h3 >> 24 & 15];
        };
        Md5.prototype.toString = Md5.prototype.hex;
        Md5.prototype.digest = function() {
          this.finalize();
          var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3;
          return [ 255 & h0, h0 >> 8 & 255, h0 >> 16 & 255, h0 >> 24 & 255, 255 & h1, h1 >> 8 & 255, h1 >> 16 & 255, h1 >> 24 & 255, 255 & h2, h2 >> 8 & 255, h2 >> 16 & 255, h2 >> 24 & 255, 255 & h3, h3 >> 8 & 255, h3 >> 16 & 255, h3 >> 24 & 255 ];
        };
        Md5.prototype.array = Md5.prototype.digest;
        Md5.prototype.arrayBuffer = function() {
          this.finalize();
          var buffer = new ArrayBuffer(16);
          var blocks = new Uint32Array(buffer);
          blocks[0] = this.h0;
          blocks[1] = this.h1;
          blocks[2] = this.h2;
          blocks[3] = this.h3;
          return buffer;
        };
        Md5.prototype.buffer = Md5.prototype.arrayBuffer;
        Md5.prototype.base64 = function() {
          var v1, v2, v3, base64Str = "", bytes = this.array();
          for (var i = 0; i < 15; ) {
            v1 = bytes[i++];
            v2 = bytes[i++];
            v3 = bytes[i++];
            base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] + BASE64_ENCODE_CHAR[63 & (v1 << 4 | v2 >>> 4)] + BASE64_ENCODE_CHAR[63 & (v2 << 2 | v3 >>> 6)] + BASE64_ENCODE_CHAR[63 & v3];
          }
          v1 = bytes[i];
          base64Str += BASE64_ENCODE_CHAR[v1 >>> 2] + BASE64_ENCODE_CHAR[v1 << 4 & 63] + "==";
          return base64Str;
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
    }).call(this, require("_process"), "undefined" !== typeof global ? global : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {});
  }, {
    _process: 1
  } ]
}, {}, [ "InitGame", "EventType", "GameConfig", "MsgConfig", "GameMode", "HotUpdate", "NetTcp", "AudioMgr", "Debug", "DeviceApi", "EventMgr", "KeyBackExit", "StrTools", "UtilTools", "WxMgr", "md5", "LoadingTips", "NoticeTips", "Toast", "LoadingScene", "LoginScene", "LogoScene" ]);