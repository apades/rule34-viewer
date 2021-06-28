import { useDp } from '@r/hooks'
import { _style } from '@r/style'
import { getAppRootUri, getRuleList } from '@r/utils/fs'
import React, { FC, useState } from 'react'
import { useEffect } from 'react'
import { View, Text } from 'react-native'
import { List, Modal } from 'react-native-paper'
import rule34Text from '@r/package/ruleParser/rules/rule34.text'
import fs from 'react-native-fs'

let selectList = ['rule34', 'e621']
type Props = {
  visible: boolean
  onDismiss: () => void
}
let RuleSelector: FC<Props> = (props) => {
  let dispatch = useDp()
  let [ruleList, setRuleList] = useState<
    {
      fileName: string
      name: string
    }[]
  >([])
  useEffect(() => {
    getRuleList().then((list) => {
      setRuleList(
        list.map((l) => ({
          fileName: l,
          name: l.replace(/(.*)\..*?$/, '$1'),
        })),
      )
    })
  }, [])

  return (
    <Modal visible={props.visible} onDismiss={props.onDismiss}>
      <View style={{ backgroundColor: '#fff', minHeight: 100 }}>
        <List.Item
          onPress={() => {
            // console.log('v', 'rule34')
            dispatch({
              type: 'setting/setRule',
              ruleString: rule34Text,
            })
          }}
          title={'rule34'}
          description={'default rule'}
          left={(props) => <Text {...props}>icon</Text>}
        />
        {ruleList.map((v, i) => (
          <List.Item
            key={i}
            onPress={async () => {
              let ruleString = await fs.readFile(
                `${getAppRootUri()}/rules/${v.fileName}`,
                'utf8',
              )
              dispatch({
                type: 'setting/setRule',
                ruleString,
              })
            }}
            title={v.name}
            left={(props) => <Text {...props}>icon</Text>}
          />
        ))}
      </View>
    </Modal>
  )
}

export default RuleSelector
