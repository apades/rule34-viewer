import getRuleResult, { setRequest, setRule } from '..'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import request from './request'

let type: 'rule34' | 'e621' = 'rule34'
let ruleText = readFileSync(resolve(__dirname, `../rules/${type}.js`), 'utf-8')
let _setRule = setRule
eval(`${ruleText};_setRule(config)`)
setRequest(request)
// ---
;(async () => {
  let list: any[] = [],
    $item: any
  list = await getRuleResult('discover.list', {
    searchString: 'dacad',
    pageNum: 0,
    pageLimit: 10,
  })
  $item = list[0]

  console.log(list.length)

  getRuleResult('content.image', {
    id: $item.id,
    $item,
  }).then((cover) => console.log(cover))
})()
