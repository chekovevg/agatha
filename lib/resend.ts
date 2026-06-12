import {Resend} from "resend";

import {env} from "@/lib/env";
import type {ContactInput} from "@/lib/validators";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
const senderName = "Agatha G.";

function getSenderAddress() {
  return env.CONTACT_FROM_EMAIL
    ? `${senderName} <${env.CONTACT_FROM_EMAIL}>`
    : undefined;
}

export function isEmailConfigured() {
  return Boolean(resend && env.CONTACT_TO_EMAIL && env.CONTACT_FROM_EMAIL);
}

export async function sendContactEmails(input: ContactInput) {
  if (!resend || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
    return {skipped: true};
  }

  const from = getSenderAddress();

  if (!from) {
    return {skipped: true};
  }

  const details = [
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Subject: ${input.subject}`,
    `Student age: ${input.studentAge || "Not provided"}`,
    `Preferred language: ${input.preferredLanguage || "Not provided"}`,
    "",
    input.message,
  ].join("\n");

  await resend.emails.send({
    from,
    to: env.CONTACT_TO_EMAIL,
    replyTo: input.email,
    subject: `New lesson inquiry: ${input.subject}`,
    text: details,
  });

  await resend.emails.send({
    from,
    to: input.email,
    subject: "Thank you for your message",
    text:
      "Thank you for writing to Agathe G. Musik. Agathe will reply soon with the next steps for your lessons.",
  });

  return {skipped: false};
}

export async function sendCalWebhookNotification(payload: unknown) {
  if (!resend || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
    return {skipped: true};
  }

  const from = getSenderAddress();

  if (!from) {
    return {skipped: true};
  }

  await resend.emails.send({
    from,
    to: env.CONTACT_TO_EMAIL,
    subject: "New Cal.com booking event",
    text: JSON.stringify(payload, null, 2),
  });

  return {skipped: false};
}
