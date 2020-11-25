import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { View } from 'react-native'
import { Comp_seachInput } from '../../components/searchInput'
import { _style } from '../../style'

export default function Search(props) {
  let { navigation } = props
  return (
    <View style={{ flex: 1, ..._style.center() }}>
      <View style={{ width: '80%' }}>
        <Comp_seachInput
          onSubmitEditing={(tags) => {
            navigation.replace('gallery', { tags })
            // navigation.goBack()
          }}
        />
      </View>
    </View>
  )
}
