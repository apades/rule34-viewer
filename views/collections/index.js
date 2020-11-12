import {
  useFocusEffect,
  useIsFocused,
  useRoute,
} from '@react-navigation/native'
import React, { useCallback, useEffect, useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { Divider, Text } from 'react-native-paper'
import { connect } from 'react-redux'
import search from '../../reducers/search'

import { _env } from '../../utils/env'

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
    setLikes(getLikes())
  }, [focus])

  let collects = ['Nintendo', 'km-15', ...Object.keys(likes.tags)]
  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {collects.map((collect) => (
          <TouchableOpacity
            key={collect}
            onPress={() => {
              search(collect)
              navigation.push('gallery')
            }}
            style={styles.container}
          >
            <Text style={styles.text}>{collect}</Text>
          </TouchableOpacity>
        ))}
        <View>
          <Text>imgs</Text>
          {Object.keys(likes.imgs).map((like) => (
            <Text key={like}>{like}</Text>
          ))}
        </View>
      </ScrollView>
    </View>
  )
})
