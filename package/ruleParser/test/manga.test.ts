import getRuleResult, { setRequest, setRule } from '..'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import request from './request'

describe.each(['kkkkdm'])('%s discover 规则测试', (a) => {
  let list: any[] = [],
    $item: any
  beforeAll(async () => {
    let ruleText = readFileSync(
      resolve(__dirname, `../../rules/${a}.js`),
      'utf-8',
    )
    let _setRule = setRule
    eval(`${ruleText};_setRule(config)`)
    setRequest(request)

    list = await getRuleResult('discover.list', {
      searchString: 'none',
      pageNum: 0,
      pageLimit: 10,
    })
    $item = list[0]
    // if (!$item) return Promise.reject('no $item')
  })
  test('discover.url', () => {
    return getRuleResult('discover.url', {
      searchString: 'none',
      pageNum: 0,
      pageLimit: 10,
    }).then((url) => expect(url).toMatch(/https?:\/\//))
  })

  test('discover.list', () => {
    return getRuleResult('discover.list', {
      searchString: 'none',
      pageNum: 0,
      pageLimit: 10,
    }).then((l) => expect(l[0]).not.toBe(undefined))
  })

  test('discover.cover', () => {
    return getRuleResult('discover.cover', {
      $item,
    }).then((cover) => expect(cover).toMatch(/https?:\/\//))
  })

  describe('content 规则测试', () => {
    test('content.getImg', () => {
      return getRuleResult('content.getImg', {
        $item,
        $index: 26,
      }).then((data) => {
        console.log(data)
        expect(data.img).not.toBe(undefined)
      })
    })
  })
})
