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
      list: async ({ xmlParser, request }) => {
        let res = await request('http://m.kkkkdm.com/comiclist/2044/', {
          responseType: 'arraybuffer',
        })
        console.log('res', res.data)
        let html = new TextDecoder('GBK').decode(res.data)
        let $query = xmlParser(html)
        let els = $query('#list li a')
        let idList = els
          .attr('href')
          .map((id) => id.match(/^\/comiclist\/(.*)\/1.htm$/)[1])
        let nameList = els.text()
        return nameList.map((name, i) => ({
          name,
          id: idList[i],
        }))
      },
    },
    search: null,
    content: {
      async getImg({ $item, $index, request }) {
        let reqUrl = `http://m.kkkkdm.com/comiclist/${$item.id}/${
          $index + 1
        }.htm`
        let reg = /<IMG.*?m2007\+\"(.*?)\'>/
        let res = await request(reqUrl, {
          responseType: 'arraybuffer',
        })
        let resHtml = new TextDecoder('GBK').decode(res.data)
        return {
          img: `https://tu.kukudm.com/${resHtml.match(reg)[1]}`,
          isEnd: resHtml.indexOf('/exit/exit.htm') !== -1,
        }
      },
    },
  }
  return config
})()

export default config
