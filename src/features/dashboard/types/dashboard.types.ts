export interface DashboardSummary {
  clients: {
    total: number
    active: number
    inactive: number
    newThisMonth: number
  }
  contracts: {
    active: number
    pending: number
    suspended: number
    canceled: number
    expiringIn30Days: number
  }
  receivables: {
    expectedThisMonth: number
    receivedThisMonth: number
    pendingThisMonth: number
    overdueTotal: number
    overdueCount: number
  }
}

export interface UpcomingReceivable {
  id: string
  contractId: string
  clientName: string
  dueDate: string
  value: number
  status: string
  installmentNumber: number
}

export interface UpcomingReceivablesResponse {
  data: UpcomingReceivable[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface MonthlyRevenueItem {
  month: string
  expected: number
  received: number
  pending: number
  overdue: number
}

export interface MonthlyRevenueResponse {
  data: MonthlyRevenueItem[]
}
