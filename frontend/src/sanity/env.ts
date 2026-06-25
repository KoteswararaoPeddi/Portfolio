import { z } from "zod"

// Public Sanity config (projectId + dataset are not secrets — they ship to the client).
const schema = z.object({
  projectId: z.string().default(""),
  dataset: z.string().default("production"),
  apiVersion: z.string().default("2025-01-01"),
})

const parsed = schema.parse({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
})

export const projectId = parsed.projectId
export const dataset = parsed.dataset
export const apiVersion = parsed.apiVersion

// Until a project id is set, the site renders static fallback content and the Studio is inert.
export const isSanityConfigured = !!projectId
