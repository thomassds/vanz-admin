import { getDeviceTypeLabel } from '../utils/deviceType'

export function DeviceTypeBadge({ type }: { type: number }) {
  const label = getDeviceTypeLabel(type)
  const cls = type === 1
    ? 'bg-blue-100 text-blue-700'
    : 'bg-purple-100 text-purple-700'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {label}
    </span>
  )
}
