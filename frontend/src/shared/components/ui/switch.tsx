import * as React from "react"

import { cn } from "@lib/utils"

type Props = React.ComponentProps<"button"> & {
  checked?: boolean
}

// Visual toggle. Interactivity is wired by consumers when needed.
function Switch({ checked = false, className, ...props }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-slot="switch"
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
        checked ? "bg-primary" : "bg-surface-overlay",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "inline-block size-5 rounded-full bg-surface shadow-sm transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  )
}

export { Switch }
