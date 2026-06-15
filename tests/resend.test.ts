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
    studentAge: "",
    preferredLanguage: "English" as const,
    subject: "Flute lessons",
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
  });
});
