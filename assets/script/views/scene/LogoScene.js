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



    start () {

        // pomelo.init({
        //     host : "192.168.159.128",
        //     port : 3014,
        // }, function () {
        //     var route = 'gate.gateHandler.queryEntry';
        //     pomelo.request(route, {
        //         username:"huanglibo",
        //         rid:1234,
        //     }, function (data) {
        //         console.log("data======================");
        //         // pomelo.disconnect(function () {
        //         //     pomelo.init({
        //         //         host : host2,
        //         //         host : host2,
        //         //         port : port2,
        //         //         reconnect : true
        //         //     }, function () {
        //         //     })
        //         // });
        //     })
            
        // });

    },

    onLoad () { 
        //进入自动更新界面
        
        this.node.runAction(cc.sequence(cc.delayTime(0.5), cc.fadeOut(0.8), cc.callFunc(function(){
            cc.director.loadScene('LoadingScene'); 
        })));
    }, 

    // update (dt) {},
});
