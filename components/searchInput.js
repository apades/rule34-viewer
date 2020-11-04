import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { TextInput } from 'react-native-paper'
import { _style } from '../style'

export function Comp_seachInput({ navigation, route }) {
  let [text, setText] = useState('')
  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={(t) => setText(t)}
        onSubmitEditing={() => {
          console.log('seach', text)
          navigation.push('gallery', { tags: text })
        }}
        style={styles.input}
        value={text}
      />
    </View>
  )
}

let cHeight = 40,
  cWidth = '70%'
const styles = StyleSheet.create({
  container: {
    ..._style.wh(cWidth, cHeight),
    backgroundColor: '#ccc',
    borderRadius: 20,
    overflow: 'hidden',
  },
  input: {
    height: cHeight,
  },
})
