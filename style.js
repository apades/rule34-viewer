import { StyleSheet, ViewStyle } from 'react-native'

export const _style = {
  wh(width, height = width) {
    /** @type {ViewStyle} */
    var rs = {
      width,
      height,
    }
    return rs
  },
  border(borderWidth = 1, borderColor = '#000', borderStyle = 'solid') {
    /** @type {ViewStyle} */
    var rs = {
      borderWidth,
      borderColor,
      borderStyle,
    }
    return rs
  },
  center() {
    /** @type {ViewStyle} */
    var rs = {
      justifyContent: 'center',
      alignItems: 'center',
    }
    return rs
  },
}
