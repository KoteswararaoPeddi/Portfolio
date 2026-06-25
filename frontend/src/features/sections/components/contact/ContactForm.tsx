"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Send } from "lucide-react"

import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import { Textarea } from "@components/ui/textarea"
import { Card } from "@components/ui/card"
import { Field } from "@components/ui/field"
import { Typography } from "@components/ui/typography"
import { contactSchema, type ContactValues } from "../../schemas/contact.schema"
import { CONTACT_FORM_TITLE } from "../../data"

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) })

  // No backend yet: acknowledge locally and reset. Swap for a real submit later.
  const onSubmit = (_values: ContactValues) => {
    toast.success("Message sent. I'll get back to you soon.")
    reset()
  }

  return (
    <Card className="rounded-2xl p-6 lg:p-8">
      <Typography as="h3" variant="h3" weight="semibold" className="text-foreground">
        {CONTACT_FORM_TITLE}
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 flex flex-col gap-4" noValidate>
        <Field label="Name" error={errors.name?.message}>
          <Input placeholder="Your name" aria-invalid={!!errors.name} {...register("name")} />
        </Field>

        <Field label="Email" error={errors.email?.message}>
          <Input
            type="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </Field>

        <Field label="Message" error={errors.message?.message}>
          <Textarea
            placeholder="Your message..."
            rows={5}
            aria-invalid={!!errors.message}
            {...register("message")}
          />
        </Field>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full gap-2 rounded-full text-label-lg"
        >
          Send Message
          <Send className="size-4" />
        </Button>
      </form>
    </Card>
  )
}
