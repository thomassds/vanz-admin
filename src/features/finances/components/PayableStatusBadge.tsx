import { cn } from '@/shared/utils/cn'
import { getPayableStatusLabel, getPayableStatusClass } from '../utils/payableStatus'

interface PayableStatusBadgeProps {
  status: number
}

export function PayableStatusBadge({ status }: PayableStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        getPayableStatusClass(status),
      )}
    >
      {getPayableStatusLabel(status)}
    </span>
  )
}
