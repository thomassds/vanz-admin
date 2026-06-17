import { cn } from '@/shared/utils/cn'
import { getStatusLabel, getStatusClass } from '../utils/receivableStatus'

interface ReceivableStatusBadgeProps {
  status: number
}

export function ReceivableStatusBadge({ status }: ReceivableStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        getStatusClass(status),
      )}
    >
      {getStatusLabel(status)}
    </span>
  )
}
