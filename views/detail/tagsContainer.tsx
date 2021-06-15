import { getContentTags } from '@r/actions/ruleAction'
import ChipList from '@r/components/chipList'
import { StateBase } from '@r/reducers'
import { dykey } from '@r/types'
import { RootPageProps } from '@r/types/route'
import { getCache, setCache } from '@r/utils/cache'
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
  let { data } = props
  let id = data?.id
  let navigation = useNavigation<RootPageProps<'detail'>['navigation']>()
  let [isLoading, setLoading] = useState(false)

  let [allTagsMap, setAllTagsMap] = useState<[string, string[]][]>([])

  async function initTagsMap() {
    let _setAllTagsMap = (obj: dykey) => {
      console.log('_tags', obj)
      setAllTagsMap(Object.entries(obj))
    }

    let url = props.rule.content.url
    if (!url) {
      let _tags = await props.getContentTags({
        $item: data,
        id: data.id,
      })
      _setAllTagsMap(_tags)
      return
    }
    url += id

    let cache = await getCache(url)
    if (cache) {
      return _setAllTagsMap(JSON.parse(cache))
    }
    let _tags = await props.getContentTags({
      $item: data,
      id: data.id,
    })
    _setAllTagsMap(_tags)
    await setCache(url, JSON.stringify(_tags))
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
    rule: state.setting.rule,
  }
}

const mapDispatchToProps = {
  getContentTags,
}

let connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(TagsContainer)
