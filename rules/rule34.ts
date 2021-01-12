type RuleTemplate = 'list'
type RuleGetType = 'html' | 'json'
type RuleContentType = 'image' | 'manga' | 'text'
type RuleDetailProps = {
  url: string
  ctype: RuleContentType
  gtype?: RuleGetType
  tags?: string
} & {
  ctype: 'image' | 'manga'
  image: string
}

type RuleProps = {
  name: string
  home?: {
    template?: RuleTemplate
  }
  list: {
    url: string
    gtype?: RuleGetType
    list: string
    cover: string
  }
  detail: RuleDetailProps
}

let rule: RuleProps = {
  name: 'rule34',
  list: {
    url:
      'https://rule34.xxx/index.php?page=dapi&s=post&q=index&json=1&tags=@{searchString}&limit=@{pageLimit}&pid=@{pageNum}',
    list: '$',
    cover:
      "@js:($)=>`https://rule34.xxx/thumbnails/${$.directory}/thumbnail_${$.image.replace(/^(.*)\\..*?$/,'$1.jpg')}`",
  },
  detail: {
    url: 'https://rule34.xxx/index.php?page=post&s=view&id=@{id}',
    gtype: 'html',
    ctype: 'image',
    image:
      '@js:({$i})=>`https://rule34.xxx/images/${$i.directory}/${$i.image}`',
    tags:
      "@js:({$q})=>({ copyright:$q('.tag-type-copyright a').text(),character:$q('.tag-type-character a').text(),artist:$q('.tag-type-artist a').text(),general:$q('.tag-type-general a').text(),metadata:$q('.tag-type-metadata a').text()})",
  },
}

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
    _tags:
      '@map{copyright::@css:.tag-type-copyright a@text||character::@css:.tag-type-copyright a@text||artist::@css:.tag-type-artist a@text||general::@css:.tag-type-general a@text||metadata::@css:.tag-type-metadata a@text}@',
    tags:
      "@js:({$q})=>({ copyright:$q('.tag-type-copyright a').text(),character:$q('.tag-type-character a').text(),artist:$q('.tag-type-artist a').text(),general:$q('.tag-type-general a').text(),metadata:$q('.tag-type-metadata a').text()})",
  },
}
