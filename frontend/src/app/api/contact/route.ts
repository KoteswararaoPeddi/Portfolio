import { NextResponse } from "next/server"
import { Resend } from "resend"

import { contactSchema } from "@features/sections/schemas/contact.schema"

// POST /api/contact — validates the message and emails it via Resend.
// Server-only: RESEND_API_KEY never reaches the client.
export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, message: "Invalid request body" }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Please check the form fields and try again." },
      { status: 422 }
    )
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL

  if (!apiKey || !to || !from) {
    console.error(
      "[api/contact] Missing env: RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL"
    )
    return NextResponse.json(
      { success: false, message: "Contact is not configured yet. Please email me directly." },
      { status: 500 }
    )
  }

  const { name, email, message } = parsed.data
  const resend = new Resend(apiKey)

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    })

    if (error) {
      console.error("[api/contact] Resend error:", error)
      return NextResponse.json(
        { success: false, message: "Could not send your message. Please try again later." },
        { status: 502 }
      )
    }
  } catch (err) {
    console.error("[api/contact] Unexpected error:", err)
    return NextResponse.json(
      { success: false, message: "Could not send your message. Please try again later." },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, message: "Message sent" })
}
