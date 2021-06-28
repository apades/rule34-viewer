import { StateBase } from '@r/reducers'
import React, { FC, memo, useState } from 'react'
import { View, ActivityIndicator } from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'
import { IImageInfo } from 'react-native-image-zoom-viewer/built/image-viewer.type'
import { ConnectedProps, connect } from 'react-redux'

export type ViewerProps = {
  //
}
type rProps = ConnectedProps<typeof connector> & ViewerProps
let Page_MangaViewer: FC = (props) => {
  let [imageUrls, setImageUrls] = useState<IImageInfo[]>([])
  let [index, setindex] = useState(0)

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
        enablePreload={true}
        key={imageUrls.length}
        index={index}
        onChange={(i) =>
          setTimeout(() => {
            setindex(i)
          }, 0)
        }
        pageAnimateTime={100}
        useNativeDriver={true}
        saveToLocalByLongPress={false}
        loadingRender={() => <ActivityIndicator animating={true} />}
        style={{
          zIndex: 10,
        }}
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
