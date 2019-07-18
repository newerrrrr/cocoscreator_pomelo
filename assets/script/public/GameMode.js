
//全局游戏数据处理

var M = {};

var playerNickHead = {}; //缓存玩家头像
var servTimeDelta  = 0; //与服务器时间偏差(毫秒)
var enterBackTime  = 0;

M.init = function() { 
    M.registerMsg();
}

M.registerMsg = function() { 
    //消息 
    gt.tcp.registerMsg(gt.WALLET_INFO, M, M.onRcvWalletInfo); //钱包信息
    gt.tcp.registerMsg(gt.REPLAY_BY_SHARE_CODE, M, M.onRcvReplayByShareCode); //回放
    gt.tcp.registerMsg(gt.SYSTEM_NOTICE, M, M.onRcvSysNotice); //系统消息
    gt.tcp.registerMsg(gt.SYNC_TIME, M, M.onRcvSyncTime); //时间同步

    //事件
    cc.game.on(cc.game.EVENT_HIDE, M.onEnterBackground, M); //进入后台
    cc.game.on(cc.game.EVENT_SHOW, M.onEnterForeground, M); //进入前台
} 

M.unregisterMsg = function() { 
    gt.tcp.unregisterAllMsg(M); 

    cc.game.off(cc.game.EVENT_HIDE, M.onEnterBackground, M); 
    cc.game.off(cc.game.EVENT_SHOW, M.onEnterForeground, M); 
} 

//缓存玩家头像和昵称
M.savePlayerNickHead = function(uid, nickName, headurl) {
    playerNickHead[uid] = {nick:nickName, icon:headurl};
}

M.getPlayerNickHead = function(uid) {
    return playerNickHead[uid];
} 

//钱包数据更新 
M.onRcvWalletInfo = function(msgTbl) {
    if (msgTbl.code && msgTbl.code < 0 ) {
        require('Toast').show(msgTbl.error || '');
        return;
    } 
    gt.playerData.wallet = msgTbl;
    gt.dispatchEvent(gt.EventType.WALLET_CHANGE);
} 

//根据分享码来回放 
M.reqReplayByShareCode = function(code) {
    gt.tcp.sendMessage(gt.REPLAY_BY_SHARE_CODE, {share_code:code}) 
    gt.showLoadingTips('请稍后。。。', 10); 
} 

M.onRcvReplayByShareCode = function(msgTbl) {
    cc.log('=== onRcvReplayByShareCode')
    gt.removeLoadingTips() 
} 

//检查回访码 
M.checkReplayShareCode = function() {
    let shareCode = extension.getURLShareCode();
    if (shareCode && shareCode != "") { 
        cc.log("---get replay code : ", shareCode); 
        this.reqReplayByShareCode(shareCode); 
        return true;
    } 
    return false;
} 

//获取房间号
M.checkRoomCodeFromUrl = function() {
    let roomId = tonumber(extension.getURLRoomID()); 
    if (roomId && roomId > 0) { 
        gt.tcp.sendMessage(gt.JOIN_ROOM, {room_id:roomId}); 
        gt.showLoadingTips(gt.tr("please_wait"), 10);
        return true;
    } 
    return false;
}   

//相同账号登录提示
M.onRcvDuplicateLogin = function(msgTbl) {
    cc.log("=== onRcvDuplicateLogin") 

    gt.tcp.disconnect() 
    require('NoticeTips').show("您的账号已在其他地方登录", function(){ 
        cc.director.loadScene('LoadingScene');       
    }, null, true);
} 

//获取维护信息
// M.getRepairsNoticeInfo = function() {
//     let url = gt.noticeUrl
//     local xhr = cc.XMLHttpRequest:new()
//     xhr.timeout = 3000
//     xhr.responseType = cc.XMLHTTPREQUEST_RESPONSE_JSON
//     xhr:open("GET", url)
//     local function onGetNotice()
//         if xhr.readyState == 4 and (xhr.status >= 200 and xhr.status < 207) then
//             local retData = xhr.response 
//             local start, End = string.find(retData, "{", 1, true)
//             if nil == start then return end 
//             local subData = string.sub(retData, start, -1)
//             gt.dump(json.decode(tostring(subData)))
//             local result = json.decode(tostring(subData))
//             local str = result.content[1].." \n\n    "..result.content[2] 
//             if result.is_open == 1 and gt.needNotice then
//                 require("app.views.msgbox.RepairTips"):create(str, function() 
//                   gt.needNotice = false
//                 end, nil, true) 
//             end
//         elseif xhr.readyState == 1 and xhr.status == 0 then
//             -- 网络问题,异常断开
//             print("获取维护信息--网络异常断开")
//         else 
//             print("获取维护信息--数据异常")
//         end
//         xhr:unregisterScriptHandler()
//     end
//     xhr:registerScriptHandler(onGetNotice) 
//     xhr:send()
// } 

//返回大厅
M.backMainScene = function() {

}

M.onTcpLoginSuccess = function() { 
    cc.log("@@@@ ---onTcpLoginSuccess")   
} 

//收到系统(公告)消息
M.onRcvSysNotice = function() {

}

//时间同步
M.reqSyncTime = function() {
    gt.tcp.sendMessage(gt.SYNC_TIME, {}) 
} 

M.onRcvSyncTime = function(msgTbl) {
    cc.log("=== onRcvSyncTime") 
    if (msgTbl.code && msgTbl.code < 0) return;
    servTimeDelta = msgTbl.utc_time - new Date(); //毫秒 
}  

M.getServerTime = function() {
    let time = new Date() + servTimeDelta;
    return time; 
}  

//进入后台
M.onEnterBackground = function() {
    cc.log("@@@@@@@@@@@ === onEnterBackground");
    enterBackTime = new Date();
    gt.audio.pauseAll();
} 

//回到前台
M.onEnterForeground = function() { 
    let enterForeTime = new Date();

    if (enterBackTime == 0) { 
        enterBackTime = enterForeTime;
    }  
    
    // gt.tcp.sendHeartbeat() 

    //IOS进入后台后网络立即断开, 因此回到前台需要同步数据.
    let elapse = enterForeTime - enterBackTime; 
    if (elapse > 15000) {  
        cc.log("@@@@@@@@@@ === onEnterForeground, reconnect...");
        gt.tcp.reconnect();
    }
    else if (elapse > 3000) {
        cc.log("@@@@@@@@@@@ === onEnterForeground ");
        gt.showLoadingTips('请稍后。。。', 3000); 
        // M:sendEchoTest() --测试网络是否通畅
        gt.dispatchEvent(gt.EventType.SCENE_RESET);
    } 
    gt.audio.resumeAll(); 

    // gt.dispatchEvent(gt.EventType.CHECK_URL_CLICK) //查询点击链接查看回放或者进入房间
} 

// M.init();

module.exports = M;
