import { useNavigation } from '@react-navigation/native'
import { debounce } from 'lodash'
import React, { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Text } from 'react-native-paper'
import { searchCompleteList } from '../../api/list_o'
import { Comp_seachInput } from '../../components/searchInput'
import { _style } from '../../style'
import { debounceAsync } from '../../utils/utils'

let fn = debounceAsync(async (text = '') => {
  let searchArr = text.trim().split(' ')
  let searchDataList = []
  if (text.trim().length) {
    let nowCompelte = searchArr[searchArr.length - 1]
    searchDataList = await searchCompleteList(nowCompelte)
  }

  return searchDataList
}, 200)

export default function Search(props) {
  let { navigation } = props

  let [text, setText] = useState(props.value || '')
  let searchInputEl = (
    <Comp_seachInput
      onChangeText={(text) => {
        setText(text)
      }}
      onSubmitEditing={(tags) => {
        navigation.replace('gallery', { tags })
      }}
      value={text}
    />
  )
  function RenderSearchHistoryContainer() {
    let [dataList, setDataList] = useState([])

    useEffect(() => {
      try {
        fn(text).then(
          (rs) => setDataList(rs),
          () => ({}),
        )
      } catch (error) {}
    }, [text])

    return (
      <ScrollView>
        {dataList.map((data, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              let searchArr = text.trim().split(' ') || []
              searchArr[searchArr.length - 1] = data.value
              setText(searchArr.join(' '))
            }}
          >
            <View style={{ padding: 10, ..._style.center, ..._style.border() }}>
              <Text>{data.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    )
  }
  return (
    <View style={{ flex: 1, ..._style.center() }}>
      <View style={{ width: '80%' }}>
        {searchInputEl}
        <View style={{ marginTop: 10 }}>{RenderSearchHistoryContainer()}</View>
      </View>
    </View>
  )
}
