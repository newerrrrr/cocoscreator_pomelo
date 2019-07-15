
var EventMgr = {};

var callbacks = {};

EventMgr.addEventHandler = function(event, target, handler) {
    callbacks = callbacks || {};
    callbacks[event] = callbacks[event] || [];

    let tbl = callbacks[event];
    for (let i = 0, len = tbl.length; i < len; i++) {
        if (tbl[i].obj == target && tbl[i].func == handler) { 
            return 
        } 
    } 

    tbl.push({obj:target, func:handler});
} 

EventMgr.removeEventHandler = function(event, target) {
    callbacks = callbacks || {};
    callbacks[event] = callbacks[event] || []; 
    
    let tbl = callbacks[event];
    for (let i = 0, len = tbl.length; i < len; i++) {
        if (tbl[i].obj == target) { 
            tbl.splice(i, 1);
            return 
        } 
    } 
} 

EventMgr.removeAllEventHandler = function(target) {
    callbacks = callbacks || {}; 
    
    for (var event in callbacks) {
        let tbl = callbacks[event];

        let i = tbl.length;
        while(i--){ //递归删除
            if (tbl[i].obj == target) { 
                tbl.splice(i, 1);
            } 
        } 
    } 
} 

//支持可变长度参数,但是至少带一个参数 event  
EventMgr.dispatchEvent = function(event, arg1, arg2) { 
    callbacks = callbacks || {}; 
    let tbl = callbacks[event];
    if (!tbl) return;

    for (let i = 0, len = tbl.length; i < len; i++) { 
        if (tbl[i].func) { 
            tbl[i].func.call(this, arg1, arg2) 
        } 
    } 
} 

module.exports = EventMgr; 
