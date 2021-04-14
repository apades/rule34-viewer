import { StateBase } from '@r/reducers'
import React, { FC, memo, useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Text } from 'react-native-paper'
import { connect, ConnectedProps } from 'react-redux'
import { _style } from '../../style'
import request from '../../utils/request'
import { debounceAsync } from '../../utils/utils'

let fn = debounceAsync<string>(async (text = '') => {
  let searchArr = text.trim().split(' ')
  let searchDataList = []
  if (text.trim().length) {
    let nowCompelte = searchArr[searchArr.length - 1]
    searchDataList = (await request(
      `https://rule34.xxx/autocomplete.php?q=${nowCompelte}`,
    )) as any
  }

  return searchDataList
}, 500)

export type historyContainerProps = {
  setText: React.Dispatch<React.SetStateAction<string>>
  text: string
}
type rProps = ConnectedProps<typeof connector> & historyContainerProps
let SearchHistoryContainer: FC<rProps> = (props) => {
  let [dataList, setDataList] = useState([])

  let { text, setText } = props

  useEffect(() => {
    try {
      fn(text).then(
        (rs) => {
          if (text.trim().length) setDataList(rs as any)
          else setDataList(props.histories)
        },
        () => ({}),
      )
    } catch (error) {
      console.error('histories error', error)
    }
  }, [text])

  return (
    <ScrollView>
      {dataList.map((data, index) => {
        let { value = data, label = data } = data

        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              let searchArr = text.trim().split(' ') || []
              searchArr[searchArr.length - 1] = value
              setText(searchArr.join(' '))
            }}
          >
            <View style={{ padding: 10, ..._style.center, ..._style.border() }}>
              <Text>{label}</Text>
            </View>
          </TouchableOpacity>
        )
      })}
    </ScrollView>
  )
}

const mapStateToProps = (state: StateBase) => {
  return {
    histories: state.search.histories,
  }
}
const mapDispatchToProps = {}
let connector = connect(mapStateToProps, mapDispatchToProps)
export default connector(memo(SearchHistoryContainer))
