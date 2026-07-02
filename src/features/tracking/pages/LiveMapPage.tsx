import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { Map as LeafletMap } from 'leaflet'
import { latLngBounds } from 'leaflet'
import { MapContainer, TileLayer } from 'react-leaflet'
import { Link } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'
import { selectTheme } from '@/shared/store/uiSlice'
import { useGetVehiclesQuery } from '@/features/vehicles/store/vehiclesApi'
import { useLivePositions } from '../hooks/useLivePositions'
import { VehicleMarker } from '../components/VehicleMarker'
import { ConnectionStatusBadge } from '../components/ConnectionStatus'
import { cn } from '@/shared/utils/cn'
import type { Vehicle } from '@/features/vehicles/types/vehicle.types'
import type { LivePosition } from '../types/position.types'

const BRAZIL_CENTER: [number, number] = [-15.7801, -47.9292]

const TILES = {
  light: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },
}

function EyeIcon({ off }: { off?: boolean }) {
  if (off) {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function liveState(pos: LivePosition | undefined): 'fresh' | 'aging' | 'offline' {
  if (!pos) return 'offline'
  const age = Date.now() - pos.receivedAt
  if (age < 5 * 60 * 1000) return 'fresh'
  if (age < 15 * 60 * 1000) return 'aging'
  return 'offline'
}

interface VehicleDockCardProps {
  vehicle: Vehicle
  position: LivePosition | undefined
  hidden: boolean
  onToggle: () => void
  onFocus: () => void
}

function VehicleDockCard({ vehicle, position, hidden, onToggle, onFocus }: VehicleDockCardProps) {
  const state = liveState(position)

  return (
    <div
      className={cn(
        'flex w-52 shrink-0 items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm transition-all',
        hidden && 'opacity-55',
      )}
    >
      <button
        type="button"
        onClick={onFocus}
        disabled={!position}
        className="min-w-0 flex-1 text-left disabled:cursor-default"
        title={position ? 'Centralizar no mapa' : 'Sem posição disponível'}
      >
        <p className="m-0 truncate font-mono text-sm font-bold tracking-wider text-text">
          {vehicle.plate}
        </p>
        <p className="m-0 mt-0.5 truncate text-xs text-text-muted">{vehicle.model}</p>
        <p className="m-0 mt-1 flex items-center gap-1.5 text-[11px] text-text-subtle">
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              state === 'fresh' && 'animate-pulse bg-success',
              state === 'aging' && 'bg-warning',
              state === 'offline' && 'bg-text-subtle',
            )}
          />
          {state === 'offline'
            ? 'Sem sinal'
            : `${Math.round(position!.speed)} km/h`}
        </p>
      </button>

      <button
        type="button"
        onClick={onToggle}
        aria-pressed={!hidden}
        aria-label={hidden ? `Mostrar ${vehicle.plate} no mapa` : `Ocultar ${vehicle.plate} do mapa`}
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors',
          hidden
            ? 'bg-card-hover text-text-subtle hover:text-text'
            : 'bg-primary-soft text-primary hover:bg-primary/20',
        )}
      >
        <EyeIcon off={hidden} />
      </button>
    </div>
  )
}

export default function LiveMapPage() {
  const theme = useAppSelector(selectTheme)
  const mapRef = useRef<LeafletMap | null>(null)
  const fittedRef = useRef(false)
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set())

  const { data: vehiclesData } = useGetVehiclesQuery({ page: 1, limit: 100 })
  const { positions, status } = useLivePositions()

  const vehicles = useMemo(() => vehiclesData?.items ?? [], [vehiclesData?.items])

  const visibleMarkers = useMemo(
    () => [...positions.entries()].filter(([vehicleId]) => !hiddenIds.has(vehicleId)),
    [positions, hiddenIds],
  )

  // Enquadra todos os veículos na primeira carga de posições
  useEffect(() => {
    if (fittedRef.current || !mapRef.current || visibleMarkers.length === 0) return
    fittedRef.current = true
    const bounds = latLngBounds(visibleMarkers.map(([, p]) => [p.latitude, p.longitude]))
    mapRef.current.fitBounds(bounds, { padding: [64, 64], maxZoom: 14 })
  }, [visibleMarkers])

  const toggleVehicle = (id: string) => {
    setHiddenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const focusVehicle = (id: string) => {
    const pos = positions.get(id)
    if (pos && mapRef.current) {
      mapRef.current.flyTo([pos.latitude, pos.longitude], 15, { duration: 1.2 })
    }
  }

  const tiles = theme === 'dark' ? TILES.dark : TILES.light
  const visibleCount = vehicles.filter((v) => !hiddenIds.has(v.id)).length

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-app font-body">
      <MapContainer
        center={BRAZIL_CENTER}
        zoom={4}
        zoomControl={false}
        className="absolute inset-0 z-0 h-full w-full"
        ref={mapRef}
      >
        <TileLayer key={theme} attribution={tiles.attribution} url={tiles.url} />

        {visibleMarkers.map(([vehicleId, pos]) => (
          <VehicleMarker
            key={vehicleId}
            position={pos}
            vehicle={vehicles.find((v) => v.id === vehicleId)}
          />
        ))}
      </MapContainer>

      {/* Cabeçalho flutuante */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-[1000] flex items-center justify-between gap-3 p-4">
        <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-border bg-card/85 px-4 py-2.5 shadow-lg shadow-black/10 backdrop-blur-md">
          <span className="font-heading text-lg font-extrabold text-primary">VANZ</span>
          <span className="hidden text-sm text-text-muted sm:inline">· Mapa ao vivo</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <ConnectionStatusBadge status={status} />
          <Link
            to="/dashboard"
            className="flex items-center gap-2 rounded-2xl border border-border bg-card/85 px-4 py-2.5 text-sm font-bold text-text shadow-lg shadow-black/10 backdrop-blur-md transition-colors hover:bg-card"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-primary">
              <path fill="currentColor" d="M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z" />
            </svg>
            Dashboard
          </Link>
        </div>
      </header>

      {/* Dock de veículos */}
      <nav
        aria-label="Veículos da empresa"
        className="absolute inset-x-0 bottom-0 z-[1000] p-4"
      >
        <div className="mx-auto max-w-5xl rounded-3xl border border-border bg-card/85 p-4 shadow-2xl shadow-black/20 backdrop-blur-md">
          <div className="mb-3 flex items-center justify-between px-1">
            <h2 className="m-0 font-heading text-sm font-bold text-text">Veículos</h2>
            <span className="text-xs text-text-muted">
              {visibleCount} de {vehicles.length} no mapa
            </span>
          </div>

          {vehicles.length === 0 ? (
            <p className="m-0 px-1 pb-1 text-sm text-text-muted">
              Nenhum veículo cadastrado.{' '}
              <Link to="/vehicles" className="font-bold text-primary hover:text-primary-hover">
                Cadastrar veículos
              </Link>
            </p>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {vehicles.map((vehicle) => (
                <VehicleDockCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  position={positions.get(vehicle.id)}
                  hidden={hiddenIds.has(vehicle.id)}
                  onToggle={() => toggleVehicle(vehicle.id)}
                  onFocus={() => focusVehicle(vehicle.id)}
                />
              ))}
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}
