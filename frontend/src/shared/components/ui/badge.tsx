import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@lib/utils"

// Brand-subtle chip used for section eyebrows (pill) and tech tags (tag).
const badgeVariants = cva(
  "inline-flex items-center border border-border bg-primary/10 text-primary",
  {
    variants: {
      variant: {
        pill: "rounded-full px-4 py-1.5 text-body-base",
        tag: "rounded-md px-2.5 py-1 text-body-sm",
      },
    },
    defaultVariants: {
      variant: "pill",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
