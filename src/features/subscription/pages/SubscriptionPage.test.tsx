import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Mock } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import SubscriptionPage from './SubscriptionPage'
import { subscriptionApi } from '../store/subscriptionApi'
import type { SubscriptionMe } from '../types/subscription.types'
import { axiosInstance } from '@/shared/api/axiosInstance'

vi.mock('@/shared/api/axiosInstance', () => ({
  axiosInstance: vi.fn(),
}))

const mockedAxiosInstance = axiosInstance as unknown as Mock

const plans = [
  {
    key: 'gestao',
    name: 'Gestão',
    priceMonthlyCents: 2990,
    maxVehicles: 2,
    features: ['management'],
  },
  {
    key: 'operacao',
    name: 'Operação',
    priceMonthlyCents: 9990,
    maxVehicles: null,
    features: ['management', 'tracking'],
  },
]

const trialSubscription: SubscriptionMe = {
  plan: 'operacao',
  planName: 'Operação',
  status: 'trialing',
  trialEndsAt: new Date(Date.now() + 10 * 86400000).toISOString(),
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
  hasAccess: true,
  trialDaysLeft: 10,
}

function mockApi(subscription: SubscriptionMe) {
  mockedAxiosInstance.mockImplementation(
    ({ url, method }: { url: string; method: string }) => {
      if (url === '/subscriptions/me') {
        return Promise.resolve({ data: { data: subscription } })
      }
      if (url === '/subscriptions/plans') {
        return Promise.resolve({ data: { data: { plans } } })
      }
      if (url === '/subscriptions/checkout' && method === 'POST') {
        return Promise.resolve({ data: { data: { url: 'https://gw/checkout' } } })
      }
      if (url === '/subscriptions/portal' && method === 'POST') {
        return Promise.resolve({ data: { data: { url: 'https://gw/portal' } } })
      }
      return Promise.reject(new Error(`URL não mockada: ${url}`))
    },
  )
}

function renderPage() {
  const store = configureStore({
    reducer: {
      [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(subscriptionApi.middleware),
  })

  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/subscription']}>
        <SubscriptionPage />
      </MemoryRouter>
    </Provider>,
  )
}

beforeEach(() => {
  mockedAxiosInstance.mockReset()
})

describe('SubscriptionPage', () => {
  it('exibe os dois planos com preços formatados', async () => {
    mockApi(trialSubscription)
    renderPage()

    expect(await screen.findByText('R$ 29,90')).toBeInTheDocument()
    expect(screen.getByText('R$ 99,90')).toBeInTheDocument()
    expect(screen.getByText('Recomendado')).toBeInTheDocument()
  })

  it('mostra o status do trial com dias restantes', async () => {
    mockApi(trialSubscription)
    renderPage()

    expect(await screen.findByText('Período de teste')).toBeInTheDocument()
    expect(
      screen.getByText(/10 dias restantes de teste com acesso total/),
    ).toBeInTheDocument()
  })

  it('assinar dispara o checkout com o plano escolhido', async () => {
    const user = userEvent.setup()
    mockApi(trialSubscription)
    renderPage()

    const buttons = await screen.findAllByRole('button', { name: 'Assinar' })
    await user.click(buttons[buttons.length - 1])

    await waitFor(() =>
      expect(mockedAxiosInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/subscriptions/checkout',
          method: 'POST',
          data: { plan: 'operacao' },
        }),
      ),
    )
  })

  it('assinante ativo vê "Plano atual" e o botão de portal', async () => {
    mockApi({
      ...trialSubscription,
      status: 'active',
      plan: 'gestao',
      planName: 'Gestão',
      trialDaysLeft: null,
      currentPeriodEnd: new Date('2026-08-01').toISOString(),
    })
    renderPage()

    expect(
      await screen.findByRole('button', { name: 'Plano atual' }),
    ).toBeDisabled()
    expect(
      screen.getByRole('button', { name: 'Gerenciar assinatura' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Mudar para este plano' }),
    ).toBeInTheDocument()
  })

  it('trial expirado orienta a assinar', async () => {
    mockApi({
      ...trialSubscription,
      hasAccess: false,
      trialDaysLeft: 0,
    })
    renderPage()

    expect(
      await screen.findByText(/Seu período de teste terminou/),
    ).toBeInTheDocument()
  })
})
