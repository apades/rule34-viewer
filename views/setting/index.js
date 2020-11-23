import React from 'react'
import { StatusBar, Text, View } from 'react-native'
import { Button, Divider } from 'react-native-paper'
import { connect } from 'react-redux'
import { _style } from '../../style'

let Setting = connect(
  (state) => ({ likes: state.likes }),
  (dispatch) => ({
    clear: (key) => dispatch({ type: 'likes/clear', key }),
  }),
)(function (props) {
  let { navigation, route } = props

  let { likes, clear } = props
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{ height: StatusBar.currentHeight, backgroundColor: '#fff' }}
      ></View>
      <View>
        <Text>clear</Text>
      </View>
      <Divider />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Button mode="contained" onPress={() => clear('tags')}>
          tags
        </Button>
        <Text>length:{Object.keys(likes.tags).length}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Button mode="contained" onPress={() => clear('imgs')}>
          imgs
        </Button>
        <Text>length:{Object.keys(likes.imgs).length}</Text>
      </View>
    </View>
  )
})
export default Setting
