import AsyncStorage from '@react-native-async-storage/async-storage'

export type SearchDstate = {
  histories: string[]
}
let init: SearchDstate = {
  histories: [],
}

export type SearchAction = SearchInit | SearchAdd

type SearchInit = {
  type: 'search/initHis'
  histories: string[]
}
type SearchAdd = {
  type: 'search/addHis'
  value: string
}

const search = (state = init, action: SearchAction): SearchDstate => {
  switch (action.type) {
    case 'search/addHis':
      console.log(`add ${action.value}`)

      let histories = init.histories
      let value = action.value
      // clear had
      let hasIndex = histories.indexOf(value)
      if (hasIndex !== -1) histories.splice(hasIndex, 1)

      histories.unshift(value)

      // clear lengthout
      if (histories.length > 10) histories.pop()
      AsyncStorage.setItem('searchHistories', JSON.stringify(histories))

      return { ...state, histories }
    case 'search/initHis':
      return { ...state, histories: action.histories || [] }
    default:
      return { ...state }
  }
}

export default search
