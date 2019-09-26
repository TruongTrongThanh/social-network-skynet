import axios from 'axios'
import { Feed, FeedVoteNumber, FeedForm } from '@/models/feed'

const API_URL = process.env.VUE_APP_SERVER_API

axios.defaults.withCredentials = true

export async function getHomeFeeds(): Promise<Feed[]> {
  const url = API_URL + '/home-feeds'
  const res = await axios.get(url)
  return res.data
}

export async function getShareFeeds(feedID: number): Promise<Feed[]> {
  const url = API_URL + `/share-feeds?id=${feedID}`
  const res = await axios.get(url)
  return res.data
}

export async function getFeedDetail(feedID: number): Promise<Feed> {
  const url = API_URL + `/feed?id=${feedID}`
  const res = await axios.get(url)
  return res.data
}

export async function postFeed(form: FeedForm): Promise<number> {
  const url = API_URL + '/feed'
  const res = await axios.post(url, form)
  return res.data
}

export async function voteFeed(feedID: number, voteState: boolean | null): Promise<FeedVoteNumber> {
  const url = API_URL + '/feed/vote'
  const res = await axios.post(url, { feedID, voteState })
  return res.data
}

export async function postComment(feedID: number, content: string): Promise<number> {
  const url = API_URL + '/feed/comment'
  const res = await axios.post(url, { feedID, content })
  return res.data
}

export async function postReply(commentID: number, content: string): Promise<number> {
  const url = API_URL + '/feed/comment/reply'
  const res = await axios.post(url, { commentID, content })
  return res.data
}
