import { useState } from 'react'
import { SummaryKpis } from '@/features/dashboard/components/SummaryKpis'
import { UpcomingReceivablesTable } from '@/features/dashboard/components/UpcomingReceivablesTable'
import { MonthlyRevenueTable } from '@/features/dashboard/components/MonthlyRevenueTable'
import {
  useGetSummaryQuery,
  useGetUpcomingQuery,
  useGetMonthlyRevenueQuery,
} from '@/features/dashboard/store/dashboardApi'

const UPCOMING_LIMIT = 10

export default function DashboardPage() {
  const [upcomingPage, setUpcomingPage] = useState(1)
  const [months, setMonths] = useState(6)

  const {
    data: summary,
    isLoading: summaryLoading,
    isError: summaryError,
    refetch: refetchSummary,
  } = useGetSummaryQuery()

  const {
    data: upcoming,
    isLoading: upcomingLoading,
    isFetching: upcomingFetching,
    isError: upcomingError,
    refetch: refetchUpcoming,
  } = useGetUpcomingQuery({ page: upcomingPage, limit: UPCOMING_LIMIT })

  const {
    data: revenue,
    isLoading: revenueLoading,
    isFetching: revenueFetching,
    isError: revenueError,
    refetch: refetchRevenue,
  } = useGetMonthlyRevenueQuery({ months })

  return (
    <div className="grid gap-8">
      <h2 className="font-['Montserrat',sans-serif] text-2xl font-bold text-navy">Dashboard</h2>

      {/* KPIs */}
      <SummaryKpis
        summary={summary}
        isLoading={summaryLoading}
        isError={summaryError}
        onRefetch={refetchSummary}
      />

      {/* Próximos vencimentos */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="font-['Montserrat',sans-serif] text-sm font-bold text-navy">
            Próximos Vencimentos
          </h3>
          <p className="mt-0.5 text-xs text-gray-400">Recebimentos pendentes nos próximos 30 dias</p>
        </div>
        <UpcomingReceivablesTable
          data={upcoming?.data}
          total={upcoming?.meta?.total ?? 0}
          page={upcomingPage}
          totalPages={upcoming?.meta?.totalPages ?? 1}
          isLoading={upcomingLoading || upcomingFetching}
          isError={upcomingError}
          onPageChange={setUpcomingPage}
          onRefetch={refetchUpcoming}
        />
      </div>

      {/* Receita mensal */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <MonthlyRevenueTable
          data={revenue?.data}
          months={months}
          isLoading={revenueLoading || revenueFetching}
          isError={revenueError}
          onMonthsChange={(m) => {
            setMonths(m)
          }}
          onRefetch={refetchRevenue}
        />
      </div>
    </div>
  )
}
