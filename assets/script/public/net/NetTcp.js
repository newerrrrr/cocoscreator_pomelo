
var NetTcp = {};
//网络管理器. 基于 pomelo 封装的 websocket 
//网络状态
var NetState = {
    Connecting:1,
    Connected:2, 
    Disconnect:3
};

var connectTimeout   = 8000; //by hlb 
var connectTimeoutId = null;
var connectCallback  = null;
var handlers         = {}; //消息处理
var connectParams    = {}; //连接参数

var state = NetState.Disconnect;


NetTcp.registerMsg = function(msgId, target, callback){
    if (msgId == null || msgId == 'undefined') {
        cc.log(' invalid msgId ');
    };

    handlers[msgId] = handlers[msgId] || [];
    let items = handlers[msgId];
    //如果已注册则返回 
    for (let i = 0, len = items.length; i < len; i++) { 
        if (items[i].obj == target && items[i].func == callback) { 
            return;
        }
    }
    items.push({obj:target, func:callback}); 
};

NetTcp.unregisterMsg = function(msgId, target){ 
    let items = handlers[msgId];

    if (items == 'undefined') return;
    for (let i = 0, len = items.length; i < len; i++) { 
        if (items[i].obj == target) { 
            items.splice(i, 1);
            break;
        } 
    } 
};

//清楚该对象所有关联信息
NetTcp.unregisterAllMsg = function(target) {
    for (let key in handlers) { 
        let items = handlers[key];
        for (let i = items.length-1; i >= 0; i--){
            if (items[i].obj == target) {
                items.splice(i, 1);
            }
        }
    }
};

//params = {host:host, port:port, reconnect:true/false, ...};
NetTcp.connect = function(params, callback){ 
    if (state == NetState.Connecting || state == NetState.Connected) {
        cc.log('do nothing, now connect state =:', state)
        return;
    }  
    state = NetState.Connecting;

    connectParams = params;
    connectCallback = callback;
    //开始连接 
    NetTcp.disconnect(function(){            
        pomelo.init(connectParams, function() { 
            //连接成功
            // NetTcp.stopConnectTimer();
            state = NetState.Connected;
            connectCallback && connectCallback(true); 
        });
    });
    //开启连接超时定时器
    // NetTcp.startConnectTimer(connectCallback);
};

NetTcp.disconnect = function(cb){
    state = NetState.Disconnect;
    // NetTcp.stopConnectTimer();
    pomelo.disconnect(function(){             
        cb && cb();
    });
};

NetTcp.reconnect = function() { 
    connectParams.reconnect = true; 
    NetTcp.connect(connectParams); 
};

NetTcp.sendMessage = function(data) {

};

// NetTcp.startConnectTimer = function(cb) { 
//     NetTcp.stopConnectTimer() 
//     connectTimeoutId = setTimeout(function(){ 
//         cc.log('xxxxxx disconnect ...');
//         NetTcp.disconnect();
//         cb && cb(false);
//     }, connectTimeout);
// };

// NetTcp.stopConnectTimer = function() { 
//     if(connectTimeoutId) { 
//         clearTimeout(connectTimeoutId);
//         connectTimeoutId = null;
//     } 
// };

var onKick = function(data) { 
    cc.log('---NetTcp:onKick');
};

var onClose = function(event) { 
    cc.log('---NetTcp:onClose, state = ', state); 
    if (state == NetState.Connecting) { 

    } 
    state = NetState.Disconnect; 
};

var onDisconnect = function(event) { 
    cc.log('---NetTcp:onDisconnect');
};

var onReconnect = function() {
    cc.log('---NetTcp:onReconnect');
};

pomelo.on('onKick', onKick);
pomelo.on('close', onClose);
pomelo.on('disconnect', onDisconnect);
pomelo.on('reconnect', onReconnect);



module.exports = NetTcp;
