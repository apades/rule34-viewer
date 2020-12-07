import { useIsFocused } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { StatusBar, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Badge, Button, Chip, Text } from 'react-native-paper'
import { connect } from 'react-redux'
import ChipList from '../../components/chipList'
import { _style } from '../../style'

export const view_collections = connect(
  (state) => ({
    getLikes: () => state.likes,
  }),
  (dispatch) => ({
    search: (text) => dispatch({ type: 'search/input', text }),
  }),
)(function ({ navigation, getLikes, search }) {
  let focus = useIsFocused()
  let [likes, setLikes] = useState(getLikes())

  useEffect(() => {
    let likes = getLikes()
    setLikes(likes)
  }, [focus])

  let collects = Object.keys(likes.tags)

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{ height: StatusBar.currentHeight, backgroundColor: '#fff' }}
      ></View>
      <ScrollView>
        <View
          style={{
            alignItems: 'baseline',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          {ChipList({
            dataList: collects,
            onPress: (collect) => {
              search(collect)
              navigation.push('gallery', {
                tags: collect,
              })
            },
            // renderChild: () => (
            //   <View style={{ position: 'absolute', right: 0, top: -1 }}>
            //     <Badge size={15}>1</Badge>
            //   </View>
            // ),
          })}
        </View>
        <View>
          <Button
            mode="contained"
            onPress={() => {
              search('img-likes')
              navigation.push('gallery', {
                likeList: true,
              })
            }}
          >
            img likes
          </Button>
        </View>
      </ScrollView>
      {/* <DebugInfo>
        <Text>tags:{Object.keys(likes.tags).join(',')}</Text>
      </DebugInfo> */}
    </View>
  )
})
