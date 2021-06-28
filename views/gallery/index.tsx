import { getMoreGalleyData } from '@r/actions/ruleAction'
import DebugInfo from '@r/components/debugInfo'
import { StateBase } from '@r/reducers'
import { _style } from '@r/style'
import { RootPageProps } from '@r/types/route'
import { _screen } from '@r/utils/env'
import { genHandlerScrollEnd, _logBox } from '@r/utils/utils'
import { throttle } from 'lodash'
import React, { FC, memo, useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { FlatGrid } from 'react-native-super-grid'
import { connect, ConnectedProps } from 'react-redux'
import GalleryHeader from './header'
import RenderGalleryItem from './item'

let console = _logBox('Gallery')
type Props = RootPageProps<'gallery'>
type rProps = ConnectedProps<typeof connector> & Props

export type rData<T = any> = {
  isLike: boolean
  content: string
  cover: string
  // tags: {
  //   [k: string]: string[]
  // }
  // originUrl: string
  originData: T
}

const Gallery: FC<rProps> = function (props) {
  let { navigation, route, imgLikes } = props
  // dataList
  let [dataList, setDataList] = useState<rData[]>([])

  // pid
  let pidInit = props.rule?.config?.pageNumStart ?? 0
  let [pid, setPid] = useState(pidInit)

  // loading
  let [loading, setLoading] = useState(false)
  let [firstLoad, setFirstLoad] = useState(true)

  let tags = route?.params?.tags ?? ''

  useEffect(() => {
    initState()

    loadData(pidInit)
  }, [props.rule])

  // useEffect(() => {
  //   setTimeout(() => {
  //     initState()

  //     loadData(pidInit)
  //   }, 0)
  // }, [])

  function initState() {
    console.log(`--- render ${route?.params?.tags ?? 'home'} gallery ---`)
    setDataList([])
    setPid(pidInit)
  }

  async function loadData(pid: number) {
    setLoading(true)
    // --- imgLikes-mode
    // if (route?.params?.likeList) {
    //   let dataList: rData[] = Object.values(imgLikes)
    //     .reverse()
    //     .map((d) => {
    //       let uri = executePaser(props.rule.content.image, { $i: d })
    //       uri = isDev
    //         ? `http://${ip}:3001/proxy-img?url=${encodeURIComponent(uri)}`
    //         : uri
    //       return {
    //         isLike: true,
    //         data: d,
    //         img: uri,
    //       }
    //     })
    //   setDataList(dataList)
    //   setFirstLoad(false)
    //   setLoading(false)
    //   return
    // }
    // --- imgLikes-mode

    console.log(`load ${tags}`)

    let resDataList = await props.getMoreGalleyData({
      searchString: tags,
      pageLimit: 20,
      pageNum: pid,
    })
    console.log('resDataList', resDataList)

    if (firstLoad) {
      console.log('init Gallery')
      setFirstLoad(false)
    }
    setDataList((dataList) => [...dataList, ...resDataList])
    setLoading(false)
    setPid(pid)
  }

  let loadMore = () => {
    if (!loading) {
      console.log('scroll end pid:', pid)
      loadData(pid + 1)
    }
  }
  // container scroll event
  let handlerScrollEnd = genHandlerScrollEnd(loadMore)

  return (
    <View style={{ ..._style.wh('100%'), position: 'relative' }}>
      <GalleryHeader tags={route.params?.tags || ''} />
      <FlatGrid
        data={dataList}
        onScroll={throttle(handlerScrollEnd)}
        itemDimension={_screen.width / 3}
        renderItem={({ item, index }) => {
          return (
            <RenderGalleryItem
              key={item.originData.id}
              index={index}
              data={item}
              onPress={() => {
                navigation.push('viewer', {
                  dataList,
                  index,
                  page: pid,
                  nowTag: tags,
                })
              }}
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
  getMoreGalleyData,
}

let connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(memo(Gallery))
