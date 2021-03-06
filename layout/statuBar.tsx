import React, { FC, ReactElement } from 'react'
import { StatusBar, StyleProp, View, ViewStyle } from 'react-native'

type Props = {
  style?: Partial<StyleProp<ViewStyle>>
}
let StatuBarLayout: FC<Props> = ({ style, children }) => (
  <View style={{ flex: 1, ...style }}>{children}</View>
)
export default StatuBarLayout
