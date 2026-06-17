"use client";

import {useEffect, useRef} from "react";

type ScrollSection = {
  baseColor: string;
  color: string;
  element: HTMLElement;
  mode: "solid" | "early-pulse" | "center-pulse";
  peakColor: string | null;
};

type RGB = {
  b: number;
  g: number;
  r: number;
};

const DEFAULT_COLOR = "#fef9ed";

function parseColor(color: string): RGB | null {
  const value = color.trim();

  if (value.startsWith("#")) {
    const hex = value.slice(1);
    const full =
      hex.length === 3
        ? hex
            .split("")
            .map((part) => part + part)
            .join("")
        : hex;

    if (full.length !== 6) {
      return null;
    }

    return {
      b: Number.parseInt(full.slice(4, 6), 16),
      g: Number.parseInt(full.slice(2, 4), 16),
      r: Number.parseInt(full.slice(0, 2), 16),
    };
  }

  const rgb = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);

  if (!rgb) {
    return null;
  }

  return {
    b: Number(rgb[3]),
    g: Number(rgb[2]),
    r: Number(rgb[1]),
  };
}

function mixColor(from: string, to: string, amount: number) {
  const start = parseColor(from);
  const end = parseColor(to);

  if (!start || !end) {
    return amount > 0.5 ? to : from;
  }

  const clamped = Math.min(1, Math.max(0, amount));
  const channel = (a: number, b: number) => Math.round(a + (b - a) * clamped);

  return `rgb(${channel(start.r, end.r)}, ${channel(start.g, end.g)}, ${channel(
    start.b,
    end.b,
  )})`;
}

function getActiveSection(sections: ScrollSection[]) {
  const viewportCenter = window.innerHeight / 2;

  return sections.reduce<ScrollSection | null>((active, section) => {
    const rect = section.element.getBoundingClientRect();
    const sectionCenter = rect.top + rect.height / 2;
    const isNearViewport = rect.bottom >= 0 && rect.top <= window.innerHeight;

    if (!isNearViewport) {
      return active;
    }

    if (!active) {
      return section;
    }

    const activeRect = active.element.getBoundingClientRect();
    const activeCenter = activeRect.top + activeRect.height / 2;

    return Math.abs(sectionCenter - viewportCenter) <
      Math.abs(activeCenter - viewportCenter)
      ? section
      : active;
  }, null);
}

function getSectionProgress(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const viewportCenter = window.innerHeight / 2;
  const distance = Math.max(1, rect.height);

  return Math.min(1, Math.max(0, (viewportCenter - rect.top) / distance));
}

function getPulseStrength(section: ScrollSection) {
  const progress = getSectionProgress(section.element);
  const peakAt = section.mode === "early-pulse" ? 0.18 : 0.5;
  const width = section.mode === "early-pulse" ? 0.28 : 0.38;
  const distance = Math.abs(progress - peakAt);

  return Math.max(0, 1 - distance / width);
}

export function HomeScrollBackground() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const shell = layer?.closest<HTMLElement>(".home-reference-shell");

    if (!shell) {
      return;
    }

    const styles = getComputedStyle(shell);
    const baseColor =
      styles.getPropertyValue("--reference-cream").trim() ||
      styles.getPropertyValue("--background-color").trim() ||
      DEFAULT_COLOR;
    const sections: ScrollSection[] = Array.from(
      shell.querySelectorAll<HTMLElement>("[data-scroll-bg]"),
    ).map((element) => {
      const mode: ScrollSection["mode"] =
        element.dataset.scrollBgMode === "early-pulse" ||
        element.dataset.scrollBgMode === "center-pulse"
          ? element.dataset.scrollBgMode
          : "solid";

      return {
        baseColor,
        color: element.dataset.scrollBg ?? baseColor,
        element,
        mode,
        peakColor: element.dataset.scrollBgPeak ?? null,
      };
    });

    if (sections.length === 0) {
      return;
    }

    let frame = 0;
    let lastColor = "";

    const update = () => {
      frame = 0;
      const active = getActiveSection(sections);
      const nextColor =
        active?.peakColor && active.mode !== "solid"
          ? mixColor(active.baseColor, active.peakColor, getPulseStrength(active))
          : active?.color ?? baseColor;

      if (nextColor !== lastColor) {
        shell.style.setProperty("--home-scroll-bg", nextColor);
        lastColor = nextColor;
      }
    };

    const requestUpdate = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(update);
      }
    };

    const observer = new IntersectionObserver(requestUpdate, {
      root: null,
      rootMargin: "-18% 0px -18% 0px",
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    sections.forEach(({element}) => observer.observe(element));
    update();
    window.addEventListener("scroll", requestUpdate, {passive: true});
    window.addEventListener("resize", requestUpdate);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return <div ref={layerRef} aria-hidden="true" className="home-scroll-background" />;
}
