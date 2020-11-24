import React from 'react'
import AutoHeightImage from 'react-native-auto-height-image'
import { Image, View } from 'react-native'
import { FAB, Text } from 'react-native-paper'
import { connect } from 'react-redux'
import { _env, _screen } from '../../utils/env'

const Detail = connect((state) => ({
  dataList: state.imgList.dataList,
  count: state.imgList.count,
  pid: state.imgList.pid,
  index: state.imgList.index,
  getLikes: (img) => state.likes.imgs[img],
}))(function (props) {
  let { navigation, route } = props

  let { dataList, index } = props
  let uri = dataList[index].file_url
  let ImageEl = _env.NSFW ? (
    <AutoHeightImage source={{ uri }} width={_screen.width} />
  ) : (
    <Text>img:{uri}</Text>
  )

  let FabEl = (
    <FAB
      icon="heart"
      onPress={() => {
        console.log('like!')
      }}
      style={{
        position: 'absolute',
        bottom: 10,
        right: 10,
      }}
    />
  )

  return (
    <View style={{ flex: 1, position: 'relative', flexDirection: 'column' }}>
      {ImageEl}
      <View>
        <Text>this is tags container</Text>
      </View>
      {FabEl}
    </View>
  )
})
export default Detail
