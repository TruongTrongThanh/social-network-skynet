import axios, { AxiosError } from 'axios'
import User from '@/models/user'

const API_URL = process.env.VUE_APP_SERVER_API
axios.defaults.withCredentials = true

export async function getUserDetails(userID: string): Promise<User> {
  const url = API_URL + `/user?id=${userID}`
  const res = await axios.get(url)
  return res.data
}
