
var StrTools = {};


//maxChnCount:允许的中文个数上限.
//ext: 如果超过则添加扩展子串, 默认为 "..."
StrTools.getShortString = function(str, maxChnCount, ext) { 
    if (str.length > maxChnCount) {
    	ext = ext || '...';
    	return str.substr(0, maxChnCount) + ext;
    }
    return str;
};

StrTools.stringToByte = function(str) {  
    var bytes = new Array();  
    
    for(let i = 0, len = str.length; i < len; i++) {  
        let c = str.charCodeAt(i);  
        if(c >= 0x010000 && c <= 0x10FFFF) {  
            bytes.push(((c >> 18) & 0x07) | 0xF0);  
            bytes.push(((c >> 12) & 0x3F) | 0x80);  
            bytes.push(((c >> 6) & 0x3F) | 0x80);  
            bytes.push((c & 0x3F) | 0x80);  
        } 
        else if(c >= 0x000800 && c <= 0x00FFFF) {  
            bytes.push(((c >> 12) & 0x0F) | 0xE0);  
            bytes.push(((c >> 6) & 0x3F) | 0x80);  
            bytes.push((c & 0x3F) | 0x80);  
        } 
        else if(c >= 0x000080 && c <= 0x0007FF) {  
            bytes.push(((c >> 6) & 0x1F) | 0xC0);  
            bytes.push((c & 0x3F) | 0x80);  
        } 
        else {  
            bytes.push(c & 0xFF);  
        }  
    }  
    return bytes; 
};

//字节序列转ASCII码
//[0x24, 0x26, 0x28, 0x2A] ==> "$&C*"
StrTools.byteToString = function(arr) {  
    if(typeof arr === 'string') {  
        return arr;  
    } 

    var str = '', _arr = arr;  
    for(var i = 0; i < _arr.length; i++) {  
        var one = _arr[i].toString(2), v = one.match(/^1+?(?=0)/);  
        if(v && one.length == 8) {  
            var bytesLength = v[0].length;  
            var store = _arr[i].toString(2).slice(7 - bytesLength);  
            for(var st = 1; st < bytesLength; st++) {  
                store += _arr[st + i].toString(2).slice(2);  
            }  
            str += String.fromCharCode(parseInt(store, 2));  
            i += bytesLength - 1;  
        } 
        else {  
            str += String.fromCharCode(_arr[i]);  
        }  
    } 
    return str;  
} 


module.exports = StrTools;
