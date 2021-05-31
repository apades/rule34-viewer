import { getMoreGalleyData } from '@r/actions/ruleAction'
import { useDp } from '@r/hooks'
import { StateBase } from '@r/reducers'
import { RootPageProps } from '@r/types/route'
import { _screen } from '@r/utils/env'
import { handleOpenUrl } from '@r/utils/utils'
import React, { FC, memo, useEffect, useRef, useState } from 'react'
import { Modal, View, Text } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import ImageViewer from 'react-native-image-zoom-viewer'
import { ActivityIndicator, Button, FAB } from 'react-native-paper'
import Animated from 'react-native-reanimated'
import { Easing } from 'react-native-reanimated'
import { connect, ConnectedProps } from 'react-redux'
import TagsContainer from '../detail/tagsContainer'
import { rData } from '../gallery'

export type ViewerProps = RootPageProps<'viewer'>
type rProps = ConnectedProps<typeof connector> & ViewerProps

let initHeight = (_screen.height / 100) * 90
let Page_Viewer: FC<rProps> = (props) => {
  let { navigation } = props
  let {
    index: InitIndex,
    dataList: _dataList,
    page: _page,
    nowTag,
  } = props.route.params
  let dispatch = useDp()

  const bottomAnim = useRef(new Animated.Value(-100)).current

  let [index, setindex] = useState(InitIndex)
  let [page, setPage] = useState(_page)
  let [dataList, setDataList] = useState(_dataList)
  let [like, setLike] = useState(false)
  let [nowData, setNowData] = useState<rData>(_dataList[InitIndex])
  let data = nowData?.originData

  useEffect(() => {
    let rdata = dataList[index]
    console.log('rdata', rdata)
    setNowData(rdata)
    setLike(rdata?.isLike)
  }, [index, dataList])

  let [mStartY, setmStartY] = useState(0)
  let [bottom, setbottom] = useState<number>(-100)
  let [height, setheight] = useState(0)

  let setInitBottom = (_height = height) => {
    let _bottom = (_height / 100) * 90 * -1
    console.log('setInitBottom', _bottom)
    setbottom(_bottom)

    Animated.timing(bottomAnim, {
      duration: 300,
      toValue: _bottom,
      easing: Easing.inOut(Easing.ease),
    }).start()
  }

  async function loadMore() {
    let resDataList = await props.getMoreGalleyData({
      pageLimit: 20,
      pageNum: page + 1,
      searchString: nowTag,
    })
    setDataList((list) => [...list, ...resDataList])
    setPage(page + 1)
  }
  let imageUrls = dataList.map((i) => ({ url: i.img }))

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
          setInitBottom()
        }}
        saveToLocalByLongPress={false}
        onLongPress={() => {
          console.log('onLongPress')
        }}
        loadingRender={() => <ActivityIndicator animating={true} />}
      />
      {/* mask 用来上滑拉出bottom */}
      <View
        style={{
          zIndex: bottom === 0 ? 9 : 11,
          backgroundColor: '#fff',
          width: '100%',
          height: 100,
          position: 'absolute',
          opacity: 0.1,
          bottom: 0,
        }}
        onTouchStart={(e) => {
          setmStartY(e.nativeEvent.pageY)
        }}
        onTouchMove={(e) => {
          let y = e.nativeEvent.pageY
          if (mStartY - y >= 30) {
            setbottom(0)
            Animated.timing(bottomAnim, {
              duration: 300,
              toValue: 0,
              easing: Easing.inOut(Easing.ease),
            }).start()
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
          bottom: bottomAnim,
        }}
        onLayout={(e) => {
          let _height = e.nativeEvent.layout.height
          if (height === _height || _height === 135) return
          setTimeout(() => {
            setInitBottom(_height)
            setheight(_height)
          }, 0)
        }}
      >
        <TagsContainer data={data} nowTag={''} />
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
  return {
    rule: state.setting.rule,
  }
}

const mapDispatchToProps = {
  getMoreGalleyData,
}
let connector = connect(mapStateToProps, mapDispatchToProps)
export default connector(memo(Page_Viewer))
