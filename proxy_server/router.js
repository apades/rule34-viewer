import koaRouter from '@koa/router'
import { request } from './request'

let router = new koaRouter()
router
  .get('/', (ctx) => (ctx.body = 'yeah'))
  .get('/proxy', async (ctx) => {
    let url = decodeURIComponent(ctx.query.url)
    console.log(`${'proxy:'.green} ${url}`)
    let res = await request(url, {
      responseType: 'arraybuffer',
      headers: {
        cookie: ctx.req.headers?.cookie ?? '',
      },
    })

    Object.entries(res?.headers ?? {}).forEach(([key, val]) => {
      ctx.set(key, val)
    })
    ctx.body = res.data
  })
  // TODO 去除旧的
  .get('/proxy-img', async (ctx) => {
    let url = decodeURIComponent(ctx.query.url)
    let res = await request(url, { responseType: 'arraybuffer' })

    Object.entries(res.headers).forEach(([key, val]) => {
      ctx.set(key, val)
    })
    ctx.body = res.data
  })

export default router
