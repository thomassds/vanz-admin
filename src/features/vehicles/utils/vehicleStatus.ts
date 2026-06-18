import type { VehicleStatusValue } from '../types/vehicle.types'

export const VEHICLE_STATUS_LABELS: Record<VehicleStatusValue, string> = {
  0: 'Ativo',
  1: 'Inativo',
  2: 'Manutenção',
}

export function getVehicleStatusLabel(status: number): string {
  return VEHICLE_STATUS_LABELS[status as VehicleStatusValue] ?? String(status)
}

export function getVehicleStatusBadgeClass(status: number): string {
  switch (status) {
    case 0: return 'bg-green-100 text-green-700'
    case 1: return 'bg-gray-100 text-gray-600'
    case 2: return 'bg-yellow-100 text-yellow-700'
    default: return 'bg-gray-100 text-gray-600'
  }
}
