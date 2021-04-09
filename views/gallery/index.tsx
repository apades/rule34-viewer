import { throttle } from 'lodash'
import React from 'react'
import { Dispatch, FC, memo, useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { FlatGrid } from 'react-native-super-grid'
import { connect, ConnectedProps } from 'react-redux'
import { _env } from '@r/utils/env'
import GalleryHeader from './header'
import RenderGalleryItem from './item'
import { _style } from '@r/style'
import { RootPageProps } from '@r/types/route'
import request from '@r/utils/request'
import { StateBase, RootActions } from '@r/reducers'
import { parserStringValue, parserItemValue } from '@r/utils/ruleParser'
import { genHandlerScrollEnd } from '@r/utils/utils'
import DebugInfo from '@r/components/debugInfo'

type Props = RootPageProps<'gallery'>
type rProps = ConnectedProps<typeof connector> & Props

export type rData<T = any> = {
  isLike: boolean
  data: T
}

const Gallery: FC<rProps> = function (props) {
  let { navigation, route, likesToggle } = props
  console.log(`--- render ${route?.params?.tags ?? 'home'} gallery ---`)

  // dataList
  let [dataList, setDataList] = useState<rData[]>([])

  // pid
  let pidInit = props.rule?.config?.pageNumStart ?? 0
  let [pid, setPid] = useState(pidInit)

  // loading
  let [loading, setLoading] = useState(false)
  let [firstLoad, setFirstLoad] = useState(true)

  let { imgLikes } = props
  useEffect(() => {
    initState()

    loadData(pidInit)
  }, [])

  function initState() {
    console.log(`initState,${route.params?.tags ?? 'home'}`)
    setDataList([])
    setPid(pidInit)
  }

  function loadData(pid: number) {
    setLoading(true)
    // imgLikes-mode
    if (route?.params?.likeList) {
      let dataList: rData[] = Object.values(imgLikes)
        .reverse()
        .map((d) => ({
          isLike: true,
          data: d,
        }))
      setDataList(dataList)
      setFirstLoad(false)
      setLoading(false)
      return
    }

    let tags = route?.params?.tags ?? ''
    console.log(`load ${tags}`)

    // **script-load request**
    let requestUrl = parserStringValue(props.rule.discover.url, {
      searchString: tags,
      pageLimit: 20,
      pageNum: pid,
    })
    console.log('requestUrl', requestUrl)

    request(requestUrl).then((res) => {
      let resDataList = parserItemValue(
        props.rule.discover?.list ?? '$',
        res,
      ).map((d: any) => {
        let id = `rule34_${d.id}`
        return {
          isLike: !!imgLikes[id],
          data: d,
        }
      })
      console.log('imgLikes', imgLikes, resDataList)

      function ejectData() {
        let newDataList = [...dataList, ...resDataList]
        setDataList(newDataList)
        setLoading(false)
      }

      if (firstLoad) {
        console.log('init Gallery')
        setFirstLoad(() => {
          ejectData()
          return false
        })
      } else {
        ejectData()
      }
      setPid(pid)
    })
  }

  // container scroll event
  let handlerScrollEnd = genHandlerScrollEnd(() => {
    if (!loading) {
      console.log('scroll end pid:', pid)
      loadData(pid + 1)
    }
  })

  return (
    <View style={{ ..._style.wh('100%'), position: 'relative' }}>
      <GalleryHeader tags={route.params?.tags || ''} />
      <FlatGrid
        data={dataList}
        onScroll={throttle(handlerScrollEnd)}
        renderItem={({ item, index }) => {
          return (
            <RenderGalleryItem
              key={item.data.id}
              index={index}
              isLike={item.isLike}
              data={item.data}
              navigation={navigation}
              nowTag={route.params?.tags}
            />
          )
        }}
      />

      {firstLoad && (
        <View
          style={{
            ..._style.wh('100%'),
            ..._style.center(),
            position: 'absolute',
            top: 0,
          }}
        >
          <ActivityIndicator animating={true} />
        </View>
      )}
      <DebugInfo>
        <Text>
          l:{dataList.length} p:{pid}
        </Text>
      </DebugInfo>
      {loading && !firstLoad && (
        <View
          style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 1000 }}
        >
          <ActivityIndicator animating={true} />
        </View>
      )}
    </View>
  )
}

const mapStateToProps = (state: StateBase) => {
  return {
    imgLikes: state.likes.imgs,
    rule: state.setting.rule,
  }
}
const mapDispatchToProps = {
  likesToggle: (data: any) => (dispatch: Dispatch<RootActions>) =>
    dispatch({ type: 'likes/img_toggle', id: data.id, data }),
}

let connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(memo(Gallery))
