import { likeToggle } from '@r/actions/likeAction'
import { StateBase } from '@r/reducers'
import { _style } from '@r/style'
import { GalleryItem } from '@r/types/itemType'
import { RootPageProps } from '@r/types/route'
import { _screen, _env, isDev, ip } from '@r/utils/env'
import { executePaser } from '@r/utils/ruleParser'
import React, { FC, memo, useState } from 'react'
import { Image, ImageStyle, StyleSheet, View } from 'react-native'
import { TouchableNativeFeedback } from 'react-native-gesture-handler'
import { Colors, IconButton, Text } from 'react-native-paper'
import { connect, ConnectedProps, shallowEqual } from 'react-redux'
import { DetailData } from '../detail'

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

export type GalleryItemType = {
  cover: string
  id: number | string
  data: DetailData
}

export type rGalleryItem = {
  info: GalleryItem
  list: GalleryItem[]
  isLike: boolean
  index: number
  itemType: 'image'
}

type rProps = ConnectedProps<typeof connector> & {
  // data: rGalleryItem
  data: GalleryItem
  index: number
  isLike: boolean
  navigation: RootPageProps<'gallery'>['navigation']
  onClick?: (index?: number) => void
  nowTag?: string
}

const RenderGalleryItem: FC<rProps> = function (props) {
  // console.log(`render ${props.index}`)
  let { data, index, isLike, navigation } = props

  function RenderItemType() {
    // let type = executePaser(props.rule.)
    return (
      <View style={{ position: 'absolute', left: 0, top: 0 }}>
        {data.tags.indexOf('webm') !== -1 ? (
          <Text style={{ color: Colors.blue300 }}>Webm</Text>
        ) : (
          <></>
        )}
      </View>
    )
  }

  function RenderImg() {
    let uri = executePaser(props.rule.discover.cover, data)
    uri = isDev
      ? `http://${ip}:3001/proxy-img?url=${encodeURIComponent(uri)}`
      : uri

    return (
      <TouchableNativeFeedback
        onPress={() => {
          // navigation.push('detail', {
          //   data: { ...data, cover: uri },
          //   nowTag: props.nowTag,
          // })
          props.onClick?.(props.index)
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
            props.likeToggle(data)
            setLike(!like)
          }}
          size={width}
        />
      </View>
    )
  }
  return (
    <View style={styles.itemContainer}>
      {/* 图片可触摸区 */}
      {RenderImg()}
      {/* 工具区 */}
      <View style={styles.tooltipContainer}>{RenderLike()}</View>
    </View>
  )
}

const mapStateToProps = (state: StateBase) => {
  return {
    rule: state.setting.rule,
  }
}
const mapDispatchToProps = {
  likeToggle,
}
let connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(
  memo(RenderGalleryItem, (pre, next) => {
    return shallowEqual(pre.data, next.data)
  }),
)
