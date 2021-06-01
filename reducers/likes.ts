import { GalleryItem } from '@r/types/itemType'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type LikesDstate = {
  imgs: {
    [k: string]: GalleryItem
  }
  tags: {
    [k: string]: boolean
  }
}

let init: LikesDstate = {
  imgs: {},
  tags: {},
}

export type LikesAction =
  | LikesInit
  | LikesImgToggle
  | LikesTagToggle
  | LikesClear

type LikesInit = {
  type: 'likes/init'
  imgs: {
    [k: string]: GalleryItem
  }
  tags: {
    [k: string]: boolean
  }
  initStore?: true
}
type LikesImgToggle = {
  type: 'likes/img_toggle'
  id: number
  data: GalleryItem
}
type LikesTagToggle = {
  type: 'likes/tag_toggle'
  tag: string
}
type LikesClear = {
  type: 'likes/clear'
  key: 'tag' | 'img'
}

const likes = (state = init, action: LikesAction): LikesDstate => {
  switch (action.type) {
    case 'likes/init':
      for (let i in action.imgs) {
        state.imgs[i] = action.imgs[i]
      }
      for (let i in action.tags) {
        state.tags[i] = action.tags[i]
      }
      if (action.initStore) {
        console.log('initStore')
        AsyncStorage.setItem('imgLikes', JSON.stringify(state.imgs))
        AsyncStorage.setItem('tagLikes', JSON.stringify(state.tags))
      }
      return { ...state }
    case 'likes/img_toggle':
      let id = `rule34_${action.id}`
      if (state.imgs[id]) delete state.imgs[id]
      else state.imgs[id] = action.data
      AsyncStorage.setItem('imgLikes', JSON.stringify(state.imgs))
      return state
    case 'likes/tag_toggle':
      if (state.tags[action.tag]) delete state.tags[action.tag]
      else state.tags[action.tag] = true
      AsyncStorage.setItem('tagLikes', JSON.stringify(state.tags))
      return state
    case 'likes/clear':
      if (action.key === 'img') state.imgs = {}
      else if (action.key === 'tag') state.tags = {}

      AsyncStorage.setItem(`${action.key}Likes`, '{}')
      return { ...state }
    default:
      return state
  }
}

export default likes
