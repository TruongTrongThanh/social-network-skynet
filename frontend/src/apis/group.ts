import axios from 'axios'
import { GroupForm, Group } from '@/models/group'

const API_URL = process.env.VUE_APP_SERVER_API
axios.defaults.withCredentials = true

export async function createGroup(form: GroupForm): Promise<number> {
  const url = API_URL + '/group'
  const res = await axios.post(url, form)
  return res.data
}

export async function updateGroup(form: GroupForm) {
  const url = API_URL + '/update-group'
  await axios.post(url, form)
}

export async function getGroupsFromUserID(): Promise<Group[]> {
  const url = API_URL + '/group?type=follow'
  const res = await axios.get(url)
  return res.data
}

export async function getTagsFromGroup(groupID: number): Promise<string[]> {
  const url = API_URL + `/group/tags?id=${groupID}`
  const res = await axios.get(url)
  return res.data
}

export async function getGroupDetails(groupID: number): Promise<Group> {
  const url = API_URL + `/group-details?id=${groupID}`
  const res = await axios.get(url)
  return res.data
}

export async function setGroupMemberStatus(groupID: number, status: 'join' | 'leave') {
  const url = API_URL + '/group-member'
  const res = await axios.post(url, { id: groupID, status })
}
