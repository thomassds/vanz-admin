import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { LoginForm } from './LoginForm'
import { authSlice } from '../store/authSlice'
import { authApi } from '../store/authApi'
import { axiosInstance } from '@/shared/api/axiosInstance'

vi.mock('@/shared/api/axiosInstance', () => ({
  axiosInstance: vi.fn(),
}))

const mockedAxiosInstance = axiosInstance as unknown as Mock

function renderLoginForm() {
  const store = configureStore({
    reducer: {
      auth: authSlice.reducer,
      [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware),
  })

  render(
    <Provider store={store}>
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    </Provider>,
  )

  return { store }
}

beforeEach(() => {
  mockedAxiosInstance.mockReset()
})

describe('LoginForm', () => {
  it('submissão com dados válidos chama a mutation de login', async () => {
    mockedAxiosInstance.mockResolvedValueOnce({
      data: {
        data: { token: 'fake-token', user: { id: '1', name: 'Teste', email: 'teste@vans.com' } },
      },
    })

    const { store } = renderLoginForm()
    const user = userEvent.setup()

    await user.type(screen.getByLabelText('Email'), 'teste@vans.com')
    await user.type(screen.getByLabelText('Senha'), 'senha123')
    await user.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => expect(mockedAxiosInstance).toHaveBeenCalledTimes(1))
    expect(mockedAxiosInstance).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/auth',
        method: 'POST',
        data: { email: 'teste@vans.com', password: 'senha123' },
      }),
    )
    await waitFor(() => expect(store.getState().auth.isAuthenticated).toBe(true))
  })

  it('erro INVALID_CREDENTIALS exibe mensagem correta', async () => {
    mockedAxiosInstance.mockRejectedValueOnce({
      response: { status: 401, data: { error: 'INVALID_CREDENTIALS' } },
    })

    renderLoginForm()
    const user = userEvent.setup()

    await user.type(screen.getByLabelText('Email'), 'teste@vans.com')
    await user.type(screen.getByLabelText('Senha'), 'senhaerrada')
    await user.click(screen.getByRole('button', { name: /entrar/i }))

    expect(await screen.findByText('Senha incorreta.')).toBeInTheDocument()
  })

  it('erro EMAIL_NOT_VALIDATED exibe mensagem correta', async () => {
    mockedAxiosInstance.mockRejectedValueOnce({
      response: { status: 403, data: { error: 'EMAIL_NOT_VALIDATED' } },
    })

    renderLoginForm()
    const user = userEvent.setup()

    await user.type(screen.getByLabelText('Email'), 'teste@vans.com')
    await user.type(screen.getByLabelText('Senha'), 'senha123')
    await user.click(screen.getByRole('button', { name: /entrar/i }))

    expect(
      await screen.findByText('Seu e-mail ainda não foi validado. Verifique sua caixa de entrada.'),
    ).toBeInTheDocument()
  })

  it('campos inválidos exibem erro de validação inline', async () => {
    renderLoginForm()
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /entrar/i }))

    expect(await screen.findByText('E-mail inválido')).toBeInTheDocument()
    expect(await screen.findByText('Senha obrigatória')).toBeInTheDocument()
    expect(mockedAxiosInstance).not.toHaveBeenCalled()
  })

  it('botão fica desabilitado durante o loading', async () => {
    let resolveRequest: (value: unknown) => void = () => {}
    mockedAxiosInstance.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve
        }),
    )

    renderLoginForm()
    const user = userEvent.setup()

    await user.type(screen.getByLabelText('Email'), 'teste@vans.com')
    await user.type(screen.getByLabelText('Senha'), 'senha123')
    await user.click(screen.getByRole('button', { name: /entrar/i }))

    const button = await screen.findByRole('button', { name: /entrando/i })
    expect(button).toBeDisabled()

    resolveRequest({
      data: {
        data: { token: 'fake-token', user: { id: '1', name: 'Teste', email: 'teste@vans.com' } },
      },
    })
  })
})
