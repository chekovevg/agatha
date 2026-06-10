import {NextResponse} from "next/server";

import {env} from "@/lib/env";
import {sendCalWebhookNotification} from "@/lib/resend";
import {calWebhookSchema} from "@/lib/validators";

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

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({error: "Invalid request"}, {status: 400});
  }

  const parsed = calWebhookSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({error: "Invalid payload"}, {status: 400});
  }

  await sendCalWebhookNotification(parsed.data);

  return NextResponse.json({ok: true});
}
