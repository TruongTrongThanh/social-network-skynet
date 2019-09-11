import User from './user'

export default interface Group {
  id: number
  avatar?: string
  name: string
  members: User[]

}
