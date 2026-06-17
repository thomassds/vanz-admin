import { cn } from '@/shared/utils/cn'
import type { ContractStatus } from '../types/contract.types'

const STATUS_MAP: Record<ContractStatus, { label: string; className: string }> = {
  active: { label: 'Ativo', className: 'bg-success-light text-success' },
  inactive: { label: 'Inativo', className: 'bg-gray-100 text-gray-500' },
  pending: { label: 'Pendente', className: 'bg-yellow-50 text-yellow-700' },
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
