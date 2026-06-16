import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { User } from '../types/auth.types'

interface Tenant {
  id: string
  name: string
}

interface AuthState {
  user: User | null
  token: string | null
  tenantId: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  tenantId: localStorage.getItem('tenantId'),
  isAuthenticated: !!localStorage.getItem('token'),
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: User; token: string; tenant: Tenant | null }>,
    ) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.tenantId = action.payload.tenant?.id ?? null
      state.isAuthenticated = true
      localStorage.setItem('token', action.payload.token)
      if (action.payload.tenant?.id) {
        localStorage.setItem('tenantId', action.payload.tenant.id)
      }
    },
    logout(state) {
      state.user = null
      state.token = null
      state.tenantId = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('tenantId')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions

export const selectAuth = (state: { auth: AuthState }) => state.auth

export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated

export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user
