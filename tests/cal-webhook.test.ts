import {beforeEach, describe, expect, it, vi} from "vitest";

const mocks = vi.hoisted(() => ({
  webhookSecret: "test-secret" as string | undefined,
  sendNotification: vi.fn(),
}));

vi.mock("@/lib/env", () => ({
  env: {
    get CAL_WEBHOOK_SECRET() {
      return mocks.webhookSecret;
    },
  },
}));

vi.mock("@/lib/resend", () => ({
  sendCalWebhookNotification: mocks.sendNotification,
}));

function request(
  body: string,
  options: {secret?: string; contentLength?: number} = {},
) {
  const headers = new Headers({"content-type": "application/json"});

  if (options.secret) {
    headers.set("cal-webhook-secret", options.secret);
  }

  if (options.contentLength !== undefined) {
    headers.set("content-length", String(options.contentLength));
  }

  return new Request("http://localhost/api/cal/webhook", {
    method: "POST",
    headers,
    body,
  });
}

describe("POST /api/cal/webhook", () => {
  beforeEach(() => {
    mocks.webhookSecret = "test-secret";
    mocks.sendNotification.mockReset();
    mocks.sendNotification.mockResolvedValue({skipped: false});
  });

  it("returns 503 when the webhook is disabled", async () => {
    mocks.webhookSecret = undefined;
    const {POST} = await import("@/app/api/cal/webhook/route");
    const response = await POST(request("{}"));

    expect(response.status).toBe(503);
    expect(mocks.sendNotification).not.toHaveBeenCalled();
  });

  it("checks the secret before reading the request body", async () => {
    const {POST} = await import("@/app/api/cal/webhook/route");
    const response = await POST(request("{"));

    expect(response.status).toBe(401);
    expect(mocks.sendNotification).not.toHaveBeenCalled();
  });

  it("rejects malformed JSON", async () => {
    const {POST} = await import("@/app/api/cal/webhook/route");
    const response = await POST(request("{", {secret: "test-secret"}));

    expect(response.status).toBe(400);
  });

  it("rejects oversized payloads", async () => {
    const {POST} = await import("@/app/api/cal/webhook/route");
    const response = await POST(
      request("{}", {secret: "test-secret", contentLength: 300_000}),
    );
    const body = await response.json();

    expect(response.status).toBe(413);
    expect(body.error).toBe("Request too large");
    expect(mocks.sendNotification).not.toHaveBeenCalled();
  });

  it("rejects payloads outside the Cal schema", async () => {
    const {POST} = await import("@/app/api/cal/webhook/route");
    const response = await POST(
      request('{"payload":[]}', {secret: "test-secret"}),
    );

    expect(response.status).toBe(400);
    expect(mocks.sendNotification).not.toHaveBeenCalled();
  });

  it("returns a controlled error when notification delivery fails", async () => {
    mocks.sendNotification.mockRejectedValue(new Error("resend failed"));
    const {POST} = await import("@/app/api/cal/webhook/route");
    const response = await POST(
      request('{"payload":{"event":"created"}}', {
        secret: "test-secret",
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe("Unable to process webhook");
  });

  it("notifies and acknowledges a valid webhook", async () => {
    const {POST} = await import("@/app/api/cal/webhook/route");
    const response = await POST(
      request('{"payload":{"event":"created"}}', {
        secret: "test-secret",
      }),
    );

    expect(response.status).toBe(200);
    expect(mocks.sendNotification).toHaveBeenCalledWith({
      payload: {event: "created"},
    });
  });
});
