import React, { FC, useState } from 'react'
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
  function RenderLoading() {
    let [loading, setLoading] = useState(false)
    let [error, setError] = useState(false)

    let { source, width = _screen.width } = props
    let el = (
      <AutoHeightImage
        onError={() => {
          // console.log('load err')
          setError(true)
        }}
        onLoadEnd={() => {
          // console.log('load end')
          setLoading(false)
        }}
        onLoadStart={() => {
          // console.log('load start')
          setLoading(true)
        }}
        source={source}
        width={width}
      />
    )

    let addHeight = 100
    let addElStyle: StyleProp<ViewStyle> = {
      width: '100%',
      height: addHeight,
      ..._style.center(),
      position: 'absolute',
      top: 0,
      left: 0,
    }
    let addEl
    if (loading) {
      addEl = (
        <View style={addElStyle}>
          <ActivityIndicator animating={true} />
        </View>
      )
    } else if (error) {
      addEl = (
        <View style={addElStyle}>
          <Text>error load</Text>
        </View>
      )
    }

    let cStyle: StyleProp<ViewStyle> = { position: 'relative' }
    if (loading) cStyle.height = addHeight
    else delete cStyle.height
    return (
      <View style={cStyle}>
        {el}
        {addEl}
        {props.children}
      </View>
    )
  }

  return <View>{RenderLoading()}</View>
}

export default ImageContainer
