import User from './user'
import { Group } from './group'

export interface Feed {
  id: number
  originalPoster: User
  content: string
  voteState: boolean | null
  upvote: number
  downvote: number
  comment: number
  share: number
  createdAt: string
  commentList: FeedComment[]
  group?: Group
  image?: string
  shareFromFeed?: Feed
}

export interface FeedComment {
  id: number
  originalPoster: User
  content: string
  upvote: number
  downvote: number
  createdAt: string
  replies: FeedComment[]
}

export interface FeedVoteNumber {
  upvote: number
  downvote: number
  voteState: boolean | null
  userID: string
}

export interface FeedForm {
  content: string
  image: string
  groupID: number
  tags: string[]
  shareFromFeedID?: number
}
