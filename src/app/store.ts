import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'

// redux-persist/lib/storage não resolve corretamente em Vite (interop CJS/ESM).
// Adapter explícito evita o erro "storage.setItem is not a function".
const storage = {
  getItem: (key: string) => Promise.resolve(localStorage.getItem(key)),
  setItem: (key: string, value: string) => { localStorage.setItem(key, value); return Promise.resolve() },
  removeItem: (key: string) => { localStorage.removeItem(key); return Promise.resolve() },
}
import { authSlice } from '@/features/auth/store/authSlice'
import { authApi } from '@/features/auth/store/authApi'
import { uiSlice } from '@/shared/store/uiSlice'
import { clientsApi } from '@/features/clients/store/clientsApi'
import { contractsApi } from '@/features/contracts/store/contractsApi'

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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(authApi.middleware, clientsApi.middleware, contractsApi.middleware),
})

export const persistor = persistStore(store)
