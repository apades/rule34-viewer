import React, { useEffect, useState } from 'react'
import { Image, ScrollView, TouchableWithoutFeedback, View } from 'react-native'
import { Button, Colors, Divider, FAB, Text } from 'react-native-paper'
import { connect } from 'react-redux'
import ChipList from '../../components/chipList'
import DebugInfo from '../../components/debugInfo'
import imageContainer from '../../components/imageContainer'
import _config from '../../config/base.config'
import statuBarLayout from '../../layout/statuBar'
import { _style } from '../../style'
import { _env, _screen } from '../../utils/env'
import request from '../../utils/request'
import { executePaser } from '../../utils/ruleParser'
import { deurl, handleOpenUrl } from '../../utils/utils'
import TagsContainer from './tagsContainer'

function RenderImageEl(uri, data) {
  console.log('render img')
  // let _isVideo = data.tags.indexOf('webm') === -1
  let [isVideo, setIsVideo] = useState(false)
  let [firstLoad, setFirstLoad] = useState(false)

  let ImageEl

  useEffect(() => {
    if (!isVideo) {
      request.head(uri).then((res) => {
        setFirstLoad(false)
        if (res.headers['content-type'].indexOf('video') !== -1)
          setIsVideo(true)
      })
    }
  }, [])

  if (!_env.NSFW) {
    ImageEl = <Text>img:{uri}</Text>
  } else {
    ImageEl =
      !firstLoad && !isVideo
        ? imageContainer({
            source: { uri },
          })
        : imageContainer({
            source: { uri: data.cover },
            child: () =>
              isVideo ? (
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
              ) : (
                <></>
              ),
          })
  }
  return ImageEl
}

const Detail = connect((state) => ({
  getLikes: (id) => state.likes.imgs[`rule34_${id}`],
  rule: state.setting.rule,
}))(function (props) {
  console.log('render contain')
  let { navigation, route, dispatch } = props

  let data = route.params?.data ?? {}

  let uri = executePaser(props.rule.content.image, { $i: data })

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

  // let tags = data?.tags?.split(' ').filter((str) => str !== '')
  let tagsContainer = (
    <TagsContainer
      data={data}
      id={data.id}
      navigation={navigation}
      nowTag={route.params?.nowTag}
      // tags={tags}
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

    return dataList.length ? (
      <View>
        <View>
          <Text>reffers</Text>
          <Divider />
        </View>
        {ChipList({
          dataList,
          onPress(data) {
            handleOpenUrl(data.url)
          },
        })}
      </View>
    ) : (
      <></>
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
          {RenderImageEl(uri, data)}
          {tagsContainer}
          {RenderReffer()}
          <View>
            <Button
              mode="contained"
              onPress={() =>
                handleOpenUrl(
                  `https://rule34.xxx/index.php?page=post&s=view&id=${data.id}`,
                )
              }
            >
              origin
            </Button>
          </View>
          <View style={{ marginTop: 20 }}></View>
        </ScrollView>
        {RenderDebugInfo()}
        {RenderLike()}
      </>
    ),
  })
})
export default Detail
