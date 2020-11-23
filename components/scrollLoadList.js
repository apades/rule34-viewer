import React, { useState } from 'react'
import { Component } from 'react'
import {} from 'react-native'
import { FlatGrid } from 'react-native-super-grid'

/**
 * @typedef {object} scrollLoadListProps
 * @property {object} navigation    路由组件
 * @property {object} route         路由组件
 *
 * @property {function(callbackData):Promise<any[]>}    handleLoadData
 *
 * @property {function(callbackData):Component}         renderLoading
 * @property {function(callbackData):Component}         renderFirstLoad
 * @property {function(callbackData):Component}         renderEmpty
 * @property {function(callbackData):Component}         renderError
 *
 */

/**
 * @typedef callbackData
 * @property {number}   page
 * @property {any[]}    dataList
 * @property {number}   limit
 */

/**
 * @param {scrollLoadListProps} props
 */
export default function scrollLoadList(props) {
  let { navigation, route } = props

  let [loading, setLoading] = useState(false)
  let [page, setPage] = useState(0)
  let [dataList, setDataList] = useState([])

  let { handleLoadData } = props

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
        page++
        handleLoadData()
      }
    }
  }

  return <FlatGrid />
}

scrollLoadList({
  async handleLoadData({ page }) {
    return new Promise((res) => {
      res([])
    })
  },
})