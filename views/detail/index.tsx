import ChipList, { ChipListDataType } from '@r/components/chipList'
import DebugInfo from '@r/components/debugInfo'
import ImageContainer from '@r/components/imageContainer'
import { useDp } from '@r/hooks'
import StatuBarLayout from '@r/layout/statuBar'
import { resolveDetailData } from '@r/package/ruleParser/resolve'
import { StateBase } from '@r/reducers'
import { _style } from '@r/style'
import { RootPageProps } from '@r/types/route'
import { _env, _screen } from '@r/utils/env'
import request from '@r/utils/request'
import { executePaser } from '@r/utils/ruleParser'
import { deurl, handleOpenUrl } from '@r/utils/utils'
import React, { FC, useEffect, useState } from 'react'
import { Image, ScrollView, TouchableWithoutFeedback, View } from 'react-native'
import { Button, Colors, Divider, FAB, Text } from 'react-native-paper'
import { connect, ConnectedProps } from 'react-redux'
import TagsContainer from './tagsContainer'

function RenderImageEl(uri: string, data: any) {
  console.log('render img')
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
type rProps = ConnectedProps<typeof connector> &
  Props & {
    [k: string]: any
  }

const Detail: FC<rProps> = (props) => {
  console.log('render contain')
  let { navigation, route } = props
  let dispatch = useDp()

  let data = route.params?.data
  // let data = resolveDetailData(props.rule, route.params?.data)

  let uri = executePaser(props.rule.content.image, { $i: data })

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

  // function RenderReffer() {
  //   let refferMap = {
  //     'e621.net': (
  //       <Image
  //         source={{
  //           uri:
  //             'https://callstack.github.io/react-native-paper/screenshots/chip-1.png',
  //         }}
  //       />
  //     ),
  //   }

  //   let reffers: string[] = (data?.source && data.source.split(' ')) || []
  //   let dataList = reffers.map((reffer) => {
  //     let durl = deurl(reffer)
  //     console.log('durl', durl)
  //     return {
  //       label: durl.domain,
  //       url: reffer,
  //     }
  //   })

  //   return (
  //     !!dataList.length && (
  //       <View>
  //         <View>
  //           <Text>reffers</Text>
  //           <Divider />
  //         </View>
  //         <ChipList
  //           dataList={dataList}
  //           onPress={(data, index) => {
  //             handleOpenUrl(dataList[index].url)
  //           }}
  //         />
  //       </View>
  //     )
  //   )
  // }

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
      <>
        <ScrollView>
          {RenderImageEl(uri, data)}
          <TagsContainer
            data={data}
            id={data.id}
            navigation={navigation}
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
      </>
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
