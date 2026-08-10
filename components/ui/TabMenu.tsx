"use client";

import {useEffect, useRef, useState} from "react";

import {getNearestTabScrollLeft} from "@/components/ui/tab-menu-scroll";
import {cn} from "@/lib/utils";

type TabMenuItem = {
  active: boolean;
  href: string;
  label: string;
};

export function TabMenu({
  ariaLabel,
  items,
}: {
  ariaLabel: string;
  items: TabMenuItem[];
}) {
  const [overflow, setOverflow] = useState(false);
  const viewportRef = useRef<HTMLElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const row = rowRef.current;

    if (!viewport || !row) return;

    const measure = () => {
      setOverflow(viewport.scrollWidth - viewport.clientWidth > 0.5);
    };

    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    observer.observe(row);
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    const viewport = viewportRef.current;
    const row = rowRef.current;
    const activeItem = activeItemRef.current;

    if (!overflow || !viewport || !row || !activeItem) return;

    const target = getNearestTabScrollLeft({
      clientWidth: viewport.clientWidth,
      itemLeft: row.offsetLeft + activeItem.offsetLeft,
      itemWidth: activeItem.offsetWidth,
      scrollLeft: viewport.scrollLeft,
    });

    if (Math.abs(target - viewport.scrollLeft) < 0.5) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    viewport.scrollTo({
      behavior: reducedMotion ? "auto" : "smooth",
      left: target,
    });
  }, [items, overflow]);

  return (
    <div className="tab-menu-layout" data-overflow={overflow}>
      <nav
        ref={viewportRef}
        aria-label={ariaLabel}
        data-overflow={overflow}
        data-testid="booking-tab-menu"
        className="tab-menu-viewport"
      >
        <div ref={rowRef} className="tab-menu-row">
        {items.map((item) => (
          <a
            key={item.label}
            ref={item.active ? activeItemRef : undefined}
            href={item.href}
            aria-current={item.active ? "page" : undefined}
            className={cn(
              "tab-menu-item mai-ui",
              item.active
                ? "bg-[var(--background)]"
                : "bg-[var(--tab-surface)]",
            )}
          >
            {item.label}
          </a>
        ))}
        </div>
      </nav>
    </div>
  );
}
