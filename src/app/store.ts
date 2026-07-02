import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'

// redux-persist/lib/storage não resolve corretamente em Vite (interop CJS/ESM).
// Adapter explícito evita o erro "storage.setItem is not a function".
const storage = {
  getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key: string, value: string) => { localStorage.setItem(key, value); return Promise.resolve() },
  removeItem: (key: string) => { localStorage.removeItem(key); return Promise.resolve() },
}
import { authSlice, logout } from '@/features/auth/store/authSlice'
import { configureAuthBridge } from '@/shared/api/authBridge'
import { authApi } from '@/features/auth/store/authApi'
import { uiSlice } from '@/shared/store/uiSlice'
import { clientsApi } from '@/features/clients/store/clientsApi'
import { contractsApi } from '@/features/contracts/store/contractsApi'
import { receivablesApi } from '@/features/finances/store/receivablesApi'
import { payablesApi } from '@/features/finances/store/payablesApi'
import { dashboardApi } from '@/features/dashboard/store/dashboardApi'
import { vehiclesApi } from '@/features/vehicles/store/vehiclesApi'
import { trackingApi } from '@/features/tracking/store/trackingApi'
import { usersApi } from '@/features/users/store/usersApi'
import { subscriptionApi } from '@/features/subscription/store/subscriptionApi'

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'tenantId', 'isAuthenticated'],
}

const persistedAuthReducer = persistReducer(authPersistConfig, authSlice.reducer)

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    ui: uiSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [clientsApi.reducerPath]: clientsApi.reducer,
    [contractsApi.reducerPath]: contractsApi.reducer,
    [receivablesApi.reducerPath]: receivablesApi.reducer,
    [payablesApi.reducerPath]: payablesApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
    [vehiclesApi.reducerPath]: vehiclesApi.reducer,
    [trackingApi.reducerPath]: trackingApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(authApi.middleware, clientsApi.middleware, contractsApi.middleware, receivablesApi.middleware, payablesApi.middleware, dashboardApi.middleware, vehiclesApi.middleware, trackingApi.middleware, usersApi.middleware, subscriptionApi.middleware),
})

export const persistor = persistStore(store)

// O axios lê a sessão do store e, num 401, desloga por aqui —
// estado e persist:auth ficam sempre em sincronia.
configureAuthBridge({
  getAuth: () => {
    const { token, tenantId } = store.getState().auth
    return { token, tenantId }
  },
  onUnauthorized: () => {
    if (store.getState().auth.isAuthenticated) {
      store.dispatch(logout())
    }
  },
})
