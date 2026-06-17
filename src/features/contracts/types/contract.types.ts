export type ContractStatus = 'active' | 'inactive' | 'pending'

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
