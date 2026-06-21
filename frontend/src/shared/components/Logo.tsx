import Link from "next/link"
import { ShoppingCart } from "lucide-react"

import { cn } from "@lib/utils"

type Props = {
  className?: string
  href?: string
}

export function Logo({ className, href = "/" }: Props) {
  return (
    <Link
      href={href}
      aria-label="Dealport home"
      className={cn(
        "inline-flex items-center text-h2 font-extrabold tracking-tight text-primary",
        className
      )}
    >
      <span>Koti</span>
      {/* <ShoppingCart className="size-5 -mx-0.5" strokeWidth={2.5} /> */}
      {/* <span>RT</span> */}
    </Link>
  )
}
