import * as Koa from 'koa'
import { getUserIDFromJWT } from '../services/authentication'

export default async function auth(ctx: Koa.ParameterizedContext<any, {}>, next: () => Promise<any>) {
  try {
    ctx.state.userID = await getUserIDFromJWT(ctx.cookies.get('access_token'))
  } catch (err) {
    //
  }
  await next()
}
