import * as Koa from 'koa'

import { config } from './config'
import { init } from './database'
import logger from './logging'
import routes from './routes'

const app = new Koa()

init()

app.use(logger)
app.use(routes)

app.listen(config.port)

console.log(`Server running on port ${config.port}`)
