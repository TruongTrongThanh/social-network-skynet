import PB from '../database'
import { GroupURLForm } from '../models/group'

export async function createGroup(form: GroupURLForm): Promise<number> {
  const query = `
    INSERT INTO public."Group"(
      avatar, banner, intro, name, description)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
  `
  const params = [form.avatarURL, form.bannerURL, form.intro, form.name, form.description]
  const res = await PB.query(query, params)
  return res.rows[0].id
}

// export async function getGroupDetails(groupID: number)
