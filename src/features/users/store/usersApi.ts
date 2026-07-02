import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@/shared/api/axiosBaseQuery'
import type { PaginatedResponse } from '@/shared/types/api.types'
import type { TenantUser, TenantUserFilters } from '../types/user.types'

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getTenantUsers: builder.query<PaginatedResponse<TenantUser>, TenantUserFilters>({
      query: (params) => ({ url: '/users', method: 'GET', params }),
    }),
  }),
})

export const { useGetTenantUsersQuery } = usersApi
