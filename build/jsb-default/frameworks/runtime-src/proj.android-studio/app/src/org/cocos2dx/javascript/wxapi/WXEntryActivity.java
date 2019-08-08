package org.cocos2dx.javascript.wxapi;

import android.app.Activity;
import android.os.Bundle;

import com.tencent.mm.opensdk.modelbase.BaseReq;
import com.tencent.mm.opensdk.modelbase.BaseResp;
import com.tencent.mm.opensdk.modelmsg.SendAuth;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.IWXAPIEventHandler;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

import android.util.Log;

import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

import static org.cocos2dx.lib.Cocos2dxHelper.runOnGLThread;

public class WXEntryActivity extends Activity implements IWXAPIEventHandler {
    private IWXAPI api;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.d(Constant.LOG_TAG, "------ WXEntryActivity:onCreate");
        api = WXAPIFactory.createWXAPI(this, Constant.WX_APPID, false);
        api.handleIntent(getIntent(), this);
    }

    @Override
    public void onReq(BaseReq baseReq) {
        Log.d(Constant.LOG_TAG, "------ WXEntryActivity:onReq" + baseReq.toString());
        finish();
    }

    @Override
    public void onResp(BaseResp baseResp) {
        Log.d(Constant.LOG_TAG, "------ WXEntryActivity:onResp:" + baseResp.toString());

        int type = baseResp.getType();
        String tagStr = "";
        if(type == 1) {
            tagStr = Constant.TYPE_WEIXIN_TOKEN;
        }else if(type == 2) {
            tagStr = Constant.TYPE_WEIXIN_SHARE;
        }else if(type == 5) {
            tagStr = Constant.TYPE_WEIXIN_PAY;
        }

        switch (baseResp.errCode){
            case BaseResp.ErrCode.ERR_OK: //用户同意
                Log.d(Constant.LOG_TAG, "Resp OK");
                String jsFuncPara = "";
                if(type == 1){
                    SendAuth.Resp tempResp = (SendAuth.Resp) baseResp;
                    String code = tempResp.code;
                    jsFuncPara = this.bindMsg(tagStr, 1, code);
                }
                else if(type == 2 || type == 5){
                    jsFuncPara = this.bindMsg(tagStr, 1, "");
                }
                else{
                    Log.d(Constant.LOG_TAG, "onResp type is else");
                }
                //将结果返回给 JS 端
                if (!jsFuncPara.equals("")) {
                    String sb = "gt.WxMgr.execCallback(";
                    sb += ("'" + tagStr + "',");
                    sb += ("'" + jsFuncPara + "')");
                    evalString(sb);
                }
                break;

            case BaseResp.ErrCode.ERR_USER_CANCEL: //用户取消
                Log.d(Constant.LOG_TAG, "CANCEL");
                String jsPara = "";
                if(type == 1) {
                    jsPara = this.bindMsg(tagStr, 0, "");
                }else {
                    jsPara = this.bindMsg(tagStr, -2, "");
                }
                //将结果返回给 JS 端
                if (!jsPara.equals("")) {
                    String sb = "gt.WxMgr.execCallback(";
                    sb += ("'" + tagStr + "',");
                    sb += ("'" + jsPara + "')");
                    evalString(sb);
                }
                break;

            case BaseResp.ErrCode.ERR_AUTH_DENIED:  //用户拒绝
                Log.d(Constant.LOG_TAG, "ERR_AUTH_DENIED");
                String para = "";
                if(type == 1) {
                    para = this.bindMsg(tagStr, 0, "");
                }else {
                    para = this.bindMsg(tagStr, -4, "");
                }
                //将结果返回给 JS 端
                if (!para.equals("")) {
                    String sb = "gt.WxMgr.execCallback(";
                    sb += ("'" + tagStr + "',");
                    sb += ("'" + para + "')");
                    evalString(sb);
                }
                break;

            default:
                Log.d(Constant.LOG_TAG, "default");
                String paras = this.bindMsg(tagStr, -3, "");
                String sb = "gt.WxMgr.execCallback(";
                sb += ("'" + tagStr + "',");
                sb += ("'" + paras + "')");
                evalString(sb);
                break;
        }
        this.finish();
    }

    private String bindMsg(String type, int status, String code) {
        return "{\"type\":\"" + type + "\", \"status\":" + status +", \"code\":\""+ code + "\"}";
    }

    //在 GL 线程调用JS 脚本
    public void evalString(final String js) {
        runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString(js);
            }
        });
    }
}
