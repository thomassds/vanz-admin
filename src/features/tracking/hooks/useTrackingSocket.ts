import { useEffect, useRef, useState } from 'react'
import { io, type Socket } from 'socket.io-client'
import { useSelector } from 'react-redux'
import { selectAuth } from '@/features/auth/store/authSlice'
import type { ConnectionStatus, LivePosition, VehiclePositionEvent } from '../types/position.types'

const WS_URL = import.meta.env.VITE_WS_URL as string

export function useTrackingSocket() {
  const auth = useSelector(selectAuth)
  const [status, setStatus] = useState<ConnectionStatus>('connecting')
  const [positions, setPositions] = useState<Map<string, LivePosition>>(new Map())
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Fallback to localStorage in case redux-persist hasn't rehydrated yet
    const token = auth.token ?? localStorage.getItem('token')
    const tenantId = auth.tenantId ?? localStorage.getItem('tenantId')

    if (!token || !tenantId) {
      setStatus('disconnected')
      return
    }

    setStatus('connecting')

    const socket = io(`${WS_URL}/tracking`, {
      extraHeaders: {
        authorization: `Bearer ${token}`,
        'x-tenant-id': tenantId,
      },
      query: { token, tenantId },
      transports: ['polling'],
      upgrade: false,
    })

    socketRef.current = socket

    socket.on('connect', () => setStatus('connected'))
    socket.on('disconnect', () => setStatus('disconnected'))

    socket.on('connect_error', (err) => {
      console.error('[TrackingSocket] connect_error:', err.message, err)
      setStatus('reconnecting')
    })

    socket.on('reconnect_attempt', () => setStatus('reconnecting'))

    socket.on('error', (err: { code?: string }) => {
      if (err?.code === 'WS_UNAUTHORIZED') {
        socket.disconnect()
        setStatus('disconnected')
      }
    })

    socket.on('vehicle:position', (event: VehiclePositionEvent) => {
      setPositions((prev) => {
        const next = new Map(prev)
        next.set(event.vehicleId, { ...event, receivedAt: Date.now() })
        return next
      })
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [auth.token, auth.tenantId])

  return { positions, status }
}
