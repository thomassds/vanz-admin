import { describe, expect, it, vi } from 'vitest'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { configureAuthBridge, notifyUnauthorized, readAuth } from './authBridge'
import { axiosInstance } from './axiosInstance'
import type { User } from '@/features/auth/types/auth.types'

interface InterceptorHandlers<V> {
  handlers: Array<{
    fulfilled: (value: V) => V | Promise<V>
    rejected: (error: unknown) => unknown
  }>
}

function requestHandlers() {
  return (
    axiosInstance.interceptors.request as unknown as InterceptorHandlers<AxiosRequestConfig>
  ).handlers
}

function responseHandlers() {
  return (
    axiosInstance.interceptors.response as unknown as InterceptorHandlers<AxiosResponse>
  ).handlers
}

describe('authBridge + interceptors do axios', () => {
  it('sem bridge configurada, readAuth retorna sessão vazia', () => {
    configureAuthBridge({
      getAuth: () => ({ token: null, tenantId: null }),
      onUnauthorized: vi.fn(),
    })
    expect(readAuth()).toEqual({ token: null, tenantId: null })
  })

  it('injeta Authorization e X-API-KEY a partir da sessão do store', async () => {
    configureAuthBridge({
      getAuth: () => ({ token: 'tok-123', tenantId: 'tenant-9' }),
      onUnauthorized: vi.fn(),
    })

    const [{ fulfilled }] = requestHandlers()
    const config = await fulfilled({ headers: {} } as AxiosRequestConfig)

    expect(config.headers?.Authorization).toBe('Bearer tok-123')
    expect(config.headers?.['X-API-KEY']).toBe('tenant-9')
  })

  it('não injeta headers quando não há sessão', async () => {
    configureAuthBridge({
      getAuth: () => ({ token: null, tenantId: null }),
      onUnauthorized: vi.fn(),
    })

    const [{ fulfilled }] = requestHandlers()
    const config = await fulfilled({ headers: {} } as AxiosRequestConfig)

    expect(config.headers?.Authorization).toBeUndefined()
    expect(config.headers?.['X-API-KEY']).toBeUndefined()
  })

  it('notifica onUnauthorized ao receber 401', async () => {
    const onUnauthorized = vi.fn()
    configureAuthBridge({
      getAuth: () => ({ token: 'tok', tenantId: null }),
      onUnauthorized,
    })

    const [{ rejected }] = responseHandlers()
    await expect(rejected({ response: { status: 401 } })).rejects.toBeTruthy()

    expect(onUnauthorized).toHaveBeenCalledTimes(1)
  })

  it('não desloga em erros que não são 401', async () => {
    const onUnauthorized = vi.fn()
    configureAuthBridge({
      getAuth: () => ({ token: 'tok', tenantId: null }),
      onUnauthorized,
    })

    const [{ rejected }] = responseHandlers()
    await expect(rejected({ response: { status: 500 } })).rejects.toBeTruthy()

    expect(onUnauthorized).not.toHaveBeenCalled()
  })
})

describe('integração com o store: 401 encerra a sessão', () => {
  it('limpa estado (e persistência) quando notifyUnauthorized dispara', async () => {
    // Importar o store real reconfigura a bridge para apontar para ele
    const { store } = await import('@/app/store')
    const { setCredentials } = await import('@/features/auth/store/authSlice')

    const user = { id: 'u1', name: 'Teste', email: 't@t.com' } as unknown as User
    store.dispatch(setCredentials({ user, token: 'tok-abc', tenant: { id: 'ten-1', name: 'Empresa' } }))

    expect(store.getState().auth.isAuthenticated).toBe(true)
    expect(readAuth()).toEqual({ token: 'tok-abc', tenantId: 'ten-1' })

    notifyUnauthorized()

    const auth = store.getState().auth
    expect(auth.isAuthenticated).toBe(false)
    expect(auth.token).toBeNull()
    expect(auth.tenantId).toBeNull()
    expect(auth.user).toBeNull()
  })
})
