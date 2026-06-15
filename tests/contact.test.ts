import {beforeEach, describe, expect, it, vi} from "vitest";

const sendContactEmails = vi.fn();

vi.mock("@/lib/resend", () => ({
  sendContactEmails,
}));

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    name: "Test Student",
    email: "student@example.com",
    studentAge: "24",
    preferredLanguage: "English",
    subject: "Flute lessons",
    message: "I would like to ask about a first flute lesson.",
    website: "",
    formStartedAt: String(Date.now() - 5_000),
    ...overrides,
  };
}

function expectedContactPayload(payload: ReturnType<typeof validPayload>) {
  const contactPayload: Record<string, unknown> = {...payload};
  delete contactPayload.formStartedAt;
  return contactPayload;
}

function request(payload: unknown, ip = "203.0.113.1") {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(payload),
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.resetModules();
    sendContactEmails.mockReset();
    sendContactEmails.mockResolvedValue({skipped: false});
  });

  it("rejects invalid email", async () => {
    const {POST} = await import("@/app/api/contact/route");
    const response = await POST(request(validPayload({email: "not-email"})));

    expect(response.status).toBe(400);
    expect(sendContactEmails).not.toHaveBeenCalled();
  });

  it("rejects missing required fields", async () => {
    const {POST} = await import("@/app/api/contact/route");
    const response = await POST(request(validPayload({message: ""})));

    expect(response.status).toBe(400);
    expect(sendContactEmails).not.toHaveBeenCalled();
  });

  it("ignores honeypot spam submissions", async () => {
    const {POST} = await import("@/app/api/contact/route");
    const response = await POST(
      request(validPayload({website: "https://spam.example"})),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(sendContactEmails).not.toHaveBeenCalled();
  });

  it("ignores submissions sent too quickly for a human form fill", async () => {
    const {POST} = await import("@/app/api/contact/route");
    const response = await POST(
      request(validPayload({formStartedAt: String(Date.now())})),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(sendContactEmails).not.toHaveBeenCalled();
  });

  it("ignores marketing spam submissions", async () => {
    const {POST} = await import("@/app/api/contact/route");
    const response = await POST(
      request(
        validPayload({
          subject: "Please Disregard",
          message:
            "Bonjour Agathe, nous pouvons optimiser votre site web pour attirer plus d'eleves.",
        }),
      ),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(sendContactEmails).not.toHaveBeenCalled();
  });

  it("sends expected payload for valid submission", async () => {
    const {POST} = await import("@/app/api/contact/route");
    const payload = validPayload();
    const response = await POST(request(payload));

    expect(response.status).toBe(200);
    expect(sendContactEmails).toHaveBeenCalledWith(expectedContactPayload(payload));
  });

  it("does not expose internal send errors", async () => {
    sendContactEmails.mockRejectedValue(new Error("resend failed"));
    const {POST} = await import("@/app/api/contact/route");
    const response = await POST(request(validPayload()));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe("Unable to send message");
  });
});
