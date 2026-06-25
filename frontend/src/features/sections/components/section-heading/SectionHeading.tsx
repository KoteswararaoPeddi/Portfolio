import { Badge } from "@components/ui/badge"
import { Typography } from "@components/ui/typography"
import type { SectionHeadingContent } from "../../types/portfolio.types"

export function SectionHeading({
  eyebrow,
  titleLead,
  titleHighlight,
  subtitle,
}: SectionHeadingContent) {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
      <Badge>{eyebrow}</Badge>

      <Typography
        as="h2"
        variant="h1"
        weight="bold"
        className="text-foreground md:text-display-lg md:leading-10"
      >
        {titleLead}
        {titleHighlight ? <span className="text-primary">{titleHighlight}</span> : null}
      </Typography>

      {subtitle ? (
        <Typography variant="body-lg" className="text-muted-foreground">
          {subtitle}
        </Typography>
      ) : null}
    </div>
  )
}
