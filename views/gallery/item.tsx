import { likeToggle } from '@r/actions/likeAction'
import { StateBase } from '@r/reducers'
import { _style } from '@r/style'
import React, { FC, memo, useState } from 'react'
import { Image, ImageStyle, View } from 'react-native'
import { TouchableNativeFeedback } from 'react-native-gesture-handler'
import { IconButton } from 'react-native-paper'
import { connect, ConnectedProps, shallowEqual } from 'react-redux'
import { rData } from '.'
import { ItemStyles } from './style'

type Props = {
  data: rData
  index: number
  onPress?: () => void
}
type rProps = ConnectedProps<typeof connector> & Props

const RenderGalleryItem: FC<rProps> = function (props) {
  let { data, index } = props
  let { isLike, originData, cover } = data
  let [like, setLike] = useState(isLike)

  return (
    <View style={ItemStyles.itemContainer}>
      {/* 图片可触摸区 */}
      <TouchableNativeFeedback onPress={() => props.onPress()}>
        <View style={{ ...ItemStyles.imgContainer }}>
          <Image
            source={{ uri: cover }}
            style={ItemStyles.img as ImageStyle}
          ></Image>
        </View>
      </TouchableNativeFeedback>
      {/* 工具区 */}
      <View style={ItemStyles.tooltipContainer}>
        {/* isLike */}
        <View style={{ ..._style.wh(25), right: 15 }}>
          <IconButton
            color="#6cf"
            icon={like ? 'heart' : 'heart-outline'}
            onPress={() => {
              props.likeToggle(originData)
              setLike(!like)
            }}
            size={25}
          />
        </View>
      </View>
    </View>
  )
}

const mapStateToProps = (state: StateBase) => {
  return {}
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
