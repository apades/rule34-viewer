import { loadHtml } from '../utils'
import request from '../utils/reuqest'

export async function list_site(ctx) {
  let html = await request('https://rule34.xxx/index.php', {
    params: {
      tags: ctx.params.tags,
      page: 'post',
      s: 'list',
    },
  })

  let rs = resolveData(html)

  return rs
}

export function resolveData(html) {
  let getter = loadHtml(html)
  let $ = getter.$
  let rs = {}

  rs.imgDataList = getter(
    '.thumb a',
    [
      {
        q: '',
        attr: { id: 'id', origin_url: 'href' },
      },
      {
        q: 'img',
        attr: { img_url_preview: 'src' },
      },
    ],
    true,
  )

  return rs
}
