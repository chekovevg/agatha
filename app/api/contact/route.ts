import {NextResponse} from "next/server";

import {sendContactEmails} from "@/lib/resend";
import {createRateLimiter} from "@/lib/rate-limit";
import {readJsonBody} from "@/lib/request-json";
import {contactSchema} from "@/lib/validators";

const MAX_CONTACT_BODY_BYTES = 16_384;
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;
const MAX_RATE_LIMIT_KEYS = 10_000;
const MIN_FORM_FILL_MS = 2_500;
const rateLimiter = createRateLimiter({
  windowMs: WINDOW_MS,
  maxRequests: MAX_REQUESTS,
  maxKeys: MAX_RATE_LIMIT_KEYS,
});

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
  const body = await readJsonBody(request, MAX_CONTACT_BODY_BYTES);

  if (!body.ok) {
    if (body.reason === "too-large") {
      return NextResponse.json({error: "Request too large"}, {status: 413});
    }

    return NextResponse.json({error: "Invalid request"}, {status: 400});
  }

  const payload = body.data;
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

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "local";

  if (rateLimiter.isLimited(ip)) {
    return NextResponse.json({error: "Too many requests"}, {status: 429});
  }

  try {
    const result = await sendContactEmails(parsed.data);

    if (result.skipped) {
      return NextResponse.json(
        {error: "Email service unavailable"},
        {status: 503},
      );
    }

    return NextResponse.json({ok: true});
  } catch {
    return NextResponse.json(
      {error: "Unable to send message"},
      {status: 500},
    );
  }
}
