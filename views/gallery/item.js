import React, { useEffect, useState } from 'react'
import { Dimensions, Image, StyleSheet, View } from 'react-native'
import { TouchableNativeFeedback } from 'react-native-gesture-handler'
import { ActivityIndicator, Button, IconButton } from 'react-native-paper'
import { connect } from 'react-redux'
import { _style } from '../../style'
import { _env, _screen } from '../../utils/env'

export const RenderGalleryItem = connect(
  (state) => ({}),
  (dispatch) => ({
    setIndex: (index) => dispatch({ type: 'imgList/setIndex', index }),
  }),
)(function (props) {
  let { item, index, isLike, likesToggle, navigation } = props
  console.log('render', index)

  // 获取屏幕宽度
  let width = _screen.width
  const styles = StyleSheet.create({
    itemContainer: {
      position: 'relative',
    },
    tooltipContainer: {
      position: 'absolute',
      bottom: 15,
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
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

  function RenderImg() {
    let { setIndex } = props
    return (
      <TouchableNativeFeedback onPress={() => setIndex(index)}>
        <View style={{ ...styles.imgContainer }}>
          <Image source={{ uri: item.preview_url }} style={styles.img}></Image>
        </View>
      </TouchableNativeFeedback>
    )
  }
  function RenderLike() {
    let [like, setLike] = useState(isLike)
    // let like = false

    let width = 25
    // 判断like
    return (
      <View style={{ ..._style.wh(width), right: 15 }}>
        <IconButton
          color="#6cf"
          icon={like ? 'heart' : 'heart-outline'}
          onPress={() => {
            likesToggle(item)
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
})
