import type { DeviceStatusValue } from '../types/device.types'

export const DEVICE_STATUS_LABELS: Record<DeviceStatusValue, string> = {
  0: 'Ativo',
  1: 'Inativo',
}

export function getDeviceStatusLabel(status: number): string {
  return DEVICE_STATUS_LABELS[status as DeviceStatusValue] ?? String(status)
}

export function getDeviceStatusBadgeClass(status: number): string {
  return status === 0 ? 'bg-success-soft text-success' : 'bg-card-hover text-text-muted'
}
