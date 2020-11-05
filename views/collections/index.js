import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { connect } from 'react-redux'

import { _env } from '../../utils/env'

let collects = ['dacad', 'km-15', 'sfw']

function dom({ navigation, route, likes }) {
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
        <Text>likes</Text>
        {Object.keys(likes).map((like) => (
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
  likes: state.likes,
}))(dom)
