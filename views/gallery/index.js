import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { imgList_o } from '../../api/list_o'
import { _style } from '../../style'

export function view_gallery({ navigation, route }) {
  let [dataList, setDataList] = useState([])

  useEffect(() => {
    imgList_o({ tags: route.params?.tags || 'dacad', limit: 10 }).then(
      (res) => {
        setDataList(res.dataList)
      }
    )
  }, [route.params?.tags])

  function isLast(i) {
    /** @type {ViewStyle} */
    let s = {
      //   flexShrink
    }
    return i + 1 === dataList.length ? s : {}
  }

  return (
    <>
      <View style={styles.container}>
        {dataList.map((d, i) => (
          <TouchableOpacity
            key={d.id}
            onPress={() => navigation.push('viewer', { id: d.id })}
          >
            <View style={{ ...styles.imgContainer, ...isLast(i) }}>
              <Image style={styles.img} source={{ uri: d.preview_url }}></Image>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <Text>{dataList.length}</Text>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  img: {
    ..._style.wh(10),
  },
  imgContainer: {
    ..._style.wh(50, 50),
    ..._style.border(),
    ..._style.center(),
  },
})
