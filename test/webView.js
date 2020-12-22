import React, { useRef } from 'react'
import { View } from 'react-native'
import { Button } from 'react-native-paper'
import { WebView } from 'react-native-webview'

export default function WebViewTest(props) {
  let webRef = useRef(null)
  return (
    <View>
      <Button
        onPress={() =>
          webRef.current.injectJavaScript(
            'window.ReactNativeWebView.postMessage("Hello!")',
          )
        }
      >
        back
      </Button>
      <WebView
        onMessage={(e) => console.log(e)}
        ref={webRef}
        source={{ uri: 'https://www.bilibili.com/' }}
        style={{ height: '100%' }}
      ></WebView>
    </View>
  )
}
