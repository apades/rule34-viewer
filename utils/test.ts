import { testrule34 } from '../types/rule'
import { createRuleParser } from './ruleParser'

async function main() {
  let rulefn = createRuleParser(testrule34)
  let list = await rulefn.getListData({
    listName: 'dacad',
    pid: 0,
  })

  let detail = await rulefn.getDetailData({
    index: 19,
  })

  console.log(detail)
}

main()
