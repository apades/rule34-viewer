let init = {
  imgs: {},
  tags: {},
}

const likes = (state = init, action) => {
  switch (action.type) {
    case 'likes/img_toggle':
      if (state.imgs[action.id]) delete state.imgs[action.id]
      else state.imgs[action.id] = true
      // 这样不让他更新全部
      return state
    case 'likes/tag_toggle':
      if (state.tags[action.tag]) delete state.tags[action.tag]
      else state.tags[action.tag] = true
      return state
    default:
      return state
  }
}

export default likes
