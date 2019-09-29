
import * as Router from 'koa-router'
import authenticationRoutes from './authentication'
import feedRoutes from './feed'
import groupRoutes from './group'
import searchRoutes from './searching'
import userRoutes from './user'

const router = new Router()

router.use(authenticationRoutes)
router.use(feedRoutes)
router.use(groupRoutes)
router.use(searchRoutes)
router.use(userRoutes)
router.use(router.allowedMethods())

export default router.routes()
