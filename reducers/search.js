let init = {
  searching: false,
}

const search = (state = init, action) => {
  switch (action.type) {
    case 'search/toggle':
      return { ...state, searching: !state.searching }
    default:
      return state
  }
}

export default search
