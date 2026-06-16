export interface User {
  id: string
  name: string
  email: string
}

export interface AuthCredentials {
  user: User
  token: string
}
