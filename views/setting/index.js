import * as fs from 'expo-file-system'
import React from 'react'
import { Text, ToastAndroid, View } from 'react-native'
import { Button, Colors, Switch } from 'react-native-paper'
import { connect } from 'react-redux'
import statuBarLayout from '../../layout/statuBar'

let Setting = connect((state) => ({
  likes: state.likes,
  setting: state.setting,
  rule: state.setting.rule,
}))(function (props) {
  let { navigation, route } = props

  let { dispatch, likes, setting } = props
  // let dir = fs.documentDirectory
  let dir = 'file:///storage/emulated/0/'
  async function writeFile(filename, content) {
    let uri = `${dir}${filename}.txt`
    return fs
      .writeAsStringAsync(uri, content, {
        encoding: fs.EncodingType.UTF8,
      })
      .then(
        () =>
          ToastAndroid.showWithGravity(
            `导出成功 ${dir}`,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
          ),
        (rej) =>
          ToastAndroid.showWithGravity(
            `导出失败 ${rej}`,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
          ),
      )
      .catch((err) =>
        ToastAndroid.showWithGravity(
          `发生错误 ${err}`,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        ),
      )
  }
  // fs.readAsStringAsync(dir + 'tags.txt', {
  //   encoding: fs.EncodingType.UTF8,
  // }).then((res) => console.log(res))
  // fs.readDirectoryAsync('file:///storage/emulated/0').then((res) =>
  //   console.log(res),
  // )

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
            <Text>dir:{dir}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>tags</Text>
            <Button
              mode="contained"
              onPress={() => writeFile('tags', JSON.stringify(likes.tags))}
            >
              export
            </Button>
            <Button
              color={Colors.red600}
              mode="contained"
              onPress={() => clear('tag')}
            >
              clear
            </Button>
            <Text>length:{Object.keys(likes.tags).length}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text>imgs</Text>
            <Button
              mode="contained"
              onPress={() => writeFile('imgs', JSON.stringify(likes.imgs))}
            >
              export
            </Button>
            <Button
              color={Colors.red600}
              mode="contained"
              onPress={() => clear('img')}
            >
              clear
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
