import React from 'react'
import { View } from 'react-native'
import Draggable from 'react-native-draggable'
import { connect } from 'react-redux'

const DebugInfo = connect((state) => ({
  setting: state.setting,
}))(function (props) {
  let { setting, x, y } = props

  return setting.debugMode ? (
    <Draggable x={x ?? 0} y={y ?? 85}>
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
