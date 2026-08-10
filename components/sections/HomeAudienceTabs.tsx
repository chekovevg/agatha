"use client";

import {useState} from "react";

import {SplitLinkButton} from "@/components/ui/SplitLinkButton";
import {TabMenu} from "@/components/ui/TabMenu";
import type {SiteContent} from "@/content/types";
import {introBookingHref} from "@/lib/booking";

type AudienceTabs = SiteContent["home"]["audienceTabs"];
type AudienceId = keyof AudienceTabs;

const audienceOrder: AudienceId[] = ["adults", "children"];
const panelId = "home-audience-panel";

export function HomeAudienceTabs({tabs}: {tabs: AudienceTabs}) {
  const [activeAudience, setActiveAudience] =
    useState<AudienceId>("adults");
  const activeTab = tabs[activeAudience];

  return (
    <section
      className="home-manifesto-section editorial-container"
      aria-labelledby="home-audience-title"
    >
      <h2 id="home-audience-title" className="sr-only">
        Who lessons are for
      </h2>
      <TabMenu
        mode="tabs"
        activeId={activeAudience}
        ariaLabel="Lesson audience"
        items={audienceOrder.map((id) => ({id, label: tabs[id].label}))}
        onTabChange={(id) => setActiveAudience(id as AudienceId)}
        panelId={panelId}
      />
      <p
        id={panelId}
        role="tabpanel"
        aria-labelledby={`${panelId}-${activeAudience}-tab`}
        className="home-section-copy"
        data-home-manifesto-copy
        data-testid="home-audience-panel"
      >
        {activeTab.description}
      </p>
      <SplitLinkButton
        href={introBookingHref}
        className="home-audience-action"
        data-analytics-booking-cta="home-audience"
      >
        Book a Call
      </SplitLinkButton>
    </section>
  );
}
