import React from 'react'
import { StatusBar, Text, View } from 'react-native'
import { Button, Divider, Switch } from 'react-native-paper'
import { connect } from 'react-redux'
import statuBarLayout from '../../layout/statuBar'
import { _style } from '../../style'

let Setting = connect((state) => ({
  likes: state.likes,
  setting: state.setting,
}))(function (props) {
  let { navigation, route } = props

  let { dispatch, likes, setting } = props
  console.log(Object.keys(likes.imgs))
  let clear = (key) => dispatch({ type: 'likes/clear', key })
  let changeLikes = () => {
    let imgs = { ...likes.imgs }
    let newImgs = {}
    clear('img')
    let keys = Object.keys(imgs)
    keys.forEach((key) => (newImgs[`rule34_${imgs[key].id}`] = imgs[key]))
    dispatch({ type: 'likes/init', imgs: newImgs, initStore: true })
  }

  console.log(setting)
  return statuBarLayout({
    children() {
      return (
        <>
          <View>
            <Text>clear</Text>
            <Divider />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Button mode="contained" onPress={() => clear('tag')}>
              tags
            </Button>
            <Text>length:{Object.keys(likes.tags).length}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Button mode="contained" onPress={() => clear('img')}>
              imgs
            </Button>
            <Text>length:{Object.keys(likes.imgs).length}</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Button mode="contained" onPress={() => changeLikes()}>
              fixLikes
            </Button>
          </View>

          <View>
            <Text>debug mode</Text>
            <Switch
              onValueChange={() => dispatch({ type: 'setting/debugMode' })}
              value={setting.debugMode}
            />
          </View>
        </>
      )
    },
  })
})
export default Setting
