import axios from 'axios'
import { GroupForm, Group } from '@/models/group'

const API_URL = process.env.VUE_APP_SERVER_API
axios.defaults.withCredentials = true

export async function createGroup(form: GroupForm): Promise<number> {
  const url = API_URL + '/group'
  const res = await axios.post(url, form)
  return res.data
}

export async function getGroupsFromUserID(): Promise<Group[]> {
  const url = API_URL + '/group?type=follow'
  const res = await axios.get(url)
  return res.data
}

