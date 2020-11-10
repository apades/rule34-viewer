import React, { useEffect, useState } from 'react'
import { Dimensions, Image, StyleSheet, View } from 'react-native'
import { TouchableNativeFeedback } from 'react-native-gesture-handler'
import { ActivityIndicator, Button, IconButton } from 'react-native-paper'
import { connect } from 'react-redux'
import { _style } from '../../style'
import { _env } from '../../utils/env'

export function dom({ item, index, getLike, likesToggle, navigation }) {
  //   let isLike = false
  function RenderImg() {
    return (
      <TouchableNativeFeedback
        onPress={() => navigation.push('viewer', { id: item.id, index })}
      >
        <View style={{ ...styles.imgContainer }}>
          <Image source={{ uri: item.preview_url }} style={styles.img}></Image>
        </View>
      </TouchableNativeFeedback>
    )
  }
  function RenderLike() {
    let [like, setLike] = useState(getLike(item.id))

    let width = 15
    // 判断like
    return (
      <View style={_style.wh(width)}>
        <IconButton
          color="#6cf"
          icon={like ? 'heart' : 'heart-outline'}
          onPress={() => {
            likesToggle(item.id)
            setLike(!like)
          }}
          size={width}
        />
      </View>
    )
  }
  return (
    <View key={item.id} style={styles.itemContainer}>
      {/* 图片可触摸区 */}
      <RenderImg />
      {/* 工具区 */}
      <View style={styles.tooltipContainer}>
        <RenderLike />
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
    // ..._style.wh(width),
    resizeMode: 'contain',
  },
  imgContainer: {
    ..._style.wh(width / 2),
    // ..._style.border(),
    ..._style.center(),
  },
})

export const RenderGalleryItem = connect((state) => {
  return {
    getLike: (id) => state.likes.imgs[id],
  }
})(dom)
