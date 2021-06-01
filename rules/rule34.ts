export default {
  name: 'rule34',
  host: 'https://rule34.xx',
  discover: {
    url:
      'https://rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&tags=@{searchString}&limit=@{pageLimit}&pid=@{pageNum}',
    list: '$',
    name: '',
    cover:
      "@js:($)=>`https://rule34.xxx/thumbnails/${$.directory}/thumbnail_${$.image.replace(/^(.*)\\..*?$/,'$1.jpg')}`",
  },
  content: {
    url: 'https://rule34.xxx/index.php?page=post&s=view&id=@{id}',
    type: 'html',
    image:
      '@js:({$i})=>`https://rule34.xxx/images/${$i.directory}/${$i.image}`',
    tags:
      "@js:({$q})=>({ copyright:$q('.tag-type-copyright a').text(),character:$q('.tag-type-character a').text(),artist:$q('.tag-type-artist a').text(),general:$q('.tag-type-general a').text(),metadata:$q('.tag-type-metadata a').text()})",
  },
}
