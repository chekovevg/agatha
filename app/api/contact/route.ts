import {NextResponse} from "next/server";

import {sendContactEmails} from "@/lib/resend";
import {contactSchema} from "@/lib/validators";

const submissions = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

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

  if (parsed.data.website) {
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
