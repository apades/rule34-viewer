import ChipList from '@r/components/chipList'
import { StateBase } from '@r/reducers'
import { RootPageProps } from '@r/types/route'
import { getCache, setCache } from '@r/utils/cache'
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
    let url = props.rule.content.url
    if (url) {
      let requestUrl = executePaser(url, {
        id,
      })

      getCache(requestUrl).then((res) => {
        if (res) setAtags(JSON.parse(res))
        else
          request(requestUrl).then((res) => {
            let _tags = executePaser(props.rule.content.tags, res)
            setAtags(_tags)
            setCache(requestUrl, JSON.stringify(_tags))
          })
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

  let el = (
    <View style={{ minHeight: 100, backgroundColor: '#fff' }}>
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
