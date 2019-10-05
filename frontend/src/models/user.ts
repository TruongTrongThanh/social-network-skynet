import { Group } from './group'

export default interface User {
  id?: string
  fullname: string
  position: string
  isActivated: boolean
  role?: string
  email?: string
  avatar?: string
  follow?: User[]
  followers?: User[]
  groups?: Group[]
  createdAt?: Date
  modifiedAt?: Date
  refresh_token?: string
  feedCount?: number
  cmtCount?: number
}
