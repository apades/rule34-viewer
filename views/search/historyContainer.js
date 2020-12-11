import React, { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Text } from 'react-native-paper'
import { connect } from 'react-redux'
import { searchCompleteList } from '../../api/list_o'
import { _style } from '../../style'
import request from '../../utils/request'
import { debounceAsync } from '../../utils/utils'

let fn = debounceAsync(async (text = '') => {
  let searchArr = text.trim().split(' ')
  let searchDataList = []
  if (text.trim().length) {
    let nowCompelte = searchArr[searchArr.length - 1]
    searchDataList = await request(
      `https://rule34.xxx/autocomplete.php?q=${nowCompelte}`,
    )
  }

  return searchDataList
}, 500)

let SearchHistoryContainer = connect((state) => ({
  histories: state.search.histories,
}))((props) => {
  let [dataList, setDataList] = useState([])

  let { text, setText } = props

  useEffect(() => {
    try {
      fn(text).then(
        (rs) => {
          if (text.trim().length) setDataList(rs)
          else setDataList(props.histories)
        },
        () => ({}),
      )
    } catch (error) {}
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
})

export default SearchHistoryContainer
