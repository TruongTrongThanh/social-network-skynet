import axios from 'axios'
import User from '@/models/user'

const API_URL = process.env.VUE_APP_SERVER_API

export async function login(username: string, password: string) {
  const url = API_URL + '/login'
  await axios.post(url, { username, password }, {
    withCredentials: true
  })
}

export async function register(username: string, fullname: string, password: string) {
  const url = API_URL + '/register'
  await axios.post(url, { username, fullname, password })
}

export async function getUser(): Promise<User> {
  const url = API_URL + '/get-user'
  const res = await axios.post(url, null, {
    withCredentials: true
  })
  return res.data
}
