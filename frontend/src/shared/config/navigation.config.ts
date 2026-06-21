// Render-driving navigation data for the storefront chrome (navbar + footer).
// Hrefs point at storefront routes; pages are added as the build progresses.


export type NavLink = {
  label: string
  href: string
}

// Primary nav links (shown in the navbar utility row).
export const PRIMARY_NAV_RIGHT: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Product", href: "/products" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
]

// Department bar above the hero.
export const DEPARTMENT_LINKS: NavLink[] = [
  { label: "Men", href: "/categories/men" },
  { label: "Women", href: "/categories/women" },
  { label: "Baby", href: "/categories/baby" },
  { label: "Grocery & Essentials", href: "/categories/grocery" },
  { label: "Streetwear", href: "/categories/streetwear" },
  { label: "Shoes", href: "/categories/shoes" },
  { label: "Accessories", href: "/categories/accessories" },
  { label: "Beauty", href: "/categories/beauty" },
  { label: "Electronics", href: "/categories/electronics" },
  { label: "Industrial equipment", href: "/categories/industrial" },
]

export type FooterColumn = {
  title: string
  links: NavLink[]
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Company Info",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press Releases", href: "/press" },
      { label: "Sustainability Practices", href: "/sustainability" },
    ],
  },
  {
    title: "Customer Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Help Center (FAQs)", href: "/help" },
      { label: "Track My Order", href: "/account/orders" },
      { label: "Return & Refund Policy", href: "/returns" },
      { label: "Shipping Information", href: "/shipping" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Categories", href: "/products" },
      { label: "Bestsellers", href: "/products?sort=top-rated" },
      { label: "New Arrivals", href: "/products?sort=newest" },
      { label: "Deals & Promotions", href: "/deals" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Accessibility Statement", href: "/accessibility" },
      { label: "Return & Refund Policy", href: "/returns" },
    ],
  },
]
