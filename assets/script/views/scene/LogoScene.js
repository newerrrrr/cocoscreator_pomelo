// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () { 
        // var tt = GameTools.getInstance() 
        // cc.log('--------------tt:', tt)
    }, 

    onDestroy() {
    },

    start () { 
        //进入自动更新界面
        this.node.runAction(cc.sequence(cc.delayTime(0.3), cc.fadeOut(0.5), cc.callFunc(function(){ 
            //如果未开启热更或者热更后重启则直接进入游戏 
            if (!jsb || !gt.open_hotupdate || cc.sys.localStorage.getItem('RestartAfterHotUpdate') == 'true') {
                cc.log('[LogoScene] :  skip hotUpdate ------->')
                cc.sys.localStorage.setItem('RestartAfterHotUpdate', 'false'); 
                cc.director.loadScene('LoadingScene');
            }
            else {
                cc.director.loadScene('HotUpdate'); 
            } 
        })));
    }

    // update (dt) {},
});
