import User from './user'
import Group from './group'
import PB from '../database'

export interface Feed {
  id: number
  originalPoster: User
  content: string
  voteState?: VoteState
  upvote: number
  downvote: number
  comment: number
  share: number
  createdAt: Date
  group?: Group
  image?: string
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
