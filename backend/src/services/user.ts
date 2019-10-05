import PB from '../database'
import User from '../models/user'
import { GroupRole } from '../models/authentication'
import * as crypto from 'crypto'
import * as nodemailer from 'nodemailer'


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

export async function updateUser(user: User) {
  const query = `
    UPDATE "User"
    SET
      fullname = $1,
      avatar = $2,
      position = $3,
      tmp_email = $4
    WHERE id = $5;
  `
  const params = [user.fullname, user.avatar, user.position, user.email, user.id]
  await PB.query(query, params)
}

export async function generateActivateToken(userID: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex')
  const query = `UPDATE "User" SET activate_token = $1 WHERE id = $2`
  const params = [token, userID]
  await PB.query(query, params)
  return token
}

export async function activateEmail(token: string): Promise<number> {
  const query = `UPDATE "User" SET is_activated = true, email = tmp_email, tmp_email = null WHERE activate_token = $1`
  const params = [token]
  const res = await PB.query(query, params)
  return res.rowCount
}

export async function getEmails(userID: string): Promise<string[]> {
  const query = `SELECT email, tmp_email AS "tmpEmail" FROM "User" WHERE id = $1;`
  const params = [userID]
  const res = await PB.query(query, params)
  return [res.rows[0].email, res.rows[0].tmp_email]
}

export async function sendVerifiedEmail(email: string, activateUrl: string) {
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD
      }
  })

  await transporter.sendMail({
    from: `"Skynet" <${process.env.MAIL_USER}>`,
    to: email,
    subject: 'Xác thực email tài khoản Skynet',
    html: `Bạn vui lòng nhấn vào link phía dưới để kích hoạt email: <br/> <a href="${activateUrl}">${activateUrl}</a>`
  })
}
