import { useDp } from '@r/hooks'
import { StateBase } from '@r/reducers'
import { _screen } from '@r/utils/env'
import { handleOpenUrl } from '@r/utils/utils'
import React, { FC, memo, useEffect, useRef, useState } from 'react'
import { GestureResponderEvent, Modal, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import ImageViewer from 'react-native-image-zoom-viewer'
import { ActivityIndicator, Button, FAB } from 'react-native-paper'
import { connect, ConnectedProps } from 'react-redux'
import TagsContainer from '../detail/tagsContainer'

export type ViewerProps = {
  images: string[]
  datas: any[]
  index: number
  nowTag: string
  visible: boolean
  setVisible: (v: boolean) => void
  loadMore?: () => void
}
type rProps = ConnectedProps<typeof connector> & ViewerProps

let initHeight = (_screen.height / 100) * 90
let Page_Viewer: FC<rProps> = (props) => {
  let dispatch = useDp()

  let [index, setindex] = useState(props.index)
  let [like, setLike] = useState(false)
  let [rData, setrData] = useState<any>()
  let data = rData?.data

  useEffect(() => {
    setindex(props.index)
  }, [props.index])

  useEffect(() => {
    console.log('data', rData)
    let rdata = props.datas[index]
    setrData(rdata)
    setLike(rdata?.isLike)
  }, [index])

  let [mStartY, setmStartY] = useState(0)
  let [top, settop] = useState<string | undefined | number>(initHeight)
  let [bottom, setbottom] = useState<string | undefined | number>(undefined)

  return (
    <Modal
      visible={props.visible}
      onRequestClose={() => props.setVisible(false)}
      style={{
        position: 'relative',
      }}
    >
      <ImageViewer
        imageUrls={props.images.map((i) => ({ url: i }))}
        index={index}
        onChange={(i) => {
          setindex(i)
          if (i === props.images.length - 1) props.loadMore?.()
        }}
        onClick={() => {
          setbottom(undefined)
          settop(initHeight)
        }}
        loadingRender={() => <ActivityIndicator animating={true} />}
      />
      <View
        style={{
          zIndex: top === undefined ? 9 : 11,
          backgroundColor: '#fff',
          width: '100%',
          height: 100,
          position: 'absolute',
          top: initHeight,
          opacity: 0,
        }}
        onTouchStart={(e) => {
          setmStartY(e.nativeEvent.pageY)
        }}
        onTouchMove={(e) => {
          let y = e.nativeEvent.pageY
          if (mStartY - y >= 30) {
            settop(undefined)
            setbottom(0)
          }
        }}
      ></View>
      {data && (
        <>
          <ScrollView
            style={{
              backgroundColor: '#fff',
              zIndex: 10,
              width: '100%',
              position: 'absolute',
              maxHeight: _screen.height / 2,
              top,
              bottom,
            }}
            key={index}
          >
            <TagsContainer data={data} id={data.id} nowTag={props.nowTag} />
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
          </ScrollView>
          <FAB
            key={`${like}-${index}`}
            icon={like ? 'heart' : 'heart-outline'}
            onPress={() => {
              console.log(`like!,${data.id}`)
              rData.isLike = !rData.isLike
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
        </>
      )}
    </Modal>
  )
}

const mapStateToProps = (state: StateBase) => {
  return {
    rule: state.setting.rule,
  }
}
const mapDispatchToProps = {}
let connector = connect(mapStateToProps, mapDispatchToProps)
export default connector(memo(Page_Viewer))
