import { getContentOriginUrl, getMoreGalleyData } from '@r/actions/ruleAction'
import { useDp } from '@r/hooks'
import { StateBase } from '@r/reducers'
import { RootPageProps } from '@r/types/route'
import { _screen } from '@r/utils/env'
import { handleOpenUrl } from '@r/utils/utils'
import React, { FC, memo, useEffect, useRef, useState } from 'react'
import { Image, Text, View } from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'
import { IImageInfo } from 'react-native-image-zoom-viewer/built/image-viewer.type'
import { ActivityIndicator, Button, FAB } from 'react-native-paper'
import Animated, { Easing } from 'react-native-reanimated'
import { connect, ConnectedProps } from 'react-redux'
import TagsContainer from '../detail/tagsContainer'
import { rData } from '../gallery'

export type ViewerProps = RootPageProps<'viewer'>
type rProps = ConnectedProps<typeof connector> & ViewerProps

let initTop = (_screen.height / 100) * 85
let Page_Viewer: FC<rProps> = (props) => {
  let {
    index: InitIndex,
    dataList: _dataList,
    page: _page,
    nowTag,
  } = props.route.params
  let dispatch = useDp()

  let [index, setindex] = useState(InitIndex)
  let [page, setPage] = useState(_page)
  let [dataList, setDataList] = useState([..._dataList])
  let [like, setLike] = useState(false)
  let [nowData, setNowData] = useState<rData>(_dataList[InitIndex])
  let [isAnimating, setAnimating] = useState(false)
  let data = nowData?.originData

  useEffect(() => {
    let rdata = dataList[index]
    // console.log('rdata', rdata)
    setNowData(rdata)
    setLike(rdata?.isLike)
  }, [index, dataList])

  let [mStartY, setmStartY] = useState(0)
  let [isCanSlidBottom, setCanSlidBottom] = useState(true)
  let top = useRef(new Animated.Value(initTop)).current
  let [height, setheight] = useState(0)

  async function loadMore() {
    let resDataList = await props.getMoreGalleyData({
      pageLimit: 20,
      pageNum: page + 1,
      searchString: nowTag,
    })
    setDataList((list) => [...list, ...resDataList])
    setPage(page + 1)
  }
  let imageUrls: IImageInfo[] = dataList.map((i) => {
    let isVideo = /\.(webm|mp4)$/.test(i.content)
    return {
      url: isVideo ? i.cover : i.content,
      props: {
        isVideo,
        cover: i.cover,
      },
    }
  })

  return (
    <View
      style={{
        position: 'relative',
        flex: 1,
      }}
    >
      <ImageViewer
        // TODO 这里出现了末尾时data正常，但是中间image加载异常，黑屏且没法滑动
        imageUrls={imageUrls}
        index={index}
        onChange={(i) => {
          setindex(i)
          if (i === dataList.length - 1) loadMore()
        }}
        onClick={() => {
          console.log('click to hide bottom')
          setCanSlidBottom(true)
          Animated.timing(top, {
            duration: 300,
            toValue: initTop,
            easing: Easing.inOut(Easing.ease),
          }).start()
        }}
        saveToLocalByLongPress={false}
        onLongPress={() => {
          console.log('onLongPress')
        }}
        renderImage={(props) => {
          let { source, style } = props
          // console.log('props', props)
          if (props.isVideo)
            return (
              <View
                style={{
                  ...style,
                  backgroundColor: '#f00',
                  position: 'relative',
                }}
              >
                <Image source={{ uri: source.uri }} style={{ ...style }} />
                <Text
                  style={{
                    color: '#fff',
                    position: 'absolute',
                    bottom: '50%',
                    zIndex: 100,
                  }}
                >
                  this is video, click origin to watch
                </Text>
              </View>
            )
          return <Image source={{ uri: source.uri }} style={{ ...style }} />
        }}
        loadingRender={() => <ActivityIndicator animating={true} />}
      />
      <View
        style={{
          zIndex: isCanSlidBottom ? 11 : 9,
          backgroundColor: '#fff',
          width: '100%',
          height: 100,
          position: 'absolute',
          opacity: 0,
          bottom: 0,
        }}
        onTouchStart={(e) => {
          setmStartY(e.nativeEvent.pageY)
        }}
        onTouchMove={(e) => {
          let y = e.nativeEvent.pageY
          if (mStartY - y >= 30 && !isAnimating) {
            setCanSlidBottom(false)
            setAnimating(true)
            Animated.timing(top, {
              duration: 300,
              toValue: _screen.height - height - 70,
              easing: Easing.inOut(Easing.ease),
            }).start((data) => {
              if (data.finished) setAnimating(false)
            })
          }
        }}
      ></View>
      <Animated.ScrollView
        style={{
          backgroundColor: '#fff',
          zIndex: 10,
          width: '100%',
          position: 'absolute',
          maxHeight: _screen.height / 2,
          top,
        }}
        onLayout={(e) => {
          let _height = e.nativeEvent.layout.height
          setheight(_height)
        }}
      >
        <TagsContainer data={data} nowTag={''} />
        <View style={{ height: 35 }}>
          <Button
            mode="contained"
            onPress={() =>
              handleOpenUrl(props.getContentOriginUrl({ id: data.id }))
            }
          >
            origin
          </Button>
        </View>
      </Animated.ScrollView>
      <FAB
        key={`${like}-${index}`}
        icon={like ? 'heart' : 'heart-outline'}
        onPress={() => {
          console.log(`like!,${data.id}`)
          nowData.isLike = !nowData.isLike
          dispatch({ type: 'likes/img_toggle', id: data.id, data })
          setLike(!like)
        }}
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          zIndex: 12,
        }}
      />
    </View>
  )
}

const mapStateToProps = (state: StateBase) => {
  return {}
}

const mapDispatchToProps = {
  getMoreGalleyData,
  getContentOriginUrl,
}
let connector = connect(mapStateToProps, mapDispatchToProps)
export default connector(memo(Page_Viewer))
