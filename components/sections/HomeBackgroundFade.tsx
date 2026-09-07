"use client";

import {useEffect} from "react";

export function HomeBackgroundFade() {
  useEffect(() => {
    const shell = document.querySelector<HTMLElement>(".home-page-shell");
    if (!shell) return;
    const sections = Array.from(shell.querySelectorAll<HTMLElement>("[data-home-tone]"));
    let frame = 0;

    function update() {
      frame = 0;
      const center = window.innerHeight / 2;
      const active = sections.find((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= center && bounds.bottom >= center;
      });
      if (active?.dataset.homeTone) {
        shell!.style.setProperty("--home-page-background", active.dataset.homeTone);
      } else {
        shell!.style.removeProperty("--home-page-background");
      }
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", schedule, {passive: true});
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    sections.forEach((section) => observer.observe(section));
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      cancelAnimationFrame(frame);
      shell.style.removeProperty("--home-page-background");
    };
  }, []);

  return null;
}
