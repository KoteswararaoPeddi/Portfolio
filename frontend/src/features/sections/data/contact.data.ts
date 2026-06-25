import type { ContactInfoItem, SectionHeadingContent } from "../types/portfolio.types"

export const CONTACT_HEADING: SectionHeadingContent = {
  eyebrow: "Contact",
  titleLead: "Let's build ",
  titleHighlight: "something great",
  subtitle: "Have a project in mind? I'd love to hear about it. Let's connect.",
}

export const CONTACT_FORM_TITLE = "Send a message"
export const CONTACT_INFO_TITLE = "Contact Information"

export const CONTACT_INFO: ContactInfoItem[] = [
  {
    icon: "mail",
    label: "Email",
    value: "emmanuel@example.com",
    href: "mailto:emmanuel@example.com",
  },
  { icon: "phone", label: "Phone", value: "+234 XXX XXX XXXX", href: "#" },
  { icon: "map", label: "Location", value: "Nigeria", href: "#" },
]
