// Shared content types for the portfolio sections. Each section's `data/` file
// is typed against one of these shapes so the components stay props-driven.

export type CtaLink = {
  label: string
  href: string
}

export type HeroContent = {
  availability: string
  headlineLead: string
  headlineHighlight: string
  subheading: string
  primaryCta: CtaLink
  secondaryCta: CtaLink
  portraitInitials: string
  portraitSrc?: string
}

export type AboutFeature = {
  icon: "code" | "layers" | "zap"
  label: string
}

export type AboutContent = {
  eyebrow: string
  heading: string
  paragraphs: string[]
  features: AboutFeature[]
  imageInitials: string
  imageSrc?: string
}

// Centered section header shared by Projects / Experience / Testimonials / Contact.
export type SectionHeadingContent = {
  eyebrow: string
  titleLead: string
  titleHighlight?: string
  subtitle?: string
}

export type ProjectLink = {
  label: string
  href: string
  icon: "external" | "code"
}

export type Project = {
  title: string
  description: string
  tags: string[]
  links: ProjectLink[]
  image?: string
}

export type ExperienceEntry = {
  period: string
  role: string
  company: string
  description: string
}

export type ContactInfoItem = {
  icon: "mail" | "phone" | "map"
  label: string
  value: string
  href: string
}
