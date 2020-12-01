import { StyleSheet, ViewStyle } from 'react-native'

function generBlockType(type) {
  return function (str = '10') {
    let arr = str.split(' ').map((a) => +a)
    /** @type {ViewStyle} */
    var rs = {}
    switch (arr.length) {
      case 1:
        rs = {
          [type]: str,
        }
        break
      case 2:
        rs = {
          [`${type}Top`]: arr[0],
          [`${type}Bottom`]: arr[0],
          [`${type}Left`]: arr[1],
          [`${type}Right`]: arr[1],
        }
        break
      case 3:
        rs = {
          [`${type}Top`]: arr[0],
          [`${type}Right`]: arr[1],
          [`${type}Left`]: arr[1],
          [`${type}Bottom`]: arr[2],
        }
        break
      case 4:
        rs = {
          [`${type}Top`]: arr[0],
          [`${type}Right`]: arr[1],
          [`${type}Bottom`]: arr[2],
          [`${type}Left`]: arr[3],
        }
        break
      default:
        break
    }
    return rs
  }
}

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
    return generBlockType('margin')
  },
  padding(str = '10') {
    return generBlockType('padding')
  },
}
