"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import type {SiteContent} from "@/content/types";
import {cn} from "@/lib/utils";

type ValuesContent = SiteContent["home"]["values"];

const SCRIBBLES = [
  {
    d: "M1 37C24.5 23.5 65 2 140.5 2C199.5 2 265.5 32 265.5 76C265.5 111 211.467 137.5 163 137.5C125.5 137.5 79.5 118 79.5 93C79.5 73 103 62.5 135.5 62.5C203 62.5 239 121.5 239 158.5C239 189.5 211 180 211 143.5C211 117.988 241.5 38 406 32.5",
    mode: "connect",
    viewBox: "0 0 407 179",
  },
  {
    d: "M1 20.0006C50.5 4.5 145 0.99977 197 2.50102C149.333 4.16806 51.2 13.7021 28 30.5021C19.7256 36.4939 25.5 39.5105 42 37.5021C74 33.6071 152 11.5021 221.5 11.5021C260 11.5021 282.5 18.001 298.5 24.5021",
    mode: "underline",
    viewBox: "0 0 300 40",
  },
  {
    d: "M1 152C118 176 219.5 121 219.5 85.5C219.5 71.5 207 64.5 187.5 64.5C152.5 64.5 122.5 86.5 122.5 107.5C122.5 133 151 148 196 148C271 148 312.028 95.6215 350 55C393 9 430.5 1.5 457.5 1.5",
    mode: "connect",
    viewBox: "0 0 458 160",
  },
  {
    d: "M1 208L389 2",
    mode: "connect",
    viewBox: "0 0 390 210",
  },
  {
    d: "M449.5 35.1743C310.5 8.12448 2 -0.0414939 2 74.473C2 108.158 58 125 195 125C415 125 503 83.1492 503 48.9544C503 17.8214 450.5 2 368.5 2C269.5 2 175 23.4377 138.5 38.7469",
    mode: "circled",
    viewBox: "0 0 505 127",
  },
  {
    d: "M1.876 57.558L23 89.5C30 72.5 44.5 35 82.2346 1.56918",
    lineJoin: "bevel",
    mode: "start",
    viewBox: "0 0 84 91",
  },
] as const;

const SCRIBBLE_DASH_LENGTH = "1075";

function getViewBoxSize(viewBox: string) {
  const [, , width, height] = viewBox.split(" ").map(Number);

  return {height, width};
}

function getValueEntries(values: ValuesContent) {
  return values.items.map((label, index) => ({
    label,
    text: values.itemTexts?.[index] ?? values.activeText,
  }));
}

function ValuesScribble({
  activeIndex,
  style,
}: {
  activeIndex: number;
  style: CSSProperties;
}) {
  const scribble = SCRIBBLES[activeIndex] ?? SCRIBBLES[0];

  return (
    <svg
      {...{
        "dash-length": SCRIBBLE_DASH_LENGTH,
        mode: scribble.mode,
        shape: "",
      }}
      aria-hidden="true"
      className="pointer-events-none absolute z-0 hidden h-auto overflow-visible min-[861px]:block"
      fill="none"
      strokeDasharray={SCRIBBLE_DASH_LENGTH}
      strokeDashoffset={SCRIBBLE_DASH_LENGTH}
      style={style}
      viewBox={scribble.viewBox}
    >
      <path
        key={activeIndex}
        className="home-values-scribble-path"
        d={scribble.d}
        stroke="var(--ink)"
        strokeLinejoin={"lineJoin" in scribble ? scribble.lineJoin : undefined}
        strokeWidth="3"
        style={
          {
            "--scribble-length": SCRIBBLE_DASH_LENGTH,
          } as CSSProperties
        }
      />
    </svg>
  );
}

export function HomeValuesSection({values}: {values: ValuesContent}) {
  const entries = getValueEntries(values);
  const initialIndex = Math.max(0, values.items.indexOf(values.activeItem));
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [scribbleStyle, setScribbleStyle] = useState<CSSProperties>({});
  const desktopLayoutRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const activeEntry = entries[activeIndex] ?? entries[0];
  const updateScribbleGeometry = useCallback(() => {
    const layout = desktopLayoutRef.current;
    const item = itemRefs.current[activeIndex];
    const panel = panelRef.current;
    const scribble = SCRIBBLES[activeIndex] ?? SCRIBBLES[0];

    if (!layout || !item || !panel) {
      return;
    }

    const layoutRect = layout.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const itemLeft = itemRect.left - layoutRect.left;
    const itemRight = itemRect.right - layoutRect.left;
    const itemTop = itemRect.top - layoutRect.top;
    const panelLeft = panelRect.left - layoutRect.left;
    const {height: viewBoxHeight, width: viewBoxWidth} = getViewBoxSize(
      scribble.viewBox,
    );
    const heightForWidth = (width: number) =>
      (width * viewBoxHeight) / viewBoxWidth;
    let left = itemRight;
    let top = itemTop;
    let width = Math.max(96, panelLeft - itemRight);
    let height = heightForWidth(width);

    if (scribble.mode === "underline") {
      width = itemRect.width * 1.2;
      height = heightForWidth(width);
      left = itemLeft;
      top = itemTop + itemRect.height * 0.62;
    } else if (scribble.mode === "circled") {
      width = itemRect.width;
      height = heightForWidth(width);
      left = itemLeft;
      top = itemTop - height * 0.38;
    } else if (scribble.mode === "start") {
      width = Math.max(44, Math.min(70, layoutRect.width * 0.042));
      height = heightForWidth(width);
      left = itemLeft - width;
      top = itemTop - height * 0.18;
    } else if (activeIndex === 0) {
      top = itemTop - height * 0.22;
    } else if (activeIndex === 2) {
      top = itemTop - height * 0.42;
    } else {
      top = itemTop - height * 0.55;
    }

    setScribbleStyle({
      left,
      top,
      width,
    });
  }, [activeIndex]);

  useLayoutEffect(() => {
    updateScribbleGeometry();
  }, [updateScribbleGeometry]);

  useLayoutEffect(() => {
    const layout = desktopLayoutRef.current;

    if (!layout) {
      return;
    }

    const observer = new ResizeObserver(updateScribbleGeometry);
    observer.observe(layout);
    window.addEventListener("resize", updateScribbleGeometry);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScribbleGeometry);
    };
  }, [updateScribbleGeometry]);

  return (
    <section
      className="editorial-container mt-[194px] grid justify-items-center gap-[72px] text-[var(--ink)] min-[861px]:mt-0 min-[861px]:gap-[96px]"
      aria-labelledby="home-values-title"
      data-reference-section="values"
      data-scroll-bg="#fef9ed"
      data-scroll-bg-mode="early-pulse"
      data-scroll-bg-peak="#f4e8c8"
    >
      <h2
        id="home-values-title"
        className="mai-h4 text-center"
      >
        {values.heading}
      </h2>

      <div className="relative w-full max-w-[1288px]">
        <div
          ref={desktopLayoutRef}
          className="relative hidden min-h-[460px] w-full min-[861px]:grid min-[861px]:grid-cols-[minmax(260px,340px)_minmax(250px,1fr)_minmax(360px,613px)] min-[861px]:items-start min-[861px]:gap-8 lg:gap-12"
        >
          <ValuesScribble activeIndex={activeIndex} style={scribbleStyle} />

          <ul
            aria-label={values.heading}
            className="mai-h3 relative z-10 grid content-start pt-[46px]"
            role="tablist"
          >
            {entries.map((entry, index) => {
              const isActive = index === activeIndex;

              return (
                <li key={entry.label}>
                  <button
                    ref={(element) => {
                      itemRefs.current[index] = element;
                    }}
                    aria-controls="home-values-panel"
                    aria-selected={isActive}
                    className={cn(
                      "block cursor-pointer appearance-none bg-transparent p-0 text-left transition-opacity duration-[600ms] ease-out focus-visible:opacity-100",
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
            ref={panelRef}
            className="relative z-10 col-start-3 min-h-[360px] pt-[45px]"
            id="home-values-panel"
            role="tabpanel"
            aria-labelledby={`home-values-tab-${activeIndex}`}
          >
            <p
              key={activeEntry.label}
              className="mai-h5 home-values-copy-appear max-w-[613px]"
            >
              {activeEntry.text}
            </p>
          </div>
        </div>

        <div className="grid w-full gap-0 min-[861px]:hidden">
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
              <p className="mai-text-large-alt">
                {entry.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
