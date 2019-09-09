import axios from 'axios'

const API_URL = process.env.VUE_APP_SERVER_API

axios.defaults.withCredentials = true

export async function postFeed(content: string, groupID?: string) {
  const url = API_URL + '/feed'
  await axios.post(url, { content, groupID })
}
