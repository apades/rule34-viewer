import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import Draggable from 'react-native-draggable'
import { connect } from 'react-redux'

const DebugInfo = connect((state) => ({
  setting: state.setting,
}))(function (props) {
  let { setting } = props

  return setting.debugMode ? (
    <Draggable x={0} y={85}>
      <View
        style={{
          backgroundColor: '#666',
          padding: 5,
        }}
      >
        {props.children}
      </View>
    </Draggable>
  ) : (
    <></>
  )
})

export default DebugInfo
