import { useState } from 'react'
import { useGetContractHistoryQuery } from '../store/contractsApi'
import {
  EVENT_LABELS,
  EVENT_BADGE_CLASS,
  getDiffEntries,
  formatEventDateTime,
} from '../utils/contractHistory'
import type { ContractHistoryEvent, ContractEventType } from '../types/contract.types'

interface ContractHistorySectionProps {
  contractId: string
}

const LIMIT = 10
const DIFF_EVENTS = new Set<ContractEventType>(['CONTRACT_UPDATED', 'CONTRACT_RENEWED'])

function SkeletonRow() {
  return (
    <div className="flex gap-4 py-4">
      <div className="h-5 w-28 animate-pulse rounded-full bg-gray-200" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-48 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  )
}

function EventDiff({ event }: { event: ContractHistoryEvent }) {
  if (!DIFF_EVENTS.has(event.eventType)) return null
  const entries = getDiffEntries(event.oldValue, event.newValue)
  if (entries.length === 0) return null

  return (
    <ul className="mt-2 space-y-1 rounded-md border border-gray-100 bg-gray-50 px-3 py-2">
      {entries.map(({ key, label, from, to }) => (
        <li key={key} className="text-xs text-gray-600">
          <span className="font-medium">{label}:</span>{' '}
          <span className="text-red-500 line-through">{from}</span>
          {' → '}
          <span className="text-green-600 font-medium">{to}</span>
        </li>
      ))}
    </ul>
  )
}

function EventMetadata({ event }: { event: ContractHistoryEvent }) {
  const meta = event.metadata
  if (!meta) return null

  if (
    (event.eventType === 'CONTRACT_SUSPENDED' || event.eventType === 'CONTRACT_CANCELED') &&
    typeof meta.reason === 'string'
  ) {
    return (
      <p className="mt-1 text-xs text-gray-500">
        <span className="font-medium">Motivo:</span> {meta.reason}
      </p>
    )
  }

  if (event.eventType === 'DEPENDENT_LINKED' || event.eventType === 'DEPENDENT_UNLINKED') {
    const dependentId =
      (typeof meta?.dependentName === 'string' && meta.dependentName) ||
      (typeof event.newValue?.dependentId === 'string' && event.newValue.dependentId) ||
      (typeof event.oldValue?.dependentId === 'string' && event.oldValue.dependentId)
    if (dependentId) {
      return (
        <p className="mt-1 text-xs text-gray-500">
          <span className="font-medium">Dependente:</span> {dependentId}
        </p>
      )
    }
  }

  return null
}

export function ContractHistorySection({ contractId }: ContractHistorySectionProps) {
  const [page, setPage] = useState(1)

  const { data, isLoading, isFetching, isError, refetch } = useGetContractHistoryQuery({
    id: contractId,
    page,
    limit: LIMIT,
  })

  const loading = isLoading || isFetching

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-['Montserrat',sans-serif] text-sm font-bold text-navy">
        Histórico
      </h3>

      {isError ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <p className="text-sm text-gray-600">Erro ao carregar histórico.</p>
          <button
            type="button"
            onClick={refetch}
            className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Tentar novamente
          </button>
        </div>
      ) : loading ? (
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : !data?.items.length ? (
        <p className="py-8 text-center text-sm text-gray-500">
          Nenhum evento registrado para este contrato.
        </p>
      ) : (
        <>
          <div className="divide-y divide-gray-100">
            {data.items.map((event) => {
              const badgeClass =
                EVENT_BADGE_CLASS[event.eventType] ?? 'bg-gray-100 text-gray-600'
              const label = EVENT_LABELS[event.eventType] ?? event.eventType

              return (
                <div key={event.id} className="py-4">
                  <div className="flex items-start gap-3">
                    <span
                      className={`inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}
                    >
                      {label}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatEventDateTime(event.createdAt)}
                    </span>
                  </div>
                  <div className="mt-1 pl-0.5">
                    <EventDiff event={event} />
                    <EventMetadata event={event} />
                  </div>
                </div>
              )
            })}
          </div>

          {(data.totalPages ?? 1) > 1 && (
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
              <span className="text-xs text-gray-400">
                {data.total} evento{data.total !== 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                >
                  Anterior
                </button>
                <span className="px-3 text-xs text-gray-500">
                  {page} / {data.totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= data.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
