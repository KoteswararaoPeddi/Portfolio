import type { HeroContent } from "../types/portfolio.types"

// Mock content for the hero. Swap copy / add `portraitSrc` (drop the image in
// public/) when the real assets are ready.
export const HERO: HeroContent = {
  availability: "Available for new projects",
  headlineLead: "Building modern web experiences with ",
  headlineHighlight: "clean code",
  subheading:
    "I'm a frontend developer who builds scalable, user-focused web applications with React, Next.js, and TypeScript.",
  primaryCta: { label: "View my work", href: "#work" },
  secondaryCta: { label: "Download CV", href: "/documents/cv.pdf" },
  portraitInitials: "KP",
  portraitSrc: "/Me.svg",
}
