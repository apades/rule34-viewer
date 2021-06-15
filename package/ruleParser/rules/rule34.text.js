export default `
var config = {
  name: 'rule34',
  host: 'https://rule34.xx',
  theme: '#aae5a4',

  discover: {
    url: 'https://rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&tags=@{searchString}&limit=@{pageLimit}&pid=@{pageNum}',
    list: '$',
    cover({ $item }) {
      return \`https://rule34.xxx/thumbnails/\${
        \$item.directory
      }/thumbnail_\${$item.image.replace(/^(.*)\\..*?$/, '$1.jpg')}\`
    },
  },
  content: {
    url: 'https://rule34.xxx/index.php?page=post&s=view&id=@{id}',
    type: 'html',
    image({ $item }) {
      return \`https://rule34.xxx/images/\${$item.directory}/\${$item.image}\`
    },
    tags({ $query }) {
      return {
        copyright: $query('.tag-type-copyright a').text(),
        character: $query('.tag-type-character a').text(),
        artist: $query('.tag-type-artist a').text(),
        general: $query('.tag-type-general a').text(),
        metadata: $query('.tag-type-metadata a').text(),
      }
    },
  },
}
`
