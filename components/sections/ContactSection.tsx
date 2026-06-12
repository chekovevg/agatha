import type {SiteContent} from "@/content/types";
import {Section} from "@/components/ui/Section";
import {SectionHeader} from "@/components/ui/SectionHeader";
import {ContactForm} from "@/components/ui/ContactForm";
import {ButtonLink} from "@/components/ui/Button";
import {env} from "@/lib/env";

export function ContactSection({content}: {content: SiteContent}) {
  const contactLinks = [
    env.NEXT_PUBLIC_CAL_LINK
      ? {label: content.cta.primary, href: env.NEXT_PUBLIC_CAL_LINK}
      : null,
    env.NEXT_PUBLIC_WHATSAPP_URL
      ? {label: "Message on WhatsApp", href: env.NEXT_PUBLIC_WHATSAPP_URL}
      : null,
    env.NEXT_PUBLIC_PREPLY_URL
      ? {label: "Read reviews on Preply", href: env.NEXT_PUBLIC_PREPLY_URL}
      : null,
    env.NEXT_PUBLIC_INSTAGRAM_URL
      ? {label: "Instagram", href: env.NEXT_PUBLIC_INSTAGRAM_URL}
      : null,
  ].filter(Boolean) as {label: string; href: string}[];

  return (
    <Section id="contact">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <SectionHeader title={content.contact.heading} intro={content.contact.copy} />
          {contactLinks.length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {contactLinks.map((link) => (
                <ButtonLink
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  variant="secondary"
                >
                  {link.label}
                </ButtonLink>
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-[var(--radius-card)] bg-[var(--card)] p-5 text-sm font-medium leading-6 text-[var(--muted)] shadow-[var(--shadow-inset)]">
              Add Cal.com, WhatsApp, Preply, or Instagram URLs in environment
              variables to show quick contact links here.
            </p>
          )}
        </div>
        <ContactForm />
      </div>
    </Section>
  );
}
