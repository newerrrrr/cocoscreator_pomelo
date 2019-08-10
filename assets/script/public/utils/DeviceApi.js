
var DeviceApi = {};

var ANDROID_CLASS_NAME = "org/cocos2dx/javascript/SystemAPI";
var IOS_CLASS_NAME = null;

//异步回调 
var callBackHandler = {};
var Tag_Clipboard   = 'Tag_Clipboard';
var Tag_Battery     = 'Tag_Battery';


//注意：在 Android 应用中，cocos 引擎的渲染和 JS 的逻辑是在 GL 线程中进行的，
//而 Android 本身的 UI 更新是在 App 的 UI 线程进行的，所以如果我们在 JS 中调
//用的 Java 方法有任何刷新 UI 的操作，都需要在 UI 线程进行。

//异步回调处理, 此方法在 Java中调用 
//para: 当多参数时可写成 {key1:val1, ...} 
DeviceApi.execCallback = function(tag, para) { 
    cc.log("DeviceApi.execCallback: ", tag, para)
    callBackHandler[tag] && callBackHandler[tag](para); 
}

DeviceApi.copyToClipboard = function(str) {
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(ANDROID_CLASS_NAME, "copyToClipboard", "(Ljava/lang/String;)V", str); 
    }
    else if (cc.sys.os == cc.sys.OS_IOS) {

    } 
}

//获取剪切板内容,用完之后记得清空(使用方法 copyToClipboard("") ) 
DeviceApi.getClipboardText = function(callback, clearAfterRead) {
    if (!callback) return;

    callBackHandler[Tag_Clipboard] = callback;
    let clear = clearAfterRead ? "true" : "false";
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(ANDROID_CLASS_NAME, "getClipboardContent", "(Ljava/lang/String;Ljava/lang/String;)V", Tag_Clipboard, clear); 
    }
    else if (cc.sys.os == cc.sys.OS_IOS) {

    } 
}

//获取电池电量, 不要频繁访问, 间隔需2秒以上 
DeviceApi.getBattery = function(callback) {
    if (!callback) return; 
    callBackHandler[Tag_Battery] = callback;

    if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(ANDROID_CLASS_NAME, "getBattery", "(Ljava/lang/String;)V", Tag_Battery); 
    }
    else if (cc.sys.os == cc.sys.OS_IOS) {

    }     
}

//获取唯一的设备id
//android 获取android id
//ios 获取idfa
DeviceApi.getUUID = function(){ 
    let uuid = "";
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        uuid = jsb.reflection.callStaticMethod(ANDROID_CLASS_NAME, "getUUID", "()Ljava/lang/String;"); 
    }
    else if (cc.sys.os == cc.sys.OS_IOS) {

    } 
    return uuid; 
};

DeviceApi.getShareCode = function(){ 
    let shareCode = "";
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        shareCode = jsb.reflection.callStaticMethod(ANDROID_CLASS_NAME, "getShareCode", "()Ljava/lang/String;"); 
    }
    else if (cc.sys.os == cc.sys.OS_IOS) {

    } 
    return shareCode;
}

DeviceApi.isGpsOpen = function() {
    let result = false;
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        result = jsb.reflection.callStaticMethod(ANDROID_CLASS_NAME, "isGpsOPen", "()Z"); 
    }
    else if (cc.sys.os == cc.sys.OS_IOS) {

    } 
    return result;
} 

DeviceApi.gotoOpenGps = function() {
    let result = false;
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        result = jsb.reflection.callStaticMethod(ANDROID_CLASS_NAME, "gotoOpenGps", "()V"); 
    }
    else if (cc.sys.os == cc.sys.OS_IOS) {

    } 
    return result;
} 

DeviceApi.vibrate = function(millisecond) {
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod(ANDROID_CLASS_NAME, "vibrate", "(I)V", millisecond); 
    }
    else if (cc.sys.os == cc.sys.OS_IOS) {

    } 
}







module.exports = DeviceApi;
