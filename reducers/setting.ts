import { omitOjbect } from '@r/utils/utils'
import rule34Text from '@r/package/ruleParser/rules/rule34.text'
import { RuleType } from '@r/package/ruleParser/rules/type'

export type SettingDstate = typeof init

type ruleFile = {
  name: string
  fileName: string
}
let rule: RuleType
eval(`${rule34Text};rule=config`)
let init = {
  debugMode: false,
  rule,
  ruleList: [] as ruleFile[],
}

export type SettingAction = SettingSet

type SettingSet = {
  type: 'setting/set'
} & {
  [k in keyof SettingDstate]?: SettingDstate[k]
}

const setting = (state = init, action: SettingAction): SettingDstate => {
  switch (action.type) {
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
