import { SectionHeading } from "../section-heading"
import { ContactForm } from "./ContactForm"
import { ContactInfo } from "./ContactInfo"
import { CONTACT_HEADING } from "../../data"

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden py-24">
      <div className="mx-auto flex w-[90%] max-w-[1100px] flex-col gap-12">
        <SectionHeading {...CONTACT_HEADING} />

        <div className="grid gap-8 lg:grid-cols-2">
          <ContactForm />
          <ContactInfo />
        </div>
      </div>
    </section>
  )
}
