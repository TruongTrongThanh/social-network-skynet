
import * as Router from 'koa-router'
import * as Auth from '../services/authentication'
import User from '../models/user'

const router = new Router()

router.post('/register', async ctx => {
  try {
    await Auth.register(ctx.request.body.username, ctx.request.body.fullname, ctx.request.body.password)
    ctx.status = 200
  } catch (err) {
    console.log(err)
    ctx.status = 500
  }
})

router.post('/login', async ctx => {
  try {
    const accessToken = await Auth.login(ctx.request.body.username, ctx.request.body.password)
    ctx.cookies.set('access_token', accessToken, {
      httpOnly: true
    })
    ctx.status = 200
  } catch (err) {
    console.log(err)
    ctx.status = 400
  }
})

router.post('/get-user', async ctx => {
  try {
    const jwtoken = ctx.cookies.get('access_token')
    console.log(jwtoken)
    const identity: User = await Auth.getUser(jwtoken)
    ctx.body = identity
  } catch (err) {
    ctx.status = 403
  }
 })

export default router.routes()
