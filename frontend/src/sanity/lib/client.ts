import { createClient, type SanityClient } from "next-sanity"

import { apiVersion, dataset, isSanityConfigured, projectId } from "../env"

// Null until configured, so importing this module never throws on a missing
// projectId (createClient validates it). Callers fall back to static content.
export const client: SanityClient | null = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : null
