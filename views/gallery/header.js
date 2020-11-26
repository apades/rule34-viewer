import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Appbar } from 'react-native-paper'
import { connect } from 'react-redux'

const GalleryHeader = connect(
  (state) => ({
    getLike: (tag) => state.likes.tags[tag],
  }),
  (dispatch) => ({
    likesToggle: (tag) => dispatch({ type: 'likes/tag_toggle', tag }),
  }),
)(function (props) {
  let { getLike, likesToggle, tags } = props
  let [like, setLike] = useState(false)

  useFocusEffect(() => {
    setLike(getLike(tags))
  })
  let navigation = useNavigation()

  let showLikeBtn = tags.length && tags !== 'img-likes'
  return (
    <Appbar.Header>
      <Appbar.Content title={tags || 'home'} />
      {showLikeBtn ? (
        <Appbar.Action
          icon={like ? 'heart' : 'heart-outline'}
          onPress={() => {
            likesToggle(tags)
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
