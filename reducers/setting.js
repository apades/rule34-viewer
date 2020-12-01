let init = {
  debugMode: false,
  isAdvancedTags: true,
}

const setting = (state = init, action) => {
  switch (action.type) {
    case 'setting/debugMode':
      return { ...state, debugMode: action.value ?? !state.debugMode }
    case 'setting/changeSetting':
      let { key, value } = action
      return { ...state, [key]: value }
    default:
      return state
  }
}

export default setting
