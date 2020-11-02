import { loadHtml } from '../utils'
import request from '../utils/reuqest'

export async function list_site(ctx) {
  let html = await request({
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

  // rs.pageTags = getter('.tag-type-general a:nth-of-type(3)')
  // let imgDoms = $('.thumb a').toArray()
  // rs.imgDataList = imgDoms.map((d) => {
  //   let rs = {}
  //   // a标签提取
  //   let $1 = $(d)
  //   rs.id = $1.attr('id').replace('p', '')
  //   rs.origin_d_url = $1.attr('href')
  //   // img提取
  //   let $2 = $(d).children('img')
  //   rs.img_url_preview = $2.attr('src')

  //   return rs
  // })
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
    true
  )

  return rs
}
