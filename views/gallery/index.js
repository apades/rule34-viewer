import { connect } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ActivityIndicator, Text } from 'react-native-paper'
import { FlatGrid } from 'react-native-super-grid'
import { imgList_o } from '../../api/list_o'
import { _style } from '../../style'
import { RenderGalleryItem } from './item'
import { View_viewer } from '../viewer'
import GalleryHeader from './header'
import DebugInfo from '../../components/debugInfo'

let init = true
var Gallery = connect(
  (state) => {
    return {
      imgDataList: state.imgList.dataList,
      imgLikes: state.likes.imgs,
      searchText: state.search.text,
    }
  },
  (dispatch) => ({
    likesToggle: (data) =>
      dispatch({ type: 'likes/img_toggle', id: data.id, data }),
    resetImgList: () => dispatch({ type: 'imgList/reset' }),
    pushImgList: (data) =>
      dispatch({
        type: 'imgList/push',
        ...data,
      }),
  }),
)(function (props) {
  console.log(`--- render ${props.searchText} gallery ---`)
  let { navigation, route, likesToggle } = props
  let [dataList, setDataList] = useState([])
  let [pid, setPid] = useState(0)
  let [loading, setLoading] = useState(false)

  let [firstLoad, setFirstLoad] = useState(true)

  let { resetImgList, pushImgList, imgLikes, searchText } = props
  useEffect(() => {
    initState()

    loadData()
  }, [searchText])

  function initState() {
    // reset dataList 关键
    dataList.length = 0
    setDataList(dataList)
    setPid(0)
    init = true
    resetImgList()
    setFirstLoad(true)
  }

  function loadData() {
    setLoading(true)
    if (searchText === 'img-likes') {
      let dataList = Object.values(imgLikes)
      setDataList(dataList)
      init = false
      setFirstLoad(false)
      pushImgList({ count: dataList.length, dataList, pid: 0 })
      return
    }
    imgList_o({ tags: searchText, limit: 20, pid }).then((res) => {
      let newDataList = [...dataList, ...res.dataList]
      setDataList(newDataList)

      pushImgList({ ...res, pid })
      if (init) {
        console.log('init')
        init = false
        setFirstLoad(false)
      }
      setLoading(false)
    })
  }

  // container scroll event
  function handlerScrollEnd(e) {
    function isCloseToBottom({
      layoutMeasurement,
      contentOffset,
      contentSize,
    }) {
      return (
        layoutMeasurement.height + contentOffset.y >= contentSize.height - 1
      )
    }
    if (isCloseToBottom(e.nativeEvent)) {
      if (!loading) {
        console.log('scroll end', pid)
        setPid((pid) => pid + 1)
        loadData()
      }
    }
  }

  function RenderViewer() {
    return <View_viewer />
  }
  return (
    <View style={{ ..._style.wh('100%'), position: 'relative' }}>
      <GalleryHeader />
      {!firstLoad ? (
        <FlatGrid
          data={dataList}
          onScroll={handlerScrollEnd}
          renderItem={({ item, index }) => (
            <RenderGalleryItem
              index={index}
              isLike={!!imgLikes[item.id]}
              item={item}
              likesToggle={likesToggle}
              navigation={navigation}
            />
          )}
        />
      ) : (
        <View style={{ ..._style.wh('100%'), ..._style.center() }}>
          <ActivityIndicator animating={true} />
        </View>
      )}
      <RenderViewer />
      <DebugInfo>
        <Text>length:{dataList.length}</Text>
      </DebugInfo>
    </View>
  )
})

export default Gallery
