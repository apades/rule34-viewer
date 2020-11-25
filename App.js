import AsyncStorage from '@react-native-async-storage/async-storage'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import {
  NavigationContainer,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'
import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { FAB } from 'react-native-paper'
import { connect, Provider } from 'react-redux'
import { createStore } from 'redux'
import reducer from './reducers/index'
import { view_collections } from './views/collections'
import Detail from './views/detail'
import view_gallery from './views/gallery'
import Search from './views/search'
import Setting from './views/setting'

const Stack = createStackNavigator()
const store = createStore(reducer)

function _RenderRouter(props) {
  // init store
  useEffect(() => {
    console.log('init store')
    _initStore()
  }, [])

  let { initLikes } = props
  async function _initStore() {
    let [tags, imgs] = await Promise.all([
      AsyncStorage.getItem('tagLikes'),
      AsyncStorage.getItem('imgLikes'),
    ])
    tags = JSON.parse(tags)
    imgs = JSON.parse(imgs)
    initLikes({ tags, imgs })
  }

  function HomeComponent() {
    let tab = createMaterialBottomTabNavigator()
    return (
      <NavigationContainer independent={true}>
        <tab.Navigator initialRouteName="collections">
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
            name="homeGallery"
            options={{
              tabBarIcon: 'view-list',
              tabBarLabel: 'gallery',
            }}
          />
          <Stack.Screen
            component={Setting}
            name="Setting"
            options={{
              tabBarIcon: 'settings',
              tabBarLabel: 'setting',
            }}
          />
        </tab.Navigator>
      </NavigationContainer>
    )
  }
  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="home">
          <Stack.Screen
            component={HomeComponent}
            name="home"
            options={{ header: () => null }}
          />
          <Stack.Screen
            component={Search}
            name="search"
            options={{ header: () => null }}
          />
          <Stack.Screen
            component={Detail}
            name="detail"
            options={{ header: () => null }}
          />
          <Stack.Screen
            component={view_gallery}
            name="gallery"
            options={{ header: () => null }}
          />
        </Stack.Navigator>
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
