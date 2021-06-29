import { StateBase } from '@r/reducers'
import React, { FC, memo, useState } from 'react'
import { View } from 'react-native'
import {
  ActivityIndicator,
  Button,
  Dialog,
  FAB,
  Portal,
  Text,
} from 'react-native-paper'
import ImageViewer from 'react-native-image-zoom-viewer/src/index'
import { IImageInfo } from 'react-native-image-zoom-viewer/src/image-viewer.type'
import { ConnectedProps, connect } from 'react-redux'
import { useEffect } from 'react'
import getRuleResult from '@r/package/ruleParser'
import { RootPageProps } from '@r/types/route'
import { Image } from 'react-native'
import { simpleStyle } from '@r/package/react-native-image-viewer/src/image-viewer.style'

export type ViewerProps = RootPageProps<'mangaViewer'>
type rProps = ConnectedProps<typeof connector> & ViewerProps
let Page_MangaViewer: FC<rProps> = (props) => {
  let { data } = props.route.params
  let [imageUrls, setImageUrls] = useState<IImageInfo[]>([])
  let [viewIndex, setViewIndex] = useState(0)
  let [loadIndex, setloadIndex] = useState(0)
  let [isLoadEnd, setLoadEnd] = useState(false)
  console.log('data', data)

  let loadImg = ($index: number) => {
    if (isLoadEnd) return
    getRuleResult('content.getImg', {
      $item: data,
      $index,
    }).then((data) => {
      console.log(data)
      setImageUrls((imgs) => {
        let newImgs = [...imgs]
        newImgs[$index] = newImgs[$index] ?? ({ url: '' } as IImageInfo)
        newImgs[$index].url = data.img
        if (data.isEnd) setLoadEnd(true)
        return newImgs
      })
    })
  }
  useEffect(() => {
    loadImg(0)
  }, [])

  useEffect(() => {
    if (viewIndex + 1 === imageUrls.length) {
      loadImg(++loadIndex)
      setloadIndex((i) => ++i)
    }
  }, [viewIndex, imageUrls.length])

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
        // enablePreload={true}
        index={viewIndex}
        onChange={(i) =>
          setTimeout(() => {
            setViewIndex(i)
          }, 0)
        }
        pageAnimateTime={100}
        useNativeDriver={true}
        saveToLocalByLongPress={false}
        loadingRender={() => <ActivityIndicator animating={true} />}
        style={{
          zIndex: 10,
        }}
        renderIndicator={(c, a) => (
          <View style={{ ...simpleStyle.count, flexWrap: 'nowrap' }}>
            <Text style={simpleStyle.countText}>{`${c}/${a}`}</Text>
            {isLoadEnd && (
              <Text style={{ ...simpleStyle.countText }}>load end</Text>
            )}
          </View>
        )}
      />
    </View>
  )
}

const mapStateToProps = (state: StateBase) => {
  return {}
}
const mapDispatchToProps = {}
let connector = connect(mapStateToProps, mapDispatchToProps)
export default connector(memo(Page_MangaViewer))
