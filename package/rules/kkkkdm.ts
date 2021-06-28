import { RuleType } from '../ruleParser/rules/type'

let config = (() => {
  let config: RuleType = {
    contentType: 'manga',
    host: 'https://m.kkkkdm.com/',
    name: 'test managa',
    theme: '#299af4',
    discover: {
      url: 'https://m.kkkkdm.com/comiclist/2044/',
      author: ['asd'],
      cover:
        'https://img.kukudm.com/xpic/%E6%9D%A5%E8%87%AA%E6%B7%B1%E6%B8%8A.jpg',
      desc: 'test 来自深渊',
      title: '来自深渊',
      list: ({ $query }) => {
        let idList = $query('#list > li > a')
          .attr('href')
          .map((id) => ({
            id,
          }))
        return idList
      },
    },
    search: null,
    content: {
      async getImg({ $lastItem, $contentItem, $index, request }) {
        let reqUrl = `https://m.kkkkdm.com/comiclist/${$contentItem.id}/${
          $index + 1
        }.htm`
        let reg = /<IMG.*?m2007\+\"(.*?)\'>/
        let resHtml: string = (await request(reqUrl)) as any
        return {
          img: `https://tu.kukudm.com/${resHtml.match(reg)[1]}`,
          isEnd: resHtml.indexOf('/exit/exit.htm') !== -1,
        }
      },
    },
  }
  return config
})()
