/**@type {import('./type').RuleType} */
// eslint-disable-next-line no-undef
config = {
  name: 'e621',
  host: 'https://e621.net/',
  theme: '#012e56',

  config: {
    pageNumStart: 1,
  },

  discover: {
    url: 'https://e621.net/posts.json?tags=@{searchString}&limit=@{pageLimit}&page=@{pageNum}',
    list: '$.posts',
    cover({ $item }) {
      var md5 = $item.file.md5
      return (
        $item.preview.url ||
        `https://static1.e621.net/data/preview/${md5[0]}${md5[1]}/${md5[2]}${md5[3]}/${md5}.${$item.file.ext}`
      )
    },
  },
  content: {
    image({ $item }) {
      var md5 = $item.file.md5
      return (
        $item.file.url ||
        `https://static1.e621.net/data/${md5[0]}${md5[1]}/${md5[2]}${md5[3]}/${md5}.${$item.file.ext}`
      )
    },
    tags: '$.tags',
    reffers: '$.sources',
    originUrl: 'https://e621.net/posts/@{id}',
  },
}
