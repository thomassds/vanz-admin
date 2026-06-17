import type { PayableStatusValue } from '../types/payable.types'
import { ALLOWED_PAYABLE_STATUS_TRANSITIONS } from '../types/payable.types'

const STATUS_LABELS: Record<PayableStatusValue, string> = {
  0: 'Pendente',
  1: 'Pago',
  2: 'Vencido',
  3: 'Cancelado',
}

const STATUS_CLASSES: Record<PayableStatusValue, string> = {
  0: 'bg-gray-100 text-gray-500',
  1: 'bg-success-light text-success',
  2: 'bg-red-50 text-red-700',
  3: 'bg-orange-50 text-orange-700',
}

export function getPayableStatusLabel(status: number): string {
  return STATUS_LABELS[status as PayableStatusValue] ?? 'Desconhecido'
}

export function getPayableStatusClass(status: number): string {
  return STATUS_CLASSES[status as PayableStatusValue] ?? 'bg-gray-100 text-gray-500'
}

export function getAllowedPayableTransitions(status: number): PayableStatusValue[] {
  return ALLOWED_PAYABLE_STATUS_TRANSITIONS[status as PayableStatusValue] ?? []
}

export function isTerminalPayableStatus(status: number): boolean {
  return status === 3
}
