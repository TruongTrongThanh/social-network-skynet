import axios from 'axios'
import { Feed, FeedVoteNumber } from '@/models/feed'

const API_URL = process.env.VUE_APP_SERVER_API

axios.defaults.withCredentials = true

export async function getHomeFeeds(): Promise<Feed[]> {
  const url = API_URL + '/home-feeds'
  const res = await axios.get(url)
  return res.data as Feed[]
}

export async function getFeedDetail(feedID: number) {
  const url = API_URL + `/feed?id=${feedID}`
  const res = await axios.get(url)
  return res.data as Feed
}

export async function postFeed(content: string, groupID?: string) {
  const url = API_URL + '/feed'
  await axios.post(url, { content, groupID })
}

export async function voteFeed(feedID: number, voteState: boolean | null): Promise<FeedVoteNumber> {
  const url = API_URL + '/feed/vote'
  const res = await axios.post(url, { feedID, voteState })
  return res.data as FeedVoteNumber
}

export async function postComment(feedID: number, content: string) {
  const url = API_URL + '/feed/comment'
  await axios.post(url, { feedID, content })
}
