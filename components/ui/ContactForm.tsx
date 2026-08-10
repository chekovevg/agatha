"use client";

import {useEffect, useRef, useState} from "react";

import {Button} from "@/components/ui/Button";
import {contactFormContent as copy} from "@/content/contact-form";
import {submitContact} from "@/lib/contact-client";

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const formStartedAt = useRef("");
  const [state, setState] = useState<FormState>("idle");

  useEffect(() => {
    formStartedAt.current = String(Date.now());
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);
    formData.set("formStartedAt", formStartedAt.current);

    const submitted = await submitContact(Object.fromEntries(formData));

    if (submitted) {
      form.reset();
      formStartedAt.current = String(Date.now());
      setState("success");
    } else {
      setState("error");
    }
  }

  return (
    <form
      className="grid gap-4 rounded-[var(--radius-media)] bg-[var(--card)] p-5 shadow-[var(--shadow-elevated)]"
      onSubmit={handleSubmit}
      aria-busy={state === "submitting"}
    >
      <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />
      <label className="mai-ui grid gap-2">
        {copy.email}
        <input
          name="email"
          required
          type="email"
          className="mai-body rounded px-4 py-3 shadow-[var(--shadow-inset)]"
        />
      </label>
      <label className="mai-ui grid gap-2">
        {copy.message}
        <textarea
          name="message"
          required
          rows={5}
          className="mai-body rounded px-4 py-3 shadow-[var(--shadow-inset)]"
        />
      </label>
      <Button type="submit" disabled={state === "submitting"}>
        {state === "submitting" ? copy.sending : copy.submit}
      </Button>
      <div role="status" aria-live="polite">
        {state === "success" ? (
          <p className="mai-caption text-[var(--muted)]">{copy.success}</p>
        ) : null}
        {state === "error" ? (
          <p className="mai-caption text-[var(--ink)]">{copy.error}</p>
        ) : null}
      </div>
    </form>
  );
}
