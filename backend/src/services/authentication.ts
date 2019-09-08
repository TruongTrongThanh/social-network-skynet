import PB from '../database'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import User from '../models/user'

const saltRounds = 10
const JWT_KEY = process.env.JWT_KEY

export interface JwtPayload {
  id: string
}

export async function register(username: string, fullname: string, password: string) {
  const hashedPass = bcrypt.hash(password, saltRounds)
  const query = `
    INSERT INTO public."User" (id, fullname, password, created_at, modified_at)
    VALUES ($1, $2, $3, $4, $4);
  `
  const params = [username, fullname, await hashedPass, new Date()]
  await PB.query(query, params)
}

export async function login(username: string, password: string): Promise<string> {
  const query = `
    SELECT password
    FROM public."User"
    WHERE id = $1;
  `
  const params = [username]
  const res = await PB.query(query, params)

  if (res.rows[0] && res.rows[0].password) {
    const isEqual = await bcrypt.compare(password, res.rows[0].password)
    if (isEqual) {
      return jwt.sign({ id: username }, process.env.JWT_KEY)
    }
  }
  return null
}

export async function getUser(jwtoken: string): Promise<User> {
  const decoded: any = jwt.verify(jwtoken, JWT_KEY)
  const query = `
    SELECT id, fullname, avatar
    FROM public."User"
    WHERE id = $1
  `
  const params = [decoded.id]
  const res = await PB.query(query, params)
  return res.rows[0] as User
}
