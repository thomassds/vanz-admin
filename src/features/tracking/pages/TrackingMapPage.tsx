import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer } from 'react-leaflet'
import { useGetVehiclesQuery } from '@/features/vehicles/store/vehiclesApi'
import { useLivePositions } from '../hooks/useLivePositions'
import { VehicleMarker } from '../components/VehicleMarker'
import { ConnectionStatusBadge } from '../components/ConnectionStatus'
import { TrackingTabs } from '../components/TrackingTabs'

const BRAZIL_CENTER: [number, number] = [-15.7801, -47.9292]

export default function TrackingMapPage() {
  const { data: vehiclesData } = useGetVehiclesQuery({ page: 1, limit: 100 })
  const { positions, status } = useLivePositions()

  const vehicles = vehiclesData?.items ?? []
  const markers = [...positions.entries()]

  return (
    <div className="flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-text">
          Rastreamento
        </h2>
      </div>

      <TrackingTabs />

      <div className="relative overflow-hidden rounded-xl border border-border shadow-sm" style={{ height: 'calc(100vh - 220px)', minHeight: '400px' }}>
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
            <div className="rounded-xl border border-border bg-card/90 px-6 py-4 shadow-md backdrop-blur-sm">
              <p className="text-sm text-text-subtle">Nenhum veículo com posição disponível</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
