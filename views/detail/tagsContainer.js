import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { Divider, Text } from 'react-native-paper'
import { connect } from 'react-redux'
import ChipList from '../../components/chipList'
import _config from '../../config/base.config'
import request from '../../utils/request'
import { executePaser } from '../../utils/ruleParser'

let TagsContainer = connect((state) => ({
  isAdvancedTags: state.setting.isAdvancedTags,
}))(function (props) {
  let { tags, id, isAdvancedTags, navigation, data } = props

  let [atags, setAtags] = useState({
    // copyrights: [],
    // characters: [],
    // artists: [],
    // generals: [],
    // metadatas: [],
  })

  useEffect(() => {
    if (_config.rule.content.url) {
      let requestUrl = executePaser(_config.rule.content.url, {
        id,
      })
      request(requestUrl).then((res) => {
        let _tags = executePaser(_config.rule.content.tags, res)
        setAtags(_tags)
      })
    } else {
      let _tags = executePaser(_config.rule.content.tags, data)
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
})

export default TagsContainer
