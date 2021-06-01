import { StateBase } from '@r/reducers'
import React, { FC, memo } from 'react'
import { View } from 'react-native'
import Draggable from 'react-native-draggable'
import { connect, ConnectedProps } from 'react-redux'

type rProps = ConnectedProps<typeof connector> & {
  [k: string]: any
}

const DebugInfo: FC<rProps> = (props) => {
  let { setting, x, y } = props

  return (
    setting.debugMode && (
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
    )
  )
}

const mapStateToProps = (state: StateBase) => {
  return {
    setting: state.setting,
  }
}
const mapDispatchToProps = {}

let connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(memo(DebugInfo))
