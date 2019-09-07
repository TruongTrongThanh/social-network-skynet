
import * as Router from 'koa-router'

const router = new Router()

router.get('/user', async ctx => {
  ctx.body = 'your user...'
})

router.post('/user', async ctx => {
  ctx.body = 'create user...'
})

export default router.routes()
