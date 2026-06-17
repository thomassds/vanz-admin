export type ContractStatus = 'active' | 'inactive' | 'pending' | 'suspended' | 'canceled'

export type ContractEventType =
  | 'CONTRACT_CREATED'
  | 'CONTRACT_UPDATED'
  | 'CONTRACT_ACTIVATED'
  | 'CONTRACT_SUSPENDED'
  | 'CONTRACT_CANCELED'
  | 'CONTRACT_RENEWED'
  | 'DEPENDENT_LINKED'
  | 'DEPENDENT_UNLINKED'

export interface ContractHistoryEvent {
  id: string
  tenantId: string
  contractId: string
  eventType: ContractEventType
  oldValue: Record<string, unknown> | null
  newValue: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
  createdAt: string
}

export interface ContractHistoryResponse {
  items: ContractHistoryEvent[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ContractClient {
  id: string
  name: string
}

export interface ContractDependent {
  id: string
  name: string
}

export interface Contract {
  id: string
  clientId: string
  client?: ContractClient
  dependents?: ContractDependent[]
  startDate: string
  endDate: string
  firstPaymentDate: string
  value: number
  discount: number
  totalValue: number
  dueDay: number
  durationMonths: number
  status: ContractStatus
  createdAt: string
}

export interface ContractFilters {
  page: number
  limit: number
  status?: string
  clientId?: string
  dueDateFrom?: string
  dueDateTo?: string
}

export interface CreateContractDTO {
  clientId: string
  dependentIds?: string[]
  startDate: string
  endDate: string
  firstPaymentDate: string
  value: number
  discount: number
  totalValue: number
  dueDay: number
  durationMonths: number
}

export interface UpdateContractDTO {
  id: string
  clientId: string
  dependentIds?: string[]
  startDate: string
  endDate: string
  firstPaymentDate: string
  value: number
  discount: number
  totalValue: number
  dueDay: number
  durationMonths: number
}

export interface RenewContractDTO {
  startDate: string
  endDate: string
  value?: number
  discount?: number
  durationMonths?: number
  firstPaymentDate?: string
  dueDay?: number
}
