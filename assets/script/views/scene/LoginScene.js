// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var volume = 0;

cc.Class({
    extends: cc.Component,

    properties: {
        btnWX:cc.Button,
        btnTel:cc.Button,
        btnGuest:cc.Button,
        editbox:cc.EditBox,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //过渡效果
        this.node.opacity = 0;
        this.node.runAction(cc.fadeIn(0.7));

        // require('InitGame');
        gt.autoAdaptDevices(); 

        // cc.loader.loadRes('prefab/NoticeTips', function(err, prefab) {

        //    var newNode = cc.instantiate(prefab);
        //     cc.director.getScene().addChild(newNode);            
        // }); 

        // var testFunc = function(arg1, arg2) {
        //     cc.log('------arg1, arg2', arg1, arg2) 
        // }
        // gt.addEventHandler('HLBTEST', this, testFunc.bind(this)) 
        // gt.addEventHandler('HLBTEST2', this, testFunc.bind(this))   
    },

    start () { 
        cc.log('----------LoginScene start')
        // require('NoticeTips').show("dfdfdfd", 
        //     null, null, true, {
        //     imgOkPath:"texture/common/btn_blue",
        //     strOk:'dfdf'
        // }); 
        
        // gt.removeAllEventHandler(this)
        // gt.showLoadingTips("dfdfdfd", 5000, 3000);  
        // gt.dispatchEvent('HLBTEST', 111, 222) 
        // gt.dispatchEvent('HLBTEST2', 111, 222) 

        // gt.audio.playMusic('common/bgm', true)         
    },


    // update (dt) {},

    onBtnLoginWX:function(){
        cc.log("===== onBtnLoginWX");
        gt.audio.playEffect("common/btn_click", false);

    },

    onBtnLoginTel:function(){
        cc.log("===== onBtnLoginTel");
        gt.tcp.connect({
            host : gt.gateServer.ip,
            port : gt.gateServer.port,
        }, function(result) {
            cc.log('---------connect result:', result);
        });

    },

    onBtnLoginGuest:function(){ 
        pomelo.init({
            host : gt.gateServer.ip,
            port : gt.gateServer.port,
        }, function (code) {
            if (code == 'timeout') {
                cc.log('-------connect timeout !')
                pomelo.disconnect(function() {
                    cc.log("============ disconnect success")
                })
                return;
            }
            var route = 'gate.gateHandler.queryEntry';
            pomelo.request(route, {
                username:"huanglibo",
                uid:1234,
            }, function (data) {

                console.log("data======================", data.host, data.port);
                if ('undefined' != data || null != data) {
                    pomelo.disconnect(function () {
                        pomelo.init({
                            host : data.host,
                            port : data.port,
                            reconnect : true
                        }, function () {                            
                            var route = 'login.loginHandler.login';
                            pomelo.request(route, {}, function(para) {
                                console.log("para======================", para.msg);
                            });
                        });
                    });                    
                }
            })  
        });
    },


});
