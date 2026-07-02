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
    case 0: return 'bg-success-soft text-success'
    case 1: return 'bg-card-hover text-text-muted'
    case 2: return 'bg-warning-soft text-warning'
    default: return 'bg-card-hover text-text-muted'
  }
}
