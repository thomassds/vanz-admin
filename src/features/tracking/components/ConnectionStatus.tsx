import type { ConnectionStatus } from '../types/position.types'

const CONFIG: Record<ConnectionStatus, { color: string; label: string }> = {
  connecting:    { color: 'bg-warning', label: 'Conectando...' },
  connected:     { color: 'bg-success',  label: 'Conectado' },
  reconnecting:  { color: 'bg-warning', label: 'Reconectando...' },
  disconnected:  { color: 'bg-danger',    label: 'Desconectado' },
}

export function ConnectionStatusBadge({ status }: { status: ConnectionStatus }) {
  const { color, label } = CONFIG[status]
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-card/85 px-3 py-1.5 shadow-sm backdrop-blur-md">
      <span className={`h-2 w-2 rounded-full ${color} ${status !== 'connected' ? 'animate-pulse' : ''}`} />
      <span className="text-xs font-medium text-text-muted">{label}</span>
    </div>
  )
}
