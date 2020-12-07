import React from 'react'
import { View } from 'react-native'
import { Text, Chip } from 'react-native-paper'
import { _style } from '../style'

export default function ChipList({
  dataList = [],
  onPress = () => {},
  chipStyle,
  onLongPress = () => {},
  renderItem,
  renderChild,
}) {
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
      {dataList.map((data, index) => {
        let label
        let ChipProps = {}
        if (typeof data === 'string') label = data
        else {
          label = data.label
          ChipProps = data.ChipProps
        }
        return (
          <View key={`${label}-${index}`} style={{ position: 'relative' }}>
            {renderItem ? (
              renderItem(data, index)
            ) : (
              <Chip
                onPress={() => {
                  onPress(data)
                }}
                style={{
                  margin: 2,
                  ...chipStyle,
                }}
                {...ChipProps}
                onLongPress={() => [onLongPress(data)]}
              >
                <Text>{label}</Text>
              </Chip>
            )}
            {renderChild ? renderChild(data, index) : <></>}
          </View>
        )
      })}
    </View>
  )
}
