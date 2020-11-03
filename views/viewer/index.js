import React, { useEffect, useState } from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ActivityIndicator, Colors } from 'react-native-paper'
import { imgList_o } from '../../api/list_o'
import { _style } from '../../style'
import { _env } from '../../utils/env'

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
  let [data, setData] = useState(dataType)

  // test
  useEffect(() => {
    imgList_o({ id: route.params?.id || 4193295 }).then((res) => {
      setData(res.dataList[0])
    })
  }, [route.params?.id])

  function renderTags(tagStr = '') {
    let arr = tagStr.split(' ')
    return arr.map((a) => (
      <TouchableOpacity>
        <View style={s_tag.tag}>
          <Text>{a}</Text>
        </View>
      </TouchableOpacity>
    ))
  }
  return (
    <View>
      <Text>{data.file_url}</Text>
      <View style={s_img.container}>
        {data.file_url ? (
          <Image style={s_img.img} source={{ uri: data.file_url }} />
        ) : (
          <ActivityIndicator animating={true} />
        )}
      </View>
      <View style={s_tag.container}>
        <Text>this is tag container</Text>
      </View>
    </View>
  )
}

const s_tag = StyleSheet.create({
  container: {},
  tag: {},
})

let width = Dimensions.get('window').width
const s_img = StyleSheet.create({
  container: {
    ..._style.wh(width),
    ..._style.center(),
    backgroundColor: '#6cf',
  },
  img: {
    ..._style.wh(_env.NSFW ? 10 : width),
    resizeMode: 'contain',
  },
})
