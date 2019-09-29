import PB from '../database'
import User from '../models/user'
import { GroupRole } from '../models/authentication'
import * as crypto from 'crypto'


export async function getSessionUser(userID: string): Promise<User> {
  const query = `SELECT id, fullname, avatar FROM "User" WHERE id = $1;`
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

