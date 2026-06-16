# State Management Standards (SDD)

Este documento define os padrões para gerenciamento de estado no frontend com Redux Toolkit e RTK Query.

---

# 1. Visão Geral

O estado é dividido em duas responsabilidades distintas:

| Tipo           | Ferramenta       | Exemplos                                     |
| -------------- | ---------------- | -------------------------------------------- |
| Client state   | Redux Slice      | Sessão do usuário, controles de UI global    |
| Server state   | RTK Query        | Dados da API, loading, erro, cache           |
| Form state     | React Hook Form  | Valores de formulário, validação de campos   |
| Local UI state | useState         | Accordion aberto, tooltip visível            |

---

# 2. Quando Usar Cada Abordagem

## Redux Slice — use para:
- Sessão do usuário autenticado (`user`, `token`, `role`, `tenantId`)
- Controles globais de UI (sidebar aberta, modal global, toasts)
- Filtros que persistem entre navegações de página

## RTK Query — use para:
- Qualquer dado que vem da API
- Mutations (criar, atualizar, deletar)
- Cache e invalidação automática

## useState — use para:
- Estado local de UI sem impacto em outras partes
- Estado que não precisa ser compartilhado

## Nunca usar Redux para:
- Dados da API (usar RTK Query)
- Estado de formulários (usar React Hook Form)
- Estado local de UI (usar useState)

---

# 3. Estrutura do Store

```
app/
  store.ts          ← combineReducers + middleware RTK Query
  store.types.ts    ← RootState, AppDispatch

features/auth/store/
  authSlice.ts      ← Slice de sessão
  authApi.ts        ← RTK Query endpoints de auth

features/clients/store/
  clientsApi.ts     ← RTK Query endpoints de clients

features/contracts/store/
  contractsApi.ts

features/finances/store/
  receivablesApi.ts
```

---

# 4. Padrão de Slice

```ts
// features/auth/store/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store.types'

interface User {
  id: string
  name: string
  email: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      localStorage.setItem('token', action.payload.token)
    },
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions

// Selectors
export const selectAuth = (state: RootState) => state.auth
export const selectCurrentUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
```

---

# 5. Padrão de RTK Query API

```ts
// features/clients/store/clientsApi.ts
import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@/shared/api/axiosBaseQuery'
import type { Client, CreateClientDTO, ClientFilters, PaginatedResponse } from '../types'

export const clientsApi = createApi({
  reducerPath: 'clientsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Client', 'Dependent'],
  endpoints: (builder) => ({
    getClients: builder.query<PaginatedResponse<Client>, ClientFilters>({
      query: (params) => ({ url: '/clients', method: 'GET', params }),
      providesTags: ['Client'],
    }),
    createClient: builder.mutation<Client, CreateClientDTO>({
      query: (body) => ({ url: '/clients', method: 'POST', data: body }),
      invalidatesTags: ['Client'],
    }),
    updateClient: builder.mutation<Client, { id: string; body: Partial<CreateClientDTO> }>({
      query: ({ id, body }) => ({ url: `/clients/${id}`, method: 'PUT', data: body }),
      invalidatesTags: ['Client'],
    }),
    disableClient: builder.mutation<void, string>({
      query: (id) => ({ url: `/clients/${id}/disable`, method: 'PUT' }),
      invalidatesTags: ['Client'],
    }),
  }),
})

export const {
  useGetClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDisableClientMutation,
} = clientsApi
```

---

# 6. Persistência de Estado (redux-persist)

O slice `auth` é persistido no `localStorage` via `redux-persist`. Os demais slices (ui, RTK Query) **não** são persistidos.

```ts
// app/store.ts
import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { authSlice } from '@/features/auth/store/authSlice'
import { authApi } from '@/features/auth/store/authApi'

const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'tenantId', 'isAuthenticated'],
}

const persistedAuthReducer = persistReducer(authPersistConfig, authSlice.reducer)

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    // ...outros reducers
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Obrigatório: redux-persist despacha actions com valores não serializáveis
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(/* middlewares */),
})

export const persistor = persistStore(store)
```

O `persistor` é usado no `main.tsx` via `<PersistGate loading={null} persistor={persistor}>` para segurar a renderização até o estado ser reidratado do localStorage.

### O que é persistido

| Campo            | Motivo                                                    |
| ---------------- | --------------------------------------------------------- |
| `user`           | Exibir nome/avatar sem refetch ao recarregar a página     |
| `token`          | Manter sessão ativa entre recargas                        |
| `tenantId`       | Interceptor lê do localStorage para o header `X-API-KEY` |
| `isAuthenticated`| ProtectedRoute sabe se o usuário está logado              |

### O que NÃO é persistido

- `ui` slice — o sidebar já recalcula o estado inicial via `window.innerWidth`
- RTK Query caches — dados da API sempre devem ser buscados frescos

---

# 7. Padrão de Store Root

```ts
// app/store.ts (estrutura completa esperada)
import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { authSlice } from '@/features/auth/store/authSlice'
import { clientsApi } from '@/features/clients/store/clientsApi'
import { authApi } from '@/features/auth/store/authApi'

const persistedAuthReducer = persistReducer(
  { key: 'auth', storage, whitelist: ['user', 'token', 'tenantId', 'isAuthenticated'] },
  authSlice.reducer,
)

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    [authApi.reducerPath]: authApi.reducer,
    [clientsApi.reducerPath]: clientsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] },
    }).concat(authApi.middleware, clientsApi.middleware),
})

export const persistor = persistStore(store)
```

---

# 8. Regras

- Nunca mutar estado diretamente fora dos reducers (RTK usa Immer internamente)
- Actions com nomes descritivos e no padrão verbo + substantivo: `setCredentials`, `logout`, `openModal`
- Selectors sempre via `useSelector` — sem acesso direto ao `store.getState()` em componentes
- Nenhum efeito colateral dentro de reducers
- `tenantId` nunca enviado no body/query — vai exclusivamente no header `X-API-KEY` (ver `standards/api.md`)
- Tags RTK Query nomeadas igual ao recurso: `'Client'`, `'Contract'`, `'Receivable'`
- Apenas slices de sessão/autenticação são persistidos — nunca RTK Query caches
