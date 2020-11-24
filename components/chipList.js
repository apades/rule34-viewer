import React from 'react'
import { View } from 'react-native'
import { Text, Chip } from 'react-native-paper'
import { _style } from '../style'

export default function ChipList(props) {
  let { dataList = [], onPress, chipStyle } = props
  return (
    <View
      style={{
        alignItems: 'baseline',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
        width: '100%',
      }}
    >
      {dataList.map((data) => (
        <View key={data} style={{ position: 'relative' }}>
          <Chip
            onPress={() => {
              onPress && onPress(data)
            }}
            style={{
              margin: 2,
              ...chipStyle,
            }}
          >
            <Text>{data}</Text>
          </Chip>
        </View>
      ))}
    </View>
  )
}
