import React, { FC } from 'react'
import { Props } from 'react-native-image-zoom-viewer/src/image-viewer.type'
import _ImageViewer from 'react-native-image-zoom-viewer/src/index'
import { ActivityIndicator } from 'react-native-paper'
let ImageViewer: FC<Props> = (props) => {
  return (
    <_ImageViewer
      pageAnimateTime={100}
      useNativeDriver={true}
      saveToLocalByLongPress={false}
      loadingRender={() => <ActivityIndicator animating={true} />}
      style={{
        zIndex: 10,
      }}
      {...props}
    />
  )
}

export default ImageViewer
