import AsyncStorage from '@react-native-async-storage/async-storage'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React, { useEffect } from 'react'
import { LogBox, View } from 'react-native'
import { connect, Provider } from 'react-redux'
import store, { StateBase } from './reducers/index'
import { isDev } from './utils/env'
import { view_collections } from './views/collections'
import Detail from './views/detail'
import view_gallery from './views/gallery'
import Search from './views/search'
import Setting from './views/setting'

LogBox.ignoreLogs(['Remote debugger'])

const Stack = createStackNavigator()

function _RenderRouter(props: any) {
  // init store
  let { dispatch } = props
  useEffect(() => {
    console.log('init app')

    dispatch({ type: 'setting/debugMode', value: isDev })
    _initStore()
  }, [])
  async function _initStore() {
    let [tags, imgs, histories, ruleName] = await Promise.all([
      AsyncStorage.getItem('tagLikes'),
      AsyncStorage.getItem('imgLikes'),
      AsyncStorage.getItem('searchHistories'),
      AsyncStorage.getItem('setting/rule'),
    ])
    tags = JSON.parse(tags)
    imgs = JSON.parse(imgs)
    histories = JSON.parse(histories)
    dispatch({ type: 'likes/init', tags, imgs })
    dispatch({ type: 'search/initHis', histories })
    dispatch({ type: 'setting/setRule', ruleName })
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
          <tab.Screen
            component={view_gallery}
            name="homeGallery"
            options={{
              tabBarIcon: 'view-list',
              tabBarLabel: 'gallery',
            }}
          />
          <tab.Screen
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
const RenderRouter = connect((state: StateBase) => {
  return {
    likes: state.likes,
  }
})(_RenderRouter)

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <RenderRouter />
    </Provider>
  )
}

export default App
