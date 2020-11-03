import AsyncStorage from '@react-native-async-storage/async-storage'

let dataList = []
let likes = []
export function like_add(data) {
  return
}
export function like_remove(data) {
  let index = likes.findIndex((d) => d.id === data.id)
  likes.splice(index, 1)
}

export function store_setDataList(_dataList) {
  dataList = _dataList
}

export function store_getDataList() {
  return dataList
}

export function store_clearDataList() {
  dataList.length = 0
}
