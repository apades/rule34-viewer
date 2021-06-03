import { RootStackParamList, TabStackParamList } from '@r/AppRouter'
import ChipList from '@r/components/chipList'
import { StateBase } from '@r/reducers'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import {
  CompositeNavigationProp,
  useIsFocused,
  useRoute,
} from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import React, { FC } from 'react'
import { StatusBar, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Button } from 'react-native-paper'
import { connect, ConnectedProps } from 'react-redux'

type rProps = ConnectedProps<typeof connector> & {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TabStackParamList, 'collections'>,
    StackNavigationProp<RootStackParamList>
  >
}

const view_collections: FC<rProps> = (props) => {
  let { navigation, likes } = props
  let route = useRoute()

  let collects = Object.keys(likes.tags)

  return (
    <ScrollView>
      <View
        style={{
          alignItems: 'baseline',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        <ChipList
          dataList={collects}
          onPress={(collect: string) => {
            navigation.push('gallery', {
              tags: collect,
            })
          }}
        />
      </View>
    </ScrollView>
  )
}

const mapStateToProps = (state: StateBase) => {
  return {
    likes: state.likes,
  }
}
const mapDispatchToProps = {}

let connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(view_collections)
