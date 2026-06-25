import { client } from "./client"

type FetchOptions = {
  params?: Record<string, unknown>
  tags?: string[]
  revalidate?: number
}

// Typed wrapper around the Sanity client. Returns null when Sanity is not
// configured so callers can fall back to static content. ISR via `revalidate`
// + cache `tags` (tags enable future on-demand revalidation through a webhook).
export async function sanityFetch<T>(
  query: string,
  { params = {}, tags, revalidate = 60 }: FetchOptions = {}
): Promise<T | null> {
  if (!client) return null

  try {
    return await client.fetch<T>(query, params, {
      next: { revalidate, tags },
    })
  } catch (error) {
    // Never let a CMS hiccup (missing dataset, network, misconfig) break the
    // page: log and fall back to static content.
    console.error("[sanityFetch] request failed:", error)
    return null
  }
}
