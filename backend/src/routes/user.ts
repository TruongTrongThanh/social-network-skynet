import * as Router from 'koa-router'
import { getSessionUser, getUserDetails } from '../services/user'

const router = new Router()

router.get('/session-user', async ctx => {
  ctx.assert(ctx.state.user, 401)
  ctx.body = await getSessionUser(ctx.state.user.id)
  ctx.status = 200
})

router.get('/user', async ctx => {
  ctx.assert(ctx.state.user, 401)
  ctx.assert(ctx.query.id, 400)
  ctx.body = await getUserDetails(ctx.query.id)
  ctx.status = 200
})

export default router.routes()
