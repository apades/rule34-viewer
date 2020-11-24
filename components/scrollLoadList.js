import React, { useState } from 'react'
import { Component } from 'react'
import { View } from 'react-native'
import { ActivityIndicator, Text } from 'react-native-paper'
import { FlatGrid, FlatGridProps } from 'react-native-super-grid'
import { _style } from '../style'

/**
 * @typedef {object} props
 *
 * @property {function(callbackData):Promise<any[]>}    handleLoadData
 * @property {function(callbackData):void}              handleLoadDataCallback
 *
 * @property {function(callbackData):Component}         renderItem
 * @property {function(callbackData):Component}         renderLoading
 * @property {function(callbackData):Component}         renderFirstLoad
 * @property {function(callbackData):Component}         renderEmpty
 * @property {function(callbackData):Component}         renderError
 *
 * @typedef {props & FlatGridProps} scrollLoadListProps
 */

/**
 * @typedef callbackData
 * @property {number}   page
 * @property {any[]}    dataList
 */

/**
 * @param {scrollLoadListProps} props
 */
export default function scrollLoadList(props) {
  let loading = false,
    setLoading = () => {}
  let [firstLoad, setFirstLoad] = useState(true)

  let [page, setPage] = useState(0)
  let [dataList, setDataList] = useState([])

  let { handleLoadData, handleLoadDataCallback } = props
  let init = false

  function loadData(page) {
    setLoading(true)
    handleLoadData({ page, dataList }).then((res) => {
      let newDataList = [...dataList, ...res.dataList]
      setDataList(newDataList)

      handleLoadDataCallback()
      if (init) {
        init = false
        setFirstLoad(false)
      }
      setLoading(false)
    })
  }
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
        loadData(page + 1)
        setPage(page + 1)
      }
    }
  }

  function RenderLoading() {
    let { renderLoading } = props
    let [_loading, _setLoading] = useState(false)
    loading = _loading
    setLoading = _setLoading

    let el = renderLoading ? (
      renderLoading()
    ) : (
      <View style={{ position: 'absolute', bottom: 10, left: 10 }}>
        <ActivityIndicator animating={true} />
      </View>
    )

    return _loading & !firstLoad ? el : <></>
  }

  function RenderEmpty() {
    let { renderEmpty } = props
    let el = renderEmpty ? (
      renderEmpty()
    ) : (
      <View style={_style.center()}>
        <Text>No Data</Text>
      </View>
    )
    return el
  }

  function RenderFlatGrid() {
    if (!firstLoad && dataList.length === 0) return RenderEmpty()
    if (firstLoad) {
      return (
        <View style={{ ..._style.wh('100%'), ..._style.center() }}>
          <ActivityIndicator animating={true} />
        </View>
      )
    } else {
      return (
        <FlatGrid
          data={dataList}
          onScroll={handlerScrollEnd}
          renderItem={({ item, index }) => <View>{renderItem()}</View>}
        />
      )
    }
  }

  let { renderItem } = props
  return (
    <View style={{ ..._style.wh('100%'), position: 'relative' }}>
      {RenderFlatGrid()}
      {RenderLoading()}
    </View>
  )
}
