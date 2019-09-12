
import * as Router from 'koa-router'
import { getHomeFeeds, postFeed, vote, getVote } from '../services/feed'
import { FeedForm, FeedVote } from '../models/feed'

const router = new Router()

router.get('/feed', async ctx => {
  ctx.assert(ctx.state.userID, 401)
  try {
    ctx.body = await getHomeFeeds(ctx.state.userID)
    console.log(ctx.body)
    ctx.status = 200
  } catch (err) {
    console.log(err)
    ctx.status = 500
  }
})

router.post('/feed', async ctx => {
  try {
    ctx.assert(ctx.state.userID, 401)
    await postFeed(ctx.request.body as FeedForm, ctx.state.userID)
    ctx.status = 200
  } catch (err) {
    console.log(err)
    ctx.status = 500
  }
})

router.post('/feed/vote', async ctx => {
  ctx.assert(ctx.state.userID, 401)
  const feedVote = ctx.request.body as FeedVote
  await vote(ctx.body.userID, feedVote)
  ctx.body = await getVote(feedVote.feedID)
  ctx.status = 200
})

export default router.routes()
