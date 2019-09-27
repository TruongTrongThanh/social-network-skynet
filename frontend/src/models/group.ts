import User from './user'

export interface Group {
  id: number
  name: string
  role: string
  intro?: string
  description?: string
  tags: string[]
  avatar?: string
  banner?: string
  memberList: User[]
}

export interface GroupForm {
  name: string
  intro: string
  description: string
  tags: string[]
  avatar?: string
}
