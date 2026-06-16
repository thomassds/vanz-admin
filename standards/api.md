# API Standards (SDD)

Este documento define os padrões para comunicação com a API backend.

---

# 1. Visão Geral

Toda comunicação com a API é feita via **RTK Query** sobre uma instância base do **Axios**.

Nunca usar `fetch` diretamente ou Axios fora do `axiosBaseQuery`.

---

# 2. Instância Axios

```ts
// shared/api/axiosInstance.ts
import axios from 'axios'
import { store } from '@/app/store'
import { logout } from '@/features/auth/store/authSlice'

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use((config) => {
  const token = store.getState().auth.token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout())
    }
    return Promise.reject(error)
  },
)
```

---

# 3. axiosBaseQuery (RTK Query)

```ts
// shared/api/axiosBaseQuery.ts
import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import type { AxiosRequestConfig, AxiosError } from 'axios'
import { axiosInstance } from './axiosInstance'

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

export interface ApiError {
  status?: number
  code?: string
}
```

---

# 4. Response Padrão da API

Todo endpoint retorna o padrão:

```json
{
  "success": true,
  "data": {},
  "error": null
}
```

O `axiosBaseQuery` extrai `result.data.data` automaticamente — o componente recebe apenas o payload limpo.

---

# 5. Tipos Globais

```ts
// shared/types/api.types.ts
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
}

export interface ApiError {
  status?: number
  code?: string
}
```

---

# 6. Tratamento de Erros

| Situação              | Comportamento                                         |
| --------------------- | ----------------------------------------------------- |
| 401 Unauthorized      | Logout automático via interceptor do Axios            |
| Erros de validação    | Exibidos inline nos campos do formulário              |
| Erros de domínio (4xx) | Toast de erro com mensagem amigável mapeada           |
| Erro genérico (5xx)   | Toast com mensagem genérica "Algo deu errado"         |

Nunca exibir `code` de erro interno ou stack trace ao usuário.

Mapeamento de erros fica em `features/*/utils/errorMessages.ts`:

```ts
// features/clients/utils/errorMessages.ts
export const CLIENT_ERROR_MESSAGES: Record<string, string> = {
  CLIENT_NOT_FOUND: 'Cliente não encontrado.',
  CLIENT_ALREADY_EXISTS: 'Já existe um cliente com este documento.',
  TENANT_ACCESS_DENIED: 'Acesso negado.',
}
```

---

# 7. Variáveis de Ambiente

| Variável      | Uso                    |
| ------------- | ---------------------- |
| VITE_API_URL  | URL base da API backend |

O arquivo `.env.example` deve sempre conter todas as variáveis necessárias.

---

# 8. Regras

- Nenhum componente faz chamada HTTP diretamente — apenas via RTK Query hooks
- `tenantId` nunca enviado no body/query — é extraído do JWT no backend
- Paginação sempre com `page` e `limit`
- Toda mutation invalida as tags correspondentes no RTK Query
- Variáveis de ambiente sempre via `import.meta.env.VITE_*` — nunca hardcoded
