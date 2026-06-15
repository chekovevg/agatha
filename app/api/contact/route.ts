import {NextResponse} from "next/server";

import {sendContactEmails} from "@/lib/resend";
import {contactSchema} from "@/lib/validators";

const submissions = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
const MIN_FORM_FILL_MS = 2_500;

const MARKETING_SPAM_SNIPPETS = [
  "attirer plus d eleves",
  "backlinks",
  "digital marketing",
  "google ranking",
  "increase your website traffic",
  "optimiser votre site web",
  "optimize your website",
  "optimise your website",
  "search engine optimization",
  "seo services",
  "website traffic",
];

function isRateLimited(ip: string, now = Date.now()) {
  const previous = submissions.get(ip) ?? [];
  const recent = previous.filter((timestamp) => now - timestamp < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    submissions.set(ip, recent);
    return true;
  }

  submissions.set(ip, [...recent, now]);
  return false;
}

function getStringField(payload: unknown, field: string) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return undefined;
  }

  const value = (payload as Record<string, unknown>)[field];
  return typeof value === "string" ? value : undefined;
}

function normalizeSpamText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isTooFastForHuman(payload: unknown, now = Date.now()) {
  const startedAt = getStringField(payload, "formStartedAt");

  if (!startedAt) {
    return true;
  }

  const timestamp = Number(startedAt);
  return !Number.isFinite(timestamp) || now - timestamp < MIN_FORM_FILL_MS;
}

function isMarketingSpam(input: {
  message: string;
  subject: string;
}) {
  const text = normalizeSpamText(`${input.subject} ${input.message}`);
  return MARKETING_SPAM_SNIPPETS.some((snippet) => text.includes(snippet));
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "local";

  if (isRateLimited(ip)) {
    return NextResponse.json({error: "Too many requests"}, {status: 429});
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({error: "Invalid request"}, {status: 400});
  }

  const parsed = contactSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({error: "Invalid form data"}, {status: 400});
  }

  if (
    parsed.data.website ||
    isTooFastForHuman(payload) ||
    isMarketingSpam(parsed.data)
  ) {
    return NextResponse.json({ok: true});
  }

  try {
    const result = await sendContactEmails(parsed.data);
    return NextResponse.json({ok: true, emailSkipped: result.skipped});
  } catch {
    return NextResponse.json(
      {error: "Unable to send message"},
      {status: 500},
    );
  }
}
