import * as Router from 'koa-router'
import { GroupForm } from '../models/group'
import { upload } from '../services/storage'
import * as shortID from 'short-uuid'
import { createGroup, getGroupsFromUserID, getTagsFromGroup, getGroupDetails, joinGroup, leaveGroup, updateGroup } from '../services/group'
import { JwtPayload } from '../models/authentication'

const router = new Router()

router.post('/group', async ctx => {
  ctx.assert(ctx.state.user, 401)

  const form: GroupForm = ctx.request.body

  if (form.avatar) {
    const avatar = Buffer.from(form.avatar.split(',')[1], 'base64')
    form.avatar = await upload(avatar, `group/${shortID.generate()}.jpg`)
  }

  ctx.body = await createGroup(form, ctx.state.user.id)
  ctx.status = 200
})

router.get('/group', async ctx => {
  ctx.assert(ctx.state.user, 401)
  const type: string = ctx.query.type || 'all'
  if (type === 'follow') {
    ctx.body = await getGroupsFromUserID(ctx.state.user.id)
    ctx.status = 200
  } else {
    ctx.status = 501
  }
})

router.get('/group-details', async ctx => {
  ctx.assert(ctx.state.user, 401)
  ctx.body = await getGroupDetails(ctx.query.id)
  ctx.status = 200
})

router.get('/group/tags', async ctx => {
  ctx.assert(ctx.state.user, 401)
  ctx.body = await getTagsFromGroup(ctx.query.id)
  ctx.status = 200
})

router.post('/group-member', async ctx => {
  ctx.assert(ctx.state.user, 401)
  ctx.assert(ctx.request.body.id, 400)
  ctx.assert(ctx.request.body.status, 400)
  const status: 'join' | 'leave' = ctx.request.body.status
  if (status === 'join') await joinGroup(ctx.state.user.id, ctx.request.body.id)
  else if (status === 'leave') await leaveGroup(ctx.state.user.id, ctx.request.body.id)
  else ctx.throw('status is invalid', 400)
  ctx.status = 200
})

router.post('/update-group', async ctx => {
  ctx.assert(ctx.state.user, 401)

  const sessionUser: JwtPayload = ctx.state.user
  const form: GroupForm = ctx.request.body

  const isAdmin = sessionUser.roles.find(role => +role.group_id === +form.id).role === 'admin'
  ctx.assert(isAdmin, 401)

  if (form.avatar && !form.avatar.startsWith('http')) {
    const avatar = Buffer.from(form.avatar.split(',')[1], 'base64')
    form.avatar = await upload(avatar, `group/${shortID.generate()}.jpg`)
  }
  if (form.banner && !form.banner.startsWith('http')) {
    const banner = Buffer.from(form.banner.split(',')[1], 'base64')
    form.banner = await upload(banner, `group/${shortID.generate()}.jpg`)
  }
  await updateGroup(form)
  ctx.status = 200
})

export default router.routes()
