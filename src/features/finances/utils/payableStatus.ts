import type { PayableStatusValue } from '../types/payable.types'
import { ALLOWED_PAYABLE_STATUS_TRANSITIONS } from '../types/payable.types'

const STATUS_LABELS: Record<PayableStatusValue, string> = {
  0: 'Pendente',
  1: 'Pago',
  2: 'Vencido',
  3: 'Cancelado',
}

const STATUS_CLASSES: Record<PayableStatusValue, string> = {
  0: 'bg-card-hover text-text-muted',
  1: 'bg-success-soft text-success',
  2: 'bg-danger-soft text-danger',
  3: 'bg-orange-500/15 text-orange-500',
}

export function getPayableStatusLabel(status: number): string {
  return STATUS_LABELS[status as PayableStatusValue] ?? 'Desconhecido'
}

export function getPayableStatusClass(status: number): string {
  return STATUS_CLASSES[status as PayableStatusValue] ?? 'bg-card-hover text-text-muted'
}

export function getAllowedPayableTransitions(status: number): PayableStatusValue[] {
  return ALLOWED_PAYABLE_STATUS_TRANSITIONS[status as PayableStatusValue] ?? []
}

export function isTerminalPayableStatus(status: number): boolean {
  return status === 3
}
