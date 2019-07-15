
//上浮文字
//使用举例: require('views/msgbox/Toast').show('ddddddddddddddddd', cc.v2(100, 0)) 

var Toast = {
	show: function(tipsText, posOffset) {
        var self = this;
        posOffset = posOffset || cc.v2(0, 0);

        cc.loader.loadRes('prefab/Toast', function(err, prefab) {
            if (err) return;

            let pos = cc.v2(gt.center.x, gt.center.y - 60).add(posOffset);
            var node = cc.instantiate(prefab);
            node.getComponent(cc.Label).string = tipsText;
            node.position = pos; 
            cc.director.getScene().addChild(node); 

            let moveto = cc.moveTo(1, cc.v2(pos.x, pos.y + 100))
            let seq = cc.sequence(moveto, cc.delayTime(0.4), cc.fadeOut(0.5), cc.removeSelf());
            node.runAction(seq);
        });
	} 
} 

module.exports = Toast; 
