import type { DeviceTypeValue } from '../types/device.types'

export const DEVICE_TYPE_LABELS: Record<DeviceTypeValue, string> = {
  0: 'App Mobile',
  1: 'Rastreador GPS',
}

export function getDeviceTypeLabel(type: number): string {
  return DEVICE_TYPE_LABELS[type as DeviceTypeValue] ?? String(type)
}

export const DEVICE_TYPE_OPTIONS = [
  { value: 0, label: 'App Mobile' },
  { value: 1, label: 'Rastreador GPS' },
]
