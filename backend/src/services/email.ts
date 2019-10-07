import PB from '../database'
import * as nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD
  }
})

export async function getEmail(userID: string): Promise<string> {
  const query = `SELECT email FROM "User" WHERE id = $1;`
  const params = [userID]
  const res = await PB.query(query, params)
  return res.rows[0].email
}

export async function activateEmail(token: string): Promise<number> {
  const query = `UPDATE "User" SET is_activated = true WHERE activate_token = $1`
  const params = [token]
  const res = await PB.query(query, params)
  return res.rowCount
}

export async function sendVerifiedEmail(email: string, activateUrl: string) {
  await transporter.sendMail({
    from: `"Skynet" <${process.env.MAIL_USER}>`,
    to: email,
    subject: 'Xác thực email tài khoản Skynet',
    html: `Bạn vui lòng nhấn vào link phía dưới để kích hoạt email: <br/> <a href="${activateUrl}">${activateUrl}</a>`
  })
}

export async function sendResetPassEmail(email: string, resetUrl: string) {
  await transporter.sendMail({
    from: `"Skynet" <${process.env.MAIL_USER}>`,
    to: email,
    subject: 'Đặt lại mật khẩu tài khoản Skynet',
    html: `Bạn vui lòng nhấn vào link phía dưới để đặt lại mật khẩu: <br/> <a href="${resetUrl}">${resetUrl}</a>`
  })
}
