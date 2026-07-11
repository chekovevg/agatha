"use client";

import {useEffect, useRef, useState} from "react";

import {shouldHideHeader} from "@/components/layout/header-state";

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
      if (window.innerWidth <= 600) {
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
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    cancelAnimationFrame(menuAnimationFrameRef.current);
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
