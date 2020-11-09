let init = {
  count: 0,
  dataList: [],
}

const imgList = (state = init, action) => {
  switch (action.type) {
    case 'imgList/reset':
      return init
    case 'imgList/push':
      state.dataList.push(...action.dataList)
      state.count = action.count
      return { ...state }
    default:
      return state
  }
}

export default imgList
