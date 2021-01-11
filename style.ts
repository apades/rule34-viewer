import { StyleSheet, ViewStyle } from 'react-native'

function generBlockType(type: 'margin' | 'padding') {
  return function (str = '10'): ViewStyle {
    let arr = str.split(' ').map((a) => +a)
    /** @type {ViewStyle} */
    let rs = {}
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
  wh(width: number | string, height = width): ViewStyle {
    return {
      width,
      height,
    }
  },
  border(
    borderWidth = 1,
    borderColor = '#000',
    borderStyle: 'solid' | 'dotted' | 'dashed' = 'solid',
  ): ViewStyle {
    return {
      borderWidth,
      borderColor,
      borderStyle,
    }
  },
  center(): ViewStyle {
    return {
      justifyContent: 'center',
      alignItems: 'center',
    }
  },
  margin(str = '10'): ViewStyle {
    return generBlockType('margin')(str)
  },
  padding(str = '10'): ViewStyle {
    return generBlockType('padding')(str)
  },
}
