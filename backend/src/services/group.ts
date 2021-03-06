import PB from '../database'
import { Group, GroupForm } from '../models/group'

export async function createGroup(form: GroupForm, userID: string): Promise<number> {
  const query = `CALL public.create_group($1, $2, $3, $4, $5, $6, 0);`
  const params = [form.avatar, form.name, form.intro, form.description, form.tags, userID]
  const res = await PB.query(query, params)
  return res.rows[0].returning_id
}

export async function updateGroup(form: GroupForm) {
  const query = `CALL public.update_group($1, $2, $3, $4, $5, $6, $7);`
  const params = [form.id, form.avatar, form.banner, form.name, form.intro, form.description, form.tags]
  await PB.query(query, params)
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

export async function getTagsFromGroup(groupID: number): Promise<string[]> {
  const query = `
    SELECT array_agg(name) AS tags FROM "Tag" WHERE "Tag".group_ids @> Array[$1::integer]
  `
  const params = [groupID]
  const res = await PB.query(query, params)
  return res.rows[0].tags
}

export async function getGroupDetails(groupID: number): Promise<Group> {
  const query = `
    SELECT * FROM get_group($1)
  `
  const params = [groupID]
  const res = await PB.query(query, params)
  return res.rows[0]
}

export async function joinGroup(userID: string, groupID: number) {
  const query = `
    INSERT INTO public."Group_User"(
      group_id, user_id, role)
    VALUES ($1, $2, 'member');
  `
  const params = [groupID, userID]
  await PB.query(query, params)
}

export async function leaveGroup(userID: string, groupID: number) {
  const query = `
    DELETE FROM public."Group_User"
    WHERE group_id = $1 AND user_id = $2;
  `
  const params = [groupID, userID]
  await PB.query(query, params)
}

export async function getTopGroups(): Promise<Group[]> {
  const query = `SELECT * FROM get_group_stats() as grp ORDER BY grp."feedCount" DESC, grp."memberCount" DESC LIMIT 3`
  const res = await PB.query(query)
  return res.rows
}
