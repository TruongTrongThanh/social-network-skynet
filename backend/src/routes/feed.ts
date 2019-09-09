
import * as Router from 'koa-router'
import { postFeed, FeedForm } from '../services/feed'
import { getUserIDFromJWT } from '../services/authentication'

const router = new Router()

router.post('/feed', async ctx => {
  try {
    const userID = await getUserIDFromJWT(ctx.cookies.get('access_token'))
    await postFeed(ctx.request.body as FeedForm, userID)
    ctx.status = 200
  } catch (err) {
    console.log(err)
    ctx.status = 500
  }
})

export default router.routes()
