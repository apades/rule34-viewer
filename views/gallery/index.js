import React, { useEffect, useState } from 'react'
import { Dimensions, Image, StyleSheet, View, ViewStyle } from 'react-native'
import {
  ScrollView,
  TouchableNativeFeedback,
} from 'react-native-gesture-handler'
import { ActivityIndicator, Button } from 'react-native-paper'
import { imgList_o } from '../../api/list_o'
import { _style } from '../../style'
import { _env } from '../../utils/env'

let _dataList = []
export function view_gallery({ navigation, route }) {
  let [dataList, setDataList] = useState(_dataList)
  let [pid, setPid] = useState(1)

  useEffect(() => {
    // reset dataList 关键
    dataList.length = 0
    setDataList(dataList)
    setPid(1)
  }, [])

  useEffect(() => {
    imgList_o({ tags: route.params?.tags || 'dacad', limit: 20, pid }).then(
      (res) => {
        setDataList([...dataList, ...res.dataList])
      }
    )
  }, [route.params?.tags, pid])

  function handlerEnd(e) {
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
      console.log('end')
      setPid(++pid)
    }
  }

  //   return (
  //     <FlatList
  //       keyExtractor={(item) => item.id + ~~(Math.random() * 1000)}
  //       data={dataList}
  //       renderItem={renderItem}
  //       onmo={handlerEnd}
  //     ></FlatList>
  //   )
  // flex 模拟grid作用
  function isLast(i) {
    /** @type {ViewStyle} */
    let s = {}
    return i + 1 === dataList.length ? s : {}
  }
  function renderItem({ item, index }) {
    let data = item
    return (
      <View style={styles.itemContainer} key={data.id}>
        <TouchableNativeFeedback
          onPress={() => navigation.push('viewer', { id: data.id })}
        >
          <View style={{ ...styles.imgContainer, ...isLast(index) }}>
            <Image
              style={styles.img}
              source={{ uri: data.preview_url }}
            ></Image>
          </View>
        </TouchableNativeFeedback>
        <View style={styles.tooltipContainer}>
          <Button
            onPress={() => console.log(`like`, item.id)}
            style={styles.btn_like}
            icon="heart"
          ></Button>
        </View>
      </View>
    )
  }
  return (
    <ScrollView onScroll={handlerEnd}>
      {dataList.length ? (
        <View style={styles.container}>
          {dataList.map((d, index) => renderItem({ item: d, index }))}
        </View>
      ) : (
        <ActivityIndicator animating={true} />
      )}
    </ScrollView>
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
    ..._style.wh(_env.NSFW ? 10 : width / 2),
    resizeMode: 'contain',
  },
  imgContainer: {
    ..._style.wh(width / 2),
    ..._style.border(),
    ..._style.center(),
  },
})
