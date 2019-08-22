import Group from './group'

export default interface User {
  id: string
  fullname: string
  password?: string
  avatar?: string
  friends?: User[] | string[]
  groups?: Group[] | string[]
  createdAt?: Date
  modifiedAt?: Date
}
