
var WxMgr = {};

var Tag_WeiXinToken = "weixin_token";
var Tag_WeiXinShare = "weixin_share";
var Tag_WeiXinPay   = "weixin_pay";

var ANDROID_CLASS_NAME = "com/happy9/pyqps/wxapi/WXUtils";

var callBackHandler = {};


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

//请求微信授权
WxMgr.getWeixinAuth = function(callback) {
    callBackHandler[Tag_WeiXinToken] = callback;

    if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(ANDROID_CLASS_NAME, "getWeixinAuth", "()V"); 
    }
    else if (cc.sys.os == cc.sys.OS_IOS) {

    } 
} 





// var DeviceApi = require('DeviceApi'); 



// //微信分享_文字
// WxMgr.wxShareText = function(toScene,textStr,pCall){
//     var self = this;
//     self._shareEndCall = pCall;

//     var data        = {};
//     data.shareScene = toScene;
//     data.shareType  = 1;
//     data.textMsg    = textStr;
//     DeviceApi.addCallback(self.shareResultCall.bind(this),"shareResultCall");
//     cDeviceApi.wxShare(JSON.stringify(data));
// }

// //微信分享_图片
// WxMgr.wxShareImg = function(toScene,imgPath,pCall){
//     var self = this;
//     self._shareEndCall = pCall;

//     var data        = {};
//     data.shareScene = toScene;
//     data.shareType  = 2;
//     data.imgPath    = imgPath;
//     DeviceApi.addCallback(self.shareResultCall.bind(this),"shareResultCall");
//     DeviceApi.wxShare(JSON.stringify(data));
// }

// //微信分享_web
// WxMgr.wxShareWeb = function(toScene,title,des,imgUrl,urlLink,pCall){
//     var self = this;
//     self._shareEndCall = pCall;
    
//     var data        = {};
//     data.shareScene = toScene;
//     data.shareType  = 3;
//     data.linkUrl    = urlLink;//点击后跳转的url
//     data.imgUrl     = imgUrl;    //icon所在url
//     data.title      = title;      //标题
//     data.des        = des;          //描述
//     DeviceApi.addCallback(self.shareResultCall.bind(this),"shareResultCall");
//     DeviceApi.wxShare(JSON.stringify(data));
// }

// //分享成功回调
// WxMgr.shareResultCall = function(data){
//     var self = this;
//     //data.result = 1 成功 -1 取消 ...
//     if(self._shareEndCall){
//         self._shareEndCall(data);
//     }
// }

// //打开微信
// WxMgr.openWxApp = function(){
//     var bResult = false;
//     bResult = DeviceApi.openWXApp();
//     return bResult;
// }

// //获取微信token
// WxMgr.getWXToken = function(){
//     var token = gt.getLocal('wxToken');
//     if(token && token.length>0){
//         return token;
//     }
//     return null
// }

// //保存微信token
// WxMgr.saveWXToken = function(token){
//     if(token){
//         gt.setLocal('wxToken', token);
//     }
// }

// //删除微信token
// WxMgr.delWXToken = function(){
//     var self = this;
//     self.saveWXToken('');
// }

module.exports = WxMgr;
