import axios, { AxiosError } from 'axios'
import User from '@/models/user'
import { LoginForm, RegisterForm } from '@/models/authentication'

const API_URL = process.env.VUE_APP_SERVER_API
axios.defaults.withCredentials = true

export async function login(form: LoginForm) {
  const url = API_URL + '/login'
  await axios.post(url, form)
}

export async function register(form: RegisterForm) {
  const url = API_URL + '/register'
  await axios.post(url, form)
}

export async function getSessionUser(): Promise<User> {
  const url = API_URL + '/session-user'
  const res = await axios.get(url)
  return res.data
}

export async function hasLoggedIn(): Promise<boolean> {
  const url = API_URL + '/has-logged-in'
  try {
    await axios.get(url)
    return true
  } catch (err) {
    const error: AxiosError<any> = err
    if (error.response && error.response.status === 401) return false
    else throw err
  }
}

export async function logout() {
  const url = API_URL + '/logout'
  await axios.post(url)
}
