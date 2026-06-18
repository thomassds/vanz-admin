import type { DeviceStatusValue } from '../types/device.types'

export const DEVICE_STATUS_LABELS: Record<DeviceStatusValue, string> = {
  0: 'Ativo',
  1: 'Inativo',
}

export function getDeviceStatusLabel(status: number): string {
  return DEVICE_STATUS_LABELS[status as DeviceStatusValue] ?? String(status)
}

export function getDeviceStatusBadgeClass(status: number): string {
  return status === 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
}
