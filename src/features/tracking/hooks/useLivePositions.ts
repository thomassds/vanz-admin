import { useEffect, useMemo, useState } from 'react'
import { useGetDevicesQuery, useLazyGetVehiclePositionQuery } from '../store/trackingApi'
import { useTrackingSocket } from './useTrackingSocket'
import type { LivePosition } from '../types/position.types'

/**
 * Posições dos veículos: snapshot inicial via REST (uma vez por device)
 * mesclado com as atualizações ao vivo do socket.
 */
export function useLivePositions() {
  const [initialPositions, setInitialPositions] = useState<Map<string, LivePosition>>(new Map())

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

  const positions = useMemo(
    () => new Map([...initialPositions, ...livePositions]),
    [initialPositions, livePositions],
  )

  return { positions, status }
}
