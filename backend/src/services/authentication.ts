import PB from '../database'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { LoginForm, RegisterForm, JwtPayload, Token } from '../models/authentication'
import { getUserGroupRoles } from './user'
import * as crypto from 'crypto'

const saltRounds = 10
const JWT_KEY = process.env.JWT_KEY

export async function register(form: RegisterForm) {
  const hashedPass = bcrypt.hash(form.password, saltRounds)
  const query = `
    INSERT INTO public."User" (id, fullname, password, created_at, modified_at, ts_tokens)
    VALUES ($1, $2, $3, $4, $4, to_tsvector($2));
  `
  const params = [form.username, form.fullname, await hashedPass, new Date()]
  await PB.query(query, params)
}

export async function login(form: LoginForm): Promise<Token> {
  if (await isRightPassword(form.username, form.password)) {
    let refreshToken: string
    if (form.rememberMe) {
      refreshToken = await generateRefreshToken(form.username)
    }
    const groupRoles = getUserGroupRoles(form.username)
    const accessToken = this.signNewJWT({ id: form.username, roles: await groupRoles })
    return { accessToken, refreshToken }
  }
  return null
}

export async function isRightPassword(userID: string, password: string): Promise<boolean> {
  const query = `
    SELECT password
    FROM public."User"
    WHERE id = $1;
  `
  const params = [userID]
  const res = await PB.query(query, params)

  if (res.rows[0] && res.rows[0].password) {
    return await bcrypt.compare(password, res.rows[0].password)
  } else return false
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

export async function getRefreshToken(userID: string): Promise<string> {
  const query = `
    SELECT refresh_token
    FROM public."User"
    WHERE id = $1
  `
  const params = [userID]
  const res = await PB.query(query, params)
  return res.rows[0].refresh_token
}

export async function getUserIDFromRefreshToken(refreshToken: string): Promise<string> {
  const query = `
    SELECT id FROM "User" WHERE refresh_token = $1;
  `
  const params = [refreshToken]
  const res = await PB.query(query, params)
  return res.rows[0].id
}

export async function generateRefreshToken(userID: string): Promise<string> {
  const refreshToken = crypto.randomBytes(32).toString('hex')
  const query = `
    UPDATE "User"
    SET refresh_token = $1
    WHERE id = $2;
  `
  const params = [refreshToken, userID]
  await PB.query(query, params)
  return refreshToken
}

export async function generateActivateToken(userID: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex')
  const query = `UPDATE "User" SET is_activated = false, activate_token = $1 WHERE id = $2`
  const params = [token, userID]
  await PB.query(query, params)
  return token
}

export async function generatePasswordToken(userID: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex')
  const query = `UPDATE "User" SET pass_token = $1 WHERE id = $2`
  const params = [token, userID]
  await PB.query(query, params)
  return token
}
