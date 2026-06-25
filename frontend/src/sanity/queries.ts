import { groq } from "next-sanity"

// Hero + About are singletons (one document each). Projects + Experience are
// collections ordered by an explicit `order` field, then creation time.

export const heroQuery = groq`*[_type == "hero"][0]{
  availability,
  headlineLead,
  headlineHighlight,
  subheading,
  "portraitSrc": portrait.asset->url,
  "primaryCta": { "label": primaryCtaLabel, "href": primaryCtaHref },
  "secondaryCta": { "label": secondaryCtaLabel, "href": secondaryCtaHref }
}`

export const aboutQuery = groq`*[_type == "about"][0]{
  eyebrow,
  heading,
  "paragraphs": body,
  features[]{ icon, label },
  "imageSrc": image.asset->url
}`

export const projectsQuery = groq`*[_type == "project"] | order(order asc, _createdAt asc){
  title,
  description,
  tags,
  "image": image.asset->url,
  liveUrl,
  repoUrl
}`

export const experienceQuery = groq`*[_type == "experience"] | order(order asc, _createdAt asc){
  period,
  role,
  company,
  description
}`
