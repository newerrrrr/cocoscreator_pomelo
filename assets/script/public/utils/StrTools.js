
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


module.exports = StrTools;
