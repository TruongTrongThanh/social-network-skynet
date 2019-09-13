
import * as Router from 'koa-router'
import { getHomeFeeds, getFeed, postFeed, vote, getVote } from '../services/feed'
import { FeedForm, FeedVote } from '../models/feed'

const router = new Router()

router.get('/home-feeds', async ctx => {
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

router.get('/feed', async ctx => {
  ctx.assert(ctx.state.userID, 401)
  try {
    ctx.body = await getFeed(ctx.state.userID, ctx.request.body.feedID)
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
  try {
    const feedVote = ctx.request.body as FeedVote
    await vote(ctx.state.userID, feedVote)
    ctx.body = await getVote(feedVote.feedID)
    ctx.status = 200
  } catch (err) {
    console.log(err)
    ctx.status = 500
  }
})

router.get('/feed/comments', async ctx => {
  ctx.assert(ctx.state.userID, 401)
  try {
    //
  } catch (err) {
    console.timeLog(err)
    ctx.status = 500
  }
})

export default router.routes()
