import { omitOjbect } from '@r/utils/utils'
import rule34Text from '@r/package/ruleParser/rules/rule34.text'
import { RuleType } from '@r/package/ruleParser/rules/type'
import { setRule } from '@r/package/ruleParser'

export type SettingDstate = typeof init

type ruleFile = {
  name: string
  fileName: string
}
let rule: RuleType
eval(`${rule34Text};rule=config`)
console.log('rule', rule.name)
let init = {
  debugMode: false,
  rule,
  ruleList: [] as ruleFile[],
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
