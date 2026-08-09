import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {afterEach, describe, expect, it, vi} from "vitest";

import {ContactForm} from "@/components/ui/ContactForm";
import {
  contactFormContent,
  contactStudentAgeOptions,
  contactSubjectOptions,
} from "@/content/contact-form";
import {submitContact} from "@/lib/contact-client";

describe("contact client", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns true for a successful response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ok: true}));

    await expect(submitContact({name: "Agatha"})).resolves.toBe(true);
  });

  it("returns false for a non-success response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ok: false}));

    await expect(submitContact({name: "Agatha"})).resolves.toBe(false);
  });

  it("returns false instead of throwing for a network failure", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    await expect(submitContact({name: "Agatha"})).resolves.toBe(false);
  });

  it("renders the approved English copy and accessible status semantics", () => {
    const html = renderToStaticMarkup(createElement(ContactForm));

    expect(contactFormContent.submit).toBe("Send message");
    expect(contactFormContent.success).toBe(
      "Thank you. Your message has been sent.",
    );
    expect(contactFormContent.error).toBe(
      "Something went wrong. Please try again or use the booking link.",
    );
    expect(html).toContain('aria-busy="false"');
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain(">Send message<");
    expect(html).toContain('name="studentAge"');
    expect(html).toContain('name="subject"');
    for (const option of [
      ...contactStudentAgeOptions,
      ...contactSubjectOptions,
    ]) {
      expect(html).toContain(`<option value="${option}">${option}</option>`);
    }
    expect(html).not.toContain("Preferred language");
    expect(html).not.toContain("How did you find Agatha?");
  });
});
