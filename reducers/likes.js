const likes = (state = {}, action) => {
  switch (action.type) {
    case 'likes_toggle':
      state[action.id] = !state[action.id]
      // 这样不让他更新全部
      return state
    default:
      return state
  }
}

export default likes
