import { sanityFetch } from "@/sanity/lib/fetch"
import { aboutQuery, experienceQuery, heroQuery, projectsQuery } from "@/sanity/queries"

import { ABOUT, EXPERIENCE, HERO, PROJECTS } from "../data"
import type {
  AboutContent,
  AboutFeature,
  CtaLink,
  ExperienceEntry,
  HeroContent,
  Project,
} from "../types/portfolio.types"

// Raw Sanity result shapes (CMS fields may be null). Mapped to the component
// types below; if Sanity is unconfigured or empty, the static data is returned.

type HeroResult = {
  availability: string
  headlineLead: string
  headlineHighlight: string
  subheading: string
  portraitSrc: string | null
  primaryCta: CtaLink
  secondaryCta: CtaLink
}

type AboutResult = {
  eyebrow: string
  heading: string
  paragraphs: string | null
  features: { icon: string; label: string }[] | null
  imageSrc: string | null
}

type ProjectResult = {
  title: string
  description: string
  tags: string[] | null
  image: string | null
  liveUrl: string | null
  repoUrl: string | null
}

export async function getHero(): Promise<HeroContent> {
  const data = await sanityFetch<HeroResult>(heroQuery, { tags: ["hero"] })
  if (!data) return HERO

  return {
    availability: data.availability,
    headlineLead: data.headlineLead,
    headlineHighlight: data.headlineHighlight,
    subheading: data.subheading,
    primaryCta: data.primaryCta,
    secondaryCta: data.secondaryCta,
    portraitSrc: data.portraitSrc ?? undefined,
    portraitInitials: HERO.portraitInitials, // not editorial; kept as a static fallback
  }
}

export async function getAbout(): Promise<AboutContent> {
  const data = await sanityFetch<AboutResult>(aboutQuery, { tags: ["about"] })
  if (!data) return ABOUT

  const paragraphs = splitParagraphs(data.paragraphs)
  const features =
    data.features && data.features.length > 0
      ? data.features.map((f) => ({ icon: f.icon as AboutFeature["icon"], label: f.label }))
      : ABOUT.features

  return {
    eyebrow: data.eyebrow,
    heading: data.heading,
    paragraphs: paragraphs.length > 0 ? paragraphs : ABOUT.paragraphs,
    features,
    imageInitials: ABOUT.imageInitials,
    imageSrc: data.imageSrc ?? undefined,
  }
}

export async function getProjects(): Promise<Project[]> {
  const data = await sanityFetch<ProjectResult[]>(projectsQuery, { tags: ["project"] })
  if (!data || data.length === 0) return PROJECTS
  return data.map(mapProject)
}

export async function getExperience(): Promise<ExperienceEntry[]> {
  const data = await sanityFetch<ExperienceEntry[]>(experienceQuery, { tags: ["experience"] })
  if (!data || data.length === 0) return EXPERIENCE
  return data
}

// One textarea in the CMS, split into paragraphs on blank lines.
function splitParagraphs(value: string | null): string[] {
  if (!value) return []
  return value
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
}

function mapProject(doc: ProjectResult): Project {
  const links: Project["links"] = []
  if (doc.liveUrl) links.push({ label: "Live Demo", href: doc.liveUrl, icon: "external" })
  if (doc.repoUrl) links.push({ label: "Code", href: doc.repoUrl, icon: "code" })

  return {
    title: doc.title,
    description: doc.description,
    tags: doc.tags ?? [],
    links,
    image: doc.image ?? undefined,
  }
}
