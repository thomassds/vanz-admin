import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { useGetDevicesQuery, useLazyGetVehiclePositionQuery } from '../store/trackingApi'
import { useGetVehiclesQuery } from '@/features/vehicles/store/vehiclesApi'
import { useTrackingSocket } from '../hooks/useTrackingSocket'
import { VehicleMarker } from '../components/VehicleMarker'
import { ConnectionStatusBadge } from '../components/ConnectionStatus'
import { TrackingTabs } from '../components/TrackingTabs'
import type { LivePosition } from '../types/position.types'

const BRAZIL_CENTER: [number, number] = [-15.7801, -47.9292]

export default function TrackingMapPage() {
  const [initialPositions, setInitialPositions] = useState<Map<string, LivePosition>>(new Map())

  const { data: vehiclesData } = useGetVehiclesQuery({ page: 1, limit: 100 })
  const { data: devicesData } = useGetDevicesQuery({ page: 1, limit: 100, status: 0 })
  const [fetchPosition] = useLazyGetVehiclePositionQuery()
  const { positions: livePositions, status } = useTrackingSocket()

  useEffect(() => {
    if (!devicesData?.items.length) return

    const vehicleIds = [...new Set(devicesData.items.map((d) => d.vehicleId))]

    ;(async () => {
      const results = await Promise.all(
        vehicleIds.map((id) => fetchPosition(id, true).unwrap().catch(() => null)),
      )

      setInitialPositions(() => {
        const next = new Map<string, LivePosition>()
        vehicleIds.forEach((vehicleId, i) => {
          const pos = results[i]
          if (pos) {
            next.set(vehicleId, {
              vehicleId: pos.vehicleId,
              deviceId: pos.deviceId,
              latitude: pos.latitude,
              longitude: pos.longitude,
              speed: pos.speed,
              capturedAt: pos.capturedAt,
              receivedAt: new Date(pos.capturedAt).getTime(),
            })
          }
        })
        return next
      })
    })()
  }, [devicesData?.items, fetchPosition])

  const displayPositions = useMemo(
    () => new Map([...initialPositions, ...livePositions]),
    [initialPositions, livePositions],
  )

  const vehicles = vehiclesData?.items ?? []
  const markers = [...displayPositions.entries()]

  return (
    <div className="flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-['Montserrat',sans-serif] text-2xl font-bold text-navy">
          Rastreamento
        </h2>
      </div>

      <TrackingTabs />

      <div className="relative overflow-hidden rounded-xl border border-gray-200 shadow-sm" style={{ height: 'calc(100vh - 220px)', minHeight: '400px' }}>
        <MapContainer
          center={BRAZIL_CENTER}
          zoom={4}
          style={{ height: '100%', width: '100%' }}
          zoomControl
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {markers.map(([vehicleId, pos]) => (
            <VehicleMarker
              key={vehicleId}
              position={pos}
              vehicle={vehicles.find((v) => v.id === vehicleId)}
            />
          ))}
        </MapContainer>

        <div className="absolute right-4 top-4 z-[1000]">
          <ConnectionStatusBadge status={status} />
        </div>

        {markers.length === 0 && status === 'connected' && (
          <div className="pointer-events-none absolute inset-0 z-[999] flex items-center justify-center">
            <div className="rounded-xl border border-gray-200 bg-white/90 px-6 py-4 shadow-md backdrop-blur-sm">
              <p className="text-sm text-gray-500">Nenhum veículo com posição disponível</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
