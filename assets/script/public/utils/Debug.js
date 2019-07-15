
module.exports.init = function(gt){ 
	gt.dump = function(value, description) { 
		if (!gt.debug) return;

        var _dump = function(value, indent) {
            let _type = typeof value; 
            let tmpStr = '';

            if (Array.isArray(value)) { 
                tmpStr += '\n';
                tmpStr = tmpStr + indent + '[\n';

                let indent2 = indent + ' . . ';
                for (let key in value) {
                    let lineStr = indent2 + key + ' = ' + _dump(value[key], indent2) + '\n';
                    tmpStr += lineStr; 
                } 
                tmpStr = tmpStr + indent + ']';
            }
            else if (_type == 'object') {
                tmpStr += '\n';
                tmpStr = tmpStr + indent +'{\n';
                let indent2 = indent + ' . . ';
                for (let key in value) { 
                    tmpStr = tmpStr + indent2 + key + ' = ' + _dump(value[key], indent2) + '\n';
                } 
                tmpStr = tmpStr + indent + '}'; 
            } 
            else if (_type == 'string') { 
                tmpStr = tmpStr + '"' + value + '"'; 
            } 
            else if (_type == 'number') { 
                tmpStr += value;
            } 
            else if (_type == 'function') { 
                tmpStr += '*function'; 
            } 

            return tmpStr;
        };

        let str = (description || 'var') + ' = ' + _dump(value, "");
        cc.log(str);
    };
} 
