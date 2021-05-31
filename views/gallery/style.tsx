import { _style } from '@r/style'
import { _screen, _env } from '@r/utils/env'
import { StyleSheet } from 'react-native'

// 获取屏幕宽度
let width = _screen.width

export const ItemStyles = StyleSheet.create({
  itemContainer: {
    position: 'relative',
  },
  tooltipContainer: {
    position: 'absolute',
    bottom: 15,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    ..._style.wh('100%', 15),
  },
  btn_like: {
    ..._style.wh(10),
    tintColor: '#6cf',
  },
  img: {
    ..._style.wh(_env.NSFW ? width / 2 : 10),
    resizeMode: 'contain',
  },
  imgContainer: {
    ..._style.wh(width / 2),
    ..._style.center(),
    position: 'relative',
  },
})
