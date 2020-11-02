import * as React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { FAB } from 'react-native-paper'

import { view_collections } from './views/collections'
import { view_gallery } from './views/gallery'
import { view_viewer } from './views/viewer'

const Stack = createStackNavigator()

const MyComponent = () => (
  <FAB style={s.fab} small icon="plus" onPress={() => alert('Pressed')} />
)
const s = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
})

function App() {
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="gallery">
          <Stack.Screen name="collections" component={view_collections} />
          <Stack.Screen
            name="gallery"
            component={view_gallery}
            options={({ route }) => ({
              title: `tags: ${route.params?.tags || 'dacad'}`,
            })}
          />
          <Stack.Screen name="viewer" component={view_viewer} />
        </Stack.Navigator>
      </NavigationContainer>
      <MyComponent />
    </View>
  )
}

export default App
