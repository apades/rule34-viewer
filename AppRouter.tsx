import AsyncStorage from '@react-native-async-storage/async-storage'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import React, { FC, memo, useEffect } from 'react'
import { View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'
import { useDp } from './hooks'
import Drawer from './layout/Drawer'
import { StateBase } from './reducers'
import RootRouter from './router/RootRouter'
import { GalleryItem } from './types/itemType'
import { isDev, _env, _screen } from './utils/env'
import { getBasePath, initAppFolder } from './utils/fs'
import { rData } from './views/gallery'

export type RootStackParamList = {
  home: undefined
  search: { value: string }
  detail: { data: GalleryItem; nowTag: string }
  gallery: Partial<{ tags: string; likeList: boolean }>
  viewer: { dataList: rData[]; index: number; page: number; nowTag: string }
  setting: undefined
  mangaViewer: { data: any }
}
export type TabStackParamList = {
  collections: undefined
  homeGallery: undefined
  Setting: undefined
}
let drawer = createDrawerNavigator()

export type AppRouterProps = {
  // ...
}
type rProps = ConnectedProps<typeof connector> & AppRouterProps
let AppRouter: FC<rProps> = (props) => {
  let dispatch = useDp()

  useEffect(() => {
    console.log('init app')

    dispatch({ type: 'setting/set', debugMode: isDev })
    console.log(getBasePath() + '/r34-views')
    initAppFolder().catch((err) => console.error('err', err))
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
    canUseDrawer: !['viewer', 'mangaViewer'].includes(lastRouter?.name),
    rule: state.setting.rule,
  }
}
const mapDispatchToProps = {}
let connector = connect(mapStateToProps, mapDispatchToProps)
export default connector(memo(AppRouter))
