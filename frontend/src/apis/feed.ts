import axios from 'axios'
import { Feed } from '@/models/feed'

const API_URL = process.env.VUE_APP_SERVER_API

axios.defaults.withCredentials = true

export async function getHomeFeeds(): Promise<Feed[]> {
  const url = API_URL + '/feed'
  const res = await axios.get(url)
  return res.data as Feed[]
}

export async function postFeed(content: string, groupID?: string) {
  const url = API_URL + '/feed'
  await axios.post(url, { content, groupID })
}

// export async function voteFeed()
