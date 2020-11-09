import React, { useEffect, useState } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { IconButton } from 'react-native-paper'
import { connect } from 'react-redux'

function dom({ getLike, tag, likesToggle }) {
  let [like, setLike] = useState(getLike(tag))
  // let like = getLike(tag)

  let styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  })
  return (
    <View style={styles.container}>
      <Text>{tag}</Text>
      <IconButton
        color="#6cf"
        icon={like ? 'heart' : 'heart-outline'}
        onPress={() => {
          likesToggle(tag)
          setLike(!like)
        }}
        size={15}
      />
    </View>
  )
}

let GalleryHeader = connect(
  (state) => ({
    getLike: (tag) => state.likes.tags[tag],
  }),
  (dispatch) => ({
    likesToggle: (tag) => dispatch({ type: 'likes/tag_toggle', tag }),
  }),
)(dom)

export default GalleryHeader

export function GalleryHeaderRight() {
  return <IconButton icon="magnify" onPress={() => console.log('search')} />
}
