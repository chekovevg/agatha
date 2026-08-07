"use client";

import {useState} from "react";

import {ButtonLink} from "@/components/ui/Button";
import type {AudienceLessonContent} from "@/content/types";

type AudienceLink = Pick<
  AudienceLessonContent,
  "cardCopy" | "navLabel" | "path"
>;

export function HomeAudienceSelector({
  audiences,
  body,
  heading,
}: {
  audiences: AudienceLink[];
  body: string;
  heading: string;
}) {
  const [activeCopy, setActiveCopy] = useState(body);

  return (
    <section
      className="home-manifesto-section editorial-container"
      aria-labelledby="home-manifesto-title"
    >
      <div className="home-manifesto-copy-stack">
        <h2
          id="home-manifesto-title"
          className="home-manifesto-heading"
          data-home-manifesto-heading
        >
          {heading}
        </h2>
        <p
          className="home-section-copy"
          data-home-manifesto-copy
          aria-live="polite"
        >
          {activeCopy}
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {audiences.map((audience) => (
          <ButtonLink
            key={audience.path}
            href={audience.path}
            onBlur={() => setActiveCopy(body)}
            onFocus={() => setActiveCopy(audience.cardCopy)}
            onMouseEnter={() => setActiveCopy(audience.cardCopy)}
            onMouseLeave={() => setActiveCopy(body)}
          >
            {audience.navLabel}
          </ButtonLink>
        ))}
      </div>
    </section>
  );
}
