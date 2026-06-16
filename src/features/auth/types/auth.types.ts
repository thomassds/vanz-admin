export interface User {
  id: string
  name: string
  email: string
  phone: string | null
  taxIdentifier: string | null
  validatedEmailAt: string | null
  validatedPhoneAt: string | null
}

export interface AuthCredentials {
  user: User
  token: string
}
