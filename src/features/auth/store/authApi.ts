import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@/shared/api/axiosBaseQuery'
import type { User } from '../types/auth.types'

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  token: string
  user: User
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: '/auth', method: 'POST', data: body }),
    }),
  }),
})

export const { useLoginMutation } = authApi
