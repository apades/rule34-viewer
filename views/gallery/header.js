import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { IconButton } from 'react-native-paper'
import { connect } from 'react-redux'
import { Comp_seachInput } from '../../components/searchInput'

function dom(props) {
  let { getLike, tag, likesToggle } = props
  let [like, setLike] = useState(getLike(tag))
  // let like = getLike(tag)

  let styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  })

  function RenderTitle() {
    return (
      <>
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

let GalleryHeader = connect(
  (state) => ({
    getLike: (tag) => state.likes.tags[tag],
    searching: state.search.searching,
  }),
  (dispatch) => ({
    likesToggle: (tag) => dispatch({ type: 'likes/tag_toggle', tag }),
  }),
)(dom)

export default GalleryHeader

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
