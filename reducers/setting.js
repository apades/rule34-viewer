import rule_rule34 from '../rules/rule34.json'
import rule_e621 from '../rules/e621.json'
import AsyncStorage from '@react-native-async-storage/async-storage'

let init = {
  debugMode: false,
  isAdvancedTags: true,
  rule: rule_rule34,
}

const setting = (state = init, action) => {
  switch (action.type) {
    case 'setting/debugMode':
      return { ...state, debugMode: action.value ?? !state.debugMode }
    case 'setting/changeSetting':
      let { key, value } = action
      return { ...state, [key]: value }
    case 'setting/setRule':
      let ruleName = action.ruleName
      AsyncStorage.setItem('setting/rule', ruleName)
      return { ...state, rule: ruleName === 'rule34' ? rule_rule34 : rule_e621 }
    default:
      return state
  }
}

export default setting
