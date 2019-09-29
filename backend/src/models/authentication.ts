export interface LoginForm {
  username: string
  password: string
  rememberMe: boolean
}

export interface RegisterForm {
  username: string
  fullname: string
  password: string
  repeatPass: string
}

export interface GroupRole {
  group_id: number
  role: 'admin' | 'member'
}

export interface JwtPayload {
  id: string,
  roles: GroupRole[]
}

export interface Token {
  accessToken: string
  refreshToken?: string
}
