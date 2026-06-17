import type { MonthlyRevenueItem } from '../types/dashboard.types'

interface MonthlyRevenueTableProps {
  data: MonthlyRevenueItem[] | undefined
  months: number
  isLoading: boolean
  isError: boolean
  onMonthsChange: (months: number) => void
  onRefetch: () => void
}

const PERIOD_OPTIONS = [3, 6, 12] as const

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatMonth(ym: string): string {
  const [year, month] = ym.split('-')
  if (!year || !month) return ym
  const date = new Date(parseInt(year), parseInt(month) - 1, 1)
  return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
}

export function MonthlyRevenueTable({
  data,
  months,
  isLoading,
  isError,
  onMonthsChange,
  onRefetch,
}: MonthlyRevenueTableProps) {
  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-['Montserrat',sans-serif] text-sm font-bold text-navy">
          Receita Mensal
        </h3>
        <div className="flex gap-1">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onMonthsChange(opt)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                months === opt
                  ? 'bg-primary text-white'
                  : 'border border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {opt} meses
            </button>
          ))}
        </div>
      </div>

      {isError ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <p className="text-sm text-gray-600">Erro ao carregar histórico.</p>
          <button
            type="button"
            onClick={onRefetch}
            className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Mês</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Previsto</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Recebido</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Em aberto</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600">Vencido</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading
                ? Array.from({ length: months }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 animate-pulse rounded bg-gray-200" />
                        </td>
                      ))}
                    </tr>
                  ))
                : data?.map((row) => (
                    <tr key={row.month} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium capitalize text-gray-900">
                        {formatMonth(row.month)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-600">
                        {formatCurrency(row.expected)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-green-600">
                        {formatCurrency(row.received)}
                      </td>
                      <td className="px-4 py-3 text-right text-yellow-600">
                        {formatCurrency(row.pending)}
                      </td>
                      <td className="px-4 py-3 text-right text-red-500">
                        {formatCurrency(row.overdue)}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>

          {!isLoading && (!data || data.length === 0) && (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-gray-500">Sem dados no período.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
