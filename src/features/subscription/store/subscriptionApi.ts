import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@/shared/api/axiosBaseQuery'
import type { Plan, PlanKey, SubscriptionMe } from '../types/subscription.types'

export const subscriptionApi = createApi({
  reducerPath: 'subscriptionApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Subscription'],
  endpoints: (builder) => ({
    getSubscription: builder.query<SubscriptionMe, void>({
      query: () => ({ url: '/subscriptions/me', method: 'GET' }),
      providesTags: ['Subscription'],
    }),
    getPlans: builder.query<{ plans: Plan[] }, void>({
      query: () => ({ url: '/subscriptions/plans', method: 'GET' }),
    }),
    createCheckout: builder.mutation<{ url: string }, { plan: PlanKey }>({
      query: (body) => ({ url: '/subscriptions/checkout', method: 'POST', data: body }),
    }),
    createPortal: builder.mutation<{ url: string }, void>({
      query: () => ({ url: '/subscriptions/portal', method: 'POST' }),
    }),
  }),
})

export const {
  useGetSubscriptionQuery,
  useGetPlansQuery,
  useCreateCheckoutMutation,
  useCreatePortalMutation,
} = subscriptionApi
