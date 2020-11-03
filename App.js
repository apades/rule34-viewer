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
  <FAB icon="plus" onPress={() => alert('Pressed')} small style={s.fab} />
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
        <Stack.Navigator initialRouteName="collections">
          <Stack.Screen component={view_collections} name="collections" />
          <Stack.Screen
            component={view_gallery}
            name="gallery"
            options={({ route }) => ({
              title: `tags: ${route.params?.tags || 'dacad'}`,
            })}
          />
          <Stack.Screen component={view_viewer} name="viewer" />
        </Stack.Navigator>
      </NavigationContainer>
      <MyComponent />
    </View>
  )
}

export default App
