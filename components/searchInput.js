import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { TextInput } from 'react-native-paper'
import { connect } from 'react-redux'
import { _style } from '../style'

export const Comp_seachInput = connect(
  (state) => ({}),
  (dispatch) => ({
    search: (text) => dispatch({ type: 'search/input', text }),
    close: () => dispatch({ type: 'search/toggle', searching: false }),
  }),
)(function (props) {
  let [text, setText] = useState('')

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

  let { search, close } = props
  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={(t) => setText(t)}
        onSubmitEditing={() => {
          console.log('seach', text)
          search(text)
          props.onSubmitEditing(text)
          // close()
        }}
        style={styles.input}
        value={text}
      />
    </View>
  )
})
