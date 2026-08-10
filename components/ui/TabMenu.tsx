"use client";

import type {KeyboardEvent} from "react";

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

const containerClass =
  "flex w-[366px] max-w-full items-center justify-center rounded-[5px] bg-[#f7f1e4] p-3";

function itemClass(active: boolean) {
  return cn(
    "mai-ui flex h-[38px] min-w-0 shrink-0 items-center justify-center whitespace-nowrap rounded-[3px] px-[30px] transition-colors duration-[600ms] ease-[var(--alias-easeOut)] hover:bg-[var(--background)] focus-visible:bg-[var(--background)] focus-visible:outline-2 max-[400px]:shrink max-[400px]:px-[27px]",
    active ? "bg-[var(--background)]" : "bg-[#f7f1e4]",
  );
}

export function TabMenu(props: NavigationProps | TabsProps) {
  if (props.mode === "tabs") {
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
      <div
        aria-label={ariaLabel}
        className={containerClass}
        data-testid="home-audience-tabs"
        role="tablist"
      >
        <div className="flex shrink-0 items-center justify-center">
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
    );
  }

  const {ariaLabel, items} = props;

  return (
    <nav
      aria-label={ariaLabel}
      data-testid="booking-tab-menu"
      className={containerClass}
    >
      <div className="flex shrink-0 items-center justify-center">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            aria-current={item.active ? "page" : undefined}
            className={itemClass(item.active)}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
