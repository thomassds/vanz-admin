export type ReceivableStatusValue = 0 | 1 | 2 | 3 | 4 | 5

export const ALLOWED_STATUS_TRANSITIONS: Record<ReceivableStatusValue, ReceivableStatusValue[]> = {
  0: [1, 3, 4],
  1: [2, 3, 4],
  2: [],
  3: [2, 4],
  4: [],
  5: [],
}

export interface ReceivableContract {
  id: string
  client?: { name: string }
}

export interface Receivable {
  id: string
  contractId: string
  contract?: ReceivableContract
  installmentNumber: number
  dueDate: string
  value: number
  status: ReceivableStatusValue
  createdAt: string
}

export interface ReceivableFilters {
  page: number
  limit: number
  contractId?: string
  status?: number
  dueDateFrom?: string
  dueDateTo?: string
}

export interface CreateReceivableDTO {
  contractId: string
  installmentNumber: number
  dueDate: string
  value: number
}

export interface UpdateReceivableDTO {
  id: string
  value?: number
  dueDate?: string
  status?: number
}
