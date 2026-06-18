import type { ConnectionStatus } from '../types/position.types'

const CONFIG: Record<ConnectionStatus, { color: string; label: string }> = {
  connecting:    { color: 'bg-yellow-400', label: 'Conectando...' },
  connected:     { color: 'bg-green-500',  label: 'Conectado' },
  reconnecting:  { color: 'bg-yellow-400', label: 'Reconectando...' },
  disconnected:  { color: 'bg-red-500',    label: 'Desconectado' },
}

export function ConnectionStatusBadge({ status }: { status: ConnectionStatus }) {
  const { color, label } = CONFIG[status]
  return (
    <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 shadow-sm">
      <span className={`h-2 w-2 rounded-full ${color} ${status !== 'connected' ? 'animate-pulse' : ''}`} />
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </div>
  )
}
