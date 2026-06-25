import { SectionHeading } from "../section-heading"
import { ProjectCard } from "./ProjectCard"
import type { Project, SectionHeadingContent } from "../../types/portfolio.types"

type Props = {
  heading: SectionHeadingContent
  projects: Project[]
}

export function Projects({ heading, projects }: Props) {
  return (
    <section className="relative overflow-hidden py-24">
      <div id="projects" className="mx-auto flex w-[90%] max-w-[1200px] flex-col gap-12">
        <SectionHeading {...heading} />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
