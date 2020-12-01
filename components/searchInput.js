import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { TextInput } from 'react-native-paper'
import { connect } from 'react-redux'
import { _style } from '../style'

export const Comp_seachInput = connect((state) => ({}))(function (props) {
  let [text, setText] = useState(props.value)
  useEffect(() => {
    setText(props.value)
  }, [props.value])

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
        onChangeText={(text) => {
          setText(text)
          props.onChangeText(text)
        }}
        onSubmitEditing={() => {
          console.log('seach', text)
          props.onSubmitEditing(text)
        }}
        style={styles.input}
        value={text}
      />
    </View>
  )
})
