import Image from "next/image"

import { cn } from "@lib/utils"

type Props = {
  src: string
  alt: string
  className?: string
}

function Avatar({ src, alt, className }: Props) {
  return (
    <span
      data-slot="avatar"
      className={cn(
        "relative inline-block size-10 shrink-0 overflow-hidden rounded-full bg-surface-raised",
        className
      )}
    >
      <Image src={src} alt={alt} fill sizes="80px" className="object-cover" />
    </span>
  )
}

export { Avatar }
