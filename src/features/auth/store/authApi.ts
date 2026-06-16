import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@/shared/api/axiosBaseQuery'
import type { User } from '../types/auth.types'

interface LoginRequest {
  email: string
  password: string
}

interface Tenant {
  id: string
  name: string
}

interface LoginApiResponse {
  accessToken: string
  user: User
  tenant: Tenant | null
}

interface LoginResponse {
  token: string
  user: User
  tenant: Tenant | null
}

interface OnboardingRequest {
  name: string
  email: string
  password: string
}

interface OnboardingResponse {
  userId: string
}

type CodeChannel = 'email' | 'phone'

interface RequestCodeRequest {
  userId?: string
  email?: string
  phone?: string
  channel: CodeChannel
}

interface RequestCodeResponse {
  sent: boolean
  userId: string
}

interface ValidateCodeRequest {
  userId: string
  type: CodeChannel
  code: string
  justCheck?: boolean
}

interface ValidateCodeResponse {
  validated: boolean
  userId: string
  type: CodeChannel
}

interface RecoveryPasswordRequest {
  userId: string
  type: CodeChannel
  code: string
  password: string
}

interface RecoveryPasswordResponse {
  updated: boolean
}

interface PersonalDataRequest {
  userId: string
  taxIdentifier: string
  phone: string
  countryCode: string
  zipCode: string
  street: string
  neighborhood: string
  city: string
  state: string
  number: string
  complement?: string
}

interface PersonalDataResponse {
  sent: boolean
}

interface CompanyDataRequest {
  userId: string
  companyName: string
  taxIdentifier: string
  email: string
  phone: string
  countryCode: string
}

interface CompanyDataResponse {
  tenantId: string
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: '/auth', method: 'POST', data: body }),
      transformResponse: (response: LoginApiResponse): LoginResponse => ({
        token: response.accessToken,
        user: response.user,
        tenant: response.tenant,
      }),
    }),
    onboarding: builder.mutation<OnboardingResponse, OnboardingRequest>({
      query: (body) => ({ url: '/auth/onboarding', method: 'POST', data: body }),
    }),
    requestCode: builder.mutation<RequestCodeResponse, RequestCodeRequest>({
      query: (body) => ({ url: '/auth/request-code', method: 'POST', data: body }),
    }),
    validateCode: builder.mutation<ValidateCodeResponse, ValidateCodeRequest>({
      query: (body) => ({ url: '/auth/validate-code', method: 'POST', data: body }),
    }),
    savePersonalData: builder.mutation<PersonalDataResponse, PersonalDataRequest>({
      query: (body) => ({ url: '/auth/onboarding/personal', method: 'POST', data: body }),
    }),
    createCompany: builder.mutation<CompanyDataResponse, CompanyDataRequest>({
      query: (body) => ({ url: '/auth/onboarding/company', method: 'POST', data: body }),
    }),
    recoveryPassword: builder.mutation<RecoveryPasswordResponse, RecoveryPasswordRequest>({
      query: (body) => ({ url: '/auth/recovery-password', method: 'POST', data: body }),
    }),
  }),
})

export const {
  useLoginMutation,
  useOnboardingMutation,
  useRequestCodeMutation,
  useValidateCodeMutation,
  useSavePersonalDataMutation,
  useCreateCompanyMutation,
  useRecoveryPasswordMutation,
} = authApi
