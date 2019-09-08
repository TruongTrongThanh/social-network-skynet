
import * as Router from 'koa-router'
import authenticationRoutes from './authentication'

const router = new Router()

router.options('*', async ctx => {
  ctx.status = 200
})
router.use(authenticationRoutes)

export default router.routes()
