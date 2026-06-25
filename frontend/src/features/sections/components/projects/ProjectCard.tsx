import Image from "next/image"
import { Code, ExternalLink } from "lucide-react"

import { Badge } from "@components/ui/badge"
import { Card, CardContent } from "@components/ui/card"
import { Typography } from "@components/ui/typography"
import type { Project } from "../../types/portfolio.types"

// Render-driving map: link icon key -> lucide component.
const LINK_ICONS = {
  external: ExternalLink,
  code: Code,
} as const

type Props = {
  project: Project
}

export function ProjectCard({ project }: Props) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
      <div className="relative h-60 overflow-hidden md:h-64">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/20 to-surface">
            <Code className="size-12 text-primary/40" />
          </div>
        )}
      </div>

      <CardContent className="flex flex-col gap-3">
        <Typography
          as="h3"
          variant="h3"
          weight="semibold"
          className="text-foreground transition group-hover:text-primary"
        >
          {project.title}
        </Typography>

        <Typography variant="body-base" className="leading-relaxed text-muted-foreground">
          {project.description}
        </Typography>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="tag">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 pt-3">
          {project.links.map((link) => {
            const Icon = LINK_ICONS[link.icon]
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-muted-foreground transition hover:text-primary"
              >
                <Icon className="size-4" />
                <Typography as="span" variant="body-base">
                  {link.label}
                </Typography>
              </a>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
