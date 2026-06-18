import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@/shared/api/axiosBaseQuery'
import type { PaginatedResponse } from '@/shared/types/api.types'
import type {
  Vehicle,
  VehicleFilters,
  CreateVehicleDTO,
  UpdateVehicleDTO,
} from '../types/vehicle.types'

export const vehiclesApi = createApi({
  reducerPath: 'vehiclesApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Vehicle'],
  endpoints: (builder) => ({
    getVehicles: builder.query<PaginatedResponse<Vehicle>, VehicleFilters>({
      query: (params) => ({ url: '/vehicles', method: 'GET', params }),
      providesTags: ['Vehicle'],
    }),
    getVehicleById: builder.query<Vehicle, string>({
      query: (id) => ({ url: `/vehicles/${id}`, method: 'GET' }),
      providesTags: (_result, _error, id) => [{ type: 'Vehicle', id }],
    }),
    createVehicle: builder.mutation<Vehicle, CreateVehicleDTO>({
      query: (body) => ({ url: '/vehicles', method: 'POST', data: body }),
      invalidatesTags: ['Vehicle'],
    }),
    updateVehicle: builder.mutation<Vehicle, UpdateVehicleDTO>({
      query: ({ id, ...body }) => ({ url: `/vehicles/${id}`, method: 'PUT', data: body }),
      invalidatesTags: (_result, _error, { id }) => ['Vehicle', { type: 'Vehicle', id }],
    }),
  }),
})

export const {
  useGetVehiclesQuery,
  useGetVehicleByIdQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
} = vehiclesApi
