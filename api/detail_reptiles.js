import { loadHtml } from '../utils'
import request from '../utils/reuqest'

export async function detail_site(ctx) {
  let html = await request('https://rule34.xxx/index.php', {
    params: {
      id: ctx.params.id,
      page: 'post',
      s: 'view',
    },
  })

  let rs = resolveData(html)

  return rs
}

export function resolveData(html) {
  let getter = loadHtml(html)
  let $ = getter.$
  let rs = {}

  rs.img_url = getter('#image', 'src')[0]
  // info
  rs.sources = getter('#stats li:nth-of-type(4) a', 'href')
  rs.date = getter('#stats li:nth-of-type(2)')[0].match(
    /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/,
  )[0]
  // info

  // tags
  rs.tags = {}
  let tags = rs.tags

  function getTagData(className) {
    return getter(
      className,
      [
        {
          q: 'a',
          attr: {
            tag: '',
          },
        },
        {
          q: 'span',
          attr: {
            count: '',
          },
        },
      ],
      true,
    )
  }
  tags.copyrights = getTagData('.tag-type-copyright')
  tags.characters = getTagData('.tag-type-character')
  tags.artists = getTagData('.tag-type-artist')
  tags.generals = getTagData('.tag-type-general')
  tags.metadatas = getTagData('.tag-type-metadata')
  // tags

  return rs
}
