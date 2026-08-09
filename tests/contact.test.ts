import {beforeEach, describe, expect, it, vi} from "vitest";

const sendContactEmails = vi.fn();

vi.mock("@/lib/resend", () => ({
  sendContactEmails,
}));

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    name: "Test Student",
    email: "student@example.com",
    studentAge: "Adult",
    subject: "Flute",
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

  it("rejects an unknown student age group", async () => {
    const {POST} = await import("@/app/api/contact/route");
    const response = await POST(request(validPayload({studentAge: "24"})));

    expect(response.status).toBe(400);
    expect(sendContactEmails).not.toHaveBeenCalled();
  });

  it("rejects a subject outside the current class list", async () => {
    const {POST} = await import("@/app/api/contact/route");
    const response = await POST(request(validPayload({subject: "Piano"})));

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
          subject: "Flute",
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

  it("rejects oversized request bodies before processing", async () => {
    const {POST} = await import("@/app/api/contact/route");
    const oversizedRequest = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "content-length": "20000",
        "content-type": "application/json",
      },
      body: JSON.stringify(validPayload()),
    });
    const response = await POST(oversizedRequest);
    const body = await response.json();

    expect(response.status).toBe(413);
    expect(body.error).toBe("Request too large");
    expect(sendContactEmails).not.toHaveBeenCalled();
  });

  it("does not consume valid submission quota for rejected spam", async () => {
    const {POST} = await import("@/app/api/contact/route");
    const ip = "203.0.113.77";

    for (let index = 0; index < 6; index += 1) {
      const spamResponse = await POST(
        request(validPayload({website: `spam-${index}.example`}), ip),
      );
      expect(spamResponse.status).toBe(200);
    }

    const validResponse = await POST(request(validPayload(), ip));

    expect(validResponse.status).toBe(200);
    expect(sendContactEmails).toHaveBeenCalledTimes(1);
  });

  it("sends expected payload for valid submission", async () => {
    const {POST} = await import("@/app/api/contact/route");
    const payload = validPayload();
    const response = await POST(request(payload));

    expect(response.status).toBe(200);
    expect(sendContactEmails).toHaveBeenCalledWith(expectedContactPayload(payload));
  });

  it("drops the removed language and acquisition fields", async () => {
    const {POST} = await import("@/app/api/contact/route");
    const response = await POST(
      request(
        validPayload({
          preferredLanguage: "English",
          source: "Google or another search engine",
        }),
      ),
    );

    expect(response.status).toBe(200);
    expect(sendContactEmails).toHaveBeenCalledWith(
      expect.not.objectContaining({
        preferredLanguage: expect.anything(),
        source: expect.anything(),
      }),
    );
  });

  it("reports unavailable email delivery instead of a false success", async () => {
    sendContactEmails.mockResolvedValue({skipped: true});
    const {POST} = await import("@/app/api/contact/route");
    const response = await POST(request(validPayload()));
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.error).toBe("Email service unavailable");
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
