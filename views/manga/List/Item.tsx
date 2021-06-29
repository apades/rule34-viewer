import { useNav } from '@r/hooks'
import React, { FC } from 'react'
import { Text } from 'react-native'
import { Image, ScrollView, View, TouchableHighlight } from 'react-native'

type Props = {
  data: any
}
let Manga_ListItem: FC<Props> = (props) => {
  let { data } = props
  let navigation = useNav()
  return (
    <TouchableHighlight
      style={{
        height: 50,
        marginBottom: 10,
      }}
      onPress={() => {
        console.log('press', data.id)
        navigation.push('mangaViewer', {
          data,
        })
      }}
    >
      <Text>{data.name}</Text>
    </TouchableHighlight>
  )
}

export default Manga_ListItem
