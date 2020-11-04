import React, { useEffect, useState } from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import { TouchableNativeFeedback } from 'react-native-gesture-handler'
import { IconButton } from 'react-native-paper'
import { _style } from '../../../style'
import { _env } from '../../../utils/env'

// 单组件开发不会触发热更新（？？？
// container item
export default function RenderItem(props) {
  let { navigation, data, index } = props

  function RenderImg() {
    return (
      <TouchableNativeFeedback
        onPress={() => navigation.push('viewer', { id: data.id })}
      >
        <View style={{ ...styles.imgContainer }}>
          <Text>{data.id} asd</Text>
          <Image source={{ uri: data.preview_url }} style={styles.img}></Image>
        </View>
      </TouchableNativeFeedback>
    )
  }

  function RenderLike() {
    let { isLike, likesToggle } = props
    return (
      <IconButton
        color="#6cf"
        icon={isLike ? 'heart' : 'heart-outline'}
        onPress={() => {
          likesToggle(data.id)
        }}
        size={18}
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
    ..._style.wh('100%', 18),
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
