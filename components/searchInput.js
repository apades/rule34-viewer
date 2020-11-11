import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { IconButton, TextInput } from 'react-native-paper'
import { _style } from '../style'

export function Comp_seachInput({ tag, route, getLike, likesToggle }) {
  // let [like, setLike] = useState(getLike(item.id))
  let [text, setText] = useState('')
  let navigation = useNavigation()

  let cHeight = 40,
    cWidth = '100%'
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
      {/* <View style={_style.wh(cHeight)}>
        <IconButton icon={like ? 'heart' : 'heart-outline'} size={cHeight} />
      </View> */}
    </View>
  )
}
