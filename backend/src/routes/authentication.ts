
import * as Router from 'koa-router'
import * as Auth from '../services/authentication'
import Cookies = require('cookies')
import { generateRefreshToken } from '../services/user'

const router = new Router()

router.post('/register', async ctx => {
  await Auth.register(ctx.request.body)
  ctx.status = 200
})

router.post('/login', async ctx => {
  const token = await Auth.login(ctx.request.body)
  ctx.assert(token, 400)
  const options: Cookies.SetOption = {
    httpOnly: true
  }
  ctx.cookies.set('access_token', token.accessToken, options)
  if (Boolean(ctx.request.body.rememberMe)) {
    ctx.cookies.set('refresh_token', token.refreshToken, options)
  }
  ctx.status = 200
})

router.post('/logout', async ctx => {
  ctx.assert(ctx.state.user, 400)
  await generateRefreshToken(ctx.state.user.id)

  const options: Cookies.SetOption = {
    expires: new Date()
  }
  ctx.cookies.set('access_token', '', options)
  ctx.cookies.set('refresh_token', '', options)

  ctx.status = 200
})

router.get('/has-logged-in', async ctx => {
  ctx.assert(ctx.state.user, 401)
  ctx.status = 200
})

export default router.routes()
