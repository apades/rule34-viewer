import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { set } from 'lodash'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Appbar, IconButton } from 'react-native-paper'
import { connect } from 'react-redux'
import { Comp_seachInput } from '../../components/searchInput'

function dom(props) {
  let { getLike, tag, likesToggle, searchText } = props
  let [like, setLike] = useState(getLike(searchText))
  // let like = getLike(tag)

  let styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  })

  function RenderTitle() {
    console.log('searchText', searchText, searchText !== 'img-likes')
    let showLikeBtn = searchText.length && searchText !== 'img-likes'
    return (
      <>
        <Text>{searchText || 'home'}</Text>
        {showLikeBtn ? (
          <IconButton
            color="#6cf"
            icon={like ? 'heart' : 'heart-outline'}
            onPress={() => {
              likesToggle(searchText)
              setLike(!like)
            }}
            size={15}
          />
        ) : (
          <></>
        )}
      </>
    )
  }

  let navigation = useNavigation()
  return (
    <View style={styles.container}>
      {props.searching ? (
        <Comp_seachInput navigation={navigation} />
      ) : (
        <RenderTitle />
      )}
    </View>
  )
}

export const GalleryTitle = connect(
  (state) => ({
    getLike: (tag) => state.likes.tags[tag],
    searching: state.search.searching,
    searchText: state.search.text,
  }),
  (dispatch) => ({
    likesToggle: (tag) => dispatch({ type: 'likes/tag_toggle', tag }),
  }),
)(dom)

export const GalleryHeaderRight = connect(
  (state) => ({
    searching: state.search.searching,
  }),
  (dispatch) => ({
    searchToggle: () => dispatch({ type: 'search/toggle' }),
  }),
)(function ({ searchToggle, searching }) {
  return (
    <IconButton
      icon={searching ? 'close' : 'magnify'}
      onPress={() => {
        searchToggle()
        console.log(`${searching ? 'close' : 'open'} search`)
      }}
    />
  )
})

const GalleryHeader = connect(
  (state) => ({
    searchText: state.search.text,
    getLike: (tag) => state.likes.tags[tag],
    likes: state.likes.tags,
  }),
  (dispatch) => ({
    likesToggle: (tag) => dispatch({ type: 'likes/tag_toggle', tag }),
  }),
)(function (props) {
  let { searchText, getLike, likesToggle, likes } = props
  let [like, setLike] = useState(false)

  useFocusEffect(() => {
    setLike(getLike(searchText))
  })
  let navigation = useNavigation()

  let showLikeBtn = searchText.length && searchText !== 'img-likes'
  return (
    <Appbar.Header>
      <Appbar.Content title={searchText || 'home'} />
      {showLikeBtn ? (
        <Appbar.Action
          icon={like ? 'heart' : 'heart-outline'}
          onPress={() => {
            likesToggle(searchText)
            setLike((like) => !like)
          }}
        />
      ) : (
        <></>
      )}

      <Appbar.Action
        icon="magnify"
        onPress={() => {
          navigation.push('search')
        }}
      />
    </Appbar.Header>
  )
})

export default GalleryHeader
