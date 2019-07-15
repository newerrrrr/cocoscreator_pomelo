
//方法一:使用普通脚本加载

// 使用例子: require('views/msgbox/NoticeTips').show("提示内容", null, null, true, {
//             imgOkPath:"texture/common/btn_blue",
//             strOk:'dfdf'
//         }); 


var NoticeTips = { 

    //btnPara: 更换按钮图片和文字 {isPlist:true/false, imgOkPath:'', imgCancelPath:'', strOk:'', strCancel:''}  
    show:function(tips, okFunc, cancelFunc, isSingleBtn, btnPara) {
        var self = this;

        cc.loader.loadRes('prefab/NoticeTips', function(err, prefab) {
            if (err) return;

            var node = cc.instantiate(prefab);
            node.name = 'NoticeTips';
            node.position = gt.center;
            cc.director.getScene().addChild(node);

            //初始化
            var imgBg     = node.getChildByName("Img_bg"); 
            var nodeTop   = imgBg.getChildByName("node_top");
            var nodeBot   = imgBg.getChildByName("node_bot"); 
            var btnOk     = nodeBot.getChildByName("Btn_ok"); 
            var btnCancel = nodeBot.getChildByName("Btn_cancel"); 
            gt.addClickEvent(btnOk, function(){ 
                node.destroy();
                okFunc && okFunc();
            }, self); 

            gt.addClickEvent(btnCancel, function(){
                node.destroy();
                cancelFunc && cancelFunc();
            }, self); 

            //如果单个按钮则隐藏取消按钮
            if (isSingleBtn) { 
                btnCancel.active = false;
                btnOk.x = 0;
            };

            //更换按钮图片、文字
            if (btnPara) {                
                if (btnPara.imgOkPath){
                    btnOk.active = false; //由于加载是异步,会导致按钮图片闪现. 所以等加载完再显示.
                    let sp = btnOk.getComponent(cc.Sprite);
                    cc.loader.loadRes(btnPara.imgOkPath, cc.SpriteFrame, function(err, spriteFrame) {
                        sp.spriteFrame = spriteFrame;
                        btnOk.active = true; 
                    });
                };
                if (btnPara.imgCancelPath){
                    btnCancel.active = false;
                    let sp = btnCancel.getComponent(cc.Sprite);
                    cc.loader.loadRes(btnPara.imgCancelPath, cc.SpriteFrame, function(err, spriteFrame) {
                        sp.spriteFrame = spriteFrame;
                        btnCancel.active = true; 
                    });
                };
                if (btnPara.strOk) {
                    btnOk.getChildByName('Label').getComponent(cc.Label).string = btnPara.strOk;
                };
                if (btnPara.strCancel) {
                    btnCancel.getChildByName('Label').getComponent(cc.Label).string = btnPara.strCancel;
                };                
            };

            //自适应高度 
            var lbDesc = imgBg.getChildByName("Label_Tips").getComponent(cc.Label); 
            lbDesc.string = tips;
            lbDesc.node.width = imgBg.width - 80;
            lbDesc.overflow = cc.Label.Overflow.RESIZE_HEIGHT; //自动换行
            lbDesc.scheduleOnce(function(){ //需要等下一帧才更新
                let deltaH = lbDesc.node.height - 200;
                if (deltaH > 0) {
                    imgBg.height += deltaH;
                    nodeTop.y = imgBg.height * 0.5;
                    nodeBot.y = -imgBg.height * 0.5;
                }
            }, 0);            
        }); 
    }, 

    //如果弹框已创建, 则必须在下一帧才允许调用 isExist() 判断.
    isExist:function() {
        if (cc.director.getScene().getChildByName('NoticeTips')) {
            return true;
        }
        return false;
    } 
};

module.exports = NoticeTips;


//--------------------------------------------------------------------------------//

//方法二:使用组件脚本
//使用举例:
// cc.loader.loadRes('prefab/NoticeTips', function(err, prefab) {
//     var newNode = cc.instantiate(prefab);
//     newNode.position = gt.center;
//     cc.director.getScene().addChild(newNode);

//     newNode.getComponent('NoticeTips').show('描述文字', function(){
//         cc.log('---------ok func')
//     }, null, true, {
//         imgOkPath:"texture/common/btn_blue",
//         strOk:'dfdssssf'
//     }); 


// });


// cc.Class({
//     extends: cc.Component,

//     properties: { 
//         nodeRoot:cc.Node,
//         imgBg:cc.Sprite,
//         lbTip:cc.Label,
//         btnOk:cc.Button,
//         btnCancel:cc.Button,
//         nodeTop:cc.Node,
//         nodeBot:cc.Node,

//         _okFunc:null,
//         _cancelFunc:null,
//     }, 


//     // LIFE-CYCLE CALLBACKS:

//     onLoad () { 
//     },

//     start () {
//     },

//     show:function(tips, okFunc, cancelFunc, isSingleBtn, btnPara) { 
//         this._okFunc = okFunc;
//         this._cancelFunc = cancelFunc;
       
//         gt.addClickEvent(this.btnOk.node, this.onBtnOk, this); 
//         gt.addClickEvent(this.btnCancel.node, this.onBtnCancel.bind(this));  

//         //如果单个按钮则隐藏取消按钮
//         if (isSingleBtn) { 
//             this.btnCancel.node.active = false;
//             this.btnOk.node.x = 0;
//         };  

//         //更换按钮图片、文字
//         if (btnPara) { 
//             if (btnPara.imgOkPath){
//                 let sp = this.btnOk.getComponent(cc.Sprite);
//                 cc.loader.loadRes(btnPara.imgOkPath, cc.SpriteFrame, function(err, spriteFrame) {
//                     sp.spriteFrame = spriteFrame;
//                 });
//             };
//             if (btnPara.imgCancelPath){
//                 let sp = this.btnCancel.getComponent(cc.Sprite);
//                 cc.loader.loadRes(btnPara.imgCancelPath, cc.SpriteFrame, function(err, spriteFrame) {
//                     sp.spriteFrame = spriteFrame;
//                 });
//             };
//             if (btnPara.strOk) {
//                 let label = this.btnOk.node.getChildByName('Label').getComponent(cc.Label) 
//                 label.string = btnPara.strOk;
//             };
//             if (btnPara.strCancel) {
//                 let label = this.btnCancel.node.getChildByName('Label').getComponent(cc.Label) 
//                 label.string = btnPara.strCancel; 
//             };
//         };

//         //自适应高度 
//         this.lbTip.string = tips;
//         this.lbTip.node.width = this.imgBg.node.width - 80;
//         this.lbTip.overflow = cc.Label.Overflow.RESIZE_HEIGHT; //自动换行
//         this.lbTip.scheduleOnce(function(){ //需要等下一帧才更新
//             let deltaH = this.lbTip.node.height - 200;
//             if (deltaH > 0) {
//                 this.imgBg.node.height += deltaH;
//                 this.nodeTop.y = this.imgBg.node.height * 0.5;
//                 this.nodeBot.y = -this.imgBg.node.height * 0.5;
//             }
//         }.bind(this), 0); 
//     },

//     // update (dt) {},

//     onBtnOk:function() { 
//         this.nodeRoot.destroy();
//         this._okFunc && this._okFunc();
//     }, 

//     onBtnCancel:function() { 
//         this.nodeRoot.destroy();
//         this._cancelFunc && this._cancelFunc();
//     } 
// });

