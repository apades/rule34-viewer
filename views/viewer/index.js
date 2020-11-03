import React, { useEffect, useState } from 'react'
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ActivityIndicator, Button, Colors } from 'react-native-paper'
import { imgList_o } from '../../api/list_o'
import { _style } from '../../style'
import { _env, _screen } from '../../utils/env'
import testDataList from '../../test/list'
import ImageViewer from 'react-native-image-zoom-viewer'

let dataType = {
  height: '566',
  score: '42',
  file_url: '',
  parent_id: '',
  sample_url: '',
  sample_width: '800',
  sample_height: '566',
  preview_url: '',
  rating: 'e',
  tags: '',
  id: '4193295',
  width: '800',
  change: '1604034703',
  md5: '',
  creator_id: '48613',
  has_children: 'false',
  created_at: 'Fri Oct 30 05:11:42 +0000 2020',
  status: 'active',
  source:
    'https://www.furaffinity.net/view/38933638/ https://d.facdn.net/art/dacad/1604011307/1604011301.dacad_digby_-_isa_longer_.gif https://www.furaffinity.net/user/dacad/',
  has_notes: 'false',
  has_comments: 'true',
  preview_width: '150',
  preview_height: '106',
}

export function view_viewer({ navigation, route }) {
  // let [data, setData] = useState(dataType)

  // // test
  // useEffect(() => {
  //   imgList_o({ id: route.params?.id || 4193295 }).then((res) => {
  //     setData(res.dataList[0])
  //   })
  // }, [route.params?.id])
  let [index, setIndex] = useState(0)
  let dataList = testDataList.dataList.map((d) => ({ url: d.file_url }))

  function RenderTagContainer({ tagStr = '' }) {
    let arr = tagStr.split(' ')
    const style = StyleSheet.create({
      container: {
        flexDirection: 'row',
      },
      tag: {
        ..._style.margin('0 10'),
        // marginRight: 10,
      },
      text: {
        fontSize: 20,
        color: 'blue',
      },
    })

    return (
      <View style={style.container}>
        {arr.map((a, i) => (
          <TouchableWithoutFeedback
            key={i}
            onPress={() => console.log(`go to tags:${a}`)}
            style={{ backgroundColor: '#6667' }}
          >
            <View style={style.tag}>
              <Text style={style.text}>{a}</Text>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>
    )
  }

  function RenderInfo() {
    let infoHeight = _screen.height / 2
    let style = StyleSheet.create({
      container: {
        position: 'absolute',
        bottom: 0,
        ..._style.wh('100%', infoHeight),
        backgroundColor: '#6667',
        zIndex: 10,
      },
    })
    return (
      <View style={style.container}>
        <Text style={{ color: 'red' }}>now in {index}</Text>
        <RenderTagContainer tagStr={testDataList.dataList[index].tags} />
      </View>
    )
  }

  let [showInfo, setShowInfo] = useState(false)
  let [visible, setVisible] = useState(true)
  return (
    <View style={{ position: 'relative' }}>
      <Modal
        onRequestClose={() => {
          setVisible(false)
          navigation.goBack()
        }}
        transparent={true}
        visible={visible}
      >
        <ImageViewer
          imageUrls={dataList}
          index={0}
          onChange={(index) => setIndex(index)}
          onClick={() => {
            setShowInfo(!showInfo)
          }}
          onSwipeDown={() => {
            console.log('onSwipeDown')
          }}
          // onMove={(data) => console.log(data)}
          style={{ zIndex: 5 }}
        />
        {/* <View
          style={{ zIndex: showInfo ? 10 : -10, opacity: showInfo ? 1 : 0 }}
        > */}
        {showInfo ? <RenderInfo /> : <></>}
        {/* </View> */}
      </Modal>
    </View>
  )
  // return (
  //   <View>
  //     <Text>{data.file_url}</Text>
  //     <View style={s_img.container}>
  //       {data.file_url ? (
  //         <Image source={{ uri: data.file_url }} style={s_img.img} />
  //       ) : (
  //         <ActivityIndicator animating={true} />
  //       )}
  //     </View>
  //     <View style={s_tag.container}>
  //       <Text>this is tag container</Text>
  //     </View>
  //   </View>
  // )
}

let width = Dimensions.get('window').width
const s_img = StyleSheet.create({
  container: {
    ..._style.wh(width),
    ..._style.center(),
    backgroundColor: '#6cf',
  },
  img: {
    ..._style.wh(_env.NSFW ? width : 10),
    resizeMode: 'contain',
  },
})
