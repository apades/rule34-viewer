import React, { useState } from 'react'
import { View } from 'react-native'
import { searchCompleteList } from '../../api/list_o'
import { _style } from '../../style'
import { debounceAsync } from '../../utils/utils'
import SearchHistoryContainer from './historyContainer'
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

  return (
    <View style={{ flex: 1, ..._style.center() }}>
      <View style={{ width: '80%' }}>
        {/* {searchInputEl} */}
        <SearchInputEl navigation={navigation} setText={setText} text={text} />
        <View style={{ marginTop: 10 }}>
          <SearchHistoryContainer setText={setText} text={text} />
        </View>
      </View>
    </View>
  )
}
