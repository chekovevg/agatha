import {NextResponse} from "next/server";

import {env} from "@/lib/env";
import {sendCalWebhookNotification} from "@/lib/resend";
import {readJsonBody} from "@/lib/request-json";
import {calWebhookSchema} from "@/lib/validators";

const MAX_WEBHOOK_BODY_BYTES = 262_144;

export async function POST(request: Request) {
  if (!env.CAL_WEBHOOK_SECRET) {
    return NextResponse.json({error: "Webhook disabled"}, {status: 503});
  }

  const secret =
    request.headers.get("cal-webhook-secret") ??
    request.headers.get("x-cal-secret");

  if (secret !== env.CAL_WEBHOOK_SECRET) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const body = await readJsonBody(request, MAX_WEBHOOK_BODY_BYTES);

  if (!body.ok) {
    if (body.reason === "too-large") {
      return NextResponse.json({error: "Request too large"}, {status: 413});
    }

    return NextResponse.json({error: "Invalid request"}, {status: 400});
  }

  const parsed = calWebhookSchema.safeParse(body.data);

  if (!parsed.success) {
    return NextResponse.json({error: "Invalid payload"}, {status: 400});
  }

  try {
    await sendCalWebhookNotification(parsed.data);
  } catch {
    return NextResponse.json(
      {error: "Unable to process webhook"},
      {status: 500},
    );
  }

  return NextResponse.json({ok: true});
}
