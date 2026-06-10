"use client";

import {useState} from "react";
import {useTranslations} from "next-intl";

import {Button} from "@/components/ui/Button";

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const t = useTranslations("ContactForm");
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);

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
      className="grid gap-4 rounded-lg border-2 border-[var(--line)] bg-white p-5 shadow-[6px_6px_0_var(--line)]"
      onSubmit={handleSubmit}
    >
      <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />
      <label className="grid gap-2 text-sm font-black">
        {t("name")}
        <input
          name="name"
          required
          className="rounded-md border-2 border-[var(--line)] px-3 py-2 font-normal"
        />
      </label>
      <label className="grid gap-2 text-sm font-black">
        {t("email")}
        <input
          name="email"
          required
          type="email"
          className="rounded-md border-2 border-[var(--line)] px-3 py-2 font-normal"
        />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-black">
          {t("studentAge")}
          <input
            name="studentAge"
            className="rounded-md border-2 border-[var(--line)] px-3 py-2 font-normal"
          />
        </label>
        <label className="grid gap-2 text-sm font-black">
          {t("preferredLanguage")}
          <select
            name="preferredLanguage"
            className="rounded-md border-2 border-[var(--line)] px-3 py-2 font-normal"
            defaultValue="Not sure"
          >
            <option>English</option>
            <option>German</option>
            <option>Russian</option>
            <option>Not sure</option>
          </select>
        </label>
      </div>
      <label className="grid gap-2 text-sm font-black">
        {t("subject")}
        <input
          name="subject"
          required
          className="rounded-md border-2 border-[var(--line)] px-3 py-2 font-normal"
        />
      </label>
      <label className="grid gap-2 text-sm font-black">
        {t("message")}
        <textarea
          name="message"
          required
          rows={5}
          className="rounded-md border-2 border-[var(--line)] px-3 py-2 font-normal"
        />
      </label>
      <Button type="submit" disabled={state === "submitting"}>
        {state === "submitting" ? "Sending..." : t("submit")}
      </Button>
      {state === "success" ? (
        <p className="text-sm font-bold text-[var(--leaf)]">{t("success")}</p>
      ) : null}
      {state === "error" ? (
        <p className="text-sm font-bold text-red-700">{t("error")}</p>
      ) : null}
    </form>
  );
}
