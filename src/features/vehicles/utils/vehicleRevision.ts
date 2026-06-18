export type RevisionAlertLevel = 'overdue' | 'upcoming' | null

export function getRevisionAlertLevel(nextRevisionAt: string | null): RevisionAlertLevel {
  if (!nextRevisionAt) return null
  const [y, m, d] = nextRevisionAt.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diffDays = Math.ceil((date.getTime() - today.getTime()) / 86_400_000)
  if (diffDays < 0) return 'overdue'
  if (diffDays <= 30) return 'upcoming'
  return null
}
