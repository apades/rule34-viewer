import koaRouter from '@koa/router'
import { search } from 'booru'
import { request } from './request'
var e2k = require('koa-connect')

let router = new koaRouter()
router
  .get('/', () => 'yeah')
  .get('/proxy', async (ctx) => {
    let { url } = ctx.query
    url = decodeURIComponent(url)
    console.log(`proxy: ${url}`)
    let body = await request(url)
    ctx.body = body
  })
  .get('/booru/:site/:tags', async ({ params, query }) => {
    let tags = [...params.tags.split(',')]

    let data = await search(params.site, tags, query)
    return data
  })
  .get('/proxy-img', async (ctx) => {
    let url = decodeURIComponent(ctx.query.url)
    console.log(url)
    let res = await request(url, { responseType: 'arraybuffer' })
    ctx.set('content-type', 'image/png')
    ctx.body = res
  })

export default router
