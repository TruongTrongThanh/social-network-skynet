import { Tag } from './tag'
import User from './user'

export interface Group {
  id: number
  name: string
  role: string
  intro?: string
  description?: string
  tags?: Tag[]
  avatar?: string
  banner?: string
  memberList: User[]
}

export interface GroupForm {
  name: string
  intro: string
  description: string
  tags: string[]
}

export interface GroupBase64Form extends GroupForm {
  avatar?: string
  banner?: string
}

export interface GroupURLForm extends GroupForm {
  avatarURL?: string
  bannerURL?: string
}
