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
  0: 'bg-card-hover text-text-muted',
  1: 'bg-info-soft text-info',
  2: 'bg-success-soft text-success',
  3: 'bg-danger-soft text-danger',
  4: 'bg-orange-500/15 text-orange-500',
  5: 'bg-warning-soft text-warning',
}

export function getStatusLabel(status: number): string {
  return STATUS_LABELS[status as ReceivableStatusValue] ?? 'Desconhecido'
}

export function getStatusClass(status: number): string {
  return STATUS_CLASSES[status as ReceivableStatusValue] ?? 'bg-card-hover text-text-muted'
}

export function getAllowedTransitions(status: number): ReceivableStatusValue[] {
  return ALLOWED_STATUS_TRANSITIONS[status as ReceivableStatusValue] ?? []
}

export function isTerminalStatus(status: number): boolean {
  return status === 2 || status === 4 || status === 5
}
