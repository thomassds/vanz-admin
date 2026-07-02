import { isoToBR } from '@/shared/utils/date'
import type { ContractEventType } from '../types/contract.types'

export const EVENT_LABELS: Record<ContractEventType, string> = {
  CONTRACT_CREATED: 'Contrato criado',
  CONTRACT_UPDATED: 'Contrato atualizado',
  CONTRACT_ACTIVATED: 'Contrato ativado',
  CONTRACT_SUSPENDED: 'Contrato suspenso',
  CONTRACT_CANCELED: 'Contrato cancelado',
  CONTRACT_RENEWED: 'Contrato renovado',
  DEPENDENT_LINKED: 'Dependente vinculado',
  DEPENDENT_UNLINKED: 'Dependente desvinculado',
}

export const EVENT_BADGE_CLASS: Record<ContractEventType, string> = {
  CONTRACT_CREATED: 'bg-info-soft text-info',
  CONTRACT_UPDATED: 'bg-card-hover text-text-muted',
  CONTRACT_ACTIVATED: 'bg-success-soft text-success',
  CONTRACT_SUSPENDED: 'bg-warning-soft text-warning',
  CONTRACT_CANCELED: 'bg-danger-soft text-danger',
  CONTRACT_RENEWED: 'bg-primary-soft text-primary',
  DEPENDENT_LINKED: 'bg-success-soft text-success',
  DEPENDENT_UNLINKED: 'bg-card-hover text-text-muted',
}

const DATE_FIELDS = new Set(['startDate', 'endDate', 'firstPaymentDate'])
const CURRENCY_FIELDS = new Set(['value', 'discount', 'totalValue'])

export const FIELD_LABELS: Record<string, string> = {
  value: 'Valor mensal',
  discount: 'Desconto',
  totalValue: 'Valor total',
  dueDay: 'Dia de vencimento',
  durationMonths: 'Duração (meses)',
  startDate: 'Data de início',
  endDate: 'Data de vencimento',
  firstPaymentDate: 'Primeiro pagamento',
  status: 'Status',
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatDiffValue(key: string, value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (DATE_FIELDS.has(key) && typeof value === 'string' && value.length >= 10) {
    return isoToBR(value.slice(0, 10))
  }
  if (CURRENCY_FIELDS.has(key) && typeof value === 'number') {
    return formatCurrency(value)
  }
  return String(value)
}

function normalizeForComparison(key: string, value: unknown): unknown {
  if (value === null || value === undefined) return null
  if (DATE_FIELDS.has(key) && typeof value === 'string' && value.length >= 10) {
    return value.slice(0, 10)
  }
  return value
}

export function getDiffEntries(
  oldValue: Record<string, unknown> | null,
  newValue: Record<string, unknown> | null,
): Array<{ key: string; label: string; from: string; to: string }> {
  if (!oldValue || !newValue) return []
  return Object.keys(FIELD_LABELS)
    .filter((k) => k in oldValue || k in newValue)
    .filter((k) => normalizeForComparison(k, oldValue[k]) !== normalizeForComparison(k, newValue[k]))
    .map((k) => ({
      key: k,
      label: FIELD_LABELS[k] ?? k,
      from: formatDiffValue(k, oldValue[k]),
      to: formatDiffValue(k, newValue[k]),
    }))
}

export function formatEventDateTime(isoStr: string): string {
  const date = new Date(isoStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${day}/${month}/${year} às ${hours}:${minutes}`
}
