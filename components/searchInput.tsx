import { StateBase } from '@r/reducers'
import React, { FC, memo, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { TextInput } from 'react-native-paper'
import { connect, ConnectedProps } from 'react-redux'
import { _style } from '../style'

export type searchInputProps = {
  autoFocus: boolean
  onChangeText: (text: string) => void
  onSubmitEditing: (text: string) => void
  value: string
}
type rProps = ConnectedProps<typeof connector> & searchInputProps

let Comp_seachInput: FC<rProps> = (props) => {
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
        autoFocus={props.autoFocus}
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
}
const mapStateToProps = (state: StateBase) => {
  return {}
}
const mapDispatchToProps = {}
let connector = connect(mapStateToProps, mapDispatchToProps)
export default connector(memo(Comp_seachInput))
