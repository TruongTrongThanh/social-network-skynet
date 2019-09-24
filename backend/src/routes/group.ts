import * as Router from 'koa-router'
import { GroupBase64Form, GroupURLForm } from '../models/group'
import { upload } from '../services/storage'
import * as shortID from 'short-uuid'
import { createGroup, getGroupsFromUserID } from '../services/group'

const router = new Router()

router.post('/group', async ctx => {
  ctx.assert(ctx.state.userID, 401)

  const rawForm: GroupBase64Form = ctx.request.body
  const urlForm: GroupURLForm = rawForm

  if (rawForm.avatar) {
    const avatar = Buffer.from(rawForm.avatar.split(',')[1], 'base64')
    urlForm.avatarURL = await upload(avatar, `group/${shortID.generate()}.jpg`)
  }
  if (rawForm.banner) {
    const banner = Buffer.from(rawForm.banner.split(',')[1], 'base64')
    urlForm.bannerURL = await upload(banner, `group/${shortID.generate()}.jpg`)
  }

  ctx.body = await createGroup(urlForm, ctx.state.userID)
  ctx.status = 200
})

router.get('/group', async ctx => {
  ctx.assert(ctx.state.userID, 401)
  const type: string = ctx.query.type || 'all'
  if (type === 'follow') {
    ctx.body = await getGroupsFromUserID(ctx.state.userID)
    ctx.status = 200
  } else {
    ctx.status = 501
  }
})

export default router.routes()
