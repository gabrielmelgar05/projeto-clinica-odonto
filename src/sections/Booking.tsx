"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Check, ChevronDown, Info } from "lucide-react";
import { gsap, useGSAP, MQ, prefersReducedMotion } from "@/animations/gsap";
import { clipReveal, riseIn, splitReveal } from "@/animations/reveals";
import { useSite } from "@/components/providers/SiteProvider";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Button } from "@/components/ui/Button";
import { Rich } from "@/components/ui/Rich";
import { siteConfig } from "@/config/site";
import { treatmentIds } from "@/data/treatments";
import { format } from "@/i18n";
import {
  emptyBooking,
  MESSAGE_MAX,
  submitBooking,
  validateBooking,
  type BookingField,
  type BookingValues,
} from "@/lib/booking";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "demo" | "sent" | "error";

export function Booking() {
  const { dict, locale, requestedTreatment } = useSite();
  const b = dict.booking;
  const root = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const uid = useId();

  const [values, setValues] = useState<BookingValues>(emptyBooking);
  const [touched, setTouched] = useState<Partial<Record<BookingField, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [submittedName, setSubmittedName] = useState("");

  const errors = validateBooking(values);
  const showError = (field: BookingField) => (touched[field] || submitted) && errors[field];
  const errorText = (field: BookingField) => {
    const key = errors[field];
    return key ? format(b.errors[key], { max: MESSAGE_MAX }) : "";
  };

  // A treatment chosen elsewhere on the page pre-fills the select.
  useEffect(() => {
    if (requestedTreatment) {
      setValues((v) => ({ ...v, treatment: requestedTreatment }));
      setStatus((s) => (s === "idle" || s === "error" ? s : "idle"));
    }
  }, [requestedTreatment]);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        riseIn(q("[data-label]"), { trigger: root.current });
        splitReveal(q(".bk-title")[0]);
        riseIn(q(".bk-rise"), { trigger: q(".bk-intro")[0], stagger: 0.08 });
        clipReveal(q(".bk-image")[0], { from: "bottom" });
        gsap.from(q(".bk-card"), {
          y: 60,
          autoAlpha: 0,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: q(".bk-card")[0], start: "top 88%", once: true },
        });
        gsap.from(q(".bk-field"), {
          y: 20,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.06,
          ease: "expo.out",
          scrollTrigger: { trigger: q(".bk-card")[0], start: "top 75%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const { contextSafe } = useGSAP({ scope: root });

  // Result panel entrance.
  useEffect(() => {
    if (status !== "demo" && status !== "sent" && status !== "error") return;
    contextSafe(() => {
      const el = resultRef.current;
      if (!el) return;
      const d = prefersReducedMotion() ? 0 : 1;
      gsap.fromTo(el, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1 * d, ease: "expo.inOut", clearProps: "clipPath" });
      gsap.fromTo(el.querySelectorAll("[data-result-rise]"), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1 * d, stagger: 0.08, delay: 0.3 * d, ease: "expo.out" });
      el.focus({ preventScroll: true });
    })();
  }, [status, contextSafe]);

  const set = <K extends BookingField>(field: K, value: BookingValues[K]) => setValues((v) => ({ ...v, [field]: value }));
  const blur = (field: BookingField) => setTouched((t) => ({ ...t, [field]: true }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const current = validateBooking(values);
    const firstInvalid = (Object.keys(current) as BookingField[])[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    setStatus("submitting");
    const result = await submitBooking(values, locale);
    setSubmittedName(values.name.trim().split(/\s+/)[0] ?? "");
    setStatus(result.status === "error" ? "error" : result.status);
  };

  const reset = () => {
    setValues(emptyBooking);
    setTouched({});
    setSubmitted(false);
    setStatus("idle");
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[name="name"]')?.focus());
  };

  const hasErrors = submitted && Object.keys(errors).length > 0;
  const showResult = status === "demo" || status === "sent" || status === "error";
  const ids = (field: string) => ({ input: `${uid}-${field}`, error: `${uid}-${field}-error` });

  return (
    <section ref={root} id="contact" data-theme="dark" aria-labelledby="contact-title" className="relative overflow-hidden bg-ink text-bone section-pad">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(60% 50% at 85% 10%, rgba(38,61,76,0.55), transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="shell relative grid-12 gap-y-14">
        {/* Left column */}
        <div className="bk-intro col-span-12 flex flex-col lg:col-span-5">
          <SectionLabel index="09" className="text-bone/60">
            {b.label}
          </SectionLabel>
          <h2 id="contact-title" data-section-focus className="bk-title t-h2 mt-8 [&_.rich-em]:text-clinic-soft">
            <Rich text={b.title} />
          </h2>
          <p className="bk-rise t-body mt-6 max-w-[40ch] text-pretty text-bone/65">{b.intro}</p>

          <dl className="bk-rise mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="t-label text-bone/45">{b.phone}</dt>
              <dd className="mt-2">
                <a href={siteConfig.contact.phoneHref} className="link-line text-[1.05rem]">
                  {siteConfig.contact.phone}
                </a>
              </dd>
            </div>
            <div className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
              <dt className="t-label text-bone/45">{b.email}</dt>
              <dd className="mt-2">
                <a href={siteConfig.contact.emailHref} className="link-line text-[1.05rem] break-words">
                  {siteConfig.contact.email}
                </a>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="t-label text-bone/45">{b.hours}</dt>
              <dd className="mt-2 text-[1.05rem] whitespace-pre-line text-bone/85">{b.hoursValue}</dd>
            </div>
          </dl>

          <div className="mt-12 hidden max-w-[22rem] lg:block">
            <ImageSlot image="booking" sizes="22rem" className="bk-image aspect-[3/4] rounded-[var(--radius-frame)]" />
          </div>
        </div>

        {/* Form card */}
        <div className="col-span-12 lg:col-span-7 lg:col-start-6">
          <div className="bk-card relative rounded-[calc(var(--radius-frame)*1.2)] bg-ink-2 p-6 ring-1 ring-bone/10 sm:p-10 lg:p-12">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-[1.35rem] tracking-[-0.02em]">{b.formTitle}</h3>
              <span className="t-label flex items-center gap-2 rounded-full bg-clinic/15 px-3 py-1.5 text-clinic-soft">
                <Info className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
                {b.demoBadge}
              </span>
            </div>
            <p className="mt-3 text-[0.85rem] text-bone/50">{b.demoNote}</p>

            {showResult ? (
              <div ref={resultRef} tabIndex={-1} role="status" className="mt-10 rounded-2xl bg-bone/[0.04] p-7 ring-1 ring-bone/10 outline-none sm:p-9">
                <span
                  data-result-rise
                  className={cn(
                    "flex size-12 items-center justify-center rounded-full",
                    status === "error" ? "bg-[#e3a29a]/15 text-[#e3a29a]" : "bg-clinic/20 text-clinic-soft",
                  )}
                >
                  {status === "error" ? <Info className="size-5" strokeWidth={1.6} aria-hidden="true" /> : <Check className="size-5" strokeWidth={1.6} aria-hidden="true" />}
                </span>
                <p data-result-rise className="t-h3 mt-6">
                  {status === "error" ? b.failure.title : status === "sent" ? b.success.sentTitle : b.success.title}
                </p>
                <p data-result-rise className="t-body mt-4 max-w-[52ch] text-bone/70">
                  {status === "error"
                    ? b.failure.text
                    : format(status === "sent" ? b.success.sentText : b.success.text, { name: submittedName })}
                </p>
                <div data-result-rise className="mt-8">
                  <Button onClick={status === "error" ? () => setStatus("idle") : reset} variant="bone" magnetic={false}>
                    {status === "error" ? b.failure.retry : b.success.reset}
                  </Button>
                </div>
              </div>
            ) : (
              <form ref={formRef} onSubmit={onSubmit} noValidate className="mt-8 grid gap-x-8 gap-y-7 sm:grid-cols-2" aria-describedby={hasErrors ? `${uid}-summary` : undefined}>
                <Field id={ids("name")} label={b.fields.name.label} error={showError("name") ? errorText("name") : ""} className="sm:col-span-2">
                  <input
                    id={ids("name").input}
                    name="name"
                    type="text"
                    autoComplete="name"
                    className="field-input"
                    placeholder={b.fields.name.placeholder}
                    value={values.name}
                    onChange={(e) => set("name", e.target.value)}
                    onBlur={() => blur("name")}
                    aria-invalid={!!showError("name")}
                    aria-describedby={showError("name") ? ids("name").error : undefined}
                    required
                  />
                </Field>

                <Field id={ids("email")} label={b.fields.email.label} error={showError("email") ? errorText("email") : ""}>
                  <input
                    id={ids("email").input}
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    className="field-input"
                    placeholder={b.fields.email.placeholder}
                    value={values.email}
                    onChange={(e) => set("email", e.target.value)}
                    onBlur={() => blur("email")}
                    aria-invalid={!!showError("email")}
                    aria-describedby={showError("email") ? ids("email").error : undefined}
                    required
                  />
                </Field>

                <Field id={ids("phone")} label={b.fields.phone.label} error={showError("phone") ? errorText("phone") : ""}>
                  <input
                    id={ids("phone").input}
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    className="field-input"
                    placeholder={b.fields.phone.placeholder}
                    value={values.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    onBlur={() => blur("phone")}
                    aria-invalid={!!showError("phone")}
                    aria-describedby={showError("phone") ? ids("phone").error : undefined}
                    required
                  />
                </Field>

                <Field id={ids("treatment")} label={b.fields.treatment.label} error={showError("treatment") ? errorText("treatment") : ""} className="sm:col-span-2">
                  <div className="relative">
                    <select
                      id={ids("treatment").input}
                      name="treatment"
                      className={cn("field-input pr-10", !values.treatment && "text-bone/40")}
                      value={values.treatment}
                      onChange={(e) => set("treatment", e.target.value as BookingValues["treatment"])}
                      onBlur={() => blur("treatment")}
                      aria-invalid={!!showError("treatment")}
                      aria-describedby={showError("treatment") ? ids("treatment").error : undefined}
                      required
                    >
                      <option value="" disabled>
                        {b.fields.treatment.placeholder}
                      </option>
                      {treatmentIds.map((id) => (
                        <option key={id} value={id}>
                          {dict.treatments.items[id].title}
                        </option>
                      ))}
                      <option value="not-sure">{b.notSure}</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-1 size-4 -translate-y-1/2 text-bone/50" strokeWidth={1.6} aria-hidden="true" />
                  </div>
                </Field>

                <Field
                  id={ids("message")}
                  label={b.fields.message.label}
                  optional={b.optional}
                  error={showError("message") ? errorText("message") : ""}
                  className="sm:col-span-2"
                  aside={
                    <span className={cn("font-mono text-[0.6875rem] tracking-[0.06em]", values.message.length > MESSAGE_MAX ? "text-[#e3a29a]" : "text-bone/40")} aria-hidden="true">
                      {format(b.counter, { count: values.message.length, max: MESSAGE_MAX })}
                    </span>
                  }
                >
                  <textarea
                    id={ids("message").input}
                    name="message"
                    rows={4}
                    className="field-input resize-none"
                    placeholder={b.fields.message.placeholder}
                    value={values.message}
                    onChange={(e) => set("message", e.target.value)}
                    onBlur={() => blur("message")}
                    aria-invalid={!!showError("message")}
                    aria-describedby={showError("message") ? ids("message").error : undefined}
                  />
                </Field>

                <div className="bk-field sm:col-span-2">
                  <label className="group flex cursor-pointer items-start gap-3.5">
                    <span className="relative mt-0.5 flex size-5 shrink-0 items-center justify-center">
                      <input
                        type="checkbox"
                        name="consent"
                        className="peer absolute inset-0 size-5 cursor-pointer appearance-none rounded-md border border-bone/30 transition-colors checked:border-clinic-soft checked:bg-clinic-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clinic-soft aria-[invalid=true]:border-[#e3a29a]"
                        checked={values.consent}
                        onChange={(e) => {
                          set("consent", e.target.checked);
                          blur("consent");
                        }}
                        aria-invalid={!!showError("consent")}
                        aria-describedby={showError("consent") ? ids("consent").error : undefined}
                      />
                      <Check className="pointer-events-none relative size-3.5 scale-0 text-ink transition-transform duration-300 peer-checked:scale-100" strokeWidth={2.4} aria-hidden="true" />
                    </span>
                    <span className="text-[0.92rem] leading-snug text-bone/75">{b.consent}</span>
                  </label>
                  {showError("consent") && (
                    <p id={ids("consent").error} className="mt-2 pl-8 text-[0.82rem] text-[#e3a29a]">
                      {errorText("consent")}
                    </p>
                  )}
                </div>

                <div className="bk-field flex flex-col-reverse gap-4 sm:col-span-2 xl:flex-row xl:items-center xl:justify-between">
                  <p id={`${uid}-summary`} role="alert" className="text-[0.85rem] text-[#e3a29a]">
                    {hasErrors ? b.errors.summary : ""}
                  </p>
                  <Button type="submit" variant="bone" size="lg" disabled={status === "submitting"}>
                    {status === "submitting" ? b.submitting : b.submit}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  optional,
  error,
  className,
  aside,
  children,
}: {
  id: { input: string; error: string };
  label: string;
  optional?: string;
  error: string;
  className?: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("bk-field flex flex-col", className)}>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id.input} className="t-label text-bone/55">
          {label}
          {optional && <span className="ml-2 normal-case opacity-60">({optional})</span>}
        </label>
        {aside}
      </div>
      {children}
      <p id={id.error} className={cn("text-[0.82rem] text-[#e3a29a] transition-all duration-300", error ? "mt-2 opacity-100" : "h-0 opacity-0")} aria-live="off">
        {error}
      </p>
    </div>
  );
}
