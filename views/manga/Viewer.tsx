import ImageViewer from '@r/components/ImageViewer'
import { simpleStyle } from '@r/package/react-native-image-viewer/src/image-viewer.style'
import getRuleResult from '@r/package/ruleParser'
import { StateBase } from '@r/reducers'
import { _style } from '@r/style'
import { RootPageProps } from '@r/types/route'
import React, { FC, memo, useEffect, useState } from 'react'
import { View } from 'react-native'
import { IImageInfo } from 'react-native-image-zoom-viewer/src/image-viewer.type'
import { Text } from 'react-native-paper'
import { connect, ConnectedProps } from 'react-redux'

export type ViewerProps = RootPageProps<'mangaViewer'>
type rProps = ConnectedProps<typeof connector> & ViewerProps
let Page_MangaViewer: FC<rProps> = (props) => {
  let { data } = props.route.params
  let [imageUrls, setImageUrls] = useState<IImageInfo[]>([])
  let [viewIndex, setViewIndex] = useState(0)
  let [loadIndex, setloadIndex] = useState(0)
  let [isLoadEnd, setLoadEnd] = useState(false)
  let [imageLen, setimageLen] = useState(0)
  console.log('data', data)

  let loadImg = ($index: number) => {
    if (isLoadEnd) return
    return getRuleResult('content.getImg', {
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
      return data
    })
  }
  let loadAll = (index = 0) =>
    loadImg(index++).then((res) => {
      if (!res.isEnd) loadAll(index)
    })
  useEffect(() => {
    loadImg(loadIndex)
    getRuleResult('content.getLen', { $item: data }).then((len) => {
      setimageLen(len)
      // ! 不能动态改变url
      // setImageUrls((imgs) => {
      //   let newImgs = [...imgs]
      //   while (len) {
      //     let nlen = --len
      //     newImgs[nlen] = newImgs[nlen] ?? ({ url: '' } as IImageInfo)
      //   }
      //   return newImgs
      // })
    })
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
      <View
        style={{
          ..._style.wh('100%'),
          backgroundColor: '#000',
          position: 'absolute',
          top: 0,
          zIndex: 9,
          justifyContent: 'center',
        }}
      />
      <ImageViewer
        // TODO 这里出现了末尾时data正常，但是中间image加载异常，黑屏且没法滑动
        imageUrls={imageUrls}
        index={viewIndex}
        onChange={(i) =>
          setTimeout(() => {
            setViewIndex(i)
          }, 0)
        }
        renderIndicator={(c, a) => (
          <View style={{ ...simpleStyle.count, flexWrap: 'nowrap' }}>
            <Text style={simpleStyle.countText}>{`${c}/${imageLen}${
              props.debugMode ? `|${a}` : ''
            }`}</Text>
          </View>
        )}
      />
    </View>
  )
}

const mapStateToProps = (state: StateBase) => {
  return {
    debugMode: state.setting.debugMode,
  }
}
const mapDispatchToProps = {}
let connector = connect(mapStateToProps, mapDispatchToProps)
export default connector(memo(Page_MangaViewer))
