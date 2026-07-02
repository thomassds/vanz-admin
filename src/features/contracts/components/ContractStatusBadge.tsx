import { cn } from '@/shared/utils/cn'
import type { ContractStatus } from '../types/contract.types'

const STATUS_MAP: Record<ContractStatus, { label: string; className: string }> = {
  active: { label: 'Ativo', className: 'bg-success-soft text-success' },
  inactive: { label: 'Inativo', className: 'bg-card-hover text-text-muted' },
  pending: { label: 'Pendente', className: 'bg-warning-soft text-warning' },
  suspended: { label: 'Suspenso', className: 'bg-orange-500/15 text-orange-500' },
  canceled: { label: 'Cancelado', className: 'bg-danger-soft text-danger' },
}

interface ContractStatusBadgeProps {
  status: ContractStatus
}

export function ContractStatusBadge({ status }: ContractStatusBadgeProps) {
  const { label, className } = STATUS_MAP[status] ?? STATUS_MAP.pending
  return (
    <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold', className)}>
      {label}
    </span>
  )
}
