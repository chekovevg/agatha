"use client";

import {useEffect, useRef} from "react";

import type {ReferenceHeroRenderer} from "@/components/ui/reference-webgl/renderer";

type RendererStatus =
  | "idle"
  | "loading"
  | "ready"
  | "unsupported"
  | "error"
  | "context-lost";

export function ReferenceWebGLHeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let renderer: ReferenceHeroRenderer | null = null;
    let disposed = false;
    let generation = 0;
    let importStarted = false;
    let intersecting = false;
    let scrolling = false;
    let scrollTimer: number | null = null;
    let staticFrameDrawn = false;

    const setStatus = (status: RendererStatus) => {
      canvas.dataset.referenceWebglStatus = status;
    };

    const reconcileMotionState = () => {
      if (!renderer) return;
      const blocked =
        !intersecting || document.visibilityState !== "visible" || scrolling;

      if (reducedMotion.matches) {
        renderer.pause();
        renderer.setPointer(0.5, 0.5);
        if (!staticFrameDrawn) {
          renderer.drawStaticFrame();
          staticFrameDrawn = true;
        }
        return;
      }

      staticFrameDrawn = false;
      if (blocked) renderer.pause();
      else renderer.resume();
    };

    const resize = () => {
      if (!renderer) return;
      const rect = canvas.getBoundingClientRect();
      renderer.resize(rect.width, rect.height);
      staticFrameDrawn = reducedMotion.matches;
    };

    const initialize = async () => {
      if (disposed || importStarted || !intersecting) return;
      importStarted = true;
      const currentGeneration = ++generation;
      setStatus("loading");

      try {
        const {createReferenceHeroRenderer} = await import(
          "./reference-webgl/renderer"
        );
        if (disposed || currentGeneration !== generation) return;
        renderer = createReferenceHeroRenderer(canvas);
        if (!renderer) {
          setStatus("unsupported");
          return;
        }
        resize();
        renderer.drawStaticFrame();
        setStatus("ready");
        reconcileMotionState();
      } catch {
        if (!disposed && currentGeneration === generation) setStatus("error");
      }
    };

    const updatePointer = (event: PointerEvent) => {
      if (!renderer || reducedMotion.matches) return;
      const rect = canvas.getBoundingClientRect();
      renderer.setPointer(
        (event.clientX - rect.left) / Math.max(1, rect.width),
        1 - (event.clientY - rect.top) / Math.max(1, rect.height),
      );
    };
    const updateScroll = () => {
      scrolling = true;
      reconcileMotionState();
      if (scrollTimer !== null) window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        scrolling = false;
        scrollTimer = null;
        reconcileMotionState();
      }, 150);
    };
    const updateVisibility = () => reconcileMotionState();
    const updateReducedMotion = () => {
      staticFrameDrawn = false;
      reconcileMotionState();
    };
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      generation += 1;
      renderer?.destroy();
      renderer = null;
      importStarted = false;
      setStatus("context-lost");
    };
    const handleContextRestored = () => {
      setStatus("idle");
      void initialize();
    };

    const resizeObserver = new ResizeObserver(resize);
    let intersectionObserver: IntersectionObserver | null = null;

    resizeObserver.observe(canvas);
    if ("IntersectionObserver" in window) {
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          intersecting = entry.isIntersecting;
          if (intersecting) void initialize();
          reconcileMotionState();
        },
        {rootMargin: "300px"},
      );
      intersectionObserver.observe(canvas);
    } else {
      intersecting = true;
      void initialize();
    }
    reducedMotion.addEventListener("change", updateReducedMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);
    window.addEventListener("pointermove", updatePointer, {passive: true});
    window.addEventListener("scroll", updateScroll, {passive: true});

    return () => {
      disposed = true;
      generation += 1;
      resizeObserver.disconnect();
      intersectionObserver?.disconnect();
      reducedMotion.removeEventListener("change", updateReducedMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("scroll", updateScroll);
      if (scrollTimer !== null) window.clearTimeout(scrollTimer);
      renderer?.destroy();
    };
  }, []);

  return (
    <div
      className="reference-webgl-hero-bg absolute inset-0 overflow-hidden"
      data-hero-background="reference-webgl"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="reference-webgl-hero-canvas block h-full w-full"
        data-reference-webgl-status="idle"
      />
    </div>
  );
}
