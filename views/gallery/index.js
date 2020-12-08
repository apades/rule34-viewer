import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { ActivityIndicator, Text } from 'react-native-paper'
import { FlatGrid } from 'react-native-super-grid'
import { connect } from 'react-redux'
import { imgList_o } from '../../api/list_o'
import DebugInfo from '../../components/debugInfo'
import _config from '../../config/base.config'
import { _style } from '../../style'
import request from '../../utils/request'
import { parserStringValue } from '../../utils/ruleParser'
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

  let [dataList, setDataList] = useState([])
  let [pid, setPid] = useState(0)
  let loading = false,
    setLoading = () => {}

  let [firstLoad, setFirstLoad] = useState(true)

  let { imgLikes } = props
  useEffect(() => {
    initState()

    loadData(0)
  }, [])

  function initState() {
    console.log(`initState,${route.params?.tags ?? 'home'}`)
    // reset dataList 关键
    dataList.length = 0
    setDataList(dataList)
    setPid(0)
  }

  function loadData(pid) {
    setLoading(true)
    if (route?.params?.likeList) {
      let dataList = Object.values(imgLikes).reverse()
      setDataList(dataList)
      setFirstLoad(false)
      setLoading(false)
      return
    }

    let tags = route?.params?.tags ?? ''
    console.log(`load ${tags}`)

    let requestUrl = parserStringValue(_config.rule.discover.url, {
      searchString: tags,
      pageLimit: 20,
      pageNum: pid,
    })
    // console.log(requestUrl)
    request(requestUrl).then((res) => {
      function ejectData() {
        let newDataList = [...dataList, ...res]
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
    })

    // imgList_o({ tags, limit: 20, pid }).then((res) => {
    //   function ejectData() {
    //     let newDataList = [...dataList, ...res.dataList]
    //     setDataList(newDataList)
    //     setLoading(false)
    //   }

    //   if (firstLoad) {
    //     console.log('init')
    //     setFirstLoad(() => {
    //       ejectData()
    //       return false
    //     })
    //   } else {
    //     ejectData()
    //   }
    // })
  }

  // container scroll event
  let handlerScrollEnd = genHandlerScrollEnd(() => {
    if (!loading) {
      console.log('scroll end pid:', pid)
      loadData(pid + 1)
      setPid(pid + 1)
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
