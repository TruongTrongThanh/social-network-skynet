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
  replies?: FeedComment[]
}

export interface FeedForm {
  content: string
  image: string
  groupID: string
  tags: string[]
  imageURL?: string
}

export interface FeedCommentForm {
  content: string
  feedID: number
}

export interface CommentReplyForm {
  content: string
  commentID: number
}

export interface FeedVote {
  feedID: number
  voteState?: boolean
}

export interface FeedVoteNumber {
  upvote: number
  downvote: number
}
