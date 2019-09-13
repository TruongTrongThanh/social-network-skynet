
import * as Router from 'koa-router'
import authenticationRoutes from './authentication'
import feedRoutes from './feed'

const router = new Router()

router.use(authenticationRoutes)
router.use(feedRoutes)
router.use(router.allowedMethods())

export default router.routes()
