export default {
  name: 'e621',
  host: 'https://e621.net/',
  config: {
    pageNumStart: 1,
  },
  discover: {
    url:
      'https://e621.net/posts.json?tags=@{searchString}&limit=@{pageLimit}&page=@{pageNum}',
    list: '$.posts',
    cover: '$.preview.url',
  },
  content: {
    image: '$.file.url',
    tags: '$.tags',
    reffers: '$.sources',
  },
}
