import type { Project, SectionHeadingContent } from "../types/portfolio.types"

export const PROJECTS_HEADING: SectionHeadingContent = {
  eyebrow: "Projects",
  titleLead: "Some of my recent ",
  titleHighlight: "work",
  subtitle:
    "A selection of projects showcasing my ability to design, build, and scale modern fullstack applications.",
}

// Mock content mirroring the design. Add `image` (drop the file in public/) and real
// `links` per project when assets are ready.
export const PROJECTS: Project[] = [
  {
    title: "Fullstack SaaS Dashboard",
    description:
      "A modern analytics dashboard built with Next.js, Prisma, and PostgreSQL featuring authentication, charts, and real-time updates.",
    tags: ["Next.js", "TypeScript", "Prisma"],
    links: [
      { label: "Live Demo", href: "#", icon: "external" },
      { label: "Code", href: "#", icon: "code" },
    ],
  },
  {
    title: "AI Content Generator",
    description:
      "Generate blog posts and marketing content using AI. Built with OpenAI API, Next.js, and a clean UI system.",
    tags: ["Next.js", "OpenAI", "Tailwind"],
    links: [
      { label: "Live Demo", href: "#", icon: "external" },
      { label: "Code", href: "#", icon: "code" },
    ],
  },
  {
    title: "Portfolio Website",
    description:
      "A personal portfolio showcasing projects, skills, and contact features with smooth animations and modern design.",
    tags: ["Next.js", "Framer Motion"],
    links: [
      { label: "Live Demo", href: "#", icon: "external" },
      { label: "Code", href: "#", icon: "code" },
    ],
  },
  {
    title: "Real-time Chat Application",
    description:
      "A fullstack real-time chat app with authentication, private messaging, and live updates using WebSockets and a scalable backend architecture.",
    tags: ["Next.js", "Socket.io", "MongoDB"],
    links: [
      { label: "Live Demo", href: "#", icon: "external" },
      { label: "Code", href: "#", icon: "code" },
    ],
  },
]
