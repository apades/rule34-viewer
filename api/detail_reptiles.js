import parse from 'node-html-parser'
import request from '../utils/request'

export async function detailTags(id) {
  let html = await request('https://rule34.xxx/index.php', {
    params: {
      id,
      page: 'post',
      s: 'view',
    },
  })
  let root = parse(html)

  let tags = {}

  function getTagsText(queryStr) {
    return root.querySelectorAll(queryStr).map((el) => el.text)
  }

  tags.copyrights = getTagsText('.tag-type-copyright a')
  tags.characters = getTagsText('.tag-type-character a')
  tags.artists = getTagsText('.tag-type-artist a')
  tags.generals = getTagsText('.tag-type-general a')
  tags.metadatas = getTagsText('.tag-type-metadata a')

  return tags
}
