import RuleSelector from '@r/components/RuleSelector'
import { useDp } from '@r/hooks'
import { StateBase } from '@r/reducers'
import {
  DrawerContentComponentProps,
  DrawerContentOptions,
} from '@react-navigation/drawer'
import React, { FC, memo, useState } from 'react'
import { ScrollView, TouchableNativeFeedback, View } from 'react-native'
import {
  Button,
  Divider,
  Drawer,
  Menu,
  Text,
  Provider,
} from 'react-native-paper'
import { connect, ConnectedProps } from 'react-redux'

export type DrawerProps = DrawerContentComponentProps<DrawerContentOptions>
type rProps = ConnectedProps<typeof connector> & DrawerProps

let selectList = ['rule34', 'e621']
let Layout_Drawer: FC<rProps> = (props) => {
  let dispatch = useDp()
  let [isMenuVisible, setMenuVisible] = useState(false)

  return (
    <>
      <View>
        <ScrollView>
          <View
            style={{
              backgroundColor: '#6cf',
            }}
          >
            <Text>this is header</Text>
            <Button
              uppercase={false}
              onPress={() => setMenuVisible(true)}
              icon="chevron-down"
            >
              {props.rule?.name}
            </Button>
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
      </View>
      <RuleSelector
        onDismiss={() => setMenuVisible(false)}
        visible={isMenuVisible}
      />
    </>
  )
}

const mapStateToProps = (state: StateBase) => {
  return {
    rule: state.setting.rule,
  }
}
const mapDispatchToProps = {}
let connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(memo(Layout_Drawer))
