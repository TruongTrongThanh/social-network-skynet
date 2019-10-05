import axios, { AxiosError } from 'axios'
import User from '@/models/user'

const API_URL = process.env.VUE_APP_SERVER_API
axios.defaults.withCredentials = true

export async function getUserDetails(userID: string): Promise<User> {
  const url = API_URL + `/user?id=${userID}`
  const res = await axios.get(url)
  return res.data
}

export async function updateUser(data: User) {
  const url = API_URL + `/update-user`
  await axios.post(url, data)
}

export async function activateEmail(token: string) {
  const url = API_URL + `/activate-email`
  await axios.post(url, { token })
}
