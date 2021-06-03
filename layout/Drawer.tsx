import { useNav } from '@r/hooks'
import { StateBase } from '@r/reducers'
import { useRoute } from '@react-navigation/core'
import {
  DrawerContentComponentProps,
  DrawerContentOptions,
} from '@react-navigation/drawer'
import React from 'react'
import { FC, memo } from 'react'
import { ScrollView, View } from 'react-native'
import { Divider, Drawer, Text } from 'react-native-paper'
import { ConnectedProps, connect } from 'react-redux'

export type DrawerProps = DrawerContentComponentProps<DrawerContentOptions>
type rProps = ConnectedProps<typeof connector> & DrawerProps
let Layout_Drawer: FC<rProps> = (props) => {
  return (
    <ScrollView>
      <View
        style={{
          backgroundColor: '#6cf',
          height: 50,
        }}
      >
        <Text>this is header</Text>
      </View>
      <Divider />
      <Drawer.Section>
        <Drawer.Item label="favorite"></Drawer.Item>
      </Drawer.Section>
      <Divider />
      <Drawer.Section>
        <Drawer.Item label="setting"></Drawer.Item>
      </Drawer.Section>
    </ScrollView>
  )
}

const mapStateToProps = (state: StateBase) => {
  return {}
}
const mapDispatchToProps = {}
let connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(memo(Layout_Drawer))
