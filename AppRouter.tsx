import AsyncStorage from '@react-native-async-storage/async-storage'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import React, { FC, useEffect } from 'react'
import { View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import { useDp } from './hooks'
import Drawer from './layout/Drawer'
import { StateBase } from './reducers'
import { GalleryItem } from './types/itemType'
import { isDev, _env, _screen } from './utils/env'
import { getRuleList, initAppFolder } from './utils/fs'
import view_collections from './views/collections'
import Detail from './views/detail'
import view_gallery, { rData } from './views/gallery'
import Search from './views/search'
import Setting from './views/setting'
import Page_Viewer from './views/viewer'

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

let tab = createMaterialBottomTabNavigator<TabStackParamList>()
let drawer = createDrawerNavigator()

let HomeComponent = () => (
  <tab.Navigator initialRouteName="homeGallery">
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
        tabBarIcon: 'account-settings',
        tabBarLabel: 'setting',
      }}
    />
  </tab.Navigator>
)

let RootRouter = () => (
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
)

export type AppRouterProps = {
  // ...
}
type rProps = ConnectedProps<typeof connector> & AppRouterProps
let AppRouter: FC<rProps> = (props) => {
  let dispatch = useDp()

  useEffect(() => {
    console.log('init app')

    dispatch({ type: 'setting/set', debugMode: isDev })
    initAppFolder().then(async () => {
      let list = await getRuleList()
      dispatch({
        type: 'setting/set',
        ruleList: list.map((l) => ({
          fileName: l,
          name: l.replace(/(.*)\..*?$/, '$1'),
        })),
      })
    })
    _initStore()
  }, [])

  async function _initStore() {
    let [tags, imgs, histories]: [any, any, any] = await Promise.all([
      AsyncStorage.getItem('tagLikes'),
      AsyncStorage.getItem('imgLikes'),
      AsyncStorage.getItem('searchHistories'),
      // AsyncStorage.getItem('setting/rule'),
    ])
    tags = JSON.parse(tags)
    if (!_env.NSFW) {
      tags = tags ?? {}
      tags['sfw'] = true
    }
    imgs = JSON.parse(imgs)
    histories = JSON.parse(histories)
    dispatch({ type: 'likes/init', tags, imgs })
    dispatch({ type: 'search/initHis', histories })
  }
  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <NavigationContainer
        onStateChange={(state) => {
          let routers = state.routes?.[0].state.routes ?? []
          let lastRouter = routers[routers.length - 1] as any
          dispatch({
            type: 'state/set',
            lastRouter,
          })
        }}
      >
        <drawer.Navigator
          initialRouteName="_home"
          drawerContent={(props) => <Drawer {...props} />}
          drawerStyle={{
            backgroundColor: '#fff',
            width: 240,
          }}
          edgeWidth={props.canUseDrawer ? _screen.width / 2 : 0}
        >
          <drawer.Screen name="_home" component={RootRouter}></drawer.Screen>
        </drawer.Navigator>
      </NavigationContainer>
    </View>
  )
}

const mapStateToProps = (state: StateBase) => {
  let lastRouter = state.state.lastRouter
  return {
    canUseDrawer: !['viewer'].includes(lastRouter?.name),
  }
}
const mapDispatchToProps = {}
let connector = connect(mapStateToProps, mapDispatchToProps)
export default connector(AppRouter)
