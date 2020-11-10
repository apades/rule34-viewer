import {
  useFocusEffect,
  useIsFocused,
  useRoute,
} from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Divider, Text } from 'react-native-paper'
import { connect } from 'react-redux'

import { _env } from '../../utils/env'

let collects = ['dacad', 'km-15', 'sfw']

function dom({ navigation, getLikes }) {
  let focus = useIsFocused()
  let [likes, setLikes] = useState(getLikes())
  // let likes = getLikes()
  // useFocusEffect(() => {
  //   // likes = getLikes()
  //   console.log('focus', getLikes())

  // })
  useEffect(() => {
    setLikes(getLikes())
  }, [focus])
  return (
    <View style={{ flex: 1 }}>
      {collects.map((c) => (
        <TouchableOpacity
          key={c}
          onPress={() => navigation.push('gallery', { tags: c })}
          style={styles.container}
        >
          <Text style={styles.text}>{c}</Text>
        </TouchableOpacity>
      ))}
      <View>
        <Text>imgs</Text>
        {Object.keys(likes.imgs).map((like) => (
          <Text key={like}>{like}</Text>
        ))}
        <Divider />
        <Text>tags</Text>
        {Object.keys(likes.tags).map((like) => (
          <Text key={like}>{like}</Text>
        ))}
      </View>
    </View>
  )
}

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

export const view_collections = connect((state) => ({
  getLikes: () => state.likes,
}))(dom)
