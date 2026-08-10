"use client";

import {useEffect, useRef, useState, type KeyboardEvent} from "react";

import {getNearestTabScrollLeft} from "@/components/ui/tab-menu-scroll";
import {cn} from "@/lib/utils";

type NavigationItem = {
  active: boolean;
  href: string;
  label: string;
};

type TabItem = {
  id: string;
  label: string;
};

type NavigationProps = {
  mode?: "navigation";
  ariaLabel: string;
  items: NavigationItem[];
};

type TabsProps = {
  mode: "tabs";
  activeId: string;
  ariaLabel: string;
  items: TabItem[];
  onTabChange: (id: string) => void;
  panelId: string;
};

function itemClass(active: boolean) {
  return cn(
    "tab-menu-item mai-ui focus-visible:outline-2",
    active ? "bg-[var(--background)]" : "bg-[var(--tab-surface)]",
  );
}

function NavigationTabMenu({
  ariaLabel,
  items,
}: Omit<NavigationProps, "mode">) {
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
              className={itemClass(item.active)}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}

export function TabMenu(props: NavigationProps | TabsProps) {
  if (props.mode !== "tabs") {
    return <NavigationTabMenu ariaLabel={props.ariaLabel} items={props.items} />;
  }

  const {activeId, ariaLabel, items, onTabChange, panelId} = props;

  const selectTab = (
    index: number,
    event: KeyboardEvent<HTMLButtonElement>,
  ) => {
    const item = items[index];
    if (!item) return;

    onTabChange(item.id);
    const buttons = event.currentTarget.parentElement?.querySelectorAll(
      '[role="tab"]',
    );
    (buttons?.[index] as HTMLButtonElement | undefined)?.focus();
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLButtonElement>,
  ) => {
    let nextIndex: number | undefined;

    if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + items.length) % items.length;
    } else if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % items.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = items.length - 1;
    }

    if (nextIndex == null) return;
    event.preventDefault();
    selectTab(nextIndex, event);
  };

  return (
    <div className="tab-menu-layout" data-overflow="false">
      <div
        aria-label={ariaLabel}
        className="tab-menu-viewport"
        data-testid="home-audience-tabs"
        role="tablist"
      >
        <div className="tab-menu-row">
          {items.map((item, index) => {
            const active = item.id === activeId;

            return (
              <button
                key={item.id}
                id={`${panelId}-${item.id}-tab`}
                type="button"
                role="tab"
                aria-controls={panelId}
                aria-selected={active}
                className={itemClass(active)}
                tabIndex={active ? 0 : -1}
                onClick={() => onTabChange(item.id)}
                onKeyDown={(event) => handleKeyDown(index, event)}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
