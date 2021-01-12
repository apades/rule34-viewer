import React, { FC, memo, useState } from 'react'
import { Image, ImageStyle, StyleSheet, View } from 'react-native'
import { TouchableNativeFeedback } from 'react-native-gesture-handler'
import { Colors, IconButton, Text } from 'react-native-paper'
import { connect, ConnectedProps } from 'react-redux'
import { StateBase } from 'reducers'
import { _style } from '../../style'
import { _env, _screen } from '../../utils/env'
import { executePaser } from '../../utils/ruleParser'

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
    resizeMode: 'contain',
  },
  imgContainer: {
    ..._style.wh(width / 2),
    ..._style.center(),
    position: 'relative',
  },
})

type rProps = ConnectedProps<typeof connector> & {
  [k: string]: any
}

const RenderGalleryItem: FC<rProps> = function (props) {
  let { item, index, isLike, likesToggle, navigation } = props
  // console.log('render', index)

  function RenderItemType() {
    // let type = executePaser(props.rule.)
    return (
      <View style={{ position: 'absolute', left: 0, top: 0 }}>
        {item.tags.indexOf('webm') !== -1 ? (
          <Text style={{ color: Colors.blue300 }}>Webm</Text>
        ) : (
          <></>
        )}
      </View>
    )
  }

  function RenderImg() {
    let uri = executePaser(props.rule.discover.cover, item)

    return (
      <TouchableNativeFeedback
        onPress={() => {
          navigation.push('detail', {
            data: { ...item, cover: uri },
            nowTag: props.nowTag,
          })
        }}
      >
        <View style={{ ...styles.imgContainer }}>
          {/* {RenderItemType()} */}
          <Image source={{ uri }} style={styles.img as ImageStyle}></Image>
        </View>
      </TouchableNativeFeedback>
    )
  }
  function RenderLike() {
    let [like, setLike] = useState(isLike)

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
}

const mapStateToProps = (state: StateBase) => {
  return {
    rule: state.setting.rule,
  }
}
const mapDispatchToProps = {}

let connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(memo(RenderGalleryItem))
