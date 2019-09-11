import User from './user'
import Group from './group'

export interface Feed {
  id: number
  originalPoster: User
  group?: Group
  content: string
  image?: string
  voteState: boolean | null
  upvote: number
  downvote: number
  comment: number
  share: number
  createdAt: Date
}

export interface FeedComment {
  id: number
  originalPoster: User
  content: string
  upvote: number
  downvote: number
  createdAt: Date
}
