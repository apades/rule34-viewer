import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import Draggable from 'react-native-draggable'

export default function DebugInfo(props) {
  return (
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
  )
}
