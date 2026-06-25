import type { ContactValues } from "../schemas/contact.schema"

// Posts the contact form to our own route handler (which emails via Resend).
export async function sendContactMessage(values: ContactValues): Promise<void> {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  })

  if (!res.ok) {
    const data: unknown = await res.json().catch(() => null)
    const message =
      data && typeof data === "object" && "message" in data
        ? String((data as { message: unknown }).message)
        : "Failed to send message"
    throw new Error(message)
  }
}
