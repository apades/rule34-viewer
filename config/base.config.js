import rule_rule34 from '../rules/rule34.json'
import rule_e621 from '../rules/e621.json'
import AsyncStorage from '@react-native-async-storage/async-storage'

// config
const _config = {
  gallery: {
    rowNum: 2,
    pageLimit: 20,
  },
  showDebugComponent: false,
  rule: rule_rule34,
}
AsyncStorage.getItem('config_rule').then((res) => {
  console.log('get', res)
  if (res) _config.rule = res === 'rule_rule34' ? rule_rule34 : rule_e621
})

export default _config
