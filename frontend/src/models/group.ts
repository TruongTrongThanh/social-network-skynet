import User from './user'
import { Tag } from './tag'
import { ImageFile } from './image'

export interface Group {
  id: number
  name: string
  intro: string
  description: string
  tags: Tag[]
  avatar?: string
  banner?: string
}

export interface GroupForm {
  name: string
  intro: string
  description: string
  tags: string[]
  avatar?: ImageFile
}
