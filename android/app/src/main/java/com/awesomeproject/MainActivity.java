package com.awesomeproject;

import com.facebook.react.ReactActivity;
import android.os.Bundle;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.BroadcastReceiver;
import android.content.res.Configuration;
import android.view.WindowManager;
import android.view.KeyEvent;

import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactMethod;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "AwesomeProject";
  }


  private NetworkChangeReceiver networkChangeReceiver;
    Boolean isLister = false;

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Intent intent = new Intent("onConfigurationChanged");
        intent.putExtra("newConfig", newConfig);
        this.sendBroadcast(intent);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        /*
        * 主要是RN端不能直接执行MainActivity里面的方法所以需要另外创建可供RN执行的module
        * 利用module里面的方法来改变 isLister 的值实现开关功能 
        */
        // 注册自定义广播 (音开关广播)
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction("com.demo.volume"); // com.demo.volume 命名随意
        networkChangeReceiver = new NetworkChangeReceiver();
        registerReceiver(networkChangeReceiver, intentFilter);
    }

    // 音频开关
    private class NetworkChangeReceiver extends BroadcastReceiver {
      // 收到广播执行的内容
      @Override
      public void onReceive(Context context, Intent intent) {
      	// 获取广播中传入的 isLister 的值， 获取不到时取第二个参数，这里是 false 
        isLister = intent.getBooleanExtra("isLister", false);
      }
    }

    // 发送事件给RN端 的方法
    private void sendEvent(ReactContext reactContext, String eventName,  WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    // 监听手机按键
    @Override
    public boolean dispatchKeyEvent(KeyEvent event) {
        ReactContext reactContext = getReactInstanceManager().getCurrentReactContext();
        WritableMap params = Arguments.createMap();
        params.putInt("keyCode", event.getKeyCode());
        if (event.getAction() == KeyEvent.ACTION_DOWN) {
            // 发送keydown事件给RN端
            sendEvent(reactContext, "keydown", params); // keydown 可自己命名
        } else if (event.getAction() == KeyEvent.ACTION_UP) {
        	// 发送keyup事件给RN端
            sendEvent(reactContext, "keyup", params);  // keyup 可自己命名
        }
        return super.dispatchKeyEvent(event);
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
      // 覆盖音量键弹起事件 (这样就不会出现调节音量的弹窗)
      // 也可以自己根据别的 KeyEvent 事件来拦截相应操作
      if (isLister && keyCode == KeyEvent.KEYCODE_VOLUME_DOWN) {
          return true;
      } else if (isLister && keyCode == KeyEvent.KEYCODE_VOLUME_UP){
          return true;
      } else {
          return super.onKeyUp(keyCode, event);
      }
    }

    public boolean onKeyDown(int keyCode, KeyEvent event) {
      // 覆盖音量键按下事件 (这样就不会出现调节音量的弹窗)
      if (isLister && keyCode == KeyEvent.KEYCODE_VOLUME_DOWN) {
          return true;
      } else if (isLister && keyCode == KeyEvent.KEYCODE_VOLUME_UP) {
          return true;
      } else {
          return super.onKeyDown(keyCode, event);
      }
    }
}
