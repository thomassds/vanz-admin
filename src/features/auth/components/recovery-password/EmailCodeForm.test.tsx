import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { Mock } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { EmailCodeForm } from './EmailCodeForm'
import { authSlice } from '../../store/authSlice'
import { authApi } from '../../store/authApi'
import { axiosInstance } from '@/shared/api/axiosInstance'

vi.mock('@/shared/api/axiosInstance', () => ({
  axiosInstance: vi.fn(),
}))

const mockedAxiosInstance = axiosInstance as unknown as Mock

function renderEmailCodeForm(onSuccess = vi.fn()) {
  const store = configureStore({
    reducer: {
      auth: authSlice.reducer,
      [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware),
  })

  render(
    <Provider store={store}>
      <EmailCodeForm userId="user-1" email="teste@vans.com" onSuccess={onSuccess} />
    </Provider>,
  )

  return { onSuccess }
}

beforeEach(() => {
  mockedAxiosInstance.mockReset()
})

describe('EmailCodeForm (recovery-password)', () => {
  it('chama validateCode com justCheck:true e propaga o código validado', async () => {
    mockedAxiosInstance.mockResolvedValueOnce({
      data: { data: { validated: true, userId: 'user-1', type: 'email' } },
    })

    const { onSuccess } = renderEmailCodeForm()
    const user = userEvent.setup()

    await user.type(screen.getByLabelText('Código de verificação'), '123456')
    await user.click(screen.getByRole('button', { name: /confirmar/i }))

    await screen.findByRole('button', { name: /confirmar/i })
    expect(mockedAxiosInstance).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/auth/validate-code',
        method: 'POST',
        data: { userId: 'user-1', type: 'email', code: '123456', justCheck: true },
      }),
    )
    expect(onSuccess).toHaveBeenCalledWith('123456')
  })

  it('erro INVALID_CODE exibe mensagem correta', async () => {
    mockedAxiosInstance.mockRejectedValueOnce({
      response: { status: 400, data: { error: 'INVALID_CODE' } },
    })

    const { onSuccess } = renderEmailCodeForm()
    const user = userEvent.setup()

    await user.type(screen.getByLabelText('Código de verificação'), '123456')
    await user.click(screen.getByRole('button', { name: /confirmar/i }))

    expect(await screen.findByText('Código inválido.')).toBeInTheDocument()
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('timer de reenvio de código funciona corretamente', async () => {
    vi.useFakeTimers()

    renderEmailCodeForm()

    expect(screen.getByText('Reenviar código em 60s')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /reenviar código/i })).not.toBeInTheDocument()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(60_000)
    })

    expect(screen.getByRole('button', { name: /reenviar código/i })).toBeInTheDocument()

    vi.useRealTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })
})
