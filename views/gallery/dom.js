import React, { useEffect, useState } from 'react'
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native'
import {
  ScrollView,
  TouchableNativeFeedback,
} from 'react-native-gesture-handler'
import { ActivityIndicator, Button, IconButton } from 'react-native-paper'
import { imgList_o } from '../../api/list_o'
import { _style } from '../../style'
import { _env } from '../../utils/env'
import { store_setDataList, store_clearDataList } from '../../utils/store'

export default function view_gallery({
  navigation,
  route,
  likes,
  likesToggle,
}) {
  let [dataList, setDataList] = useState([])
  let [pid, setPid] = useState(1)

  useEffect(() => {
    // reset dataList 关键
    dataList.length = 0
    setDataList(dataList)
    setPid(1)
    // store_clearDataList()
  }, [])

  let pushEnd = true
  useEffect(() => {
    imgList_o({ tags: route.params?.tags || 'dacad', limit: 20, pid }).then(
      (res) => {
        let newDataList = [...dataList, ...res.dataList]
        setDataList(newDataList)
        // store_setDataList(newDataList)
        pushEnd = true
      },
    )
  }, [route.params?.tags, pid])

  // flex 模拟grid作用
  function isLast(i) {
    /** @type {ViewStyle} */
    let s = {}
    return i + 1 === dataList.length ? s : {}
  }

  // container item
  function RenderItem({ item, index }) {
    let data = item

    function RenderImg() {
      return (
        <TouchableNativeFeedback
          onPress={() => navigation.push('viewer', { id: data.id })}
        >
          <View style={{ ...styles.imgContainer, ...isLast(index) }}>
            <Image
              source={{ uri: data.preview_url }}
              style={styles.img}
            ></Image>
          </View>
        </TouchableNativeFeedback>
      )
    }
    function RenderLike() {
      // 判断like
      let isLike = !!likes[item.id]
      return (
        <IconButton
          color="#6cf"
          icon={isLike ? 'heart' : 'heart-outline'}
          onPress={() => {
            likesToggle(item.id)
          }}
          size={15}
        ></IconButton>
      )
    }
    return (
      <View key={data.id} style={styles.itemContainer}>
        {/* 图片可触摸区 */}
        <RenderImg />
        {/* 工具区 */}
        <View style={styles.tooltipContainer}>
          <RenderLike />
        </View>
      </View>
    )
  }

  // container scroll event
  function handlerScrollEnd(e) {
    function isCloseToBottom({
      layoutMeasurement,
      contentOffset,
      contentSize,
    }) {
      return (
        layoutMeasurement.height + contentOffset.y >= contentSize.height - 1
      )
    }
    if (isCloseToBottom(e.nativeEvent)) {
      if (pushEnd) {
        pushEnd = false
        console.log('end')
        setPid(++pid)
      }
    }
  }
  return (
    <View>
      {dataList.length ? (
        <ScrollView onScroll={handlerScrollEnd}>
          <View style={styles.container}>
            {dataList.map((d, index) => RenderItem({ item: d, index }))}
          </View>
        </ScrollView>
      ) : (
        <View style={{ height: '100%', ..._style.center() }}>
          <ActivityIndicator animating={true} />
        </View>
      )}
    </View>
  )
}

// 获取屏幕宽度
let width = Dimensions.get('window').width
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  itemContainer: {
    position: 'relative',
  },
  tooltipContainer: {
    position: 'absolute',
    bottom: 15,
    ..._style.wh('100%', 15),
  },
  btn_like: {
    ..._style.wh(10),
    tintColor: '#6cf',
  },
  img: {
    ..._style.wh(_env.NSFW ? width / 2 : 10),
    resizeMode: 'contain',
  },
  imgContainer: {
    ..._style.wh(width / 2),
    ..._style.border(),
    ..._style.center(),
  },
})
