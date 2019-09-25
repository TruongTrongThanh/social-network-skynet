import * as Router from 'koa-router'
import { searchPeople } from '../services/searching'

const router = new Router()

router.get('/search', async ctx => {
  ctx.assert(ctx.state.userID, 401)
  ctx.body = await searchPeople(ctx.query.text)
  ctx.status = 200
})

export default router.routes()
