export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

export interface ApiError {
  status?: number
  code?: string
}
