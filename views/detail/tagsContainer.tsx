import ChipList from '@r/components/chipList'
import { StateBase } from '@r/reducers'
import { RootPageProps } from '@r/types/route'
import request from '@r/utils/request'
import { executePaser } from '@r/utils/ruleParser'
import { useNavigation } from '@react-navigation/native'
import React, { FC, useEffect, useState } from 'react'
import { View } from 'react-native'
import { Divider, Text } from 'react-native-paper'
import { connect, ConnectedProps } from 'react-redux'

type rProps = ConnectedProps<typeof connector> & {
  data: any
  id: number
  nowTag: string
  [k: string]: any
}

let TagsContainer: FC<rProps> = (props) => {
  let { tags, id, isAdvancedTags, data } = props
  let navigation = useNavigation<RootPageProps<'detail'>['navigation']>()

  let [atags, setAtags] = useState<{ [k: string]: any }>({
    // copyrights: [],
    // characters: [],
    // artists: [],
    // generals: [],
    // metadatas: [],
  })

  useEffect(() => {
    if (props.rule.content.url) {
      let requestUrl = executePaser(props.rule.content.url, {
        id,
      })
      request(requestUrl).then((res) => {
        let _tags = executePaser(props.rule.content.tags, res)
        setAtags(_tags)
      })
    } else {
      let _tags = executePaser(props.rule.content.tags, data)
      setAtags(_tags)
    }
  }, [])

  function onPress(tag = '') {
    let tags = tag.replace(/\s/g, '_')
    return navigation.push('gallery', {
      tags,
    })
  }
  function onLongPress(tag = '') {
    let value = tag.replace(/\s/g, '_')
    return navigation.push('search', {
      value: `${props.nowTag || ''} ${value}`,
    })
  }

  let el = <></>
  if (Object.keys(atags).length)
    el = (
      <View>
        {Object.keys(atags).map((type) => {
          let dataList = atags[`${type}`]
          return (
            <View key={type}>
              {dataList.length ? (
                <>
                  <Text>{type}</Text>
                  <Divider />
                  {ChipList({
                    dataList,
                    onPress,
                    onLongPress,
                  })}
                </>
              ) : (
                <></>
              )}
            </View>
          )
        })}
      </View>
    )

  return el
}

const mapStateToProps = (state: StateBase) => {
  return {
    isAdvancedTags: state.setting.isAdvancedTags,
    rule: state.setting.rule,
  }
}
const mapDispatchToProps = {}

let connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(TagsContainer)
