import { StateBase, RootActions } from '@r/reducers'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import React, { Dispatch, FC, memo, useState } from 'react'
import { Appbar } from 'react-native-paper'
import { connect, ConnectedProps } from 'react-redux'

type rProps = ConnectedProps<typeof connector> & {
  tags: string
  [k: string]: any
}

const GalleryHeader: FC<rProps> = (props) => {
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
          navigation.navigate('search', { value: tags })
        }}
      />
    </Appbar.Header>
  )
}

const mapStateToProps = (state: StateBase) => {
  return {
    getLike: (tag: string) => state.likes.tags[tag],
  }
}
const mapDispatchToProps = {
  likesToggle: (tag: string) => (dispatch: Dispatch<RootActions>) =>
    dispatch({ type: 'likes/tag_toggle', tag }),
}

let connector = connect(mapStateToProps, mapDispatchToProps)

export default connector(memo(GalleryHeader))
