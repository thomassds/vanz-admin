import { getDeviceStatusLabel, getDeviceStatusBadgeClass } from '../utils/deviceStatus'

export function DeviceStatusBadge({ status }: { status: number }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getDeviceStatusBadgeClass(status)}`}>
      {getDeviceStatusLabel(status)}
    </span>
  )
}
