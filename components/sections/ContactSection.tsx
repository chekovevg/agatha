import type {SiteContent} from "@/content/types";
import {Section} from "@/components/ui/Section";
import {SectionHeader} from "@/components/ui/SectionHeader";
import {ContactForm} from "@/components/ui/ContactForm";

export function ContactSection({content}: {content: SiteContent}) {
  return (
    <Section id="contact">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <SectionHeader title={content.contact.heading} intro={content.contact.copy} />
        <ContactForm />
      </div>
    </Section>
  );
}
