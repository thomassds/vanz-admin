import type { PayableCategoryValue } from '../types/payable.types'

const CATEGORY_LABELS: Record<PayableCategoryValue, string> = {
  1: 'Combustível',
  2: 'Salário',
  3: 'Manutenção',
  4: 'Seguro',
  5: 'Outros',
}

export const CATEGORY_OPTIONS: { value: PayableCategoryValue; label: string }[] = [
  { value: 1, label: 'Combustível' },
  { value: 2, label: 'Salário' },
  { value: 3, label: 'Manutenção' },
  { value: 4, label: 'Seguro' },
  { value: 5, label: 'Outros' },
]

export function getPayableCategoryLabel(category: number): string {
  return CATEGORY_LABELS[category as PayableCategoryValue] ?? 'Desconhecido'
}
