import AsyncStorage from '@react-native-async-storage/async-storage'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React, { useEffect } from 'react'
import { LogBox, View } from 'react-native'
import { connect, Provider } from 'react-redux'
import store, { StateBase } from './reducers/index'
import { GalleryItem } from './types/itemType'
import { isDev } from './utils/env'
import view_collections from './views/collections'
import Detail from './views/detail'
import view_gallery, { rData } from './views/gallery'
import Search from './views/search'
import Setting from './views/setting'
import Page_Viewer from './views/Viewer'

LogBox.ignoreLogs(['Remote debugger'])

export type RootStackParamList = {
  home: undefined
  search: { value: string }
  detail: { data: GalleryItem; nowTag: string }
  gallery: Partial<{ tags: string; likeList: boolean }>
  viewer: { dataList: rData[]; index: number; page: number; nowTag: string }
  setting: undefined
}
export type TabStackParamList = {
  collections: undefined
  homeGallery: undefined
  Setting: undefined
}
const RootStack = createStackNavigator<RootStackParamList>()

function _RenderRouter(props: any) {
  // init store
  let { dispatch } = props
  useEffect(() => {
    console.log('init app')

    dispatch({ type: 'setting/debugMode', value: isDev })
    _initStore()
  }, [])
  async function _initStore() {
    let [tags, imgs, histories] = await Promise.all([
      AsyncStorage.getItem('tagLikes'),
      AsyncStorage.getItem('imgLikes'),
      AsyncStorage.getItem('searchHistories'),
      // AsyncStorage.getItem('setting/rule'),
    ])
    tags = JSON.parse(tags)
    imgs = JSON.parse(imgs)
    histories = JSON.parse(histories)
    dispatch({ type: 'likes/init', tags, imgs })
    dispatch({ type: 'search/initHis', histories })
    // dispatch({ type: 'setting/setRule', ruleName })
  }

  function HomeComponent() {
    let tab = createMaterialBottomTabNavigator<TabStackParamList>()
    return (
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
    )
  }

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <NavigationContainer>
        <RootStack.Navigator initialRouteName="home">
          <RootStack.Screen
            component={HomeComponent}
            name="home"
            options={{ header: () => null }}
          />
          <RootStack.Screen
            component={Search}
            name="search"
            options={{ header: () => null }}
          />
          <RootStack.Screen
            component={Detail}
            name="detail"
            options={{ header: () => null }}
          />
          <RootStack.Screen
            component={view_gallery}
            name="gallery"
            options={{ header: () => null }}
          />
          <RootStack.Screen
            component={Page_Viewer}
            name="viewer"
            options={{ header: () => null }}
          />
        </RootStack.Navigator>
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
