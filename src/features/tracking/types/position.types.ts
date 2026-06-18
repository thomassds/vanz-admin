export interface VehiclePositionEvent {
  vehicleId: string
  deviceId: string
  latitude: number
  longitude: number
  speed: number
  capturedAt: string
}

export interface VehiclePositionResult {
  vehicleId: string
  deviceId: string
  latitude: number
  longitude: number
  speed: number
  capturedAt: string
}

export interface LivePosition extends VehiclePositionEvent {
  receivedAt: number
}

export type ConnectionStatus = 'connecting' | 'connected' | 'reconnecting' | 'disconnected'
