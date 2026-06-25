import { cn } from "@lib/utils"
import { SectionHeading } from "../section-heading"
import { ExperienceCard } from "./ExperienceCard"
import { EXPERIENCE, EXPERIENCE_HEADING } from "../../data"

export function Experience() {
  return (
    <section id="experience" className="relative overflow-hidden py-24">
      <div className="mx-auto flex w-[90%] max-w-[1000px] flex-col gap-12">
        <SectionHeading {...EXPERIENCE_HEADING} />

        <div className="relative">
          {/* center line (left on mobile, centered on desktop) */}
          <div
            aria-hidden
            className="absolute top-0 left-2 h-full w-px bg-border md:left-1/2 md:-translate-x-1/2"
          />

          <div className="flex flex-col gap-8">
            {EXPERIENCE.map((entry, index) => {
              const onLeft = index % 2 === 0
              return (
                <div key={entry.role} className="relative md:grid md:grid-cols-2 md:gap-8">
                  {/* timeline node */}
                  <span
                    aria-hidden
                    className="absolute top-7 left-2 flex size-3 -translate-x-1/2 md:left-1/2"
                  >
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex size-3 rounded-full bg-primary" />
                  </span>

                  <div
                    className={cn(
                      "pl-8 md:pl-0",
                      onLeft ? "md:pr-12 md:text-right" : "md:col-start-2 md:pl-12"
                    )}
                  >
                    <ExperienceCard entry={entry} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
