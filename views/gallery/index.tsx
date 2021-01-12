import React, { Dispatch, FC, memo, useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { FlatGrid } from 'react-native-super-grid'
import { connect, ConnectedProps } from 'react-redux'
import { RootActions, StateBase } from 'reducers'
import DebugInfo from '../../components/debugInfo'
import { _style } from '../../style'
import request from '../../utils/request'
import { parserItemValue, parserStringValue } from '../../utils/ruleParser'
import { genHandlerScrollEnd } from '../../utils/utils'
import GalleryHeader from './header'
import RenderGalleryItem from './item'

type rProps = ConnectedProps<typeof connector> & {
  [k: string]: any
}

const Gallery: FC<rProps> = function (props) {
  let { navigation, route, likesToggle } = props
  console.log(`--- render ${route?.params?.tags ?? 'home'} gallery ---`)

  // dataList
  let [dataList, setDataList] = useState<any>([])

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
    // reset dataList 关键
    dataList.length = 0
    setDataList(dataList)
    setPid(pidInit)
  }

  function loadData(pid: number) {
    setLoading(true)
    // imgLikes-mode
    if (route?.params?.likeList) {
      let dataList = Object.values(imgLikes).reverse()
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
    console.log(requestUrl)
    request(requestUrl).then((res) => {
      let resDataList = parserItemValue(props.rule.discover?.list ?? '$', res)
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
        onScroll={handlerScrollEnd}
        renderItem={({ item, index }) => (
          <RenderGalleryItem
            index={index}
            isLike={!!imgLikes[`rule34_${item.id}`]}
            item={item}
            likesToggle={likesToggle}
            navigation={navigation}
            nowTag={route.params?.tags}
          />
        )}
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
