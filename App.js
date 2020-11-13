import AsyncStorage from '@react-native-async-storage/async-storage'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'
import { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { FAB } from 'react-native-paper'
import { connect, Provider } from 'react-redux'
import { createStore } from 'redux'
import reducer from './reducers/index'
import { view_collections } from './views/collections'
import view_gallery from './views/gallery'
import Search from './views/search'

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
  function HomeComponent() {
    let tab = createMaterialBottomTabNavigator()
    return (
      <NavigationContainer independent={true}>
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
              tabBarLabel: 'gallery',
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
        </Stack.Navigator>
      </NavigationContainer>
      <MyComponent />
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
