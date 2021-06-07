import React, { FC, ReactElement, useState } from 'react'
import {
  StyleProp,
  TouchableNativeFeedback,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native'

type Props = {
  overlay: ReactElement
} /* & ViewProps */

let Dropdown: FC<Props> = (props) => {
  let [isOverlayShow, setOverlayShow] = useState(false)
  let { overlay, ..._props } = props

  return (
    <TouchableNativeFeedback
      onPressIn={() => setOverlayShow(true)}
      onPressOut={() => setOverlayShow(false)}
    >
      <View
        style={{
          position: 'relative',
        }}
      >
        {props.children}
        {isOverlayShow && (
          <View
            style={{
              position: 'absolute',
              bottom: '100%',
            }}
          >
            {overlay}
          </View>
        )}
      </View>
    </TouchableNativeFeedback>
  )
}

export default Dropdown
