let init = {
  count: 0,
  dataList: [],
}

const imgList = (state = init, action) => {
  switch (action.type) {
    case 'imgList/reset':
      return init
    case 'imgList/push':
      let arr = [...state.dataList, ...action.dataList]
      state.count = action.count
      return { ...state, dataList: [...arr] }
    default:
      return state
  }
}

export default imgList
