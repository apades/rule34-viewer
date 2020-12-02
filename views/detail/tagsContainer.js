import React, { useState } from 'react'
import { View } from 'react-native'
import { Divider, Text } from 'react-native-paper'
import { connect } from 'react-redux'
import { detailTags } from '../../api/detail_reptiles'
import ChipList from '../../components/chipList'

let TagsContainer = connect((state) => ({
  isAdvancedTags: state.setting.isAdvancedTags,
}))(function (props) {
  let { tags, id, isAdvancedTags, navigation } = props

  let [atags, setAtags] = useState({
    // copyrights: [],
    // characters: [],
    // artists: [],
    // generals: [],
    // metadatas: [],
  })
  if (isAdvancedTags) {
    detailTags(id).then((res) => setAtags(res))
  }

  let el
  function onPress(tag = '') {
    let tags = tag.replace(/\s/g, '_')
    return navigation.push('gallery', {
      tags,
    })
  }
  if (Object.keys(atags).length)
    el = (
      <View>
        {['character', 'artist', 'general', 'copyright', 'metadata'].map(
          (type) => {
            let dataList = atags[`${type}s`]
            return (
              <View key={type}>
                {dataList.length ? (
                  <>
                    <Text>{type}</Text>
                    <Divider />
                    {ChipList({
                      dataList,
                      onPress,
                    })}
                  </>
                ) : (
                  <></>
                )}
              </View>
            )
          },
        )}
      </View>
    )
  else {
    // 简单tags模式
    el = (
      <View>
        {ChipList({
          dataList: tags,
          onPress,
        })}
      </View>
    )
  }

  return el
})

export default TagsContainer