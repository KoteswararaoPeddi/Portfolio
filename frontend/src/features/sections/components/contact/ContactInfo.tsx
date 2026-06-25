import { Mail, MapPin, Phone } from "lucide-react"

import { Typography } from "@components/ui/typography"
import { CONTACT_INFO, CONTACT_INFO_TITLE } from "../../data"

// Render-driving map: info item icon key -> lucide component.
const INFO_ICONS = {
  mail: Mail,
  phone: Phone,
  map: MapPin,
} as const

export function ContactInfo() {
  return (
    <div className="flex flex-col">
      <Typography as="h3" variant="h3" weight="semibold" className="mb-4 text-foreground">
        {CONTACT_INFO_TITLE}
      </Typography>

      <div className="flex flex-col gap-2">
        {CONTACT_INFO.map((item) => {
          const Icon = INFO_ICONS[item.icon]
          return (
            <a
              key={item.label}
              href={item.href}
              className="group flex items-center gap-4 rounded-xl p-4 transition-colors hover:bg-surface"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                <Icon className="size-5" />
              </span>
              <span className="flex flex-col">
                <Typography as="span" variant="body-base" className="text-muted-foreground">
                  {item.label}
                </Typography>
                <Typography as="span" variant="body-lg" weight="medium" className="text-foreground">
                  {item.value}
                </Typography>
              </span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
