
//按钮退出游戏弹框 
cc.Class({
    extends: cc.Component,

    onLoad() { 
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    onKeyDown:function(event) {
        switch(event.keyCode) {
            case cc.macro.KEY.back:
                gt.ui.noticeTips.show('是否退出游戏', function() {
                    cc.game.end();
                }, null);
                break;
        } 
    },

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    } 
});
