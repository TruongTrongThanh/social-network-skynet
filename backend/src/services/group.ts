import PB from '../database'
import { Group, GroupURLForm } from '../models/group'

export async function createGroup(form: GroupURLForm, userID: string): Promise<number> {
  const query = `CALL public.create_group($1, $2, $3, $4, $5, $6, 0);`
  const params = [form.avatarURL, form.name, form.intro, form.description, form.tags, userID]
  const res = await PB.query(query, params)
  return res.rows[0].returning_id
}

export async function getGroupsFromUserID(userID: string): Promise<Group[]> {
  const query = `
    SELECT id, avatar, name, role
    FROM public."Group"
    INNER JOIN public."Group_User"
      ON public."Group".id = public."Group_User".group_id
    WHERE public."Group_User".user_id = $1;
  `
  const params = [userID]
  const res = await PB.query(query, params)
  return res.rows
}

// export async function getGroupDetails(groupID: number)
