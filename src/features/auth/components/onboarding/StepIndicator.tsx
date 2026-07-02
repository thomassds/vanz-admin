import { cn } from '@/shared/utils/cn'

interface StepIndicatorProps {
  current: number
  total: number
}

export function StepIndicator({ current, total }: StepIndicatorProps) {
  return (
    <div className="mb-6 flex flex-col items-center gap-2 lg:items-start">
      <span className="text-xs font-bold uppercase tracking-wide text-text-muted">
        Etapa {current} de {total}
      </span>
      <div className="flex gap-1.5">
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={cn(
              'h-1.5 w-8 rounded-full transition-colors',
              index < current ? 'bg-primary' : 'bg-border',
            )}
          />
        ))}
      </div>
    </div>
  )
}
