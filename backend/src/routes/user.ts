import * as Router from 'koa-router'
import { getSessionUser, getUserDetails, updateUser, sendVerifiedEmail, activateEmail, generateActivateToken, getEmails } from '../services/user'
import User from '../models/user'
import * as shortID from 'short-uuid'
import { upload } from '../services/storage'

const router = new Router()

router.get('/session-user', async ctx => {
  ctx.assert(ctx.state.user, 401)
  ctx.body = await getSessionUser(ctx.state.user.id)
  ctx.status = 200
})

router.get('/user', async ctx => {
  ctx.assert(ctx.state.user, 401)
  ctx.assert(ctx.query.id, 400)
  ctx.body = await getUserDetails(ctx.query.id)
  ctx.status = 200
})

router.post('/update-user', async ctx => {
  ctx.assert(ctx.state.user, 401)
  ctx.assert(ctx.request.body, 400)

  const user: User = ctx.request.body
  if (ctx.state.user.id === user.id) {
    if (user.avatar && !user.avatar.startsWith('http')) {
      const avatar = Buffer.from(user.avatar.split(',')[1], 'base64')
      user.avatar = await upload(avatar, `avatar/${shortID.generate()}.jpg`)
    }
    const [email, tmpEmail] = await getEmails(user.id)
    if (user.email && user.email !== email) {
      const token = await generateActivateToken(ctx.state.user.id)
      const url = `http://localhost:8080/activate-email?token=${token}`
      if (email) {
        await sendVerifiedEmail(email, url)
      } else {
        await sendVerifiedEmail(user.email, url)
      }
    }
    await updateUser(user)
  } else ctx.throw(401)

  ctx.status = 200
})

router.post('/send-email', async ctx => {
  ctx.assert(ctx.state.user, 401)
  ctx.assert(ctx.request.body.email, 400)
  const token = await generateActivateToken(ctx.state.user.id)
  const url = `http://localhost:8080/activate-email?token=${token}`
  await sendVerifiedEmail(ctx.request.body.email, url)
  ctx.status = 200
})

router.post('/activate-email', async ctx => {
  ctx.assert(ctx.request.body.token, 400)
  const count = await activateEmail(ctx.request.body.token)
  if (count === 0) ctx.throw(400)
  ctx.status = 200
})

export default router.routes()
