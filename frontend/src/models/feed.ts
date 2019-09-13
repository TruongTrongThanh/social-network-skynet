import User from './user'
import Group from './group'

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
  group?: Group
  image?: string
  commentList?: FeedComment[]
}

export interface FeedComment {
  id: number
  originalPoster: User
  content: string
  upvote: number
  downvote: number
  createdAt: Date
}

export interface FeedVoteNumber {
  upvote: number
  downvote: number
}
