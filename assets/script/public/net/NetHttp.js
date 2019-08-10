
var NetHttp = {};

//data: 字符串、json对象、二进制数据;  
//isBinary：data 是否为二进制数据
NetHttp.postData = function(url, data, callback, isBinary) { 
    let xhr = cc.loader.getXMLHttpRequest();
    xhr.onreadystatechange = function () {
        // cc.log('xhr.readyState=' + xhr.readyState + '  xhr.status=' + xhr.status);
        if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
            try { 
                let respone = xhr.responseText;
                if (!isBinary) {
                    respone = JSON.parse(respone);
                }
                callback && callback(true, respone);
            } 
            catch (e) { 
                cc.log("HTTP Error: " + e);
                callback && callback(false);
            } 
        } 
        else {
            cc.log('http error: readyState=' + xhr.readyState + ',  xhr.status=' + xhr.status);
        } 
    };

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST');
    xhr.setRequestHeader('Access-Control-Allow-Headers', 'x-requested-with,content-type');
    if (isBinary) {
        xhr.setRequestHeader('Content-Type', 'application/octet-stream');
    }
    else {
        xhr.setRequestHeader('Content-Type', 'application/json');
    }

    // note: In Internet Explorer, the timeout property may be set only after calling the open()
    // method and before calling the send() method.
    xhr.timeout = 8000;// 8 seconds for timeout

    if (NetHttp.isJson(data)) {
        data = JSON.stringify(data)
    }
    xhr.send(data);
} 

NetHttp.getData = function(url, callback) {
    let xhr = cc.loader.getXMLHttpRequest();
    
    xhr.onreadystatechange = function () {
        // cc.log("Get: readyState:" + xhr.readyState + " status:" + xhr.status);
        if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
            let respone = xhr.responseText;
            callback && callback(true, respone);
        } 
        else if (xhr.readyState === 4 && xhr.status == 401) {
            callback(false, {status:401});
        } 
    };
    xhr.withCredentials = true;
    xhr.open('GET', url, true);
    
    // note: In Internet Explorer, the timeout property may be set only after calling the open()
    // method and before calling the send() method.
    xhr.timeout = 8000;// 8 seconds for timeout

    xhr.send();
}

//判断obj是否为json对象
NetHttp.isJson = function(obj) {
    var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length; 
    return isjson;
}


module.exports = NetHttp;
