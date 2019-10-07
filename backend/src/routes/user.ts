import * as Router from 'koa-router'
import { getSessionUser, getUserDetails, updateUser, getIDAndActivateStateFromEmail, updatePasswordFromPassToken } from '../services/user'
import User from '../models/user'
import * as shortID from 'short-uuid'
import { upload } from '../services/storage'
import { isRightPassword, generateActivateToken, generatePasswordToken } from '../services/authentication'
import { getEmail, sendVerifiedEmail, activateEmail, sendResetPassEmail } from '../services/email'

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

  const user: User = ctx.request.body.user
  const password: string = ctx.request.body.authPassword

  if (ctx.state.user.id === user.id) {
    if (user.avatar && !user.avatar.startsWith('http')) {
      const avatar = Buffer.from(user.avatar.split(',')[1], 'base64')
      user.avatar = await upload(avatar, `avatar/${shortID.generate()}.jpg`)
    }

    const email = await getEmail(user.id)
    const emailIsChanged = user.email && user.email !== email
    const passwordIsChanged = user.password && user.password !== ''

    if (passwordIsChanged || emailIsChanged) {
      const rightPass = await isRightPassword(user.id, password)
      if (!rightPass) ctx.throw(401)
    }

    if (emailIsChanged) {
      const token = await generateActivateToken(ctx.state.user.id)
      const url = `http://localhost:8080/activate-email?token=${token}`
      await sendVerifiedEmail(user.email, url)
    }

    await updateUser(user)
  } else ctx.throw(401)

  ctx.status = 200
})

router.post('/send-resetpass-email', async ctx => {
  ctx.assert(ctx.request.body.email, 400)
  const email: string = ctx.request.body.email
  const [id, isActivated] = await getIDAndActivateStateFromEmail(email)
  ctx.assert(id, 400, 'Email không tồn tại')
  ctx.assert(isActivated, 400, 'Email chưa được activate')
  const token = await generatePasswordToken(id)
  const resetUrl = `http://localhost:8080/reset-password?token=${token}`
  await sendResetPassEmail(email, resetUrl)
  ctx.status = 200
})

router.post('/reset-password', async ctx => {
  ctx.assert(ctx.request.body.newPassword, 400)
  ctx.assert(ctx.request.body.token, 400)
  await updatePasswordFromPassToken(ctx.request.body.newPassword, ctx.request.body.token)
  ctx.status = 200
})

router.post('/activate-email', async ctx => {
  ctx.assert(ctx.request.body.token, 400)
  const count = await activateEmail(ctx.request.body.token)
  if (count === 0) ctx.throw(400)
  ctx.status = 200
})

export default router.routes()
