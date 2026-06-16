import { cn } from '@/shared/utils/cn'

interface StepIndicatorProps {
  current: number
  total: number
}

export function StepIndicator({ current, total }: StepIndicatorProps) {
  return (
    <div className="mb-6 flex flex-col items-center gap-2 lg:items-start">
      <span className="font-['Montserrat',sans-serif] text-xs font-bold text-[#708097]">
        Etapa {current} de {total}
      </span>
      <div className="flex gap-1.5">
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={cn(
              'h-1.5 w-8 rounded-full transition-colors',
              index < current ? 'bg-[#00c8ff]' : 'bg-[#e2e8f0]',
            )}
          />
        ))}
      </div>
    </div>
  )
}
