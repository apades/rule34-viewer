import { StyleSheet, ViewStyle } from 'react-native'

export const _style = {
  dec(top = 0, left = top) {
    return {
      position: 'absolute',
      top,
      left,
      backgroundColor: '#666',
      color: 'red',
      zIndex: 100000000,
    }
  },
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
  margin(str = '10') {
    let arr = str.split(' ').map((a) => +a)
    /** @type {ViewStyle} */
    var rs = {}
    switch (arr.length) {
      case 1:
        rs = {
          margin: str,
        }
        break
      case 2:
        rs = {
          marginTop: arr[0],
          marginBottom: arr[0],
          marginLeft: arr[1],
          marginRight: arr[1],
        }
        break
      case 3:
        rs = {
          marginTop: arr[0],
          marginLeft: arr[1],
          marginRight: arr[1],
          marginBottom: arr[2],
        }
        break
      case 4:
        rs = {
          marginTop: arr[0],
          marginRight: arr[1],
          marginBottom: arr[2],
          marginLeft: arr[3],
        }
        break
      default:
        break
    }
    return rs
  },
}
