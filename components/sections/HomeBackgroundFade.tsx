"use client";

import {useEffect} from "react";

const restingColor = "#fef9ee";

export function HomeBackgroundFade() {
  useEffect(() => {
    const shell = document.querySelector<HTMLElement>(
      "[data-home-background-fade]",
    );
    const hero = document.querySelector<HTMLElement>("[data-home-hero]");

    if (!shell || !hero) {
      return;
    }

    const activeColor = hero.dataset.bgFade ?? restingColor;
    let frameId: number | null = null;

    const update = () => {
      frameId = null;
      const bounds = hero.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const isActive =
        bounds.top <= viewportCenter && bounds.bottom >= viewportCenter;

      shell.style.setProperty(
        "--home-page-background",
        isActive ? activeColor : restingColor,
      );
    };

    const scheduleUpdate = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, {passive: true});
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      shell.style.removeProperty("--home-page-background");
    };
  }, []);

  return null;
}
