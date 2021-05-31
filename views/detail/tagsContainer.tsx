import ChipList from '@r/components/chipList'
import { StateBase } from '@r/reducers'
import { RootPageProps } from '@r/types/route'
import { getCache, setCache } from '@r/utils/cache'
import request from '@r/utils/request'
import { executePaser } from '@r/utils/ruleParser'
import { useNavigation } from '@react-navigation/native'
import React, { FC, useEffect, useState } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { Divider, Text } from 'react-native-paper'
import { connect, ConnectedProps } from 'react-redux'

type rProps = ConnectedProps<typeof connector> & {
  /**orginData */
  data: any
  nowTag: string
}

let TagsContainer: FC<rProps> = (props) => {
  let { isAdvancedTags, data } = props
  let id = data?.id
  let navigation = useNavigation<RootPageProps<'detail'>['navigation']>()
  let [isLoading, setLoading] = useState(false)

  let [atags, setAtags] = useState<{ [k: string]: any }>({
    // copyrights: [],
    // characters: [],
    // artists: [],
    // generals: [],
    // metadatas: [],
  })

  useEffect(() => {
    setLoading(true)
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
            setLoading(false)
          })
        setLoading(false)
      })
    } else {
      let _tags = executePaser(props.rule.content.tags, data)
      setAtags(_tags)
      setLoading(false)
    }
  }, [data])

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

  return (
    <View style={{ minHeight: 100, backgroundColor: '#fff' }}>
      {isLoading && <ActivityIndicator animating={true} />}
      {!isLoading &&
        Object.keys(atags).map((type) => {
          let dataList = atags[`${type}`]
          return (
            <View key={type}>
              {dataList.length ? (
                <View>
                  <Text>{type}</Text>
                  <Divider />
                  <ChipList
                    dataList={dataList}
                    onPress={onPress}
                    onLongPress={onLongPress}
                  />
                </View>
              ) : (
                <></>
              )}
            </View>
          )
        })}
    </View>
  )
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
