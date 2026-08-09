import {beforeEach, describe, expect, it, vi} from "vitest";

const {sendEmail} = vi.hoisted(() => ({
  sendEmail: vi.fn(),
}));

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(function ResendMock() {
    return {
      emails: {
        send: sendEmail,
      },
    };
  }),
}));

function contactInput() {
  return {
    name: "Test Student",
    email: "student@example.com",
    studentAge: "Adult" as const,
    subject: "Flute" as const,
    message: "I would like to ask about a first flute lesson.",
    website: "",
  };
}

describe("Resend email sender", () => {
  beforeEach(() => {
    vi.resetModules();
    sendEmail.mockReset();
    sendEmail.mockResolvedValue({data: {id: "email_123"}});
    process.env.RESEND_API_KEY = "re_test";
    process.env.CONTACT_TO_EMAIL = "agatha@example.com";
    process.env.CONTACT_FROM_EMAIL = "hello@agathamusic.com";
  });

  it("uses Agatha display name with the verified sender address", async () => {
    const {sendContactEmails} = await import("@/lib/resend");

    const result = await sendContactEmails(contactInput());

    expect(result.skipped).toBe(false);
    expect(sendEmail).toHaveBeenCalledTimes(2);
    expect(sendEmail).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        from: "Agatha Music <hello@agathamusic.com>",
        to: ["agathagurko@gmail.com", "agatha@example.com"],
        replyTo: "student@example.com",
      }),
    );
    expect(sendEmail).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        from: "Agatha Music <hello@agathamusic.com>",
        to: "student@example.com",
      }),
    );
    expect(sendEmail.mock.calls[0]?.[0].text).toContain("Student age: Adult");
    expect(sendEmail.mock.calls[0]?.[0].text).not.toContain(
      "Preferred language",
    );
    expect(sendEmail.mock.calls[0]?.[0].text).not.toContain(
      "How they found Agatha",
    );
  });

  it("sends contact notifications to Agatha's Gmail address by default", async () => {
    delete process.env.CONTACT_TO_EMAIL;
    const {sendContactEmails} = await import("@/lib/resend");

    const result = await sendContactEmails(contactInput());

    expect(result.skipped).toBe(false);
    expect(sendEmail).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        to: ["agathagurko@gmail.com"],
      }),
    );
  });

  it("does not duplicate Agatha's Gmail address when CONTACT_TO_EMAIL matches it", async () => {
    process.env.CONTACT_TO_EMAIL = "AGATHAGURKO@gmail.com";
    const {sendContactEmails} = await import("@/lib/resend");

    const result = await sendContactEmails(contactInput());

    expect(result.skipped).toBe(false);
    expect(sendEmail).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        to: ["agathagurko@gmail.com"],
      }),
    );
  });

  it("sends Cal.com webhook notifications to Agatha and the env test recipient", async () => {
    const {sendCalWebhookNotification} = await import("@/lib/resend");

    const result = await sendCalWebhookNotification({event: "booking.created"});

    expect(result.skipped).toBe(false);
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: "New Cal.com booking event",
        to: ["agathagurko@gmail.com", "agatha@example.com"],
      }),
    );
  });
});
