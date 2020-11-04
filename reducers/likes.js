const likes = (state = {}, action) => {
  switch (action.type) {
    case 'likes_toggle':
      state[action.id] = !state[action.id]
      return { ...state }
    default:
      return state
  }
}

export default likes
