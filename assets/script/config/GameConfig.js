

module.exports.init = function(gt){

    //gate服务器
    gt.gateServer     = { ip:'192.168.198.128', port:3014};
    
    //维护公告
    gt.noticeUrl      = "http://47.95.217.228:8090/Web/NoticeWeb/GetNotice_Friend"
    
    //微信APPID
    gt.wxAppId       = "wxb64d088517456e5f"; //如果要更换 appid, 则 java 和 oc 均需要修改 
    
    //微信密钥
    gt.wxSecret      = "a6e3924c03258c2af514e6b6f395b8ca";
    
    //是否IOS审核版本
    gt.isReview       = false;
    
    //调试模式
    gt.debug          = true;
    
    //游客登陆
    gt.open_guest     = true;
    
    //热更新
    gt.open_hotupdate = false;
    
    gt.designSize     = cc.size(1334, 750);
    
    gt.center         = cc.v2(gt.designSize.width/2, gt.designSize.height/2);
    
    //游戏ID 
    gt.GameID = { 
        ZZMJ: 1,
        NZMJ: 2,
    };
};
