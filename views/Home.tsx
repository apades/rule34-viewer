import { loadRules, setRule } from 'actions/settingAction'
import React, { FC, useEffect, useState } from 'react'
import { View } from 'react-native'
import { TouchableHighlight } from 'react-native-gesture-handler'
import { Button, Modal, TextInput } from 'react-native-paper'
import { connect, ConnectedProps } from 'react-redux'
import { StateBase } from 'reducers'

type rProps = ConnectedProps<typeof connector>
const Home: FC<rProps> = (props) => {
  useEffect(() => {
    props.loadRules()
  }, [])
  let [showRuleModal, setShowRuleModal] = useState(false)
  let [value, setValue] = useState('')

  return (
    <View>
      <View>
        {props.rules.map((rule) => (
          <TouchableHighlight
            onPress={async () => {
              await props.setRule(rule)
              console.log('to', rule.name)
            }}
          >
            {rule.name}
          </TouchableHighlight>
        ))}
      </View>
      <Button>add rule</Button>
      <Modal visible={showRuleModal}>
        <TextInput />
      </Modal>
    </View>
  )
}

const mapStateToProps = (state: StateBase) => ({
  rules: state.setting.rules,
})

const mapDispatchToProps = {
  loadRules,
  setRule,
}

let connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(Home)
