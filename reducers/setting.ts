import { setRule } from '@r/package/ruleParser'
import { RuleType } from '@r/package/ruleParser/type'
import projectConfig from '@r/project.config'
import { omitOjbect } from '@r/utils/utils'

export type ruleFile = {
  name: string
  fileName: string
}
export type SettingDstate = {
  debugMode: boolean
  rule: RuleType
  ruleList: ruleFile[]
}
let rule = projectConfig.rule_default
console.log('rule', rule)

let init: SettingDstate = {
  debugMode: false,
  rule,
  ruleList: [],
}

export type SettingAction = SettingSet | SettingSetRule

type SettingSet = {
  type: 'setting/set'
} & {
  [k in keyof SettingDstate]?: SettingDstate[k]
}

type SettingSetRule = {
  type: 'setting/setRule'
  ruleString: string
}

const setting = (state = init, action: SettingAction): SettingDstate => {
  switch (action.type) {
    case 'setting/set': {
      let data = omitOjbect(action, ['type'])
      Object.assign(state, data)
      return { ...state }
    }
    case 'setting/setRule': {
      let _rule: RuleType,
        _setRule = setRule
      eval(`${action.ruleString};_rule=config;_setRule(config)`)
      console.log('change rule', _rule?.name)
      return { ...state, rule: _rule }
    }
    default:
      return state
  }
}

export default setting
