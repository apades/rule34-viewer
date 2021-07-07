// ---- rule pack----
import rule34 from '@r/package/rules/rule34'
import { setRequest, setRule } from '@r/package/ruleParser'
import kkkdm from '@r/package/rules/kkkkdm'
import request from '@r/utils/ruleRequest'
import { RuleType } from './package/ruleParser/type'

let rule_default = kkkdm as RuleType
setRequest(request)
setRule(rule_default)

// let _setRule = setRule
// eval(`${rule34Text};_setRule(config)`)

export default {
  proxy_serverPort: 3001,
  rule_default,
  manga_preload: 3,
}
