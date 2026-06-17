import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@/shared/api/axiosBaseQuery'
import type { PaginatedResponse } from '@/shared/types/api.types'
import type {
  Receivable,
  ReceivableFilters,
  CreateReceivableDTO,
  UpdateReceivableDTO,
} from '../types/receivable.types'

export const receivablesApi = createApi({
  reducerPath: 'receivablesApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Receivable'],
  endpoints: (builder) => ({
    getReceivables: builder.query<PaginatedResponse<Receivable>, ReceivableFilters>({
      query: (params) => ({ url: '/receivables', method: 'GET', params }),
      providesTags: ['Receivable'],
    }),
    getReceivableById: builder.query<Receivable, string>({
      query: (id) => ({ url: `/receivables/${id}`, method: 'GET' }),
      providesTags: (_result, _error, id) => [{ type: 'Receivable', id }],
    }),
    createReceivable: builder.mutation<Receivable, CreateReceivableDTO>({
      query: (body) => ({ url: '/receivables', method: 'POST', data: body }),
      invalidatesTags: ['Receivable'],
    }),
    updateReceivable: builder.mutation<Receivable, UpdateReceivableDTO>({
      query: ({ id, ...body }) => ({ url: `/receivables/${id}`, method: 'PUT', data: body }),
      invalidatesTags: ['Receivable'],
    }),
  }),
})

export const {
  useGetReceivablesQuery,
  useGetReceivableByIdQuery,
  useCreateReceivableMutation,
  useUpdateReceivableMutation,
} = receivablesApi
