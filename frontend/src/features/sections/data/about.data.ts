import type { AboutContent } from "../types/portfolio.types"

// Mock content mirroring the design. Add `imageSrc` (drop the image in public/)
// to replace the initials placeholder.
export const ABOUT: AboutContent = {
  eyebrow: "About Me",
  heading: "I build scalable and user-focused web applications",
  paragraphs: [
    "I'm a fullstack developer specializing in Next.js and modern web technologies. I enjoy building fast, scalable, and visually clean applications that solve real-world problems. My focus is on writing maintainable code and delivering smooth user experiences.",
    "Over time, I've worked with tools like TypeScript, Supabase, and modern UI systems to create projects that are both functional and production-ready.",
  ],
  features: [
    { icon: "code", label: "Clean Code" },
    { icon: "layers", label: "Fullstack Apps" },
    { icon: "zap", label: "Performance" },
  ],
  imageInitials: "KP",
}
