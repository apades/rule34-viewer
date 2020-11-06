let init = {
  imgs: {},
  tags: {},
}

const likes = (state = init, action) => {
  switch (action.type) {
    case 'likes/img_toggle':
      state.imgs[action.id] = !state.imgs[action.id]
      // 这样不让他更新全部
      return state
    case 'likes/tag_toggle':
      state.tags[action.id] = !state.tags[action.id]
      return state
    default:
      return state
  }
}

export default likes
