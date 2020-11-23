import AsyncStorage from '@react-native-async-storage/async-storage'

let init = {
  imgs: {},
  tags: {},
}

const likes = (state = init, action) => {
  switch (action.type) {
    case 'likes/init':
      for (let i in action.imgs) {
        state.imgs[i] = action.imgs[i]
      }
      for (let i in action.tags) {
        state.tags[i] = action.tags[i]
      }
      return { ...state }
    case 'likes/img_toggle':
      if (state.imgs[action.id]) delete state.imgs[action.id]
      else state.imgs[action.id] = true
      // 这样不让他更新全部
      AsyncStorage.setItem('imgLikes', JSON.stringify(state.imgs))
      return state
    case 'likes/tag_toggle':
      if (state.tags[action.tag]) delete state.tags[action.tag]
      else state.tags[action.tag] = true
      AsyncStorage.setItem('tagLikes', JSON.stringify(state.tags))
      return state
    case 'likes/clear':
      state[action.key] = {}
      return { ...state }
    default:
      return state
  }
}

export default likes
