import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ClientsTable } from './ClientsTable'
import type { Client } from '../types/client.types'
import type { PaginatedResponse } from '@/shared/types/api.types'

const client: Client = {
  id: 'client-1',
  tenantId: 'tenant-1',
  name: 'Maria Silva',
  taxIdentifier: '39053344705',
  phone: null,
  email: null,
  isActive: true,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
} as Client

const data: PaginatedResponse<Client> = {
  items: [client],
  total: 1,
  page: 1,
  limit: 10,
} as PaginatedResponse<Client>

function renderTable() {
  const props = {
    data,
    isLoading: false,
    isError: false,
    onRefetch: vi.fn(),
    onEdit: vi.fn(),
    onDisable: vi.fn(),
    onNew: vi.fn(),
    page: 1,
    limit: 10,
    onPageChange: vi.fn(),
  }

  render(
    <MemoryRouter initialEntries={['/clients']}>
      <Routes>
        <Route path="/clients" element={<ClientsTable {...props} />} />
        <Route path="/clients/:id" element={<p>detalhe do cliente</p>} />
      </Routes>
    </MemoryRouter>,
  )

  return props
}

describe('ClientsTable', () => {
  it('mostra a ação explícita de detalhes em cada linha', () => {
    renderTable()
    expect(screen.getByRole('link', { name: /detalhes/i })).toHaveAttribute(
      'href',
      '/clients/client-1',
    )
  })

  it('navega para o detalhe ao clicar em qualquer parte da linha', async () => {
    const user = userEvent.setup()
    renderTable()

    // clica na célula do documento (não é link nem botão)
    await user.click(screen.getByText('390.533.447-05'))
    expect(await screen.findByText('detalhe do cliente')).toBeInTheDocument()
  })

  it('não navega ao clicar em Editar', async () => {
    const user = userEvent.setup()
    const props = renderTable()

    await user.click(screen.getByRole('button', { name: 'Editar' }))
    expect(props.onEdit).toHaveBeenCalledWith(client)
    expect(screen.queryByText('detalhe do cliente')).not.toBeInTheDocument()
  })
})
