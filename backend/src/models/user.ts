import Group from './group'

export default interface User {
  id?: string
  fullname: string
  hashPassword?: string
  avatar?: string
  follow?: User[] | string[]
  followers?: User[] | string[]
  groups?: Group[] | string[]
  createdAt?: Date
  modifiedAt?: Date
}
