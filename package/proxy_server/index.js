import koa from 'koa'
import koaLogger from 'koa-logger'
import config from './project.config'

import 'colors'
import router from './router'

let app = new koa()

app.use(koaLogger())
// cache
var e2k = require('koa-connect'),
  cache = require('apicache').middleware
var midd = e2k(cache('1 hours'))
app.use(midd)
// cache

// 这里use顺序反的话就没法设置cors了
app.use(async (ctx, next) => {
  await next()
  ctx.set('Access-Control-Allow-Origin', '*')
})
app.use(router.routes())

app.listen(config.server_Port, () => {
  console.log(`listen in ${`http://localhost:${config.server_Port}/`.green}`)
})
