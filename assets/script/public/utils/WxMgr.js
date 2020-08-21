
var WxMgr = {};

var Tag_WeiXinToken    = "weixin_token";
var Tag_WeiXinShare    = "weixin_share";
var Tag_WeiXinPay      = "weixin_pay";

var ANDROID_CLASS_NAME = "com/happy9/pyqps/wxapi/WXUtils";

var callBackHandler    = {};
var weixinInfo         = null;

if(gt.isIOS()) { 
    WxMgr.SHARE_TO_SESSION  = "WXSceneSession";
    WxMgr.SHARE_TO_TIMELINE = "WXSceneTimeline";
} 
else{ 
    WxMgr.SHARE_TO_SESSION  = "session";
    WxMgr.SHARE_TO_TIMELINE = "timeline";
} 


//用于java/ios调用js函数
//para: 当多参数时可写成 {key1:val1, ...} 
WxMgr.execCallback = function(tag, para) {
    callBackHandler[tag] && callBackHandler[tag](para); 
}

//是否安装微信
WxMgr.isWXAppInstalled = function(){ 
    var result = false;
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        result = jsb.reflection.callStaticMethod(ANDROID_CLASS_NAME, "isWXAppInstalled", "()Z"); 
    }
    else if (cc.sys.os == cc.sys.OS_IOS) {

    } 
    return result;
} 

//微信分享_图片
WxMgr.shareImage = function(shareType, filepath, callback){ 
    callBackHandler[Tag_WeiXinShare] = callback;
    
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(ANDROID_CLASS_NAME, "shareImage", "(Ljava/lang/String;Ljava/lang/String;)V", shareType, filepath); 
    }
    else if (cc.sys.os == cc.sys.OS_IOS) {

    } 
} 

//微信分享APP URL
WxMgr.shareUrl = function(shareType, title, desc, url, callback) {
    callBackHandler[Tag_WeiXinShare] = callback;
    
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(ANDROID_CLASS_NAME, "shareAppInfo", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", shareType, title, desc, url); 
    }
    else if (cc.sys.os == cc.sys.OS_IOS) {

    } 
}

//微信支付: orderInfo:字符串化的json数据. 此接口暂未调试, todo ...
WxMgr.weixinPay = function(orderInfo) {
    callBackHandler[Tag_WeiXinPay] = callback;
    
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(ANDROID_CLASS_NAME, "weixinPay", "(Ljava/lang/String;)V", orderInfo); 
    }
    else if (cc.sys.os == cc.sys.OS_IOS) {

    } 
} 


//请求微信授权
WxMgr.getWeixinAuth = function(callback) {
    cc.log('=== getWeixinAuth');
    callBackHandler[Tag_WeiXinToken] = callback;

    if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(ANDROID_CLASS_NAME, "getWeixinAuth", "()V"); 
    }
    else if (cc.sys.os == cc.sys.OS_IOS) {

    } 
} 

//根据授权id获取 token 
WxMgr.getTokenByAuthId = function(authCode, callback) { 
    cc.log('xxx getTokenByAuthId: authCode= ', authCode);
    let url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+gt.wxAppId+'&secret='+gt.wxSecret+'&code='+authCode+'&grant_type=authorization_code';
    gt.http.getData(url, function(result, resp) {
        if (!result) {
            callback && callback(false);
            return;
        }
        cc.log('xxx getTokenByAuthId: resp= ', resp);
        resp = JSON.parse(resp);
        if (resp.errcode) {//申请失败
            cc.log("xxx get token fail!!, errcode：", resp.errcode); 
            callback && callback(false); 
            return 
        } 
        callback && callback(true, resp);
    }); 
}

//获取 access token 
WxMgr.getAccessTokenByRefreshToken = function(refreshToken, callback) { 
    cc.log('xxx getAccessToken, begin...');
    let url = 'https://api.weixin.qq.com/sns/oauth2/refresh_token?appid='+gt.wxAppId+'&grant_type=refresh_token&refresh_token='+refreshToken;
    gt.http.getData(url, function(result, resp) {
        if (!result) {
            callback && callback(false);
            return;
        }
        cc.log('xxx getAccessToken: resp= ', resp);
        resp = JSON.parse(resp);
        callback && callback(true, resp); 
    });  
}

//获取微信个人昵称, 性别, 头像url等内容
WxMgr.getWeixinUserInfo = function(accessToken, openId, callback) {
    cc.log('xxx getWeixinUserInfo, begin...');
    let url = 'https://api.weixin.qq.com/sns/userinfo?access_token='+accessToken+'&openid='+openId;
    gt.http.getData(url, function(result, resp) {
        if (!result) {
            callback && callback(false);
            return;
        }
        cc.log('xxx getWeixinUserInfo, resp =', resp);
        resp = JSON.parse(resp);
        callback && callback(true, resp);
    });
}



module.exports = WxMgr;
