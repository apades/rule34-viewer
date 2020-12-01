import AsyncStorage from '@react-native-async-storage/async-storage'

let init = {
  histories: [],
}

const search = (state = init, action) => {
  switch (action.type) {
    case 'search/addHis':
      let histories = init.histories
      let value = action.value
      let hasIndex = histories.indexOf(value)
      if (hasIndex !== -1) histories.splice(hasIndex, 1)
      histories.push(value)
      histories.length = 10
      AsyncStorage.setItem('searchHistories', JSON.stringify(histories))

      return { ...state, histories }
    default:
      return { ...state }
  }
}

export default search
