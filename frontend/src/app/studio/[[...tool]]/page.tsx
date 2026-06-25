"use client"

import dynamic from "next/dynamic"

// Sanity Studio is client-only; loading it with ssr:false keeps the heavy Studio
// bundle from being evaluated on the server during build/SSR.
const Studio = dynamic(() => import("@/sanity/Studio").then((m) => m.Studio), {
  ssr: false,
})

export default function StudioPage() {
  return <Studio />
}
