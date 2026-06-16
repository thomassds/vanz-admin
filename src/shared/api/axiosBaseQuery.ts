import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import type { AxiosRequestConfig, AxiosError } from 'axios'
import { axiosInstance } from './axiosInstance'
import type { ApiError } from '../types/api.types'

export const axiosBaseQuery =
  (): BaseQueryFn<AxiosRequestConfig, unknown, ApiError> =>
  async ({ url, method, data, params }) => {
    try {
      const result = await axiosInstance({ url, method, data, params })
      return { data: result.data.data }
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
