import React, { FC, ReactElement } from 'react'
import { View, ViewStyle } from 'react-native'
import { Chip, Text } from 'react-native-paper'

export type ChipListDataType =
  | string
  | {
      label: string
      ChipProps?: typeof Chip
      [k: string]: any
    }
type Props = {
  dataList: ChipListDataType[]
  onPress?: (data: ChipListDataType, index: number) => void
  chipStyle?: ViewStyle
  onLongPress?: (data: ChipListDataType) => void
  renderItem?: (data: ChipListDataType, index: number) => ReactElement
  renderChild?: (data: ChipListDataType, index: number) => ReactElement
}

const ChipList: FC<Props> = (props) => {
  let {
    dataList = [],
    onPress = () => 1,
    chipStyle = {},
    onLongPress = () => 1,
    renderItem,
    renderChild,
  } = props
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
          <View key={`${label}`} style={{ position: 'relative' }}>
            {renderItem ? (
              renderItem(data, index)
            ) : (
              <Chip
                style={{
                  margin: 2,
                  ...chipStyle,
                }}
                {...ChipProps}
                onPress={() => {
                  console.log('press', data, index)
                  onPress(data, index)
                }}
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
export default ChipList
