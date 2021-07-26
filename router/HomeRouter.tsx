import { TabStackParamList } from '@r/AppRouter'
import { StateBase } from '@r/reducers'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import React, { FC, memo } from 'react'
import { ConnectedProps, connect } from 'react-redux'
import view_collections from '../views/collections'
import view_gallery, { rData } from '../views/gallery'
import Manga_List from '../views/manga/List'
import Setting from '../views/setting'

let tab = createMaterialBottomTabNavigator<TabStackParamList>()
export type HomeRouterProps = {
  //
}
type rProps = ConnectedProps<typeof connector> & HomeRouterProps
let HomeRouter: FC<rProps> = (props) => {
  return (
    <tab.Navigator
      barStyle={{ backgroundColor: props.theme }}
      initialRouteName="homeGallery"
    >
      <tab.Screen
        component={view_collections}
        name="collections"
        options={{
          tabBarIcon: 'heart',
          tabBarLabel: 'collects',
        }}
      />
      <tab.Screen
        component={Manga_List}
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
}

const mapStateToProps = (state: StateBase) => {
  return { theme: state?.setting?.rule?.theme }
}
const mapDispatchToProps = {}
let connector = connect(mapStateToProps, mapDispatchToProps)
export default connector(memo(HomeRouter))
