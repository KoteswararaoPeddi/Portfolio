// Render-driving navigation data for the storefront chrome (navbar + footer).
// Hrefs point at storefront routes; pages are added as the build progresses.


export type NavLink = {
  label: string
  href: string
}

// Primary nav links (shown in the navbar utility row).
export const navlinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/experience" },
  { label: "Contact", href: "/contact" },
]

