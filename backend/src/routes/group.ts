import * as Router from 'koa-router'
import { GroupBase64Form, GroupURLForm } from '../models/group'
import { upload } from '../services/storage'
import * as shortID from 'short-uuid'
import { createGroup } from '../services/group'

const router = new Router()

router.post('/group', async ctx => {
  ctx.assert(ctx.state.userID, 401)

  const rawForm: GroupBase64Form = ctx.request.body
  const urlForm: GroupURLForm = rawForm

  if (rawForm.avatar) {
    const avatar = Buffer.from(rawForm.avatar.data, 'base64')
    urlForm.avatarURL = await upload(avatar, `group/${shortID.generate()}.${rawForm.avatar.extension}`)
  }
  if (rawForm.banner) {
    const banner = Buffer.from(rawForm.banner.data, 'base64')
    urlForm.bannerURL = await upload(banner, `group/${shortID.generate()}.${rawForm.banner.extension}`)
  }

  ctx.body = await createGroup(urlForm)
  ctx.status = 200
})

export default router.routes()
