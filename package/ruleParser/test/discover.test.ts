import getRuleResult, { setRule } from '..'
import { readFileSync } from 'fs'
import { resolve } from 'path'

describe.each(['rule34', 'e621'])('%s discover 规则测试', (a) => {
  let list: any[] = [],
    $item: any
  beforeAll(async () => {
    let ruleText = readFileSync(resolve(__dirname, `../rules/${a}.js`), 'utf-8')
    let _setRule = setRule
    eval(`${ruleText};_setRule(config)`)

    list = await getRuleResult('discover.list', {
      searchString: 'dacad',
      pageNum: 0,
      pageLimit: 10,
    })
    $item = list[0]
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
      $item,
    }).then((cover) => expect(cover).toMatch(/https?:\/\//))
  })

  describe('content 规则测试', () => {
    test('content.url', () => {
      return getRuleResult('content.url', {
        id: $item.id,
        $item,
      }).then((cover) => expect(cover).toMatch(/https?:\/\//))
    })

    test('content.tags', () => {
      return getRuleResult('content.tags', {
        id: $item.id,
        $item,
      }).then((tags) => {
        let keys = Object.keys(tags)
        return expect(
          keys.length !== 0 && Array.isArray(tags[keys[0]]),
        ).toBeTruthy()
      })
    })
  })
})
