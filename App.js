import * as React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { view_collections } from './views/collections'
import { view_gallery } from './views/gallery'
import { view_viewer } from './views/viewer'

const Stack = createStackNavigator()

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="collections">
        <Stack.Screen name="collections" component={view_collections} />
        <Stack.Screen name="gallery" component={view_gallery} />
        <Stack.Screen name="viewer" component={view_viewer} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App
