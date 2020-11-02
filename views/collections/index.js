import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { FAB } from 'react-native-paper'

let collects = ['dacad', 'km-15']

const MyComponent = () => (
  <FAB style={s.fab} small icon="plus" onPress={() => console.log('Pressed')} />
)
const s = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
})

export function view_collections({ navigation, route }) {
  return (
    <View style={{ flex: 1 }}>
      {collects.map((c) => (
        <TouchableOpacity
          style={styles.container}
          key={c}
          onPress={() => navigation.push('gallery', { tags: c })}
        >
          <Text style={styles.text} style={{ textAlign: 'center' }}>
            {c}
          </Text>
        </TouchableOpacity>
      ))}
      <MyComponent />
    </View>
  )
}

var styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#6cf',
  },
  text: {
    fontSize: 30,
  },
})
