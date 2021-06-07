import rule_rule34 from '../rules/rule34'
import rule_e621 from '../rules/e621'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { omitOjbect } from '@r/utils/utils'

export type SettingDstate = typeof init

let init = {
  debugMode: false,
  isAdvancedTags: true,
  rule: rule_rule34 as any,
  rules: [rule_rule34, rule_e621] as any[],
  loaded: false,
}

export type SettingAction =
  | SettingDebug
  | SettingChange
  | SettingSetRule
  | SettingLoadRules
  | SettingSet

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
  ruleName: string
}
type SettingLoadRules = {
  type: 'setting/loadRules'
  rules: any[]
}
type SettingSet = {
  type: 'setting/set'
} & {
  [k in keyof SettingDstate]?: SettingDstate[k]
}

const setting = (state = init, action: SettingAction): SettingDstate => {
  switch (action.type) {
    case 'setting/debugMode':
      return { ...state, debugMode: action.value ?? !state.debugMode }
    case 'setting/changeSetting':
      let { key, value } = action
      return { ...state, [key]: value }
    case 'setting/setRule':
      let rule = {}
      switch (action.ruleName) {
        case 'e621':
          rule = rule_e621
          break
        case 'rule34':
          rule = rule_rule34
          break
      }
      return { ...state, rule }
    case 'setting/loadRules': {
      return { ...state, rules: action.rules, loaded: true }
    }
    case 'setting/set': {
      let data = omitOjbect(action, ['type'])
      Object.assign(state, data)
      return { ...state }
    }
    default:
      return state
  }
}

export default setting
