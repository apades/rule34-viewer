package com.awesomeproject.keyeventlister;

import android.content.Intent;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReactContext;

public class KeyEventListerModule extends ReactContextBaseJavaModule{
    private ReactApplicationContext mContext;
    KeyEventListerModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
    }


    @Override
    public String getName() {
        return "KeyEventLister";
    }

    // 开关音量键 （提供给RN端使用的方法）
    @ReactMethod
    public void audioSwitch(final Boolean isLister) {
      getCurrentActivity().runOnUiThread(new Runnable() {
        @Override
        public void run() {
          Intent intent = new Intent();
          intent.putExtra("isLister", isLister); // 添加广播传送的参数
          intent.setAction("com.demo.volume"); // 需跟注册广播时填写的一致
          //发送广播
          getCurrentActivity().sendBroadcast(intent);
        }
      });
    }
}