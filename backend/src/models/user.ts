import { Group } from './group'

export default interface User {
  id?: string
  fullname: string
  hashPassword?: string
  avatar?: string
  follow?: User[]
  followers?: User[]
  groups?: Group[]
  createdAt?: Date
  modifiedAt?: Date
}
