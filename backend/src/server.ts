import * as Koa from 'koa'
import * as cors from '@koa/cors'
import { socketInit } from './socket'
import * as http from 'http'
import { databaseInit } from './database'
import * as path from 'path'

const app = new Koa()
databaseInit()
const server = http.createServer(app.callback())
const io = socketInit(server)

import { config } from './config'
import * as bodyParser from 'koa-bodyparser'
import logger from './logging'
import auth from './middlewares/authentication'
import routes from './routes'
import * as serve from 'koa-static'

app.use(cors({ credentials: true }))
app.use(logger)
app.use(bodyParser())
app.use(auth)
app.use(routes)
app.use(serve(path.resolve(__dirname, '../static')))

io.on('connection', (socket: SocketIO.Socket) => {
  console.log('a user connected.')
})

server.listen(config.port)

console.log(`Server running at: http://localhost:${config.port}`)
