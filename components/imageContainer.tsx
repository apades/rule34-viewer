import React, { FC, useEffect, useState } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import AutoHeightImage from 'react-native-auto-height-image'
import { ActivityIndicator, Text } from 'react-native-paper'
import { _style } from '../style'
import { _screen } from '../utils/env'

type Props = {
  width?: number
  source: number | { uri: string }
}
let ImageContainer: FC<Props> = (props) => {
  let [isLoading, setLoading] = useState(false)
  let [error, setError] = useState(false)

  let { source, width = _screen.width } = props
  let addHeight = 100
  let addElStyle: ViewStyle = {
    width: '100%',
    height: addHeight,
    ..._style.center(),
    position: 'absolute',
    top: 0,
    left: 0,
  }

  let [cStyle, setCstyle] = useState<ViewStyle>({
    position: 'relative',
  })
  useEffect(() => {
    if (isLoading) cStyle.height = addHeight
    else delete cStyle.height
    setCstyle({ ...cStyle })
  }, [isLoading])

  return (
    <View>
      <View style={cStyle}>
        <AutoHeightImage
          onError={() => {
            setError(true)
          }}
          onLoadEnd={() => {
            setLoading(false)
          }}
          onLoadStart={() => {
            setLoading(true)
          }}
          source={source}
          width={width}
        />
        <View style={addElStyle}>
          {isLoading && <ActivityIndicator animating={true} />}
          {error && <Text>error load</Text>}
        </View>
        {props.children}
      </View>
    </View>
  )
}

export default ImageContainer
