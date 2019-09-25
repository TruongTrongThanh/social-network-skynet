import User from './user'
import { Group } from './group'

export interface SearchEntity {
  data: User | Group
  type: 'user' | 'group'
  score: number
}
