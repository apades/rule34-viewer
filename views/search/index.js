import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'
import { Comp_seachInput } from '../../components/searchInput'
import { _style } from '../../style'

export default function Search(props) {
  let navigation = useNavigation()
  return (
    <View style={{ flex: 1, ..._style.center() }}>
      <View style={{ width: '80%' }}>
        <Comp_seachInput
          onSubmitEditing={() => {
            // navigation.replace('home', { redirect: 'gallery' })
            navigation.goBack()
          }}
        />
      </View>
    </View>
  )
}
