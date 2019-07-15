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
        _loadTimerId:null,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //过渡效果
        // this.node.opacity = 0;
        // this.node.runAction(cc.fadeIn(0.5)); 
    },

    start () {
        require('InitGame');
        
        //加载资源 
        var count = 0;

        count += 1;
        cc.loader.loadResDir('texture/common', function(){
            count -= 1;
            if (count <= 0) this.showLogin();
        }.bind(this));

        count += 1;
        cc.loader.loadRes('prefab/NoticeTips', function(err, prefab) {
            count -= 1;
            if (count <= 0) this.showLogin();
        }.bind(this));

        //超时则暂定加载并进入登录界面
        // this._loadTimerId = setTimeout(this.showLogin.bind(this), 6000);
    },

    // update (dt) {},

    showLogin:function(){ 
        // if (this._loadTimerId) {
        //     clearTimeout(this._loadTimerId);
        //     this._loadTimerId = null;
        // }
        this.node.runAction(cc.sequence(cc.delayTime(0.5), cc.fadeOut(0.5), cc.callFunc(function(){
            cc.director.loadScene('LoginScene'); 
        })));  
    }
});
