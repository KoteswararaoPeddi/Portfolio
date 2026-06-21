import * as React from "react"

import { cn } from "@lib/utils"

// Styled native radio; accent-primary paints the dot brand-green when selected.
// Group radios by giving them the same `name`.
const Radio = React.forwardRef<
  HTMLInputElement,
  Omit<React.ComponentProps<"input">, "type">
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="radio"
      data-slot="radio"
      className={cn(
        "size-4 shrink-0 cursor-pointer accent-primary",
        "focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
})
Radio.displayName = "Radio"

export { Radio }
