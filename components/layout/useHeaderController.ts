"use client";

import {useEffect, useRef, useState} from "react";

import {
  MOBILE_HEADER_MAX_WIDTH,
  shouldHideHeader,
} from "@/components/layout/header-state";

type MenuState = "closed" | "opening" | "open" | "closing";

export function useHeaderController() {
  const [menuState, setMenuState] = useState<MenuState>("closed");
  const [headerHidden, setHeaderHidden] = useState(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuAnimationFrameRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const scrollTickingRef = useRef(false);
  const menuVisible = menuState !== "closed";
  const menuExpanded = menuState === "open";

  useEffect(() => {
    if (!menuVisible) return;
    const mobile = window.matchMedia(`(max-width: ${MOBILE_HEADER_MAX_WIDTH}px)`);
    const previousOverflow = document.body.style.overflow;
    function syncViewport() {
      document.body.style.overflow = mobile.matches ? "hidden" : previousOverflow;
      if (!mobile.matches) setMenuState("closed");
    }
    syncViewport();
    mobile.addEventListener("change", syncViewport);
    return () => {
      document.body.style.overflow = previousOverflow;
      mobile.removeEventListener("change", syncViewport);
    };
  }, [menuVisible]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }

      cancelAnimationFrame(menuAnimationFrameRef.current);
    };
  }, []);

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;
    let scrollAnimationFrame = 0;

    function updateHeaderVisibility() {
      const nextScrollY = Math.max(window.scrollY, 0);
      const nextHidden = shouldHideHeader({
        currentScrollY: nextScrollY,
        lastScrollY: lastScrollYRef.current,
        viewportWidth: window.innerWidth,
        menuVisible,
      });

      if (nextHidden !== null) {
        setHeaderHidden(nextHidden);
      }

      lastScrollYRef.current = nextScrollY;
      scrollTickingRef.current = false;
    }

    function handleScroll() {
      if (scrollTickingRef.current) {
        return;
      }

      scrollTickingRef.current = true;
      scrollAnimationFrame = requestAnimationFrame(updateHeaderVisibility);
    }

    function handleResize() {
      if (window.innerWidth > MOBILE_HEADER_MAX_WIDTH && menuVisible) {
        if (closeTimerRef.current) {
          clearTimeout(closeTimerRef.current);
          closeTimerRef.current = null;
        }

        cancelAnimationFrame(menuAnimationFrameRef.current);
        setMenuState("closed");
        return;
      }

      if (window.innerWidth <= MOBILE_HEADER_MAX_WIDTH) {
        setHeaderHidden(false);
      }
    }

    window.addEventListener("scroll", handleScroll, {passive: true});
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(scrollAnimationFrame);
    };
  }, [menuVisible]);

  function openMenu() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    cancelAnimationFrame(menuAnimationFrameRef.current);
    setHeaderHidden(false);
    setMenuState("opening");
    menuAnimationFrameRef.current = requestAnimationFrame(() => {
      menuAnimationFrameRef.current = 0;
      setMenuState("open");
    });
  }

  function closeMenu() {
    if (!menuVisible) return;
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    cancelAnimationFrame(menuAnimationFrameRef.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMenuState("closed");
      return;
    }
    setMenuState("closing");
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      setMenuState("closed");
    }, 700);
  }

  return {
    closeMenu,
    headerHidden,
    menuExpanded,
    menuState,
    menuVisible,
    openMenu,
  };
}
