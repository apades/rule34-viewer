import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { CompositeNavigationProp, useIsFocused } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList, TabStackParamList } from 'App'
import React, { FC, useEffect, useState } from 'react'
import { StatusBar, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Button } from 'react-native-paper'
import { connect, ConnectedProps } from 'react-redux'
import { StateBase } from 'reducers'
import ChipList from '../../components/chipList'

type rProps = ConnectedProps<typeof connector> & {
  navigation: CompositeNavigationProp<
    BottomTabNavigationProp<TabStackParamList, 'collections'>,
    StackNavigationProp<RootStackParamList>
  >
  [k: string]: any
}

const view_collections: FC<rProps> = (props) => {
  let { navigation, getLikes } = props
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
            onPress: (collect: string) => {
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
}

const mapStateToProps = (state: StateBase) => {
  return {
    getLikes: () => state.likes,
  }
}
const mapDispatchToProps = {}

let connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(view_collections)
