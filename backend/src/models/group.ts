import User from './user'

export interface Group {
  id: number
  name: string
  intro: string
  description: string
  avatar?: string
  banner?: string
  members?: User[]
}

export interface GroupForm {
  name: string
  intro: string
  description: string
}

export interface GroupBase64Form extends GroupForm {
  avatar?: ImageFile
  banner?: ImageFile
}

export interface ImageFile {
  extension: string
  data: string
}

export interface GroupURLForm extends GroupForm {
  avatarURL?: string
  bannerURL?: string
}
