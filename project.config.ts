// ---- rule pack----
// import rule34Text from '@r/package/rules/rule34.text'
import { setRequest, setRule } from '@r/package/ruleParser'
import kkkdm from '@r/package/rules/kkkkdm'
import request from '@r/utils/ruleRequest'
import { RuleType } from './package/ruleParser/type'
setRule(kkkdm)
setRequest(request)

// let _setRule = setRule
// eval(`${rule34Text};_setRule(config)`)

export default {
  proxy_serverPort: 3001,
  rule_default: kkkdm as RuleType,
}
