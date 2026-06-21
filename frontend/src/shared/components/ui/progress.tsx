import { cn } from "@lib/utils"

type Props = {
  value: number // 0–100
  className?: string
  indicatorClassName?: string
}

function Progress({ value, className, indicatorClassName }: Props) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-surface-raised",
        className
      )}
    >
      <div
        className={cn("h-full rounded-full bg-primary", indicatorClassName)}
        // Width is data-driven; a utility class can't express an arbitrary %.
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}

export { Progress }
