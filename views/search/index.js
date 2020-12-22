import React, { useState } from 'react'
import { View } from 'react-native'
import statuBarLayout from '../../layout/statuBar'
import { _style } from '../../style'
import SearchHistoryContainer from './historyContainer'
import SearchInputEl from './searchInputEl'

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
