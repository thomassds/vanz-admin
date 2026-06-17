import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@/shared/api/axiosBaseQuery'
import type { PaginatedResponse } from '@/shared/types/api.types'
import type {
  Payable,
  PayableFilters,
  CreatePayableDTO,
  UpdatePayableDTO,
} from '../types/payable.types'

export const payablesApi = createApi({
  reducerPath: 'payablesApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Payable'],
  endpoints: (builder) => ({
    getPayables: builder.query<PaginatedResponse<Payable>, PayableFilters>({
      query: (params) => ({ url: '/payables', method: 'GET', params }),
      providesTags: ['Payable'],
    }),
    getPayableById: builder.query<Payable, string>({
      query: (id) => ({ url: `/payables/${id}`, method: 'GET' }),
      providesTags: (_result, _error, id) => [{ type: 'Payable', id }],
    }),
    createPayable: builder.mutation<Payable, CreatePayableDTO>({
      query: (body) => ({ url: '/payables', method: 'POST', data: body }),
      invalidatesTags: ['Payable'],
    }),
    updatePayable: builder.mutation<Payable, UpdatePayableDTO>({
      query: ({ id, ...body }) => ({ url: `/payables/${id}`, method: 'PUT', data: body }),
      invalidatesTags: ['Payable'],
    }),
  }),
})

export const {
  useGetPayablesQuery,
  useGetPayableByIdQuery,
  useCreatePayableMutation,
  useUpdatePayableMutation,
} = payablesApi
