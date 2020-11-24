import React, { useState } from 'react'
import AutoHeightImage from 'react-native-auto-height-image'
import { Image, ScrollView, View } from 'react-native'
import { FAB, Text } from 'react-native-paper'
import { connect } from 'react-redux'
import { _env, _screen } from '../../utils/env'
import statuBarLayout from '../../layout/statuBar'
import ChipList from '../../components/chipList'

const Detail = connect((state) => ({
  dataList: state.imgList.dataList,
  count: state.imgList.count,
  pid: state.imgList.pid,
  index: state.imgList.index,
  getLikes: (id) => state.likes.imgs[id],
}))(function (props) {
  let { navigation, route, dispatch } = props

  let { dataList, index } = props
  let data = dataList[index] || {}

  let uri = data.file_url
  let ImageEl = _env.NSFW ? (
    <AutoHeightImage source={{ uri }} width={_screen.width} />
  ) : (
    <Text>img:{uri}</Text>
  )

  function RenderLike() {
    let { getLikes } = props
    let [like, setLike] = useState(getLikes(data.id))
    return (
      <FAB
        icon={like ? 'heart' : 'heart-outline'}
        onPress={() => {
          console.log(`like!,${data.id}`)
          dispatch({ type: 'likes/img_toggle', id: data.id, data })
          setLike(!like)
        }}
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
        }}
      />
    )
  }

  function RenderTagsContainer() {
    let dataList = data?.tags?.split(' ').filter((str) => str !== '')
    // console.log(data)
    return (
      <View>
        {ChipList({
          dataList,
          onPress(text) {
            // console.log(d)
            dispatch({ type: 'search/input', text })
            navigation.goBack()
          },
        })}
      </View>
    )
  }

  return statuBarLayout({
    style: { position: 'relative' },
    children: () => (
      <>
        <ScrollView>
          {ImageEl}
          {RenderTagsContainer()}
        </ScrollView>
        {RenderLike()}
      </>
    ),
  })
})
export default Detail
