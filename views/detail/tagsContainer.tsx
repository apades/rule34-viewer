import ChipList from '@r/components/chipList'
import { StateBase } from '@r/reducers'
import { dykey } from '@r/types'
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

  let [allTagsMap, setAllTagsMap] = useState<[string, string[]][]>([])

  async function initTagsMap() {
    let _setAllTagsMap = (obj: dykey) => {
      setAllTagsMap(Object.entries(obj))
    }

    let url = props.rule.content.url
    if (!url) {
      let _tags = executePaser(props.rule.content.tags, data)
      _setAllTagsMap(_tags)
      return
    }
    let requestUrl = executePaser(url, {
      id,
    })

    let cache = await getCache(requestUrl)
    if (cache) {
      return _setAllTagsMap(JSON.parse(cache))
    }
    let res = await request(requestUrl)
    let _tags = executePaser(props.rule.content.tags, res)
    _setAllTagsMap(_tags)
    await setCache(requestUrl, JSON.stringify(_tags))
    return
  }

  useEffect(() => {
    setLoading(true)
    initTagsMap()
      .catch((err) => {
        console.error('initTagsMap error', err)
      })
      .finally(() => {
        setLoading(false)
      })
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
        allTagsMap.map(([key, dataList]) => (
          <View key={key}>
            {!!dataList.length && (
              <View>
                <Text>{key}</Text>
                <Divider />
                <ChipList
                  dataList={dataList}
                  onPress={onPress}
                  onLongPress={onLongPress}
                />
              </View>
            )}
          </View>
        ))}
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
