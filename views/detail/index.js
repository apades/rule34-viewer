import React, { useState } from 'react'
import {
  Image,
  Linking,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { Colors, Divider, FAB, Text } from 'react-native-paper'
import { connect } from 'react-redux'
import ChipList from '../../components/chipList'
import DebugInfo from '../../components/debugInfo'
import imageContainer from '../../components/imageContainer'
import statuBarLayout from '../../layout/statuBar'
import { _style } from '../../style'
import { _env, _screen } from '../../utils/env'
import { deurl } from '../../utils/utils'
import TagsContainer from './tagsContainer'

const Detail = connect((state) => ({
  getLikes: (id) => state.likes.imgs[`rule34_${id}`],
}))(function (props) {
  let { navigation, route, dispatch } = props

  let data = route.params?.data ?? {}

  let uri = data.file_url
  let match = uri.match(/.*?\/\/(.*?\.)rule34/)[1]
  uri = uri.replace(match, '')
  let ImageEl
  if (!_env.NSFW) {
    ImageEl = <Text>img:{uri}</Text>
  } else {
    ImageEl =
      data.tags.indexOf('webm') === -1
        ? imageContainer({
            source: { uri },
          })
        : imageContainer({
            source: { uri: data.preview_url },
            child: () => (
              <View
                style={{
                  ..._style.wh('100%'),
                  ..._style.center(),
                  position: 'absolute',
                  backgroundColor: '#fff8',
                }}
              >
                <Text style={{ fontSize: 20, color: Colors.blue400 }}>
                  click reffers-&gt;web to play webm
                </Text>
              </View>
            ),
          })
  }

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

  let tags = data?.tags?.split(' ').filter((str) => str !== '')
  let tagsContainer = (
    <TagsContainer
      id={data.id}
      navigation={navigation}
      nowTag={route.params?.nowTag}
      tags={tags}
    />
  )

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

    let reffers = (data?.source && data.source.split(' ')) || []
    let dataList = reffers.map((reffer) => {
      let durl = deurl(reffer)
      return {
        label: durl.domain,
        url: reffer,
      }
    })

    dataList.unshift({
      label: 'web',
      url: `https://rule34.xxx/index.php?page=post&s=view&id=${data.id}`,
    })

    function handleOpenUrl(url) {
      return Linking.canOpenURL(url).then((can) => {
        if (can) Linking.openURL(url)
        else console.error(`can\'t open ${url}`)
      })
    }
    return (
      <View style={{ marginBottom: 20 }}>
        {ChipList({
          dataList,
          onPress(data) {
            handleOpenUrl(data.url)
          },
        })}
      </View>
    )
  }

  function RenderDebugInfo() {
    let [detail, setDetail] = useState(false)
    return (
      <DebugInfo y={_screen.height - 50}>
        <TouchableWithoutFeedback onPress={() => setDetail((d) => !d)}>
          <Text>{detail ? JSON.stringify(data) : 'show detail'}</Text>
        </TouchableWithoutFeedback>
      </DebugInfo>
    )
  }

  return statuBarLayout({
    style: { position: 'relative' },
    children: () => (
      <>
        <ScrollView>
          {ImageEl}
          {tagsContainer}
          <View>
            <Text>reffers</Text>
            <Divider />
          </View>
          {RenderReffer()}
        </ScrollView>
        {RenderDebugInfo()}
        {RenderLike()}
      </>
    ),
  })
})
export default Detail
