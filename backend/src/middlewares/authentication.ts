import * as Koa from 'koa'
import { getIdentityFromJWT, signNewJWT } from '../services/authentication'
import { TokenExpiredError } from 'jsonwebtoken'
import { getUserGroupRoles, getUserIDFromRefreshToken } from '../services/user'
import Cookies = require('cookies')

export default async function auth(ctx: Koa.ParameterizedContext<any, {}>, next: () => Promise<any>) {
  try {
    ctx.state.user = await getIdentityFromJWT(ctx.cookies.get('access_token'))
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      const refreshToken = ctx.cookies.get('refresh_token')

      if (refreshToken) {
        const userID = await getUserIDFromRefreshToken(refreshToken)

        if (userID) {
          const groupRoles = await getUserGroupRoles(userID)
          const accessToken = signNewJWT({ id: userID, roles: groupRoles })
          const options: Cookies.SetOption = { httpOnly: true }

          ctx.cookies.set('access_token', accessToken, options)
          ctx.cookies.set('refresh_token', refreshToken, options)

          ctx.state.user = {
            id: userID,
            roles: groupRoles
          }
        }
      }
    }
  }
  await next()
}
