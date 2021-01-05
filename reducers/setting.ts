import rule_rule34 from '../rules/rule34'
import rule_e621 from '../rules/e621'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type SettingDstate = {
  debugMode: boolean
  isAdvancedTags: boolean
  rule: any
}

let init: SettingDstate = {
  debugMode: false,
  isAdvancedTags: true,
  rule: rule_rule34,
}

export type SettingAction = SettingDebug | SettingChange | SettingSetRule

type SettingDebug = {
  type: 'setting/debugMode'
  value?: boolean
}
type SettingChange = {
  type: 'setting/changeSetting'
  key: keyof SettingDstate
  value: any
}
type SettingSetRule = {
  type: 'setting/setRule'
  ruleName: 'rule34' | 'e621'
}

const setting = (state = init, action: SettingAction): SettingDstate => {
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
