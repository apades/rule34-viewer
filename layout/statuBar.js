import React from 'react'
import { StatusBar, View } from 'react-native'

export default function statuBarLayout({ style, children }) {
  return (
    <View style={{ flex: 1, ...style }}>
      <View
        style={{ height: StatusBar.currentHeight, backgroundColor: '#fff' }}
      ></View>
      {children()}
    </View>
  )
}
// export default class statuBarLayout extends React.Component {
//   render() {
//     return (
//       <View style={{ flex: 1, ...this.props.style }}>
//         <View
//           style={{ height: StatusBar.currentHeight, backgroundColor: '#fff' }}
//         ></View>
//         {this.props.children}
//       </View>
//     )
//   }
// }
