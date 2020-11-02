import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import request from './utils/reuqest'

export default function App() {
  let [dataList, setDataList] = useState([])

  useEffect(() => {
    request(
      'https://rule34.xxx/index.php?page=dapi&s=post&tags=dacad&q=index&json=1&limit=10'
    ).then((res) => {
      setDataList(res)
    })
  }, [])

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working oss hahahbbbssp!</Text>
      <Text>asdjkls</Text>
      {dataList.map((d) => (
        <View>
          <Text>{d.image}</Text>
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
})
