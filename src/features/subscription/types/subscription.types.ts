export type PlanKey = 'gestao' | 'operacao'

export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled'

export interface Plan {
  key: PlanKey
  name: string
  priceMonthlyCents: number
  /** null = ilimitado */
  maxVehicles: number | null
  features: string[]
}

export interface SubscriptionMe {
  plan: PlanKey
  planName: string
  status: SubscriptionStatus
  trialEndsAt: string | null
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
  hasAccess: boolean
  trialDaysLeft: number | null
}
