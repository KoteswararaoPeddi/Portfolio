import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Download } from "lucide-react"

import { Badge } from "@components/ui/badge"
import { Button } from "@components/ui/button"
import { Typography } from "@components/ui/typography"
import { HERO } from "../../data"

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-32 pb-16"
    >
      {/* ambient brand glow behind the portrait */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 h-[40rem] w-[40rem] translate-x-1/4 -translate-y-1/4 rounded-full bg-primary/15 blur-[120px]"
      />

      <div className="mx-auto grid w-[90%] max-w-[1200px] items-center gap-12 lg:grid-cols-2">
        {/* copy */}
        <div className="flex flex-col items-start gap-6">
          <Badge className="gap-2 bg-surface text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            {HERO.availability}
          </Badge>

          <Typography
            variant="display-lg"
            weight="bold"
            className="text-foreground md:text-display-xl md:leading-14 lg:text-display-2xl lg:leading-16"
          >
            {HERO.headlineLead}
            <span className="text-primary">{HERO.headlineHighlight}</span>
          </Typography>

          <Typography variant="body-lg" className="max-w-lg tracking-wide text-muted-foreground">
            {HERO.subheading}
          </Typography>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href={HERO.primaryCta.href}>
              <Button className="h-12 gap-2 px-6 text-label-lg">
                {HERO.primaryCta.label}
                <ArrowRight className="size-5" />
              </Button>
            </Link>
            <Link href={HERO.secondaryCta.href} download>
              <Button variant="outline" className="h-12 gap-2 px-6 text-label-lg">
                <Download className="size-5" />
                {HERO.secondaryCta.label}
              </Button>
            </Link>
          </div>
        </div>

        {/* portrait */}
        <div className="relative flex justify-center lg:justify-end">
          <div
            aria-hidden
            className="absolute inset-0 m-auto size-72 rounded-full bg-primary/30 blur-3xl sm:size-80"
          />
          <div className="relative flex size-72 items-center justify-center overflow-hidden rounded-full border border-border bg-surface shadow-lg sm:size-80">
            {HERO.portraitSrc ? (
              <Image
                src={HERO.portraitSrc}
                alt="Portrait"
                fill
                sizes="(min-width: 640px) 20rem, 18rem"
                className="object-cover"
                priority
                unoptimized
              />
            ) : (
              <Typography as="span" variant="display-2xl" weight="bold" className="text-primary">
                {HERO.portraitInitials}
              </Typography>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
