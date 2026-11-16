import { siteConfig } from "@/config/site";
import type { TreatmentId } from "@/data/treatments";

export type BookingValues = {
  name: string;
  email: string;
  phone: string;
  treatment: TreatmentId | "not-sure" | "";
  message: string;
  consent: boolean;
};

export type BookingField = keyof BookingValues;

export type BookingErrorKey =
  | "nameRequired"
  | "nameShort"
  | "emailRequired"
  | "emailInvalid"
  | "phoneRequired"
  | "phoneInvalid"
  | "treatmentRequired"
  | "messageTooLong"
  | "consentRequired";

export const MESSAGE_MAX = 600;

export const emptyBooking: BookingValues = {
  name: "",
  email: "",
  phone: "",
  treatment: "",
  message: "",
  consent: false,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Pure validation: returns an error key per invalid field (language-agnostic). */
export function validateBooking(values: BookingValues): Partial<Record<BookingField, BookingErrorKey>> {
  const errors: Partial<Record<BookingField, BookingErrorKey>> = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const digits = values.phone.replace(/\D/g, "");

  if (!name) errors.name = "nameRequired";
  else if (name.length < 2) errors.name = "nameShort";

  if (!email) errors.email = "emailRequired";
  else if (!EMAIL_RE.test(email)) errors.email = "emailInvalid";

  if (!values.phone.trim()) errors.phone = "phoneRequired";
  else if (digits.length < 8 || digits.length > 15 || /[^\d\s()+.-]/.test(values.phone)) errors.phone = "phoneInvalid";

  if (!values.treatment) errors.treatment = "treatmentRequired";
  if (values.message.length > MESSAGE_MAX) errors.message = "messageTooLong";
  if (!values.consent) errors.consent = "consentRequired";

  return errors;
}

export type BookingResult = { status: "demo" } | { status: "sent" } | { status: "error"; reason?: string };

/**
 * Integration point. With no endpoint configured (the default) this never
 * makes a network request and resolves to `{ status: "demo" }`.
 *
 * To go live: set NEXT_PUBLIC_BOOKING_ENDPOINT (or replace the body of this
 * function with your provider / server action). The UI already handles the
 * "sent" and "error" states.
 */
export async function submitBooking(values: BookingValues, locale: string): Promise<BookingResult> {
  const endpoint = siteConfig.bookingEndpoint;

  if (!endpoint) {
    // Demonstration mode: a short pause so the UI state change is legible.
    await new Promise((resolve) => setTimeout(resolve, 900));
    return { status: "demo" };
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, locale }),
    });
    return response.ok ? { status: "sent" } : { status: "error", reason: String(response.status) };
  } catch (error) {
    return { status: "error", reason: error instanceof Error ? error.message : "network" };
  }
}
