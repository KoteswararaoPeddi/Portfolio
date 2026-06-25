import { Card } from "@components/ui/card"
import { Typography } from "@components/ui/typography"
import type { ExperienceEntry } from "../../types/portfolio.types"

type Props = {
  entry: ExperienceEntry
}

export function ExperienceCard({ entry }: Props) {
  return (
    <Card className="rounded-2xl border-primary/30 p-6 transition-all duration-500 hover:border-primary/50">
      <Typography as="span" variant="body-base" weight="medium" className="text-primary">
        {entry.period}
      </Typography>
      <Typography as="h3" variant="h3" weight="semibold" className="mt-2 text-foreground">
        {entry.role}
      </Typography>
      <Typography as="p" variant="body-lg" className="text-foreground/80">
        {entry.company}
      </Typography>
      <Typography variant="body-base" className="mt-4 leading-relaxed text-muted-foreground">
        {entry.description}
      </Typography>
    </Card>
  )
}
