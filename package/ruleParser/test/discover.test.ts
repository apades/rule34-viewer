import getRuleResult, { setRule } from '..'
import { readFileSync } from 'fs'
import { resolve } from 'path'

beforeAll(() => {
  let ruleText = readFileSync(resolve(__dirname, '../rules/rule34.js'), 'utf-8')
  let _setRule = setRule
  eval(`${ruleText};_setRule(config)`)
})
describe('discover 规则测试', () => {
  let list: any[] = []
  beforeAll(async () => {
    list = await getRuleResult('discover.list', {
      searchString: 'dacad',
      pageNum: 0,
      pageLimit: 10,
    })
  })
  test('discover.url', () => {
    return getRuleResult('discover.url', {
      searchString: 'dacad',
      pageNum: 0,
      pageLimit: 10,
    }).then((url) => expect(url).toMatch(/https?:\/\//))
  })

  test('discover.list', () => {
    return getRuleResult('discover.list', {
      searchString: 'dacad',
      pageNum: 0,
      pageLimit: 10,
    }).then((l) => expect(l.length).toBe(10))
  })

  test('discover.cover', () => {
    return getRuleResult('discover.cover', {
      $item: list[0],
    }).then((cover) => expect(cover).toMatch(/https?:\/\//))
  })
})
