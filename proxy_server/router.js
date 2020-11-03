import koaRouter from '@koa/router'
import { getList } from './api'
import list from './api/list'
import detail from './api/detail'
import { search } from 'booru'
import { createProxyMiddleware } from 'http-proxy-middleware'
import Axios from 'axios'
import { request_o } from './request'
var e2k = require('koa-connect')

let router = new koaRouter()
router
  .get('/', () => 'yeah')
  .get('/getList', async (ctx) => {
    let data = await getList(ctx.query)
    ctx.body = data
  })
  .get('/list/:tags', async (ctx) => {
    let data = await list(ctx)
    ctx.body = data
  })
  .get('/detail/:id', async (ctx) => {
    let data = await detail(ctx)
    ctx.body = data
  })
  .get('/rule34/:tags', async ({ params, query }) => {
    let tags = [...params.tags.split(',')]

    let data = await search('rule34', tags, query)
    return data
  })
  .get('/img/:url', async ({ params }) => {})

router.get('/proxy-img', async (ctx) => {
  let url = decodeURIComponent(ctx.query.url)
  console.log(url)
  let res = await request_o(url, { responseType: 'arraybuffer' })
  ctx.set('content-type', 'image/png')
  ctx.body = res
})

export default router
