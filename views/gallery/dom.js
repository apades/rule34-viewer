import React, { useEffect, useState } from 'react'
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native'
import {
  ScrollView,
  TouchableNativeFeedback,
} from 'react-native-gesture-handler'
import { ActivityIndicator, Button, IconButton } from 'react-native-paper'
import { FlatGrid } from 'react-native-super-grid'
import { imgList_o } from '../../api/list_o'
import { Comp_seachInput } from '../../components/searchInput'
import { _style } from '../../style'
import { _env, _screen } from '../../utils/env'
import { dom, RenderGalleryItem } from './item'

export default function view_gallery(props) {
  let { navigation, route, likesToggle } = props
  let [dataList, setDataList] = useState([])
  let [pid, setPid] = useState(0)
  let [loading, setLoading] = useState(false)

  let init = true
  let [firstLoad, setFirstLoad] = useState(true)

  let { resetImgList, pushImgList } = props
  useEffect(() => {
    // reset dataList 关键
    dataList.length = 0
    setDataList(dataList)
    setPid(0)

    resetImgList()
  }, [])

  useEffect(() => {
    setLoading(true)
    imgList_o({ tags: route.params?.tags || 'dacad', limit: 20, pid }).then(
      (res) => {
        let newDataList = [...dataList, ...res.dataList]
        setDataList(newDataList)

        pushImgList({ ...res, pid })
        if (init) {
          init = false
          setFirstLoad(false)
        }
        setLoading(false)
      },
    )
  }, [pid])

  // flex 模拟grid作用
  function isLast(i) {
    /** @type {ViewStyle} */
    let s = {}
    return i + 1 === dataList.length ? s : {}
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
        setPid(++pid)
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
    <View style={{ ..._style.wh('100%'), position: 'absolute' }}>
      {!firstLoad ? (
        <FlatGrid
          data={dataList}
          onScroll={handlerScrollEnd}
          renderItem={({ item, index }) => (
            <RenderGalleryItem
              index={index}
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
      >
        <Comp_seachInput navigation={navigation} />
      </View>
    </View>
  )
}
