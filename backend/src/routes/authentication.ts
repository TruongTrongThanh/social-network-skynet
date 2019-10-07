
import * as Router from 'koa-router'
import * as Auth from '../services/authentication'
import Cookies = require('cookies')
import { RegisterForm } from '../models/authentication'

const router = new Router()

router.post('/register', async ctx => {
  const form: RegisterForm = ctx.request.body

  ctx.assert(form.username, 400, 'Bạn chưa nhập username.')
  ctx.assert(form.password, 400, 'Bạn chưa nhập password.')
  if (form.username.length > 50) ctx.throw('Username không được quá 50 kí tự.')

  await Auth.register(ctx.request.body)
  ctx.status = 200
})

router.post('/login', async ctx => {
  const token = await Auth.login(ctx.request.body)
  ctx.assert(token, 401)
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
  await Auth.generateRefreshToken(ctx.state.user.id)

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
