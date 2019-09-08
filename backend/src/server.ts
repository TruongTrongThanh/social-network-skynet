import * as Koa from 'koa'

import { config } from './config'
import { init } from './database'
import * as bodyParser from 'koa-bodyparser'
import logger from './logging'
import routes from './routes'

const app = new Koa()

init()

app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', 'http://localhost:8080')
  ctx.set('Access-Control-Allow-Credentials', 'true')
  ctx.set('Access-Control-Allow-Headers', 'Content-Type')
  await next()
})

app.use(logger)
app.use(bodyParser())
app.use(routes)

app.listen(config.port)

console.log(`Server running at: http://localhost:${config.port}`)
