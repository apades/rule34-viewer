import { RootPageProps } from '@r/types/route'
import React, { FC, useState } from 'react'
import { View } from 'react-native'
import StatuBarLayout from '../../layout/statuBar'
import SearchHistoryContainer from './historyContainer'
import SearchInputEl from './searchInputEl'

type Props = RootPageProps<'search'>
let Search: FC<Props> = (props) => {
  let { route } = props

  let [text, setText] = useState(route?.params?.value ?? '')

  return (
    <StatuBarLayout style={{ alignItems: 'center' }}>
      <View style={{ width: '80%', marginTop: 10 }}>
        <SearchInputEl setText={setText} text={text} />
        <View style={{ marginTop: 10 }}>
          <SearchHistoryContainer setText={setText} text={text} />
        </View>
      </View>
    </StatuBarLayout>
  )
}

export default Search
