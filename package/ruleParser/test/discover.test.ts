import getRuleResult, { setRule } from '..'
import { readFileSync } from 'fs'
import { resolve } from 'path'

console.time('read rule')
let ruleText = readFileSync(resolve(__dirname, '../rules/rule34.js'), 'utf-8')
let _setRule = setRule
eval(`${ruleText};_setRule(config)`)
console.timeEnd('read rule')
// ---
;(async function () {
  console.time('eval')
  let list = await getRuleResult('discover.url', {
    searchString: 'dacad',
    pageNum: 0,
    pageLimit: 10,
  })
  console.log('list.length', list)

  let cover = await getRuleResult('discover.cover', {
    $item: list[0],
  })
  console.log('cover', cover)
  console.timeEnd('eval')
})()
