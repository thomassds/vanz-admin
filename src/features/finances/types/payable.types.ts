export type PayableStatusValue = 0 | 1 | 2 | 3
export type PayableCategoryValue = 1 | 2 | 3 | 4 | 5

export const ALLOWED_PAYABLE_STATUS_TRANSITIONS: Record<PayableStatusValue, PayableStatusValue[]> = {
  0: [1, 2, 3],
  1: [0, 2, 3],
  2: [1, 3],
  3: [],
}

export interface Payable {
  id: string
  tenantId: string
  contractId: string | null
  value: string
  dueDate: string
  paidAt: string | null
  status: PayableStatusValue
  category: PayableCategoryValue
  description: string | null
  createdAt: string
  updatedAt: string
}

export interface PayableFilters {
  page: number
  limit: number
  status?: number
  category?: number
  contractId?: string
  dueDateFrom?: string
  dueDateTo?: string
}

export interface CreatePayableDTO {
  value: number
  dueDate: string
  category: number
  status?: number
  contractId?: string
  description?: string
}

export interface UpdatePayableDTO {
  id: string
  value?: number
  dueDate?: string
  status?: number
  category?: number
  description?: string
}
