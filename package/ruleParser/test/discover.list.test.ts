import getRuleResult, { setRule } from '..'
import { readFileSync } from 'fs'
import { resolve } from 'path'

console.time('read rule')
let ruleText = readFileSync(resolve(__dirname, '../rules/e621.js'), 'utf-8')
let _setRule = setRule
eval(`${ruleText};_setRule(config)`)
console.timeEnd('read rule')
// ---
;(async function () {
  console.time('eval')
  let list = await getRuleResult('discover.list', {
    searchString: 'dacad',
    pageNum: 0,
    pageLimit: 10,
  })
  console.log(list.length)
  console.timeEnd('eval')
})()
