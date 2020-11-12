import * as React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { FAB } from 'react-native-paper'

import { view_collections } from './views/collections'
import view_gallery from './views/gallery'
import { view_viewer } from './views/viewer'

import reducer from './reducers/index'
import { createStore } from 'redux'
import { connect, Provider } from 'react-redux'
import GalleryHeader, { GalleryHeaderRight } from './views/gallery/header'
import { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Comp_seachInput } from './components/searchInput'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'

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
let store = createStore(reducer)

let tab = createMaterialBottomTabNavigator()

function _RenderRouter(props) {
  // init store
  useEffect(() => {
    console.log('init store')
    _initStore()
  }, [])

  let { likes, initLikes } = props
  async function _initStore() {
    let [tags, imgs] = await Promise.all([
      AsyncStorage.getItem('tagLikes'),
      AsyncStorage.getItem('imgLikes'),
    ])
    tags = JSON.parse(tags)
    imgs = JSON.parse(imgs)
    // console.log(tags, imgs)
    initLikes({ tags, imgs })
  }
  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {/* <NavigationContainer>
        <Stack.Navigator initialRouteName="gallery">
          <Stack.Screen component={view_collections} name="collections" />
          <Stack.Screen
            component={view_gallery}
            name="gallery"
            options={({ route }) => ({
              headerTitle: () => (
                <GalleryHeader tag={route.params?.tags || 'dacad'} />
              ),
              headerRight: () => <GalleryHeaderRight />,
            })}
          />
          <Stack.Screen component={view_viewer} name="viewer" />
        </Stack.Navigator>
      </NavigationContainer>
      <MyComponent /> */}
      <NavigationContainer>
        <tab.Navigator>
          <tab.Screen
            component={view_collections}
            name="collections"
            options={{
              tabBarIcon: 'heart',
              tabBarLabel: 'collects',
            }}
          />
          <Stack.Screen
            component={view_gallery}
            name="gallery"
            options={{
              tabBarIcon: 'view-list',
              tabBarLabel: 'list',
            }}
          />
        </tab.Navigator>
      </NavigationContainer>
    </View>
  )
}
const RenderRouter = connect(
  (state) => {
    return {
      likes: state.likes,
    }
  },
  (dispatch) => {
    return {
      initLikes: (initData) => dispatch({ type: 'likes/init', ...initData }),
    }
  },
)(_RenderRouter)

function App() {
  return (
    <Provider store={store}>
      <RenderRouter />
    </Provider>
  )
}

export default App
