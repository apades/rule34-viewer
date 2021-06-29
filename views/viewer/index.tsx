import { getContentOriginUrl, getMoreGalleyData } from '@r/actions/ruleAction'
import { useDp } from '@r/hooks'
import ImageViewer from 'react-native-image-zoom-viewer/src/index'
import { IImageInfo } from 'react-native-image-zoom-viewer/src/image-viewer.type'
import { StateBase } from '@r/reducers'
import { _style } from '@r/style'
import { RootPageProps } from '@r/types/route'
import { _screen } from '@r/utils/env'
import { handleOpenUrl } from '@r/utils/utils'
import React, { FC, memo, useEffect, useRef, useState } from 'react'
import {
  DeviceEventEmitter,
  Image,
  NativeModules,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native'
import fs from 'react-native-fs'
import {
  ActivityIndicator,
  Button,
  Dialog,
  FAB,
  Portal,
} from 'react-native-paper'
import Animated, { Easing } from 'react-native-reanimated'
import Toast from 'react-native-toast-message'
import { connect, ConnectedProps } from 'react-redux'
import TagsContainer from '../detail/tagsContainer'
import { rData } from '../gallery'
export type ViewerProps = RootPageProps<'viewer'>
type rProps = ConnectedProps<typeof connector> & ViewerProps

let initTop = _screen.height
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
  let [imageUrls, setImageUrls] = useState<IImageInfo[]>([])
  let [isAnimating, setAnimating] = useState(false)
  let $item = nowData?.originData

  let [isSaveModalShow, setSaveModalShow] = useState(false)

  let generIImageInfoList = (list: rData[]) =>
    list.map((i) => {
      let isVideo = /\.(webm|mp4)$/.test(i.content)
      return {
        url: isVideo ? i.cover : i.content,
        props: {
          isVideo,
          cover: i.cover,
        },
      }
    })

  useEffect(() => {
    let list: IImageInfo[] = generIImageInfoList(_dataList)
    setImageUrls(list)
  }, [])

  useEffect(() => {
    let rdata = dataList[index]
    // console.log('rdata', rdata)
    setNowData(rdata)
    setLike(rdata?.isLike)
  }, [index, dataList])

  useEffect(() => {
    NativeModules.KeyEventLister.audioSwitch(true)
    let listener = DeviceEventEmitter.addListener('keydown', (e) => {
      if (e.keyCode === 24) {
        setindex((i) => (i === 0 ? 0 : --i))
      }
      if (e.keyCode === 25) {
        setindex((i) => ++i)
      }
    })
    return () => {
      listener.remove()
      NativeModules.KeyEventLister.audioSwitch(false)
    }
  }, [props.canVolume2TurnPage])

  let [mStartY, setmStartY] = useState(0)
  let [isCanSlidBottom, setCanSlidBottom] = useState(true)
  let top = useRef(new Animated.Value(initTop)).current
  let [height, setheight] = useState(0)

  async function loadMore() {
    console.log('loadMore')
    let resDataList: rData[] = await props.getMoreGalleyData({
      pageLimit: 20,
      pageNum: page + 1,
      searchString: nowTag,
    })
    setDataList((list) => [...list, ...resDataList])
    setImageUrls((l) => [...l, ...generIImageInfoList(resDataList)])
    setPage(page + 1)
  }

  useEffect(() => {
    if (index === dataList.length - 1) loadMore()
  }, [index])

  return (
    <View
      style={{
        position: 'relative',
        flex: 1,
      }}
    >
      <View
        style={{
          ..._style.wh('100%'),
          backgroundColor: '#000',
          position: 'absolute',
          top: 0,
          zIndex: 9,
          justifyContent: 'center',
        }}
      >
        {/* <ActivityIndicator animating={true} /> */}
      </View>
      <ImageViewer
        // TODO 这里出现了末尾时data正常，但是中间image加载异常，黑屏且没法滑动
        imageUrls={imageUrls}
        enablePreload={true}
        index={index}
        onChange={(i) =>
          setTimeout(() => {
            setindex(i)
          }, 0)
        }
        pageAnimateTime={100}
        useNativeDriver={true}
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
          setSaveModalShow(true)
        }}
        renderImage={(props) => {
          let { source, style } = props
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
        style={{
          zIndex: 10,
        }}
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
        {$item && (
          <>
            <TagsContainer data={$item} nowTag={''} />
            <View style={{ height: 35 }}>
              <Button
                mode="contained"
                onPress={() =>
                  props
                    .getContentOriginUrl({ id: $item.id, $item })
                    .then((url) => handleOpenUrl(url))
                }
              >
                origin
              </Button>
            </View>
          </>
        )}
      </Animated.ScrollView>

      <FAB
        key={`${like}-${index}`}
        icon={like ? 'heart' : 'heart-outline'}
        onPress={() => {
          console.log(`like!,${$item.id}`)
          nowData.isLike = !nowData.isLike
          dispatch({ type: 'likes/img_toggle', id: $item.id, data: $item })
          setLike(!like)
        }}
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          zIndex: 12,
        }}
      />

      <Portal>
        <Dialog
          visible={isSaveModalShow}
          onDismiss={() => setSaveModalShow(false)}
          style={{
            zIndex: 1000,
          }}
        >
          <Dialog.Content>
            <TouchableNativeFeedback
              onPress={() => {
                setSaveModalShow(false)
                let url = nowData.content
                let ext = url.match(/.*\.(.*?)$/)?.[1],
                  name = `${new Date().getTime()}.${ext}`
                fs.downloadFile({
                  fromUrl: url,
                  toFile: `${fs.ExternalStorageDirectoryPath}/Download/${name}`,
                })
                  .promise.then((e) => {
                    console.log('download e', e)
                    Toast.show({
                      type: 'success',
                      text1: `save as /Download/${name}`,
                    })
                  })
                  .catch((err) => {
                    console.error('download err', err)
                    Toast.show({
                      type: 'error',
                      text1: 'someError',
                    })
                  })
              }}
            >
              <Text>save</Text>
            </TouchableNativeFeedback>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  )
}

const mapStateToProps = (state: StateBase) => {
  let lastRouter = state.state.lastRouter
  return {
    canVolume2TurnPage: 'viewer' === lastRouter?.name,
  }
}

const mapDispatchToProps = {
  getMoreGalleyData,
  getContentOriginUrl,
}
let connector = connect(mapStateToProps, mapDispatchToProps)
export default connector(memo(Page_Viewer))
