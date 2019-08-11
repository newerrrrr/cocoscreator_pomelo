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
        this.node.runAction(cc.fadeIn(0.5));

        gt.autoAdaptDevices(); 
        this.addComponent('KeyBackExit'); //按返回键退出游戏
    },

    start () { 
        cc.log('=== LoginScene')
        //检查正式版是否自动微信登陆
        this.autoLogin = this.checkAutoLogin();
  

    },


    // update (dt) {},

    onBtnLoginWX:function(){
        cc.log("===== onBtnLoginWX");
  
        //提示安装微信客户端
        if (!gt.wxMgr.isWXAppInstalled()) {
            gt.ui.toast.show('您还没有安装微信哦！');
            return 
        }

        //3.获取微信个人昵称, 性别, 头像url等内容
        var getWeixinUserInfo = function(accessToken, refreshToken, openid) {
            let url = 'https://api.weixin.qq.com/sns/userinfo?access_token='+accessToken+'&openid='+openid;
            gt.http.getData(url, function(result, resp) {
                if (!result) return;
                cc.log('---------------user info resp: ', resp) 
                resp = JSON.parse(resp);
                if (resp.errcode) {
                    gt.ui.noticeTips.show('您的微信授权信息已失效, 请重新登录！', null, null, true); 
                    return 
                } 

                //4.开始登陆
                this.startLogin('weixin', resp.openid, resp.nickname, resp.headimgurl, resp.sex, accessToken, refreshToken);
            }.bind(this));            
        }

        //2.获取 token 
        var getWeixinToken = function(authCode) {
            let url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+gt.wxAppId+'&secret='+gt.wxSecret+'&code='+authCode+'&grant_type=authorization_code';
            gt.http.getData(url, function(result, resp) {
                if (!result) return;
                cc.log('---------------token resp: ', resp) 
                resp = JSON.parse(resp);
                if (resp.errcode) {//申请失败 
                    return 
                } 
                getWeixinUserInfo(resp.access_token, resp.refresh_token, resp.openid);
            }.bind(this));
        }

        //1.先获取授权 
        gt.wxMgr.getWeixinAuth(function(respJson) {
          cc.log('weixin auth resp: ', respJson);
            gt.removeLoadingTips();

            if (typeof(respJson) == 'string' && respJson !== '') {
                respJson = JSON.parse(respJson);
            }

            if (respJson.status === 'SUCCESS') {
                getWeixinToken(respJson.code) 
            }
            else if (respJson.status === 'CANCEL') { //用户取消授权
                cc.log("---- weixin auth cancel")
            }
            else {
                cc.log("---- weixin auth fail") 
                gt.ui.noticeTips.show('微信授权失败', null, null, true);  
            } 
        }.bind(this));
    },

    onBtnLoginTel:function(){
        cc.log("===== onBtnLoginTel");

        var tbl = {msg:'aa', code:'ttt'}
        console.table(tbl)
        
    },

    onBtnLoginGuest:function(){ 
        gt.tcp.connect({
            host : gt.gateServer.ip,
            port : gt.gateServer.port,
        }, 
        function(result) { 
            cc.log('---------connect result:', result);
        });

        this.startLogin('guest', )
    },

    checkAutoLogin:function() { 
        //获取存档 上次获取到的 token 时间 
        let accessTokenTime = gt.getLocal('WX_Access_Token_Time', ''); 
        let refreshTokenTime = gt.getLocal('WX_Refresh_Token_Time', ''); 
        if (accessTokenTime === '' || refreshTokenTime === '') { //未记录表示第一次登陆 
            return false; 
        } 

        //检测是否超时
        let accessTokenReconnectTime  = 5400    //3600*1.5   微信accesstoken默认有效时间为2小时,这里取1.5小时内登录不需要重新取 accesstoken
        let refreshTokenReconnectTime = 2160000 //3600*24*25 微信refreshtoken默认有效时间为30天,这里取25天内登录不需要重新取 refreshtoken
        
        
    }, 

    /* loginType: 登陆方式: weixin, guest, tel 
     * icon：头像url 
     * sex：性别 1：男 2：女 
     * accessToken, refreshToken：微信相关token 
     */
    startLogin:function(loginType, openId, nick, icon, sex, accessToken, refreshToken) {
        cc.log('=== startLogin: ', loginType, openId, nick, icon, sex, accessToken, refreshToken); 
    },

    onRcvLogin:function(msgTbl) { 
        cc.log('=== onRcvLogin:');
    },
});
