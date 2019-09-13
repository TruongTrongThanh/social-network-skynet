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
  createdAt: Date
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
  reply?: FeedComment[]
}

export interface FeedForm {
  content: string
  groupID?: string
}

export interface FeedVote {
  feedID: number
  voteState?: boolean
}

export interface FeedVoteNumber {
  upvote: number
  downvote: number
}
