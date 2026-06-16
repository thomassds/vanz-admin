import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import OnboardingPage from './OnboardingPage'
import { authSlice } from '../store/authSlice'
import { authApi } from '../store/authApi'
import { axiosInstance } from '@/shared/api/axiosInstance'

vi.mock('@/shared/api/axiosInstance', () => ({
  axiosInstance: vi.fn(),
}))

const mockedAxiosInstance = axiosInstance as unknown as Mock

function renderOnboardingPage(isAdmin?: boolean) {
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
        <OnboardingPage isAdmin={isAdmin} />
      </MemoryRouter>
    </Provider>,
  )

  return { store }
}

async function fillAccountStep(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Nome'), 'Joao Silva')
  await user.type(screen.getByLabelText('Email'), 'joao@vans.com')
  await user.type(screen.getByLabelText('Senha'), 'Senha123')
  await user.type(screen.getByLabelText('Confirmar senha'), 'Senha123')
  await user.click(screen.getByRole('button', { name: /continuar/i }))
}

beforeEach(() => {
  mockedAxiosInstance.mockReset()
})

describe('OnboardingPage', () => {
  it('avança para o próximo step após validação com sucesso', async () => {
    mockedAxiosInstance
      .mockResolvedValueOnce({ data: { data: { userId: 'user-1' } } })
      .mockResolvedValueOnce({ data: { data: { sent: true, userId: 'user-1' } } })

    renderOnboardingPage()
    const user = userEvent.setup()

    await fillAccountStep(user)

    expect(await screen.findByText(/Enviamos um código de 6 dígitos para/)).toBeInTheDocument()
    await waitFor(() => expect(mockedAxiosInstance).toHaveBeenCalledTimes(2))
  })

  it('não avança se campos do step atual forem inválidos', async () => {
    renderOnboardingPage()
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /continuar/i }))

    expect(await screen.findByText('Nome obrigatório')).toBeInTheDocument()
    expect(screen.getByText('Crie sua conta')).toBeInTheDocument()
    expect(mockedAxiosInstance).not.toHaveBeenCalled()
  })

  it('erro EMAIL_ALREADY_EXISTS exibido corretamente', async () => {
    mockedAxiosInstance.mockRejectedValueOnce({
      response: { status: 409, data: { error: 'EMAIL_ALREADY_EXISTS' } },
    })

    renderOnboardingPage()
    const user = userEvent.setup()

    await fillAccountStep(user)

    expect(await screen.findByText('Este e-mail já está cadastrado.')).toBeInTheDocument()
  })

  it('Step 3 (empresa) exibido apenas para perfil Admin', async () => {
    renderOnboardingPage(false)
    expect(screen.getByText('Etapa 1 de 4')).toBeInTheDocument()

    renderOnboardingPage(true)
    await waitFor(() => expect(screen.getAllByText('Etapa 1 de 5').length).toBeGreaterThan(0))
  })
})
