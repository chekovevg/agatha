"use client";

import {useState, type CSSProperties} from "react";

import type {SiteContent} from "@/content/types";
import {cn} from "@/lib/utils";

type ValuesContent = SiteContent["home"]["values"];

const SCRIBBLES = [
  {
    d: "M205 88C268 48 395 52 432 97C466 137 413 178 334 168C282 162 258 133 279 106C310 67 427 93 505 136C571 172 628 112 712 100",
    length: "980",
  },
  {
    d: "M0 155C54 137 150 132 229 139C168 144 54 158 18 181C0 193 26 199 75 190C126 181 190 158 270 160",
    length: "620",
  },
  {
    d: "M214 212C296 190 410 190 452 227C489 259 438 309 343 299C291 294 262 266 283 239C314 199 435 230 518 281C592 326 638 226 720 210",
    length: "1040",
  },
  {
    d: "M255 312L720 152",
    length: "520",
  },
  {
    d: "M582 302C448 266 151 257 140 333C134 375 203 401 353 397C562 391 682 351 672 307C665 274 594 250 459 258C338 265 228 295 193 332",
    length: "980",
  },
  {
    d: "M198 401L263 443C314 339 447 248 720 214",
    length: "720",
  },
] as const;

function getValueEntries(values: ValuesContent) {
  return values.items.map((label, index) => ({
    label,
    text: values.itemTexts?.[index] ?? values.activeText,
  }));
}

function ValuesScribble({activeIndex}: {activeIndex: number}) {
  const scribble = SCRIBBLES[activeIndex] ?? SCRIBBLES[0];

  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full overflow-visible md:block"
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 1000 460"
    >
      <path
        key={activeIndex}
        className="home-values-scribble-path"
        d={scribble.d}
        pathLength={Number(scribble.length)}
        stroke="var(--ink)"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
        style={
          {
            "--scribble-length": scribble.length,
          } as CSSProperties
        }
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function HomeValuesSection({values}: {values: ValuesContent}) {
  const entries = getValueEntries(values);
  const initialIndex = Math.max(0, values.items.indexOf(values.activeItem));
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const activeEntry = entries[activeIndex] ?? entries[0];

  return (
    <section
      className="editorial-container grid justify-items-center gap-[72px] text-[var(--ink)] md:gap-[96px]"
      aria-labelledby="home-values-title"
    >
      <h2
        id="home-values-title"
        className="font-display text-center text-[42px] leading-none tracking-[0] md:text-[62px]"
      >
        {values.heading}
      </h2>

      <div className="relative w-full max-w-[1288px]">
        <div className="relative hidden min-h-[460px] w-full md:grid md:grid-cols-[minmax(260px,340px)_minmax(250px,1fr)_minmax(360px,613px)] md:items-start md:gap-8 lg:gap-12">
          <ValuesScribble activeIndex={activeIndex} />

          <ul
            aria-label={values.heading}
            className="relative z-10 grid content-start pt-[46px] font-display text-[48px] leading-[0.98] tracking-[0] lg:text-[54px] xl:text-[62px]"
            role="tablist"
          >
            {entries.map((entry, index) => {
              const isActive = index === activeIndex;

              return (
                <li key={entry.label}>
                  <button
                    aria-controls="home-values-panel"
                    aria-selected={isActive}
                    className={cn(
                      "block cursor-pointer appearance-none bg-transparent p-0 text-left leading-[0.98] tracking-[0] transition-opacity duration-[600ms] ease-out focus-visible:opacity-100",
                      isActive
                        ? "text-[var(--ink)] opacity-100"
                        : "text-[var(--fog)] opacity-55 hover:opacity-100",
                    )}
                    id={`home-values-tab-${index}`}
                    onClick={() => setActiveIndex(index)}
                    onFocus={() => setActiveIndex(index)}
                    onMouseEnter={() => setActiveIndex(index)}
                    role="tab"
                    type="button"
                  >
                    {entry.label}
                  </button>
                </li>
              );
            })}
          </ul>

          <div
            className="relative z-10 col-start-3 min-h-[360px] pt-[45px]"
            id="home-values-panel"
            role="tabpanel"
            aria-labelledby={`home-values-tab-${activeIndex}`}
          >
            <p
              key={activeEntry.label}
              className="home-values-copy-appear max-w-[613px] font-display text-[32px] leading-[1.12] tracking-[0] lg:text-[38px] xl:text-[42px]"
            >
              {activeEntry.text}
            </p>
          </div>
        </div>

        <div className="grid w-full gap-0 md:hidden">
          {entries.map((entry, index) => (
            <article
              className={cn(
                "border-b border-[rgba(93,82,75,0.24)] pb-10",
                index > 0 && "pt-10",
              )}
              key={entry.label}
            >
              <h3 className="mai-ui mb-6 inline-block rounded-[5px] bg-[var(--ink)] px-[18px] py-[14px] text-[var(--parchment-white)]">
                {entry.label}
              </h3>
              <p className="font-display text-[25px] leading-[1.18] tracking-[0]">
                {entry.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
