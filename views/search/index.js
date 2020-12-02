import { useNavigation } from '@react-navigation/native'
import { debounce } from 'lodash'
import React, { useEffect, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Text } from 'react-native-paper'
import { connect } from 'react-redux'
import { searchCompleteList } from '../../api/list_o'
import { Comp_seachInput } from '../../components/searchInput'
import { _style } from '../../style'
import { debounceAsync } from '../../utils/utils'
import SearchInputEl from './searchInputEl'

let fn = debounceAsync(async (text = '') => {
  let searchArr = text.trim().split(' ')
  let searchDataList = []
  if (text.trim().length) {
    let nowCompelte = searchArr[searchArr.length - 1]
    searchDataList = await searchCompleteList(nowCompelte)
  }

  return searchDataList
}, 500)

export default function Search(props) {
  let { navigation } = props

  let [text, setText] = useState(props.value || '')

  let SearchHistoryContainer = connect((state) => ({
    histories: state.search.histories,
  }))((props) => {
    let [dataList, setDataList] = useState([])

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
              <View
                style={{ padding: 10, ..._style.center, ..._style.border() }}
              >
                <Text>{label}</Text>
              </View>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    )
  })

  return (
    <View style={{ flex: 1, ..._style.center() }}>
      <View style={{ width: '80%' }}>
        {/* {searchInputEl} */}
        <SearchInputEl navigation={navigation} setText={setText} text={text} />
        <View style={{ marginTop: 10 }}>
          <SearchHistoryContainer />
        </View>
      </View>
    </View>
  )
}
