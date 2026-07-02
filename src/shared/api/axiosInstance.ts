import axios from 'axios'
import { notifyUnauthorized, readAuth } from './authBridge'

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  headers: { 'Content-Type': 'application/json' },
})

axiosInstance.interceptors.request.use((config) => {
  const { token, tenantId } = readAuth()
  if (token) config.headers.Authorization = `Bearer ${token}`
  if (tenantId) config.headers['X-API-KEY'] = tenantId
  return config
})

axiosInstance.interceptors.response.use(
  (res) => res,
  (error: unknown) => {
    const axiosError = error as { response?: { status?: number } }
    if (axiosError.response?.status === 401) {
      // Desloga via store (limpa o estado e o persist:auth);
      // o ProtectedRoute redireciona para /login sem full reload.
      notifyUnauthorized()
    }
    if (
      axiosError.response?.status === 402 &&
      window.location.pathname !== '/subscription'
    ) {
      // Assinatura expirada no meio do uso — leva à regularização
      window.location.href = '/subscription'
    }
    return Promise.reject(error)
  },
)
