
module.exports.init = function(gt){ 


/*
** 是否是原生app端
*/
gt.isNative = function() {
    return cc.sys.isNative && jsb;
}

/*
** 是否是Adnroid
*/
gt.isAndroid = function() {
    return cc.sys.os == cc.sys.OS_ANDROID;
}

/*
** 是否是IOS 
*/
gt.isIOS = function() {
    return cc.sys.os == cc.sys.OS_IOS;
}

/*
** 是否是IOS审核版本
*/
gt.isIOSReview = function() {
    if (!gt.isIOS()) {
        return false;
    }
    else {
        return gt.isReview;
    }
}

/*
** 获取设备ID
*/
gt.getDeviceId = function() {
    return gt.deviceApi.getDeviceId();
}

/*
** 手动retain对象。(如果未开启自动管理生命周期时才允许手动操作)
*/
gt.retain = function(obj) {
    if (!cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
        obj.retain();
    }
}

/*
** 手动release对象
*/ 
gt.release = function(obj) {
    if (obj && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
        obj.release();
    }
}

/*
** 设置常驻节点（为其他场景使用）
** 将Node成为常驻节点，场景切换时不会清除这个节点的内存
** 方便下一个场景可以通过这个节点访问数据
*/
gt.addPersistNode = function(node) {
    cc.game.addPersistRootNode(node);
}

/*
** 移除常驻节点
*/ 
gt.removePersistNode = function(node) {
    cc.game.removePersistRootNode(node)
}

/*
** 保存String数据到本地
*/
gt.setLocal = function(key, str) {
    key += '';
    str += '';
    cc.sys.localStorage.setItem(key, gt.encodeString(str));
}

/*
** 获取本地保存的String数据
*/
gt.getLocal = function(key, defaultStr) {
    key += '';
    var str = cc.sys.localStorage.getItem(key);
    if (str) str = gt.decodeString(str);
    if (!str || str.length <= 0) {
        str = defaultStr
    }
    return str;
}

/*
** 删除本地保存的String数据
*/
gt.deleteLocal = function(key) {
    key += '';
    cc.sys.localStorage.removeItem(gt.encodeString(key));
}


/*
** 简单加密字符串
*/
gt.encodeString = function(code) {
    var c = String.fromCharCode(code.charCodeAt(0)+code.length);  
    for(var i=1; i<code.length; i++){  
        c += String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));  
    } 
    c = escape(c);
    return c;
}

/*
** 简单解密字符串
*/
gt.decodeString = function(code) {
    code = unescape(code);  
    var c = String.fromCharCode(code.charCodeAt(0)-code.length);  
    for(var i=1; i<code.length; i++){  
        c += String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));  
    }  
    return c;  
}

/*
** 绑定参数
** 第一个参数必须是函数类型
*/
gt.bindParams = function() {
    var args = Array.prototype.slice.call(arguments);
    var func = args.shift();
    if (typeof(func) != 'function') return;

    return function() {
      return func.apply(null, args.concat(Array.prototype.slice.call(arguments)));
  };
}

/*
** 生成任意值到任意值（也就是指定范围内）的随机数
** max期望的最大值
** min期望的最小值
*/
gt.random = function(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
} 

/*
** string转化成Bytes
*/
gt.stringToBytes = function(str) {  
    var ch, re = []; 
    for (var i = 0; i < str.length; i++ ) { 
        ch = str.charCodeAt(i);  // get char
        var st = [];
        do {  
            st.push( ch & 0xFF );  // push byte to stack  
            ch = ch >> 8;          // shift value down by 1 byte  
        }
        while ( ch );  
        // add stack contents to result  
        // done because chars have "wrong" endianness
        re = re.concat( st.reverse() ); 
    }  
    // return an array of bytes  
    return re;  
} 

/*
** 转化 value=n*256+m 为对应的字符串 nm 
*/
gt.jsToCByShort = function(value) {
    var low1 = Math.floor(value / 256);
    var low2 = Math.floor(value % 256);
    return String.fromCharCode(low1, low2);
}

/*
** 转化m+n*2^24+k*2^16+l*2^8=为字符串mnkl
*/
gt.jsToCByInt = function(value) { 
    var low1 = Math.floor(value / (256*256*256));
    var low2 = Math.floor(value / (256*256)) % 256;
    var low3 = Math.floor(value / 256) % 256;
    var low4 = Math.floor(value % 256);
    return String.fromCharCode(low1,low2,low3,low4);
}

/*
** 计算长度
*/
gt.srcSum = function(strData, len) {
    var sum = 65535;
    for (var i=0; i < len; i++) {
        var d = strData[i];
        sum = sum^d;
        if ((sum && 1) == 0) {
            sum = sum / 2;
        }
        else {
            sum = (sum/2)^(0x70B1);
        }
    }
    return sum;
}

/*
** @description 把GPS原始坐标转换成GCJ-02火星坐标
** @param lat 纬度
** @param lng 经度
** @return lat,lng
*/
/**
 * WGS84转GCj02
 * @param lng
 * @param lat
 * @returns {*[]}
 */
//function wgs84togcj02(lng, lat) {
gt.convertGPS2GCJ = function(lng, lat) {
    lng = Number(lng);
    lat = Number(lat);

    var PI = 3.1415926535897932384626;
    var a  = 6378245.0;
    var ee = 0.00669342162296594323;

    function transformlat(lng, lat) {
        var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0;
        return ret
    }
     
    function transformlng(lng, lat) {
        var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0;
        return ret
    }

    function out_of_china(lng, lat) {
        return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
    }

    // if (out_of_china(lng, lat)) {
    //     return {lat:lat, lng:lng}
    // }
    // else {
        var dlat = transformlat(lng - 105.0, lat - 35.0);
        var dlng = transformlng(lng - 105.0, lat - 35.0);
        var radlat = lat / 180.0 * PI;
        var magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
        dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
        var mglat = lat + dlat;
        var mglng = lng + dlng;
        return {lat:mglat, lng:mglng};
    // }
}

/**
 * GCJ02 转换为 WGS84
 * @param lng
 * @param lat
 * @returns {*[]}
 */
gt.gcj02towgs84 = function(lng, lat) {
    if (out_of_china(lng, lat)) {
        return [lng, lat]
    }
    else {
        var dlat = transformlat(lng - 105.0, lat - 35.0);
        var dlng = transformlng(lng - 105.0, lat - 35.0);
        var radlat = lat / 180.0 * PI;
        var magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
        dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
        mglat = lat + dlat;
        mglng = lng + dlng;
        return [lng * 2 - mglng, lat * 2 - mglat];
    }
}

/*
** @description 计算两个经纬度点间的距离
** @return 距离（number），千米
*/
gt.getDistanceOfTwoPoint = function(lat1, lng1, lat2, lng2) {
    // AppLog.log(lat1,lng1,lat2,lng2);

    //角度转弧度
    var angleToRadian = function(angle) {
        return angle*Math.PI/180;
    }

    var radlat1 = angleToRadian(lat1);
    var radlat2 = angleToRadian(lat2);;
    var a = radlat1 - radlat2;
    var b = angleToRadian(lng1) - angleToRadian(lng2);
    var distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2)+ Math.cos(radlat1) * Math.cos(radlat2) * Math.pow(Math.sin(b/2),2)));
    var earth_radius = 6378.137;
    distance = distance*earth_radius;
    return Math.abs(distance);
}

/*
** 转化数字为万、亿为单位的字符串
** num需转化的数字
** radix进制
** decimal 小数点后保留位数
** costomunitArr 自定义后缀 ['','W','Y','H']
*/
gt.convertNumToShort = function(num, radix, decimal, costomunitArr) {
    var unitArr = ['', '万', '亿', '万亿'];

    var sign = (num != 0)?num/Math.abs(num):1;  //符号
    num = Math.abs(num);

    //替换自定义后缀
    if(costomunitArr){
        unitArr = costomunitArr;
    }

    radix = (radix == null)?10000:radix; //默认值  10000万亿
    decimal = (decimal == null)?1:decimal; //默认值

    var sum = 0;
    while (num >= radix) {
        sum ++;
        num = num/radix;
    }
    num = Math.floor(num*Math.pow(10, decimal))/Math.pow(10, decimal);
    
    return num*sign + unitArr[sum]; 
}

//截屏 node:需要截屏的节点
gt.captureScreen = function(node, callback) {
    let width = Math.floor(node.width);
    let height = Math.floor(node.height);

    if (CC_JSB) {
        let fileName = "hlbtest.jpg";
        let fullPath = jsb.fileUtils.getWritablePath() + fileName;
        if (jsb.fileUtils.isFileExist(fullPath)) {
            jsb.fileUtils.removeFile(fullPath);
        } 
        let cameraNode = new cc.Node();
        cameraNode.position = cc.v2(width*0.5, height*0.5);
        cameraNode.parent = node.parent;
        let camera = cameraNode.addComponent(cc.Camera);
        camera.cullingMask = 0xffffffff;
        let texture = new cc.RenderTexture();
        let gl = cc.game._renderContext;
        texture.initWithSize(width, height, gl.STENCIL_INDEX8);
        camera.targetTexture = texture;
        camera.render(node);
        let data = texture.readPixels();

        //以下代码将截图后默认倒置的图片回正
        let picData = new Uint8Array(width * height * 4);
        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let srow = height - 1 - row;
            let start = Math.floor(srow * width * 4);
            let reStart = row * width * 4;
            // save the piexls data
            for (let i = 0; i < rowBytes; i++) {
                picData[reStart + i] = data[start + i];
            }
        }
        
        //保存图片
        jsb.saveImageData(picData, width, height, fullPath);
        console.log("截图成功，图片保存在 ====>", fullPath);
        node.parent.removeChild(camera);
        if (callback) callback(fullPath);
    } 
} 


//WX链接分享
//linkUrl:点击跳转的url
//title:分享标题
//content:分享内容
//toScene:分享场景 Global.WX_SHARE_SCENE
//shareResultCall:分享结果回调
gt.WXShareLink = function(linkUrl, title, content, toScene, shareResultCall){
    var iconUrl = gt.webShareIcon;
    if(toScene >= 0 && linkUrl && title && content){
        gt.WxMgr.wxShareWeb(toScene, title, content, iconUrl, linkUrl, shareResultCall);
    }
}

//WX图片分享
//imgPath 图片地址
//toScene: 分享场景
gt.WXShareImage = function(imgPath, toScene, shareResultCall){
    if(toScene >= 0 && imgPath){
        gt.WxMgr.wxShareImg(toScene, imgPath, shareResultCall);
    }
}

//是否开启wss 
//即当是https的时候，websocket也需要用wss
gt.isUserWSS = function(){
    var res = false
    if(gt.loginServerAddress.indexOf(':') === -1 && cc.sys.isBrowser){
        res = true
    }
    return res
}

// 按钮点击事件
gt.btnClickEvent = function(btn, func, obj, sound) {
    if(btn == null) {
        return null;
    }
    btn.on("click", func, obj);
    btn.on("touchstart", function() {
        gt.audio.playEffect(sound || "common/btn_click", false);
    });
    return btn;
}

//自动适配设备
gt.autoAdaptDevices = function () { 
    let canvasNode = cc.find('Canvas'); 
    let canvas = canvasNode.getComponent(cc.Canvas);

    let frameWidth   = canvasNode.width;
    let frameHeight  = canvasNode.height;
    let designWidth  = canvas.designResolution.width;
    let designHeight = canvas.designResolution.height;
    if ((frameWidth/frameHeight) < (designWidth/designHeight)) { //按照宽来适配
        canvas.fitWidth = true;
        canvas.fitHeight = false;
    }
    else { //按照高来适配
        canvas.fitWidth = false;
        canvas.fitHeight = true;
    }

    //适配iPhoneX的刘海
    gt.setAdaptIphoneX();
}

// 适配iphoneX
gt.setAdaptIphoneX = function(nodeName) {
    let canvas = cc.find("Canvas");
    let nameStr = 'node_root'
    if(nodeName){
        nameStr = nodeName
    }
    let nodeRoot = canvas.getChildByName(nameStr);
    
    let func = function() {
        if (nodeRoot) {
            let widget = nodeRoot.getComponent(cc.Widget);
            widget.top    = 0;
            widget.bottom = 0;
            widget.left   = 0;
            widget.right  = 0;
        }
    }; 

    if(cc.sys.isNative && cc.sys.platform == cc.sys.IPHONE){
        let size = cc.view.getFrameSize();
        let isIphoneX = (size.width == 2436 && size.height == 1125)
            ||(size.width == 1125 && size.height == 2436);
        if(isIphoneX){

        }
        else {
            func();
        }
    }
    else {
        func();
    }
}

/*
** 检测IP跟GPS
** playersList参数结构:[{uid:*, ip:*, lat:* lng:*},...]
** toPlayer参数结构：{uid:*, ip:*, lat:*, lng:*} 说明：相对玩家，缺省情况下，会两两相互之间比较
*/
gt.checkIpAndGps = function(playersList, toPlayer) {
    //是否开启GPS
    var isOpenGPS = function(player) {
        return !(player.lat === 0 && player.lng === 0);
    };

    //IP相同
    var isSameIp = function(player1, player2) {
        return (player1.ip.split(':')[0] == player2.ip.split(':')[0]);
    };

    var isNearlyDistance = function(player1, player2) {
        if (!isOpenGPS(player1)) return false;
        if (!isOpenGPS(player2)) return false;
        return gt.getDistanceOfTwoPoint(player1.lat, player1.lng, player2.lat, player2.lng) <= 0.2;
    }

    if (!toPlayer) {
        //先检测是否IP相同
        for (var i=0; i < playersList.length - 1; i++) {
            if (!playersList[i]) continue;
            for (var j=i+1; j < playersList.length; j++) {
                if (!playersList[j]) continue;
                if (isSameIp(playersList[i], playersList[j])) return true;
            }
        }

        //再检测GPS是否过近
        for (var i=0; i < playersList.length - 1; i++) {
            if (!playersList[i]) continue;
            for (var j=i+1; j < playersList.length; j++) {
                if (!playersList[j]) continue;
                if (isNearlyDistance(playersList[i], playersList[j])) return true;
            }
        }
    }
    else {
        //先检测是否IP相同
        for (var i=0; i < playersList.length; i++) {
            if (!playersList[i]) continue;
            if (playersList[i].uid == toPlayer.uid) continue;
            if (isSameIp(playersList[i], toPlayer)) return true;
        }

        //再检测GPS是否过近
        for (var i=0; i < playersList.length; i++) {
            if (!playersList[i]) continue;
            if (playersList[i].uid == toPlayer.uid) continue;
            if (isNearlyDistance(playersList[i], toPlayer)) return true;
        }
    }
    return false;
}

// 弹出动画显示
gt.showAlertAction = function(node, isShow, startScale, endScale, callback) {
    let start_Scale = startScale;
    let end_Scale = endScale;

    if(isShow) {
        if(start_Scale == null){
            node.scale = 0;
        }
        else {
            node.scale = start_Scale;
        }

        if(end_Scale == null){
            end_Scale = 1;
        }
    }
    else {
        if(start_Scale == null){
            node.scale = 1;
        }

        if(end_Scale == null){
            end_Scale = 0;
        }
    }

    let action = cc.scaleTo(0.2,end_Scale);
    if(isShow) {
        action.easing(cc.easeBackOut());
    }
    else{
        action.easing(cc.easeSineIn());
    }

    node.runAction(cc.sequence(action, cc.callFunc(function() {
        if(callback){
            callback();
        }
    })))
}

//创建一个新节点带帧动画
//atlas资源所在的图集
//preSufix资源的前缀
//nNum帧动画张数
//speed播放速度
//bLoop是否循环
//endCall播完结束的回调
//strConn前缀和数字之间的连接字符可空
//beginDif:开始图片的起始下标，默认1开始
//return: 返回的节点需要自己删除
gt.createrSpriteAni = function(atlas, preSufix, nNum, speed, bLoop, endCall, strConn, beginDif) {
    var self = this
    //创建一个空节点
    var newNode = new cc.Node('node_eff');
    var sp = newNode.addComponent(cc.Sprite);
    self.addSpriteAni(newNode,atlas,preSufix,nNum,speed,bLoop,endCall,strConn,beginDif);
    
    return newNode;
}

//给节点添加帧动画组件
gt.addSpriteAni = function(newNode, atlas, preSufix, nNum, speed, bLoop, endCall, strConn, beginDif) {
    var self = this;
    if(!beginDif) beginDif = 1;
    // 是否需要补零
    var getZeroize = function(num,isZeroize) {
        if(isZeroize) {
            let str = num<10?("0"+num):num;
            return str;
        }
        else{
            return num;
        }
    }

    var lists = [];
    for(var i = 0;i < nNum; i++){
        var key = preSufix + getZeroize(i+beginDif,true);
        if(strConn){
            key = preSufix + strConn + getZeroize(i+beginDif,true);
        }
        
        if(atlas._spriteFrames[key]){
            lists.push(atlas._spriteFrames[key]);
        }
    }
    
    var ani = newNode.addComponent(cc.Animation);
    var clip = cc.AnimationClip.createWithSpriteFrames(lists,30);
    if(bLoop){
        clip.wrapMode = cc.WrapMode.Loop;
    }
    
    clip.speed = speed;
    ani.addClip(clip,preSufix);
    var finishCall = function(){
        if(endCall){
           endCall();
        }
    }
    ani.on('finished',finishCall);
    ani.play(preSufix);
}

//空对象判断
gt.isEmptyObject = function(obj) {   
    for (var key in obj){
    　　return false;
    }　　
    return true;
}

// 按钮点击事件
//callback:允许该参数传入的时候已绑定上下文 
gt.addClickEvent = function(btn, callback, context, noSound) {
    if(btn == null) {
        return null;
    }

    btn.on("click", function(){
        if (!noSound) {
            //todo 
        }
        callback && callback.call(context);
    }, context);
}

// Loading框 
let LoadingTips = require('LoadingTips');
gt.showLoadingTips = LoadingTips.showLoadingTips;
gt.removeLoadingTips = LoadingTips.removeLoadingTips;

//事件管理
let EventMgr = require('EventMgr');
gt.addEventHandler       = EventMgr.addEventHandler;
gt.removeEventHandler    = EventMgr.removeEventHandler;
gt.removeAllEventHandler = EventMgr.removeAllEventHandler;
gt.dispatchEvent         = EventMgr.dispatchEvent;



}; //init
