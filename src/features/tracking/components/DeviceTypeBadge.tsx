import { getDeviceTypeLabel } from '../utils/deviceType'

export function DeviceTypeBadge({ type }: { type: number }) {
  const label = getDeviceTypeLabel(type)
  const cls = type === 1
    ? 'bg-info-soft text-info'
    : 'bg-purple-500/15 text-purple-500'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {label}
    </span>
  )
}
