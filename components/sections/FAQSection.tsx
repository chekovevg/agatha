"use client";

import {useState} from "react";

import type {FAQItem} from "@/content/types";
import {Section} from "@/components/ui/Section";
import {SectionHeader} from "@/components/ui/SectionHeader";

export function FAQSection({items}: {items: FAQItem[]}) {
  const [open, setOpen] = useState(items[0]?.question);

  return (
    <Section id="faq" tone="white">
      <SectionHeader title="Questions before the first lesson" />
      <div className="mt-10 divide-y-2 divide-[var(--line)] rounded-lg border-2 border-[var(--line)] bg-white">
        {items
          .sort((a, b) => a.order - b.order)
          .map((item) => {
            const isOpen = open === item.question;

            return (
              <div key={item.question}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-5 px-5 py-4 text-left font-black"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? "" : item.question)}
                >
                  <span>{item.question}</span>
                  <span aria-hidden>{isOpen ? "-" : "+"}</span>
                </button>
                {isOpen ? (
                  <p className="px-5 pb-5 leading-7 text-[var(--muted)]">
                    {item.answer}
                  </p>
                ) : null}
              </div>
            );
          })}
      </div>
    </Section>
  );
}
