import User from './user'
import Group from './group'

export interface Feed {
  id: number
  originalPoster: User
  group?: Group
  content: string
  image?: string
  voteState?: VoteState
  upvote: number
  downvote: number
  comment: number
  share: number
  createdAt: Date
  commentList?: FeedComment[] | number[]
}

export interface FeedComment {
  id: number
  originalPoster: User
  content: string
  upvote: number
  downvote: number
  createdAt: Date
  reply?: FeedComment[] | number[]
}

export enum VoteState {
  Down = 0,
  Up = 1
}
