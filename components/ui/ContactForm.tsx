"use client";

import {useEffect, useRef, useState} from "react";
import {useTranslations} from "next-intl";

import {Button} from "@/components/ui/Button";

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const t = useTranslations("ContactForm");
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

    const response = await fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: {"Content-Type": "application/json"},
    });

    if (response.ok) {
      form.reset();
      setState("success");
    } else {
      setState("error");
    }
  }

  return (
    <form
      className="grid gap-4 rounded-[var(--radius-media)] bg-[var(--card)] p-5 shadow-[var(--shadow-elevated)]"
      onSubmit={handleSubmit}
    >
      <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />
      <label className="mai-ui grid gap-2">
        {t("name")}
        <input
          name="name"
          required
          className="mai-body rounded px-4 py-3 shadow-[var(--shadow-inset)]"
        />
      </label>
      <label className="mai-ui grid gap-2">
        {t("email")}
        <input
          name="email"
          required
          type="email"
          className="mai-body rounded px-4 py-3 shadow-[var(--shadow-inset)]"
        />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="mai-ui grid gap-2">
          {t("studentAge")}
          <input
            name="studentAge"
            className="mai-body rounded px-4 py-3 shadow-[var(--shadow-inset)]"
          />
        </label>
        <label className="mai-ui grid gap-2">
          {t("preferredLanguage")}
          <select
            name="preferredLanguage"
            className="mai-body rounded px-4 py-3 shadow-[var(--shadow-inset)]"
            defaultValue="Not sure"
          >
            <option>English</option>
            <option>German</option>
            <option>Russian</option>
            <option>Not sure</option>
          </select>
        </label>
      </div>
      <label className="mai-ui grid gap-2">
        {t("subject")}
        <input
          name="subject"
          required
          className="mai-body rounded px-4 py-3 shadow-[var(--shadow-inset)]"
        />
      </label>
      <label className="mai-ui grid gap-2">
        {t("message")}
        <textarea
          name="message"
          required
          rows={5}
          className="mai-body rounded px-4 py-3 shadow-[var(--shadow-inset)]"
        />
      </label>
      <Button type="submit" disabled={state === "submitting"}>
        {state === "submitting" ? "Sending..." : t("submit")}
      </Button>
      {state === "success" ? (
        <p className="mai-caption text-[var(--muted)]">{t("success")}</p>
      ) : null}
      {state === "error" ? (
        <p className="mai-caption text-[var(--ink)]">{t("error")}</p>
      ) : null}
    </form>
  );
}
