import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import RecoveryPasswordPage from './RecoveryPasswordPage'
import LoginPage from './LoginPage'
import { authSlice } from '../store/authSlice'
import { authApi } from '../store/authApi'
import { axiosInstance } from '@/shared/api/axiosInstance'

vi.mock('@/shared/api/axiosInstance', () => ({
  axiosInstance: vi.fn(),
}))

const mockedAxiosInstance = axiosInstance as unknown as Mock

function renderRecoveryPasswordPage() {
  const store = configureStore({
    reducer: {
      auth: authSlice.reducer,
      [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware),
  })

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/recovery-password']}>
        <Routes>
          <Route path="/recovery-password" element={<RecoveryPasswordPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  )

  return { store }
}

async function advanceToEmailCodeStep(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Email'), 'joao@vans.com')
  await user.click(screen.getByRole('button', { name: /enviar código/i }))
  await screen.findByText('Confirme o código')
}

beforeEach(() => {
  mockedAxiosInstance.mockReset()
})

describe('RecoveryPasswordPage', () => {
  it('Step 1 envia código para o e-mail informado', async () => {
    mockedAxiosInstance.mockResolvedValueOnce({ data: { data: { sent: true, userId: 'user-1' } } })

    renderRecoveryPasswordPage()
    const user = userEvent.setup()

    await advanceToEmailCodeStep(user)

    expect(mockedAxiosInstance).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/auth/request-code',
        method: 'POST',
        data: { email: 'joao@vans.com', channel: 'email' },
      }),
    )
  })

  it('erro USER_NOT_FOUND exibido corretamente no Step 1', async () => {
    mockedAxiosInstance.mockRejectedValueOnce({
      response: { status: 404, data: { error: 'USER_NOT_FOUND' } },
    })

    renderRecoveryPasswordPage()
    const user = userEvent.setup()

    await user.type(screen.getByLabelText('Email'), 'joao@vans.com')
    await user.click(screen.getByRole('button', { name: /enviar código/i }))

    expect(await screen.findByText('E-mail não cadastrado na plataforma.')).toBeInTheDocument()
  })

  it('Step 2 valida o código com justCheck e avança para o Step 3 sem redefinir a senha', async () => {
    mockedAxiosInstance
      .mockResolvedValueOnce({ data: { data: { sent: true, userId: 'user-1' } } })
      .mockResolvedValueOnce({ data: { data: { validated: true, userId: 'user-1', type: 'email' } } })

    renderRecoveryPasswordPage()
    const user = userEvent.setup()

    await advanceToEmailCodeStep(user)
    await user.type(screen.getByLabelText('Código de verificação'), '123456')
    await user.click(screen.getByRole('button', { name: /confirmar/i }))

    expect(await screen.findByText('Crie uma nova senha')).toBeInTheDocument()
    expect(mockedAxiosInstance).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/auth/validate-code',
        method: 'POST',
        data: { userId: 'user-1', type: 'email', code: '123456', justCheck: true },
      }),
    )
  })

  it('Step 2 exibe o timer de reenvio assim que o código é enviado', async () => {
    mockedAxiosInstance.mockResolvedValueOnce({ data: { data: { sent: true, userId: 'user-1' } } })

    renderRecoveryPasswordPage()
    const user = userEvent.setup()

    await advanceToEmailCodeStep(user)

    expect(screen.getByText('Reenviar código em 60s')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /reenviar código/i })).not.toBeInTheDocument()
  })

  it('erro INVALID_CODE exibido corretamente no Step 2', async () => {
    mockedAxiosInstance
      .mockResolvedValueOnce({ data: { data: { sent: true, userId: 'user-1' } } })
      .mockRejectedValueOnce({
        response: { status: 400, data: { error: 'INVALID_CODE' } },
      })

    renderRecoveryPasswordPage()
    const user = userEvent.setup()

    await advanceToEmailCodeStep(user)
    await user.type(screen.getByLabelText('Código de verificação'), '123456')
    await user.click(screen.getByRole('button', { name: /confirmar/i }))

    expect(await screen.findByText('Código inválido.')).toBeInTheDocument()
  })

  it('Step 3 valida se as senhas coincidem antes de submeter', async () => {
    mockedAxiosInstance
      .mockResolvedValueOnce({ data: { data: { sent: true, userId: 'user-1' } } })
      .mockResolvedValueOnce({ data: { data: { validated: true, userId: 'user-1', type: 'email' } } })

    renderRecoveryPasswordPage()
    const user = userEvent.setup()

    await advanceToEmailCodeStep(user)
    await user.type(screen.getByLabelText('Código de verificação'), '123456')
    await user.click(screen.getByRole('button', { name: /confirmar/i }))
    await screen.findByText('Crie uma nova senha')

    await user.type(screen.getByLabelText('Nova senha'), 'Senha123')
    await user.type(screen.getByLabelText('Confirmar senha'), 'Outra123')
    await user.click(screen.getByRole('button', { name: /redefinir senha/i }))

    expect(await screen.findByText('As senhas não coincidem')).toBeInTheDocument()
    expect(mockedAxiosInstance).toHaveBeenCalledTimes(2)
  })

  it('erro WEAK_PASSWORD exibido corretamente no Step 3', async () => {
    mockedAxiosInstance
      .mockResolvedValueOnce({ data: { data: { sent: true, userId: 'user-1' } } })
      .mockResolvedValueOnce({ data: { data: { validated: true, userId: 'user-1', type: 'email' } } })
      .mockRejectedValueOnce({
        response: { status: 422, data: { error: 'WEAK_PASSWORD' } },
      })

    renderRecoveryPasswordPage()
    const user = userEvent.setup()

    await advanceToEmailCodeStep(user)
    await user.type(screen.getByLabelText('Código de verificação'), '123456')
    await user.click(screen.getByRole('button', { name: /confirmar/i }))
    await screen.findByText('Crie uma nova senha')

    await user.type(screen.getByLabelText('Nova senha'), 'Senha123')
    await user.type(screen.getByLabelText('Confirmar senha'), 'Senha123')
    await user.click(screen.getByRole('button', { name: /redefinir senha/i }))

    expect(await screen.findByText('A senha não atende aos requisitos mínimos.')).toBeInTheDocument()
  })

  it('redireciona para /login com mensagem de sucesso após o Step 3', async () => {
    mockedAxiosInstance
      .mockResolvedValueOnce({ data: { data: { sent: true, userId: 'user-1' } } })
      .mockResolvedValueOnce({ data: { data: { validated: true, userId: 'user-1', type: 'email' } } })
      .mockResolvedValueOnce({ data: { data: { updated: true } } })

    renderRecoveryPasswordPage()
    const user = userEvent.setup()

    await advanceToEmailCodeStep(user)
    await user.type(screen.getByLabelText('Código de verificação'), '123456')
    await user.click(screen.getByRole('button', { name: /confirmar/i }))
    await screen.findByText('Crie uma nova senha')

    await user.type(screen.getByLabelText('Nova senha'), 'Senha123')
    await user.type(screen.getByLabelText('Confirmar senha'), 'Senha123')
    await user.click(screen.getByRole('button', { name: /redefinir senha/i }))

    expect(await screen.findByText('BEM VINDO')).toBeInTheDocument()
    expect(
      screen.getByText('Senha redefinida com sucesso! Faça login com sua nova senha.'),
    ).toBeInTheDocument()
    expect(mockedAxiosInstance).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/auth/recovery-password',
        method: 'POST',
        data: { userId: 'user-1', type: 'email', code: '123456', password: 'Senha123' },
      }),
    )
  })
})
