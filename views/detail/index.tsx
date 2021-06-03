import { ChipListDataType } from '@r/components/chipList'
import DebugInfo from '@r/components/debugInfo'
import ImageContainer from '@r/components/imageContainer'
import { useDp } from '@r/hooks'
import StatuBarLayout from '@r/layout/statuBar'
import { StateBase } from '@r/reducers'
import { _style } from '@r/style'
import { RootPageProps } from '@r/types/route'
import { ip, isDev, _env, _screen } from '@r/utils/env'
import request from '@r/utils/request'
import { executePaser } from '@r/utils/ruleParser'
import { handleOpenUrl } from '@r/utils/utils'
import React, { FC, useEffect, useState } from 'react'
import { ScrollView, TouchableWithoutFeedback, View } from 'react-native'
import { Button, Colors, FAB, Text } from 'react-native-paper'
import { connect, ConnectedProps } from 'react-redux'
import TagsContainer from './tagsContainer'

function RenderImageEl(uri: string, data: any) {
  // let _isVideo = data.tags.indexOf('webm') === -1
  let [isVideo, setIsVideo] = useState(false)
  let [firstLoad, setFirstLoad] = useState(false)

  useEffect(() => {
    if (!isVideo) {
      request.head(uri).then((res) => {
        setFirstLoad(false)
        if (res.headers['content-type'].indexOf('video') !== -1)
          setIsVideo(true)
      })
    }
  }, [])

  if (!_env.NSFW) return <Text>img:{uri}</Text>
  if (!firstLoad && !isVideo) return <ImageContainer source={{ uri }} />
  return (
    <ImageContainer source={{ uri: data.cover }}>
      {isVideo && (
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
      )}
    </ImageContainer>
  )
}

// ! 目前只有图片detail
export type DetailData = {
  id: string | number
  uri: string
  originUrl?: string
  tags?: {
    [k: string]: ChipListDataType
  }
}
// TODO 需要把ajax拿到的原始data 转换成 DetailData
export type rDetailData = {
  resolveData: DetailData
  originData: any
}

type Props = RootPageProps<'detail'>
type rProps = ConnectedProps<typeof connector> & Props

const Detail: FC<rProps> = (props) => {
  let { navigation, route } = props
  let dispatch = useDp()

  let data = route.params?.data

  // TODO 把所有datalist传过来，detail中可以滑动到上下张
  let [index, setIndex] = useState(0)
  let uri = executePaser(props.rule.content.image, { $i: data })
  uri = isDev
    ? `http://${ip}:3001/proxy-img?url=${encodeURIComponent(uri)}`
    : uri

  function RenderLike() {
    let [like, setLike] = useState(false)
    useEffect(() => {
      setLike(props.isLike)
    }, [])
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

  let [touchStart, setTouchStart] = useState<{
    x: number
    y: number
  }>({ x: 0, y: 0 })

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

  return (
    <StatuBarLayout style={{ position: 'relative' }}>
      <ScrollView
        onTouchStart={(e) => {
          let { pageX, pageY } = e.nativeEvent
          console.log('onTouchStart')
          setTouchStart({
            x: pageX,
            y: pageY,
          })
        }}
        onTouchEnd={(e) => {
          console.log('onTouchEnd')
          let { pageX, pageY } = e.nativeEvent
          let offset = touchStart.x - pageX
          console.log(offset)
          if (Math.abs(offset) >= _screen.width / 2) {
            if (offset >= 0) {
              console.log('move left')
            } else {
              console.log('move right')
            }
          }
        }}
      >
        {RenderImageEl(uri, data)}
        <TagsContainer
          data={data}
          nowTag={route.params?.nowTag}
          // tags={tags}
        />
        {/* <RenderReffer /> */}
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
      <RenderDebugInfo />
      <RenderLike />
    </StatuBarLayout>
  )
}

const mapStateToProps = (state: StateBase, props: Props) => {
  let pageData = props.route.params.data
  return {
    isLike: !!state.likes.imgs[`rule34_${pageData.id}`],
    rule: state.setting.rule,
  }
}
const mapDispatchToProps = {}

let connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(Detail)
