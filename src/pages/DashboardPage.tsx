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
    <div className="grid gap-6 md:gap-8">
      <header>
        <h2 className="font-heading text-xl font-bold text-text sm:text-2xl">Dashboard</h2>
        <p className="mt-1 text-sm text-text-muted">Visão geral da sua operação</p>
      </header>

      {/* KPIs */}
      <SummaryKpis
        summary={summary}
        isLoading={summaryLoading}
        isError={summaryError}
        onRefetch={refetchSummary}
      />

      {/* Próximos vencimentos */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-4 py-4 sm:px-6">
          <h3 className="font-heading text-sm font-bold text-text">
            Próximos Vencimentos
          </h3>
          <p className="mt-0.5 text-xs text-text-subtle">Recebimentos pendentes nos próximos 30 dias</p>
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
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
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
