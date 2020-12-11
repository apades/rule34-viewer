import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { ActivityIndicator, Text } from 'react-native-paper'
import { FlatGrid } from 'react-native-super-grid'
import { connect } from 'react-redux'
import DebugInfo from '../../components/debugInfo'
import _config from '../../config/base.config'
import { _style } from '../../style'
import request from '../../utils/request'
import { parserItemValue, parserStringValue } from '../../utils/ruleParser'
import { genHandlerScrollEnd } from '../../utils/utils'
import GalleryHeader from './header'
import { RenderGalleryItem } from './item'

var Gallery = connect(
  (state) => {
    return {
      imgLikes: state.likes.imgs,
    }
  },
  (dispatch) => ({
    likesToggle: (data) =>
      dispatch({ type: 'likes/img_toggle', id: data.id, data }),
  }),
)(function (props) {
  let { navigation, route, likesToggle } = props
  console.log(`--- render ${route?.params?.tags ?? 'home'} gallery ---`)

  // dataList
  let [dataList, setDataList] = useState([])

  // pid
  let pidInit = _config.rule?.config?.pageNumStart ?? 0
  let [pid, setPid] = useState(pidInit)

  // loading
  let loading = false,
    setLoading = () => {}
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

  function loadData(pid) {
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
    let requestUrl = parserStringValue(_config.rule.discover.url, {
      searchString: tags,
      pageLimit: 20,
      pageNum: pid,
    })
    // console.log(requestUrl)
    request(requestUrl).then((res) => {
      let resDataList = parserItemValue(_config.rule.discover?.list ?? '$', res)
      function ejectData() {
        let newDataList = [...dataList, ...resDataList]
        setDataList(newDataList)
        setLoading(false)
      }
      if (firstLoad) {
        console.log('init')
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

  function RenderLoading() {
    let [_loading, _setLoading] = useState(false)
    loading = _loading
    setLoading = _setLoading

    return _loading && !firstLoad ? (
      <View
        style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 1000 }}
      >
        <ActivityIndicator animating={true} />
      </View>
    ) : (
      <></>
    )
  }

  return (
    <View style={{ ..._style.wh('100%'), position: 'relative' }}>
      <GalleryHeader tags={route.params?.tags || ''} />
      {!firstLoad ? (
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
      ) : (
        <View style={{ ..._style.wh('100%'), ..._style.center() }}>
          <ActivityIndicator animating={true} />
        </View>
      )}
      <DebugInfo>
        <Text>
          l:{dataList.length} p:{pid}
        </Text>
      </DebugInfo>
      {RenderLoading()}
    </View>
  )
})

export default Gallery
