import { SectionHeading } from "../section-heading"
import { ProjectCard } from "./ProjectCard"
import { PROJECTS, PROJECTS_HEADING } from "../../data"

export function Projects() {
  return (
    <section id="projects" className="relative overflow-hidden py-24">
      <div className="mx-auto flex w-[90%] max-w-[1200px] flex-col gap-12">
        <SectionHeading {...PROJECTS_HEADING} />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
