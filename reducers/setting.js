let init = {
  debugMode: false,
}

const setting = (state = init, action) => {
  switch (action.type) {
    case 'setting/debugMode':
      console.log(`set,${action.value}`)
      return { ...state, debugMode: action.value ?? !state.debugMode }
    default:
      return state
  }
}

export default setting
