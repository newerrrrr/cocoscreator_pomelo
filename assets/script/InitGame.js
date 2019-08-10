
//initGame.js 初始化游戏配置, 在 LoginScene.js 中加载 

(function() { 
    window.gt = {} 
    gt.playerData = {};

    //注: require()不需要带路径,或者带相对路径 
    require('./config/GameConfig').init(gt); 
    require('./config/MsgConfig').init(gt);
    require('./public/utils/UtilTools').init(gt);
    require('./public/utils/Debug').init(gt);
    
    gt.EventType = require('./config/EventType');
    gt.tcp       = require('./public/net/NetTcp');
    gt.http      = require('./public/net/NetHttp');
    gt.deviceApi = require('./public/utils/DeviceApi'); 
    gt.wxMgr     = require('./public/utils/WxMgr'); 
    gt.audio     = require('./public/utils/AudioMgr');
    gt.gameMode  = require('./public/GameMode');

    gt.ui = {} 
    gt.ui.toast      = require('./views/msgbox/Toast');
    gt.ui.noticeTips = require('./views/msgbox/NoticeTips');
})();
