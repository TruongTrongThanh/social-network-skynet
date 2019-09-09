
import * as Router from 'koa-router'
import authenticationRoutes from './authentication'
import feedRoutes from './feed'

const router = new Router()

router.options('*', async ctx => {
  ctx.status = 200
})

router.use(authenticationRoutes)
router.use(feedRoutes)

export default router.routes()
