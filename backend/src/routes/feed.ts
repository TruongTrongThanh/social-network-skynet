import * as Router from 'koa-router'
import { getHomeFeeds, getFeed, postFeed, vote, getVote, postComment } from '../services/feed'
import { FeedForm, FeedVote, FeedCommentForm } from '../models/feed'
import { getSocketIO } from '../socket'

const router = new Router()
const io = getSocketIO()

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
    ctx.body = await getFeed(ctx.state.userID, ctx.query.id)
    ctx.status = 200
  } catch (err) {
    console.log(err)
    ctx.status = 500
  }
})

router.post('/feed', async ctx => {
  ctx.assert(ctx.state.userID, 401)
  try {
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
  await vote(ctx.state.userID, feedVote)
  const feedNumber = await getVote(feedVote.feedID)
  io.emit(`feed-vote-update-${feedVote.feedID}`, feedNumber)
  ctx.status = 200
})

router.post('/feed/comment', async ctx => {
  ctx.assert(ctx.state.userID, 401)
  await postComment(ctx.state.userID, ctx.request.body as FeedCommentForm)
  ctx.status = 200
})

// router.get('/feed/comments', async ctx => {
//   ctx.assert(ctx.state.userID, 401)
//   try {
//     //
//   } catch (err) {
//     console.timeLog(err)
//     ctx.status = 500
//   }
// })

export default router.routes()
