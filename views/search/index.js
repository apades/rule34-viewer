import React, { useState } from 'react'
import { View } from 'react-native'
import { searchCompleteList } from '../../api/list_o'
import statuBarLayout from '../../layout/statuBar'
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
  let { navigation, route } = props

  let [text, setText] = useState(route?.params?.value ?? '')

  return statuBarLayout({
    children: () => (
      <View style={{ width: '80%', marginTop: 10 }}>
        <SearchInputEl navigation={navigation} setText={setText} text={text} />
        <View style={{ marginTop: 10 }}>
          <SearchHistoryContainer setText={setText} text={text} />
        </View>
      </View>
    ),
    style: {
      alignItems: 'center',
    },
  })
}
