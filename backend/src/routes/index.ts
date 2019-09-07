
import * as Router from 'koa-router'
import userRoutes from './user'

const router = new Router()

router.use(userRoutes)

export default router.routes()
