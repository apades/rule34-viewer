import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { _env } from '../../utils/env'

let collects = ['dacad', 'km-15']

console.log(_env)
export function view_collections({ navigation, route }) {
  // let [stor, setStor] = useState('')
  // useEffect(() => {
  //   async function main() {
  //     let data = await AsyncStorage.getItem('test')
  //     console.log('test stor', data)
  //     if (!data) AsyncStorage.setItem('test', 'i have test')
  //   }
  //   main()
  // })
  return (
    <View style={{ flex: 1 }}>
      {collects.map((c) => (
        <TouchableOpacity
          key={c}
          onPress={() => navigation.push('gallery', { tags: c })}
          style={styles.container}
        >
          <Text style={styles.text}>{c}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

var styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#6cf',
  },
  text: {
    // fontSize: 30,
    textAlign: 'center',
  },
})
