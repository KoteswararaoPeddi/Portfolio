import Image from "next/image"
import { Code, Layers, Zap } from "lucide-react"

import { Badge } from "@components/ui/badge"
import { Card } from "@components/ui/card"
import { Typography } from "@components/ui/typography"
import { ABOUT } from "../../data"

// Render-driving map: feature icon key -> lucide component.
const FEATURE_ICONS = {
  code: Code,
  layers: Layers,
  zap: Zap,
} as const

export function About() {
  return (
    <section id="about" className="relative overflow-hidden py-24">
      <div className="mx-auto grid w-[90%] max-w-[1200px] items-center gap-12 lg:grid-cols-2">
        {/* portrait */}
        <div className="flex justify-center lg:justify-start">
          <div className="relative flex size-80 items-center justify-center rounded-full border border-border bg-surface/80 backdrop-blur-md md:size-[26rem]">
            <div
              aria-hidden
              className="absolute inset-0 rounded-full bg-primary/20 blur-3xl"
            />
            {ABOUT.imageSrc ? (
              <Image
                src={ABOUT.imageSrc}
                alt="About"
                fill
                sizes="(min-width: 768px) 26rem, 20rem"
                className="rounded-full object-cover"
              />
            ) : (
              <Typography
                as="span"
                variant="display-2xl"
                weight="bold"
                className="relative text-primary"
              >
                {ABOUT.imageInitials}
              </Typography>
            )}
          </div>
        </div>

        {/* copy */}
        <div className="flex flex-col items-start gap-6">
          <Badge>{ABOUT.eyebrow}</Badge>

          <Typography
            as="h2"
            variant="h1"
            weight="bold"
            className="text-foreground md:text-display-lg md:leading-10"
          >
            {ABOUT.heading}
          </Typography>

          <div className="flex flex-col gap-4">
            {ABOUT.paragraphs.map((paragraph, index) => (
              <Typography key={index} variant="body-lg" className="max-w-xl text-muted-foreground">
                {paragraph}
              </Typography>
            ))}
          </div>

          <div className="grid w-full grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
            {ABOUT.features.map((feature) => {
              const Icon = FEATURE_ICONS[feature.icon]
              return (
                <Card key={feature.label} className="p-4 text-center">
                  <Icon className="mx-auto mb-2 size-6 text-primary" />
                  <Typography as="p" variant="body-base" className="text-foreground">
                    {feature.label}
                  </Typography>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
