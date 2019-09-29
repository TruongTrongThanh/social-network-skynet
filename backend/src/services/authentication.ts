import PB from '../database'
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken'
import { LoginForm, RegisterForm, JwtPayload, Token } from '../models/authentication'
import { getUserGroupRoles, generateRefreshToken } from './user'

const saltRounds = 10
const JWT_KEY = process.env.JWT_KEY

export async function register(form: RegisterForm) {
  const hashedPass = bcrypt.hash(form.password, saltRounds)
  const query = `
    INSERT INTO public."User" (id, fullname, password, created_at, modified_at)
    VALUES ($1, $2, $3, $4, $4);
  `
  const params = [form.username, form.fullname, await hashedPass, new Date()]
  await PB.query(query, params)
}

export async function login(form: LoginForm): Promise<Token> {
  const query = `
    SELECT password
    FROM public."User"
    WHERE id = $1;
  `
  const params = [form.username]
  const res = await PB.query(query, params)

  if (res.rows[0] && res.rows[0].password) {
    const isEqual = await bcrypt.compare(form.password, res.rows[0].password)
    if (isEqual) {
      let refreshToken: string
      if (form.rememberMe) {
        refreshToken = await generateRefreshToken(form.username)
      }
      const groupRoles = getUserGroupRoles(form.username)
      const accessToken = this.signNewJWT({ id: form.username, roles: await groupRoles })
      return { accessToken, refreshToken }
    }
  }
  return null
}

export function signNewJWT(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_KEY, {
    expiresIn: '1h'
  })
}

export function getIdentityFromJWT(jwtoken?: string): Promise<JwtPayload> {
  return new Promise((resolve, reject) => {
    if (!jwtoken) resolve(null)
    else {
      jwt.verify(jwtoken, JWT_KEY, (err, decoded) => {
        if (err) reject(err)
        else resolve(decoded as JwtPayload)
      })
    }
  })
}
