let init = {
  count: 0,
  pid: 0,
  tag: '',
  index: -1,
  dataList: [],
}

const imgList = (state = init, action) => {
  switch (action.type) {
    case 'imgList/reset':
      return init
    case 'imgList/push':
      let arr = [...state.dataList, ...action.dataList]

      let _data = { ...action }
      delete _data.type
      delete _data.dataList

      Object.assign(state, { ..._data })
      return { ...state, dataList: [...arr] }
    case 'imgList/setIndex':
      return { ...state, index: action.index }
    default:
      return state
  }
}

export default imgList
