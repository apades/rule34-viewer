import React, { useEffect, useState } from 'react'
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ActivityIndicator, Button, Text, Colors } from 'react-native-paper'
import { imgList_o } from '../../api/list_o'
import { _style } from '../../style'
import { _env, _screen } from '../../utils/env'
import testDataList from '../../test/list'
import ImageViewer from 'react-native-image-zoom-viewer'
import { connect } from 'react-redux'

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
  source: '',
  has_notes: 'false',
  has_comments: 'true',
  preview_width: '150',
  preview_height: '106',
}

function dom(props) {
  let { navigation, route } = props
  let index = route.params?.index

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
        {/* <RenderTagContainer tagStr={testDataList.dataList[index].tags} /> */}
      </View>
    )
  }

  let [showInfo, setShowInfo] = useState(false)
  let [visible, setVisible] = useState(true)
  let { dataList, count, pid } = props
  let imageUrls = dataList.map((d) => ({ url: d.file_url }))
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
          imageUrls={imageUrls}
          index={index}
          loadingRender={() => <ActivityIndicator animating={true} />}
          onChange={(index) => {
            console.log('changing')
          }}
          onClick={() => {
            setShowInfo(!showInfo)
          }}
          onSwipeDown={() => {
            console.log('onSwipeDown')
          }}
          renderHeader={() => (
            <View>
              <Text
                style={{ color: 'red' }}
              >{`pid:${pid} length:${dataList.length}`}</Text>
            </View>
          )}
          renderIndicator={(index) => (
            <View style={{ position: 'absolute', top: 10, left: 10 }}>
              <Text style={{ color: '#6cf' }}>{`${index}/${count}`}</Text>
            </View>
          )}
          style={{ zIndex: 5 }}
        />
        {showInfo ? <RenderInfo /> : <></>}
      </Modal>
    </View>
  )
}

export const view_viewer = connect((state) => ({
  dataList: state.imgList.dataList,
  count: state.imgList.count,
  pid: state.imgList.pid,
}))(dom)
