export type TenantUserRole = 'admin' | 'driver' | 'monitor' | 'responsible'

export interface TenantUser {
  id: string
  name: string
  email: string
  role: TenantUserRole
}

export interface TenantUserFilters {
  page: number
  limit: number
  role?: TenantUserRole
}
