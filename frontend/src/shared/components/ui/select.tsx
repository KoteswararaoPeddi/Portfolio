import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@lib/utils"

// Styled native <select> — keeps it accessible and trivially register()-able with
// react-hook-form. Pass <option>s as children.
const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          data-slot="select"
          className={cn(
            "flex h-9 w-full appearance-none rounded-lg border border-input bg-surface pl-3 pr-9 text-body-base text-foreground transition-colors",
            "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none",
            "disabled:pointer-events-none disabled:opacity-50",
            "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>
    )
  }
)
Select.displayName = "Select"

export { Select }
