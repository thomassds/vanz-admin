import L from 'leaflet'
import { useMemo } from 'react'
import { Marker, Popup } from 'react-leaflet'
import type { LivePosition } from '../types/position.types'
import type { Vehicle } from '@/features/vehicles/types/vehicle.types'

type Staleness = 'fresh' | 'aging' | 'stale'

function getStaleness(receivedAt: number): Staleness {
  const ageMs = Date.now() - receivedAt
  if (ageMs < 5 * 60 * 1000) return 'fresh'
  if (ageMs < 15 * 60 * 1000) return 'aging'
  return 'stale'
}

function timeAgo(receivedAt: number): string {
  const secs = Math.floor((Date.now() - receivedAt) / 1000)
  if (secs < 60) return 'agora'
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `há ${mins} min`
  return `há ${Math.floor(mins / 60)}h`
}

const COLORS: Record<Staleness, string> = {
  fresh: '#1d4ed8',
  aging: '#b45309',
  stale: '#6b7280',
}

// Inject animated glow keyframe once
if (typeof document !== 'undefined' && !document.getElementById('vanz-marker-styles')) {
  const style = document.createElement('style')
  style.id = 'vanz-marker-styles'
  style.textContent = `
    @keyframes vanzGlow {
      0%, 100% { box-shadow: 0 0 0 3px rgba(29,78,216,0.35), 0 4px 12px rgba(0,0,0,0.28); }
      50%       { box-shadow: 0 0 0 7px rgba(29,78,216,0.12), 0 4px 12px rgba(0,0,0,0.28); }
    }
    .vanz-marker-fresh { animation: vanzGlow 2.4s ease-in-out infinite; }
    .vanz-marker-base  { box-shadow: 0 4px 12px rgba(0,0,0,0.28); }
  `
  document.head.appendChild(style)
}

function buildIcon(staleness: Staleness, plate: string) {
  const color = COLORS[staleness]
  const cls = staleness === 'fresh' ? 'vanz-marker-fresh' : 'vanz-marker-base'

  const html = `
    <div style="display:flex;flex-direction:column;align-items:center;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.2))">
      <div class="${cls}" style="
        background:${color};
        color:white;
        border-radius:8px;
        padding:5px 10px;
        font-family:'Courier New',monospace;
        font-size:11px;
        font-weight:700;
        letter-spacing:1px;
        white-space:nowrap;
        border:2.5px solid rgba(255,255,255,0.9);
      ">${plate}</div>
      <div style="
        width:0;height:0;
        border-left:7px solid transparent;
        border-right:7px solid transparent;
        border-top:8px solid ${color};
        margin-top:-1px;
      "></div>
    </div>
  `

  return L.divIcon({
    className: '',
    html,
    iconSize: [80, 34],
    iconAnchor: [40, 34],
    popupAnchor: [0, -38],
  })
}

interface Props {
  position: LivePosition
  vehicle: Vehicle | undefined
}

export function VehicleMarker({ position, vehicle }: Props) {
  const staleness = getStaleness(position.receivedAt)
  const plate = vehicle?.plate ?? '???'
  const icon = useMemo(() => buildIcon(staleness, plate), [staleness, plate])

  return (
    <Marker position={[position.latitude, position.longitude]} icon={icon}>
      <Popup>
        <div style={{ minWidth: 160 }}>
          <p style={{ fontWeight: 600, color: '#111', margin: '0 0 4px' }}>
            {vehicle?.plate ?? '—'}{' '}
            <span style={{ fontWeight: 400, color: '#6b7280' }}>· {vehicle?.model ?? '—'}</span>
          </p>
          <p style={{ fontSize: 13, color: '#374151', margin: '0 0 2px' }}>
            <strong>{Math.round(position.speed)} km/h</strong>
          </p>
          <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>
            Atualizado {timeAgo(position.receivedAt)}
          </p>
        </div>
      </Popup>
    </Marker>
  )
}
