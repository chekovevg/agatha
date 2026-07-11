"use client";

import {useEffect, useState} from "react";

import {AsciiHeroReveal} from "@/components/ui/AsciiHeroReveal";
import {ReferenceWebGLHeroBackground} from "@/components/ui/ReferenceWebGLHeroBackground";
import {WatercolorHeroBackground} from "@/components/ui/WatercolorHeroBackground";
import {WebGLHeroBackground} from "@/components/ui/WebGLHeroBackground";

type HeroBackgroundVariant = "canvas" | "webgl" | "reference-webgl";

function readHeroVariant(): HeroBackgroundVariant {
  if (typeof window === "undefined") return "canvas";

  const value = new URLSearchParams(window.location.search).get("hero");
  return value === "webgl" || value === "reference-webgl" ? value : "canvas";
}

function readHeroCompareEnabled() {
  if (typeof window === "undefined") {
    return false;
  }

  return new URLSearchParams(window.location.search).get("heroCompare") === "1";
}

function readAsciiEnabled() {
  if (typeof window === "undefined") {
    return false;
  }

  const searchParams = new URLSearchParams(window.location.search);

  if (
    searchParams.get("hero") === "webgl" ||
    searchParams.get("hero") === "reference-webgl"
  ) {
    return false;
  }

  if (searchParams.get("ascii") === "1") {
    return true;
  }

  if (searchParams.get("ascii") === "0") {
    return false;
  }

  return (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  );
}

export function HomeHeroBackground() {
  const [variant, setVariant] = useState<HeroBackgroundVariant>("canvas");
  const [isCompareEnabled, setIsCompareEnabled] = useState(false);
  const [isAsciiEnabled, setIsAsciiEnabled] = useState(false);

  useEffect(() => {
    const updateState = () => {
      setVariant(readHeroVariant());
      setIsCompareEnabled(readHeroCompareEnabled());
      setIsAsciiEnabled(readAsciiEnabled());
    };

    updateState();
    window.addEventListener("popstate", updateState);

    return () => window.removeEventListener("popstate", updateState);
  }, []);

  const selectVariant = (nextVariant: HeroBackgroundVariant) => {
    setVariant(nextVariant);
    setIsAsciiEnabled(false);

    const url = new URL(window.location.href);

    if (nextVariant !== "canvas") {
      url.searchParams.set("hero", nextVariant);
      url.searchParams.delete("ascii");
    } else {
      url.searchParams.delete("hero");
      url.searchParams.set("ascii", "0");
    }

    url.searchParams.set("heroCompare", "1");
    window.history.pushState(null, "", url);
  };

  const toggleAscii = () => {
    const nextAsciiState = !isAsciiEnabled;

    setIsAsciiEnabled(nextAsciiState);

    if (nextAsciiState) {
      setVariant("canvas");
    }

    const url = new URL(window.location.href);

    if (nextAsciiState) {
      url.searchParams.delete("ascii");
      url.searchParams.delete("hero");
    } else {
      url.searchParams.set("ascii", "0");
    }

    url.searchParams.set("heroCompare", "1");
    window.history.pushState(null, "", url);
  };

  return (
    <div
      className="contents"
      data-home-hero-background-switcher={
        variant === "canvas" && isAsciiEnabled ? "ascii" : variant
      }
      data-webgl-preview={variant === "canvas" ? "available" : "enabled"}
    >
      {variant === "webgl" ? (
        <WebGLHeroBackground />
      ) : variant === "reference-webgl" ? (
        <ReferenceWebGLHeroBackground />
      ) : (
        <>
          <WatercolorHeroBackground />
          {isAsciiEnabled ? <AsciiHeroReveal /> : null}
        </>
      )}
      {isCompareEnabled ? (
        <div className="hero-background-switcher" aria-label="Hero background">
          <button
            type="button"
            className="hero-background-switcher-button"
            data-active={variant === "canvas" && !isAsciiEnabled}
            aria-pressed={variant === "canvas" && !isAsciiEnabled}
            onClick={() => selectVariant("canvas")}
          >
            Canvas
          </button>
          <button
            type="button"
            className="hero-background-switcher-button"
            data-active={variant === "webgl"}
            aria-pressed={variant === "webgl"}
            onClick={() => selectVariant("webgl")}
          >
            Legacy GL
          </button>
          <button
            type="button"
            className="hero-background-switcher-button"
            data-active={variant === "reference-webgl"}
            aria-pressed={variant === "reference-webgl"}
            onClick={() => selectVariant("reference-webgl")}
          >
            Reference GL
          </button>
          <button
            type="button"
            className="hero-background-switcher-button"
            data-active={variant === "canvas" && isAsciiEnabled}
            aria-pressed={variant === "canvas" && isAsciiEnabled}
            onClick={toggleAscii}
          >
            ASCII
          </button>
        </div>
      ) : null}
    </div>
  );
}
