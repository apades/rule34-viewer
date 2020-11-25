import {
  Link,
  useFocusEffect,
  useIsFocused,
  useRoute,
} from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { Image, StyleSheet, View, StatusBar, Linking } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { Badge, Button, Chip, Divider, Text } from 'react-native-paper'
import { connect } from 'react-redux'
import DebugInfo from '../../components/debugInfo'
import search from '../../reducers/search'
import { _style } from '../../style'

import { isDev, _env } from '../../utils/env'

var styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#6cf',
  },
  text: {
    // fontSize: 30,
    textAlign: 'center',
  },
})

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

  if (isDev)
    collects.push(
      ...[
        'test1',
        'test2',
        't3',
        'test5',
        'asdasdasda',
        'bbbbbbbbbbbbbbbb',
        'ccccc',
      ],
    )
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
            marginTop: 10,
          }}
        >
          {collects.map((collect) => (
            <View key={collect} style={{ position: 'relative' }}>
              <Chip
                onPress={() => {
                  search(collect)
                  navigation.jumpTo('gallery')
                }}
                style={{ ..._style.margin('5 2') }}
              >
                <Text>{collect}</Text>
              </Chip>
              <View style={{ position: 'absolute', right: 0, top: -1 }}>
                <Badge size={15}>1</Badge>
              </View>
            </View>
          ))}
        </View>
        <View>
          {/* <Text>imgs</Text>
          {Object.keys(likes.imgs).map((like) => (
            <Text key={like}>{like}</Text>
          ))} */}
          <Button
            mode="contained"
            onPress={() => {
              search('img-likes')
              navigation.jumpTo('gallery')
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
