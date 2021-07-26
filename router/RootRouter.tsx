import { RootStackParamList } from '@r/AppRouter'
import Search from '@r/views/search'
import { createStackNavigator } from '@react-navigation/stack'
import React, { FC } from 'react'
import Page_Viewer from '../views/viewer'
import view_gallery, { rData } from '../views/gallery'
import HomeRouter from './HomeRouter'
import Page_MangaViewer from '../views/manga/Viewer'

const RootStack = createStackNavigator<RootStackParamList>()

let RootRouter: FC = (props) => {
  return (
    <RootStack.Navigator initialRouteName="home">
      <RootStack.Screen
        component={HomeRouter}
        name="home"
        options={{ header: () => null }}
      />
      <RootStack.Screen
        component={Search}
        name="search"
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
      <RootStack.Screen
        component={Page_MangaViewer}
        name="mangaViewer"
        options={{ header: () => null }}
      />
    </RootStack.Navigator>
  )
}

export default RootRouter
