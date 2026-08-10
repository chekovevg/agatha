import {Resend} from "resend";

import {env} from "@/lib/env";
import type {ContactInput} from "@/lib/validators";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
const senderName = "Agatha Music";
const defaultContactToEmail = "agathagurko@gmail.com";

function getRecipientAddresses() {
  return [defaultContactToEmail, env.CONTACT_TO_EMAIL].reduce<string[]>(
    (recipients, email) => {
      if (!email) {
        return recipients;
      }

      const normalizedEmail = email.toLowerCase();

      if (
        recipients.some(
          (recipient) => recipient.toLowerCase() === normalizedEmail,
        )
      ) {
        return recipients;
      }

      return [...recipients, email];
    },
    [],
  );
}

function getSenderAddress() {
  return env.CONTACT_FROM_EMAIL
    ? `${senderName} <${env.CONTACT_FROM_EMAIL}>`
    : undefined;
}

export function isEmailConfigured() {
  return Boolean(
    resend && getRecipientAddresses().length > 0 && env.CONTACT_FROM_EMAIL,
  );
}

export async function sendContactEmails(input: ContactInput) {
  const recipients = getRecipientAddresses();

  if (!resend || recipients.length === 0 || !env.CONTACT_FROM_EMAIL) {
    return {skipped: true};
  }

  const from = getSenderAddress();

  if (!from) {
    return {skipped: true};
  }

  const details = [`Email: ${input.email}`, "", input.message].join("\n");

  await resend.emails.send({
    from,
    to: recipients,
    replyTo: input.email,
    subject: "New website question",
    text: details,
  });

  await resend.emails.send({
    from,
    to: input.email,
    subject: "Thank you for your message",
    text:
      "Thank you for writing to Agatha Music. Agatha will reply soon with the next steps for your lessons.",
  });

  return {skipped: false};
}

export async function sendCalWebhookNotification(payload: unknown) {
  const recipients = getRecipientAddresses();

  if (!resend || recipients.length === 0 || !env.CONTACT_FROM_EMAIL) {
    return {skipped: true};
  }

  const from = getSenderAddress();

  if (!from) {
    return {skipped: true};
  }

  await resend.emails.send({
    from,
    to: recipients,
    subject: "New Cal.com booking event",
    text: JSON.stringify(payload, null, 2),
  });

  return {skipped: false};
}
