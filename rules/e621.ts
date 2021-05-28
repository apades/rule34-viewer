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
    image: `@js:({$i})=> {
      var md5 = $i.file.md5
      return $i.file.url||\`https://static1.e621.net/data/\${md5[0]}\${md5[1]}/\${md5[2]}\${md5[3]}/\${md5}.\${$i.file.ext}\`
    }`,
    tags: '$.tags',
    reffers: '$.sources',
  },
}
