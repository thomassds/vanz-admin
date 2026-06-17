import type { ReceivableStatusValue } from '../types/receivable.types'
import { ALLOWED_STATUS_TRANSITIONS } from '../types/receivable.types'

const STATUS_LABELS: Record<ReceivableStatusValue, string> = {
  0: 'Pendente',
  1: 'Cobrado',
  2: 'Pago',
  3: 'Vencido',
  4: 'Cancelado',
  5: 'Contrato pendente',
}

const STATUS_CLASSES: Record<ReceivableStatusValue, string> = {
  0: 'bg-gray-100 text-gray-500',
  1: 'bg-blue-50 text-blue-700',
  2: 'bg-success-light text-success',
  3: 'bg-red-50 text-red-700',
  4: 'bg-orange-50 text-orange-700',
  5: 'bg-yellow-50 text-yellow-700',
}

export function getStatusLabel(status: number): string {
  return STATUS_LABELS[status as ReceivableStatusValue] ?? 'Desconhecido'
}

export function getStatusClass(status: number): string {
  return STATUS_CLASSES[status as ReceivableStatusValue] ?? 'bg-gray-100 text-gray-500'
}

export function getAllowedTransitions(status: number): ReceivableStatusValue[] {
  return ALLOWED_STATUS_TRANSITIONS[status as ReceivableStatusValue] ?? []
}

export function isTerminalStatus(status: number): boolean {
  return status === 2 || status === 4 || status === 5
}
