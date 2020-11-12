import { connect } from 'react-redux'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'
import { FlatGrid } from 'react-native-super-grid'
import { imgList_o } from '../../api/list_o'
import { _style } from '../../style'
import { RenderGalleryItem } from './item'

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
    likesToggle: (id) => dispatch({ type: 'likes/img_toggle', id }),
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
  let pid = 0
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
    pid = 0
    init = true
    resetImgList()
  }

  function loadData() {
    setLoading(true)
    imgList_o({ tags: searchText || 'dacad', limit: 20, pid }).then((res) => {
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
        console.log('scroll end')
        pid++
        loadData()
      }
    }
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
    },
  })
  return (
    <View style={{ ..._style.wh('100%'), position: 'relative' }}>
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
      <View
        style={{
          position: 'absolute',
          width: '100%',
          alignItems: 'center',
          top: 10,
        }}
      ></View>
    </View>
  )
})

export default Gallery
