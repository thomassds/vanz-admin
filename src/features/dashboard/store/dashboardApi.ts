import { createApi } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import type { AxiosRequestConfig, AxiosError } from 'axios'
import { axiosInstance } from '@/shared/api/axiosInstance'
import type { ApiError } from '@/shared/types/api.types'
import type {
  DashboardSummary,
  UpcomingReceivable,
  UpcomingReceivablesResponse,
  MonthlyRevenueItem,
  MonthlyRevenueResponse,
} from '../types/dashboard.types'

// Base query que retorna o corpo completo da resposta (sem desembrulhar .data)
// necessário para acessar campos como `meta` que ficam no mesmo nível que `data`
const dashboardBaseQuery: BaseQueryFn<AxiosRequestConfig, unknown, ApiError> = async ({
  url,
  method,
  params,
}) => {
  try {
    const result = await axiosInstance({ url, method, params })
    return { data: result.data }
  } catch (error) {
    const axiosError = error as AxiosError<{ error: string }>
    return {
      error: {
        status: axiosError.response?.status,
        code: axiosError.response?.data?.error,
      },
    }
  }
}

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: dashboardBaseQuery,
  tagTypes: ['DashboardSummary', 'DashboardUpcoming', 'DashboardRevenue'],
  endpoints: (builder) => ({
    getSummary: builder.query<DashboardSummary, void>({
      query: () => ({ url: '/dashboard/summary', method: 'GET' }),
      transformResponse: (res: { data: DashboardSummary }) => res.data,
      providesTags: ['DashboardSummary'],
    }),
    getUpcoming: builder.query<UpcomingReceivablesResponse, { page: number; limit: number }>({
      query: (params) => ({ url: '/dashboard/upcoming', method: 'GET', params }),
      transformResponse: (res: {
        data: UpcomingReceivable[]
        meta: UpcomingReceivablesResponse['meta']
      }) => ({ data: res.data, meta: res.meta }),
      providesTags: ['DashboardUpcoming'],
    }),
    getMonthlyRevenue: builder.query<MonthlyRevenueResponse, { months: number }>({
      query: (params) => ({ url: '/dashboard/monthly-revenue', method: 'GET', params }),
      transformResponse: (res: { data: MonthlyRevenueItem[] }) => ({ data: res.data }),
      providesTags: ['DashboardRevenue'],
    }),
  }),
})

export const {
  useGetSummaryQuery,
  useGetUpcomingQuery,
  useGetMonthlyRevenueQuery,
} = dashboardApi
