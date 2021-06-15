import { useDp } from '@r/hooks'
import { StateBase } from '@r/reducers'
import { RootPageProps } from '@r/types/route'
import React, { FC, memo } from 'react'
import { Text, ToastAndroid, View } from 'react-native'
import { Button, Colors, Switch } from 'react-native-paper'
import { connect, ConnectedProps } from 'react-redux'
import StatuBarLayout from '../../layout/statuBar'

export type settingProps = RootPageProps<'setting'>
type rProps = ConnectedProps<typeof connector> & settingProps
let Page_Setting: FC<rProps> = (props) => {
  let { navigation, route } = props

  let dispatch = useDp()
  let { likes, setting } = props
  // let dir = fs.documentDirectory
  let dir = 'file:///storage/emulated/0/'
  // async function writeFile(filename: any, content: any) {
  //   let uri = `${dir}${filename}.txt`
  //   return fs
  //     .writeAsStringAsync(uri, content, {
  //       encoding: fs.EncodingType.UTF8,
  //     })
  //     .then(
  //       () =>
  //         ToastAndroid.showWithGravity(
  //           `导出成功 ${dir}`,
  //           ToastAndroid.LONG,
  //           ToastAndroid.BOTTOM,
  //         ),
  //       (rej) =>
  //         ToastAndroid.showWithGravity(
  //           `导出失败 ${rej}`,
  //           ToastAndroid.LONG,
  //           ToastAndroid.BOTTOM,
  //         ),
  //     )
  //     .catch((err) =>
  //       ToastAndroid.showWithGravity(
  //         `发生错误 ${err}`,
  //         ToastAndroid.LONG,
  //         ToastAndroid.BOTTOM,
  //       ),
  //     )
  // }
  // fs.readAsStringAsync(dir + 'tags.txt', {
  //   encoding: fs.EncodingType.UTF8,
  // }).then((res) => console.log(res))
  // fs.readDirectoryAsync('file:///storage/emulated/0').then((res) =>
  //   console.log(res),
  // )

  let clear = (key: any) => dispatch({ type: 'likes/clear', key })

  // console.log(setting)
  return (
    <StatuBarLayout>
      <>
        <View>
          <Text>dir:{dir}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text>tags</Text>
          <Button
            mode="contained"
            // onPress={() => writeFile('tags', JSON.stringify(likes.tags))}
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
            // onPress={() => writeFile('imgs', JSON.stringify(likes.imgs))}
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

        <View>
          <Text>debug mode</Text>
          <Switch
            onValueChange={() =>
              dispatch({ type: 'setting/set', debugMode: !setting.debugMode })
            }
            value={setting.debugMode}
          />
        </View>
      </>
    </StatuBarLayout>
  )
}
const mapStateToProps = (state: StateBase) => {
  return {
    likes: state.likes,
    setting: state.setting,
  }
}
const mapDispatchToProps = {}
let connector = connect(mapStateToProps, mapDispatchToProps)
export default connector(memo(Page_Setting))
