var config = (() => {
  let listConfig = {
    cover({ $item, $setHeader }) {
      $setHeader({
        Referer: 'https://m.dmzj.com',
      })
      return `https://images.dmzj.com/${$item.cover}`
    },
    author: ({ $item }) => $item.authors.split(' '),
    title: ({ $item }) => $item.name,
    desc: ({ $item }) => `${$item.readergroup}  ${$item.types}`,
    tags: ({ $item }) => ({ 类别: $item.types.split('/') }),
  }
  /**@type {import('../ruleParser/rules/type').RuleType} */
  let config = {
    name: '动漫之家',
    host: 'https://m.dmzj.com',
    contentType: 'manga',
    theme: '#01e3fe',

    discover: {
      url: 'https://m.dmzj.com/classify/0-0-0-0-0-0.json',
      type: 'json',
      list: '$',
      ...listConfig,
    },
    search: {
      url: 'https://m.dmzj.com/search/@{searchString}.html',
      type: 'html',
      list: ({ $query }) => {
        let tarScript = $query('body').text()
        let serchArry = tarScript.match(/serchArry\s*=\s*([^\]]*\])/)[1]
        return JSON.parse(serchArry)
      },
      ...listConfig,
    },
    content: {
      url: ({ $item, id }) =>
        `https://m.dmzj.com/view/${$item.comic_id}/${id}.html`,
      type: 'html',
      tags: listConfig.tags,
      imageList: ({ $query, $setHeader }) => {
        let tarScript = $query('body').text()
        $setHeader({
          Referer: 'https://m.dmzj.com',
        })
        let serchArry = tarScript.match(/\"page_url\":([^\\]]*\\])/)[1]
        return JSON.parse(serchArry)
      },
    },
  }

  return config
})()
