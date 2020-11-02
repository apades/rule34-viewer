import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { generRandomId } from '../utils/utils'
import imgList_o from './api/list_o'

export default function App() {
  let [dataList, setDataList] = useState([])

  useEffect(() => {
    imgList_o({ tags: 'dacad', limit: 10 }).then((res) => {
      setDataList(res.dataList)
    })
  }, [])

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working oss change!</Text>
      {dataList.map((d) => (
        <View key={d.id}>
          {/* <Text>{d.preview_url}</Text> */}
          <Image
            style={styles.tinyLogo}
            source={{ uri: d.preview_url }}
          ></Image>
        </View>
      ))}
      <Text>{dataList.length}</Text>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tinyLogo: {
    width: 10,
    height: 10,
  },
})
