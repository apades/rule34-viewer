import React, { FC, ReactElement } from 'react'
import { View, ViewStyle } from 'react-native'
import { Chip, Text } from 'react-native-paper'

type DataType =
  | string
  | {
      label: string
      ChipProps?: typeof Chip
      [k: string]: any
    }
type Props = {
  dataList: DataType[]
  onPress?: (data: DataType, index: number) => void
  chipStyle?: ViewStyle
  onLongPress?: (data: DataType) => void
  renderItem?: (data: DataType, index: number) => ReactElement
  renderChild?: (data: DataType, index: number) => ReactElement
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
          <View key={`${label}-${index}`} style={{ position: 'relative' }}>
            {renderItem ? (
              renderItem(data, index)
            ) : (
              <Chip
                onPress={() => {
                  onPress(data, index)
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
export default ChipList
