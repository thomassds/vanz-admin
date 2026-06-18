export type VehicleStatusValue = 0 | 1 | 2

export interface Vehicle {
  id: string
  tenantId: string
  plate: string
  model: string
  year: number | null
  capacity: number
  status: VehicleStatusValue
  lastRevisionAt: string | null
  nextRevisionAt: string | null
  createdAt: string
  updatedAt: string
}

export interface VehicleFilters {
  page: number
  limit: number
  status?: VehicleStatusValue
}

export interface CreateVehicleDTO {
  plate: string
  model: string
  capacity: number
  year?: number
  lastRevisionAt?: string
  nextRevisionAt?: string
}

export interface UpdateVehicleDTO {
  id: string
  plate?: string
  model?: string
  capacity?: number
  year?: number
  status?: number
  lastRevisionAt?: string
  nextRevisionAt?: string
}
