import type { ExperienceEntry, SectionHeadingContent } from "../types/portfolio.types"

export const EXPERIENCE_HEADING: SectionHeadingContent = {
  eyebrow: "Experience",
  titleLead: "Experience that ",
  titleHighlight: "speaks volumes",
  subtitle:
    "A timeline of my growth as a developer, from learning the fundamentals to building fullstack applications.",
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    period: "2025 - Present",
    role: "Fullstack Engineer",
    company: "Independent Projects",
    description:
      "Designing and building production-ready web applications with a focus on scalability, performance, and clean architecture. Implemented authentication systems, dashboards, and API integrations.",
  },
  {
    period: "2024 - 2025",
    role: "Frontend Engineer",
    company: "Open Source Contributions",
    description:
      "Contributed to open-source UI components and improved frontend performance and accessibility. Focused on reusable components and modern design systems.",
  },
  {
    period: "2023 - 2024",
    role: "Backend Developer",
    company: "Side Projects",
    description:
      "Built backend services including REST APIs, authentication flows, and database schemas. Worked on real-time features and data handling.",
  },
  {
    period: "2022 - 2023",
    role: "Junior Web Developer",
    company: "Self-Driven Learning",
    description:
      "Learned core web development concepts and built multiple beginner-to-intermediate projects to strengthen problem-solving and coding fundamentals.",
  },
]
