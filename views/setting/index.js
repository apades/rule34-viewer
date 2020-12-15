import React from 'react'
import { StatusBar, Text, View } from 'react-native'
import { Button, Divider, Switch } from 'react-native-paper'
import { connect } from 'react-redux'
import statuBarLayout from '../../layout/statuBar'
import { _style } from '../../style'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as fs from 'expo-file-system'

let Setting = connect((state) => ({
  likes: state.likes,
  setting: state.setting,
  rule: state.setting.rule,
}))(function (props) {
  let { navigation, route } = props

  let { dispatch, likes, setting } = props
  // console.log(Object.keys(likes.imgs))
  // let [dir,setDir] = useState('')
  let dir = fs.documentDirectory
  // console.log(fs.documentDirectory)

  let clear = (key) => dispatch({ type: 'likes/clear', key })
  let changeLikes = () => {
    let imgs = { ...likes.imgs }
    let newImgs = {}
    clear('img')
    let keys = Object.keys(imgs)
    keys.forEach((key) => (newImgs[`rule34_${imgs[key].id}`] = imgs[key]))
    dispatch({ type: 'likes/init', imgs: newImgs, initStore: true })
  }

  // console.log(setting)
  return statuBarLayout({
    children() {
      return (
        <>
          <View>
            <Text>{dir}</Text>
          </View>
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

          {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Button mode="contained" onPress={() => changeLikes()}>
              fixLikes
            </Button>
          </View> */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>{props.rule.name}</Text>
            <Button
              mode="contained"
              onPress={() => {
                dispatch({
                  type: 'setting/setRule',
                  ruleName: props.rule.name === 'rule34' ? 'e621' : 'rule34',
                })
              }}
            >
              change
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
