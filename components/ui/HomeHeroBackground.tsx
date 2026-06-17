"use client";

import {useEffect, useState} from "react";

import {AsciiHeroReveal} from "@/components/ui/AsciiHeroReveal";
import {WatercolorHeroBackground} from "@/components/ui/WatercolorHeroBackground";
import {WebGLHeroBackground} from "@/components/ui/WebGLHeroBackground";

type HeroBackgroundVariant = "canvas" | "webgl";

function readHeroVariant(): HeroBackgroundVariant {
  if (typeof window === "undefined") {
    return "canvas";
  }

  return new URLSearchParams(window.location.search).get("hero") === "webgl"
    ? "webgl"
    : "canvas";
}

function readHeroCompareEnabled() {
  if (typeof window === "undefined") {
    return false;
  }

  return new URLSearchParams(window.location.search).get("heroCompare") === "1";
}

function readAsciiEnabled() {
  if (typeof window === "undefined") {
    return true;
  }

  const searchParams = new URLSearchParams(window.location.search);

  if (searchParams.get("hero") === "webgl") {
    return false;
  }

  return searchParams.get("ascii") !== "0";
}

export function HomeHeroBackground() {
  const [variant, setVariant] = useState<HeroBackgroundVariant>("canvas");
  const [isCompareEnabled, setIsCompareEnabled] = useState(false);
  const [isAsciiEnabled, setIsAsciiEnabled] = useState(true);

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

    if (nextVariant === "webgl") {
      url.searchParams.set("hero", "webgl");
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
      data-webgl-preview={variant === "webgl" ? "enabled" : "available"}
    >
      {variant === "webgl" ? (
        <WebGLHeroBackground />
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
            WebGL
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
