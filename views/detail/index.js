import React, { useState } from 'react'
import AutoHeightImage from 'react-native-auto-height-image'
import { Image, Linking, ScrollView, View } from 'react-native'
import { Divider, FAB, Text } from 'react-native-paper'
import { connect } from 'react-redux'
import { _env, _screen } from '../../utils/env'
import statuBarLayout from '../../layout/statuBar'
import ChipList from '../../components/chipList'
import { deurl } from '../../utils/utils'
import imageContainer from '../../components/imageContainer'

const Detail = connect((state) => ({
  getLikes: (id) => state.likes.imgs[id],
}))(function (props) {
  let { navigation, route, dispatch } = props

  let data = route.params?.data ?? {}

  let uri = data.file_url
  let match = uri.match(/.*?\/\/(.*?\.)rule34/)[1]
  uri = uri.replace(match, '')
  let ImageEl = _env.NSFW ? (
    imageContainer({
      source: { uri },
      width: _screen.width,
    })
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
          onPress(tags) {
            // console.log(d)
            navigation.push('gallery', {
              tags,
            })
          },
        })}
      </View>
    )
  }

  function RenderReffer() {
    let refferMap = {
      'e621.net': (
        <Image
          source={{
            uri:
              'https://callstack.github.io/react-native-paper/screenshots/chip-1.png',
          }}
        />
      ),
    }

    let reffers = data?.source?.split(' ')
    let dataList =
      reffers?.map((reffer) => {
        let durl = deurl(reffer)
        return {
          label: durl.domain,
          url: reffer,
        }
      }) || []
    function handleOpenUrl(url) {
      return Linking.canOpenURL(url).then((can) => {
        if (can) Linking.openURL(url)
        else console.error(`can\'t open ${url}`)
      })
    }
    return (
      <View>
        {ChipList({
          dataList,
          onPress(data) {
            handleOpenUrl(data.url)
            // console.log(data)
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
          <View>
            <Text>reffers</Text>
            <Divider />
          </View>
          {RenderReffer()}
        </ScrollView>
        {RenderLike()}
      </>
    ),
  })
})
export default Detail
