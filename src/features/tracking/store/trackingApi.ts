import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@/shared/api/axiosBaseQuery'
import type { PaginatedResponse } from '@/shared/types/api.types'
import type { Device, DeviceFilters, CreateDeviceDTO } from '../types/device.types'
import type { VehiclePositionResult } from '../types/position.types'

export const trackingApi = createApi({
  reducerPath: 'trackingApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Device'],
  endpoints: (builder) => ({
    getDevices: builder.query<PaginatedResponse<Device>, DeviceFilters>({
      query: (params) => ({ url: '/tracking/devices', method: 'GET', params }),
      providesTags: ['Device'],
    }),
    createDevice: builder.mutation<Device, CreateDeviceDTO>({
      query: (body) => ({ url: '/tracking/devices', method: 'POST', data: body }),
      invalidatesTags: ['Device'],
    }),
    deleteDevice: builder.mutation<void, string>({
      query: (id) => ({ url: `/tracking/devices/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Device'],
    }),
    getVehiclePosition: builder.query<VehiclePositionResult, string>({
      query: (vehicleId) => ({ url: `/tracking/vehicles/${vehicleId}/position`, method: 'GET' }),
    }),
  }),
})

export const {
  useGetDevicesQuery,
  useCreateDeviceMutation,
  useDeleteDeviceMutation,
  useLazyGetVehiclePositionQuery,
} = trackingApi
