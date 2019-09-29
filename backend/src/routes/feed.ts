import * as Router from 'koa-router'
import { getHomeFeeds, getFeed, postFeed, vote, getVote, postComment, postReply, getShareFeeds, getGroupFeeds, getUserFeeds } from '../services/feed'
import {  FeedVote, FeedForm } from '../models/feed'
import { getSocketIO } from '../socket'
import { upload } from '../services/storage'
import * as shortID from 'short-uuid'

const router = new Router()
const io = getSocketIO()

router.get('/home-feeds', async ctx => {
  ctx.assert(ctx.state.user, 401)
  ctx.body = await getHomeFeeds(ctx.state.user.id)
  console.log(ctx.body)
  ctx.status = 200
})

router.get('/share-feeds', async ctx => {
  ctx.assert(ctx.state.user, 401)
  ctx.assert(ctx.query.id, 400)
  ctx.body = await getShareFeeds(ctx.state.user.id, ctx.query.id)
  ctx.status = 200
})

router.get('/group-feeds', async ctx => {
  ctx.assert(ctx.state.user, 401)
  ctx.assert(ctx.query.id, 400)
  ctx.body = await getGroupFeeds(ctx.state.user.id, ctx.query.id)
  ctx.status = 200
})

router.get('/user-feeds', async ctx => {
  ctx.assert(ctx.state.user, 401)
  ctx.assert(ctx.query.id, 400)
  ctx.body = await getUserFeeds(ctx.state.user.id, ctx.query.id)
  ctx.status = 200
})

router.get('/feed', async ctx => {
  ctx.assert(ctx.state.user, 401)
  ctx.body = await getFeed(ctx.state.user.id, ctx.query.id)
  ctx.status = 200
})

router.post('/feed', async ctx => {
  ctx.assert(ctx.state.user, 401)
  const form: FeedForm = ctx.request.body
  if (form.image && !form.shareFromFeedID) {
    const img = Buffer.from(form.image.split(',')[1], 'base64')
    form.imageURL = await upload(img, `feed/${shortID.generate()}.jpg`)
  }
  ctx.body = await postFeed(form, ctx.state.user.id)
  ctx.status = 200
})

router.post('/feed/vote', async ctx => {
  ctx.assert(ctx.state.user, 401)
  const feedVote = ctx.request.body as FeedVote
  await vote(ctx.state.user.id, feedVote)
  const feedNumber = await getVote(feedVote.feedID)
  feedNumber.voteState = feedVote.voteState
  feedNumber.userID = ctx.state.user.id
  io.emit(`feed-vote-update-${feedVote.feedID}`, feedNumber)
  ctx.status = 200
})

router.post('/feed/comment', async ctx => {
  ctx.assert(ctx.state.user, 401)
  ctx.body = await postComment(ctx.state.user.id, ctx.request.body)
  ctx.status = 200
})

router.post('/feed/comment/reply', async ctx => {
  ctx.assert(ctx.state.user, 401)
  ctx.body = await postReply(ctx.state.user.id, ctx.request.body)
  ctx.status = 200
})

export default router.routes()
