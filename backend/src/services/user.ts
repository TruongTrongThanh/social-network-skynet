import PB from '../database'
import User from '../models/user'
import { GroupRole } from '../models/authentication'
import * as bcrypt from 'bcrypt'

const saltRounds = 10

export async function getSessionUser(userID: string): Promise<User> {
  const query = `
    SELECT
      id, fullname, avatar, email,
      is_activated AS "isActivated"
      FROM "User"
    WHERE id = $1;`
  const params = [userID]
  const res = await PB.query(query, params)
  return res.rows[0]
}

export async function getUserDetails(userID: string): Promise<User> {
  const query = `SELECT * FROM get_user_details($1);`
  const params = [userID]
  const res = await PB.query(query, params)
  return res.rows[0]
}

export async function getUserGroupRoles(userID: string): Promise<GroupRole[]> {
  const query = `SELECT group_id, role FROM "Group_User" WHERE user_id = $1;`
  const params = [userID]
  const res = await PB.query(query, params)
  return res.rows
}

export async function updateUser(user: User) {
  let hashedPass: string | null = null
  if (user.password && user.password !== '') {
    hashedPass = await bcrypt.hash(user.password, saltRounds)
  }
  const query = `
    UPDATE "User"
    SET
      fullname = $1::varchar,
      avatar = $2,
      position = $3::varchar,
      email = $4,
      password = COALESCE($5, password),
      ts_tokens = to_tsvector($1) || to_tsvector($3)
    WHERE id = $6;
  `
  const params = [user.fullname, user.avatar, user.position, user.email, hashedPass, user.id]
  await PB.query(query, params)
}

export async function updatePasswordFromPassToken(newPassword: string, passToken: string) {
  const hashedPass = await bcrypt.hash(newPassword, saltRounds)
  const query = `
    UPDATE "User"
    SET
      password = $1
    WHERE pass_token = $2;
  `
  const params = [hashedPass, passToken]
  await PB.query(query, params)
}

export async function getIDAndActivateStateFromEmail(email: string): Promise<string[]> {
  const query = `SELECT id, is_activated AS "isActivated" FROM "User" WHERE email = $1`
  const params = [email]
  const res = await PB.query(query, params)
  if (res.rows.length > 0) return [res.rows[0].id, res.rows[0].isActivated]
  else return [null, null]
}

export async function getTopUsers(): Promise<User[]> {
  const query = `SELECT * FROM get_user_stats() as stats
    ORDER BY stats."feedCount" DESC, stats."cmtCount" DESC
    LIMIT 3`
  const res = await PB.query(query)
  return res.rows
}
