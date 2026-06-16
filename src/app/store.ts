import { configureStore } from '@reduxjs/toolkit'
import { authSlice } from '@/features/auth/store/authSlice'
import { authApi } from '@/features/auth/store/authApi'
import { uiSlice } from '@/shared/store/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
})
