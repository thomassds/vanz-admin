export type DeviceTypeValue = 0 | 1
export type DeviceStatusValue = 0 | 1

export interface Device {
  id: string
  tenantId: string
  vehicleId: string
  userId: string | null
  externalDeviceId: number
  uniqueId: string
  name: string
  type: DeviceTypeValue
  status: DeviceStatusValue
  createdAt: string
  updatedAt: string
}

export interface DeviceFilters {
  page: number
  limit: number
  vehicleId?: string
  type?: DeviceTypeValue
  status?: DeviceStatusValue
}

export interface CreateDeviceDTO {
  vehicleId: string
  userId?: string
  uniqueId?: string
  name?: string
  type?: number
}
