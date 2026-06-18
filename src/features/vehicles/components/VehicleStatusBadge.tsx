import { getVehicleStatusLabel, getVehicleStatusBadgeClass } from '../utils/vehicleStatus'

interface VehicleStatusBadgeProps {
  status: number
}

export function VehicleStatusBadge({ status }: VehicleStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getVehicleStatusBadgeClass(status)}`}
    >
      {getVehicleStatusLabel(status)}
    </span>
  )
}
