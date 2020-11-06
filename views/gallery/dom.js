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
import { Comp_seachInput } from '../../components/searchInput'
import { _style } from '../../style'
import { _env } from '../../utils/env'
import { dom, RenderGalleryItem } from './item'

export default function view_gallery({ navigation, route, likesToggle }) {
  let [dataList, setDataList] = useState([])
  let [pid, setPid] = useState(1)
  let [loading, setLoading] = useState(false)

  let init = true
  let [firstLoad, setFirstLoad] = useState(true)

  useEffect(() => {
    // reset dataList 关键
    dataList.length = 0
    setDataList(dataList)
    setPid(1)
  }, [])

  useEffect(() => {
    setLoading(true)
    imgList_o({ tags: route.params?.tags || 'dacad', limit: 20, pid }).then(
      (res) => {
        let newDataList = [...dataList, ...res.dataList]
        setDataList(newDataList)
        if (init) {
          init = false
          setFirstLoad(false)
        }
        setLoading(false)
      },
    )
  }, [pid])

  // flex 模拟grid作用
  function isLast(i) {
    /** @type {ViewStyle} */
    let s = {}
    return i + 1 === dataList.length ? s : {}
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
      if (!loading) {
        console.log('scroll end')
        setPid(++pid)
      }
    }
  }
  return (
    <View style={{ ..._style.wh('100%'), position: 'absolute' }}>
      {!firstLoad ? (
        <ScrollView onScroll={handlerScrollEnd}>
          <View style={styles.container}>
            {dataList.map((d, index) => {
              return (
                <View key={d.id}>
                  <RenderGalleryItem
                    index={index}
                    item={d}
                    likesToggle={likesToggle}
                    navigation={navigation}
                  />
                </View>
              )
            })}
          </View>
        </ScrollView>
      ) : (
        <View style={{ ..._style.wh('100%'), ..._style.center() }}>
          <ActivityIndicator animating={true} />
        </View>
      )}
      <View
        style={{
          position: 'absolute',
          width: '100%',
          alignItems: 'center',
          top: 10,
        }}
      >
        <Comp_seachInput navigation={navigation} />
      </View>
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
