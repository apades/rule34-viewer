let init = {
  searching: false,
  text: '',
}

const search = (state = init, action) => {
  switch (action.type) {
    case 'search/toggle':
      return { ...state, searching: !state.searching }
    case 'search/input':
      return { ...state, text: action.text }
    default:
      return state
  }
}

export default search
