"use client";

import {useEffect, useRef} from "react";

type Wash = {
  color: string;
  x: number;
  y: number;
  rx: number;
  ry: number;
  rotation: number;
  phase: number;
  speed: number;
};

type MotionState = {
  x: number;
  y: number;
  scroll: number;
};

const TAU = Math.PI * 2;

const washes: Wash[] = [
  {
    color: "rgba(255, 183, 139, 0.54)",
    x: 0.25,
    y: 0.18,
    rx: 0.11,
    ry: 0.036,
    rotation: -0.78,
    phase: 0.4,
    speed: 0.00011,
  },
  {
    color: "rgba(255, 185, 139, 0.62)",
    x: 0.47,
    y: 0.18,
    rx: 0.16,
    ry: 0.052,
    rotation: -0.86,
    phase: 1.9,
    speed: 0.00008,
  },
  {
    color: "rgba(255, 178, 132, 0.7)",
    x: 0.59,
    y: 0.32,
    rx: 0.18,
    ry: 0.056,
    rotation: -0.82,
    phase: 2.7,
    speed: 0.00009,
  },
  {
    color: "rgba(255, 180, 132, 0.72)",
    x: 0.7,
    y: 0.22,
    rx: 0.12,
    ry: 0.05,
    rotation: -0.9,
    phase: 3.5,
    speed: 0.00007,
  },
  {
    color: "rgba(255, 190, 146, 0.48)",
    x: 0.82,
    y: 0.28,
    rx: 0.095,
    ry: 0.034,
    rotation: -0.72,
    phase: 4.4,
    speed: 0.00006,
  },
  {
    color: "rgba(255, 184, 138, 0.5)",
    x: 0.18,
    y: 0.5,
    rx: 0.13,
    ry: 0.04,
    rotation: -0.86,
    phase: 5.8,
    speed: 0.0001,
  },
  {
    color: "rgba(255, 170, 128, 0.66)",
    x: 0.42,
    y: 0.55,
    rx: 0.14,
    ry: 0.048,
    rotation: -0.76,
    phase: 6.6,
    speed: 0.00007,
  },
  {
    color: "rgba(255, 180, 134, 0.76)",
    x: 0.57,
    y: 0.53,
    rx: 0.2,
    ry: 0.064,
    rotation: -0.82,
    phase: 7.2,
    speed: 0.00008,
  },
  {
    color: "rgba(255, 169, 126, 0.68)",
    x: 0.68,
    y: 0.48,
    rx: 0.13,
    ry: 0.045,
    rotation: -0.95,
    phase: 8.1,
    speed: 0.00009,
  },
  {
    color: "rgba(255, 186, 144, 0.5)",
    x: 0.82,
    y: 0.54,
    rx: 0.11,
    ry: 0.032,
    rotation: -0.72,
    phase: 9.2,
    speed: 0.00006,
  },
  {
    color: "rgba(255, 177, 132, 0.58)",
    x: 0.33,
    y: 0.7,
    rx: 0.12,
    ry: 0.044,
    rotation: -0.82,
    phase: 10.1,
    speed: 0.00008,
  },
  {
    color: "rgba(255, 181, 136, 0.72)",
    x: 0.52,
    y: 0.76,
    rx: 0.16,
    ry: 0.054,
    rotation: -0.78,
    phase: 10.9,
    speed: 0.00007,
  },
  {
    color: "rgba(255, 193, 150, 0.54)",
    x: 0.73,
    y: 0.79,
    rx: 0.18,
    ry: 0.056,
    rotation: -0.78,
    phase: 11.6,
    speed: 0.00007,
  },
  {
    color: "rgba(255, 187, 143, 0.48)",
    x: 0.91,
    y: 0.83,
    rx: 0.13,
    ry: 0.044,
    rotation: -0.72,
    phase: 12.4,
    speed: 0.00006,
  },
  {
    color: "rgba(255, 181, 138, 0.38)",
    x: 0.09,
    y: 0.92,
    rx: 0.075,
    ry: 0.026,
    rotation: -0.78,
    phase: 13.2,
    speed: 0.00008,
  },
  {
    color: "rgba(255, 196, 154, 0.38)",
    x: 0.94,
    y: 0.46,
    rx: 0.07,
    ry: 0.025,
    rotation: -0.72,
    phase: 14.1,
    speed: 0.00007,
  },
];

const streaks: Wash[] = [
  {
    color: "rgba(255, 189, 144, 0.68)",
    x: 0.18,
    y: 0.22,
    rx: 0.052,
    ry: 0.017,
    rotation: -0.82,
    phase: 0.7,
    speed: 0.00009,
  },
  {
    color: "rgba(255, 183, 136, 0.76)",
    x: 0.31,
    y: 0.26,
    rx: 0.086,
    ry: 0.026,
    rotation: -0.84,
    phase: 1.2,
    speed: 0.00008,
  },
  {
    color: "rgba(255, 196, 148, 0.7)",
    x: 0.48,
    y: 0.2,
    rx: 0.12,
    ry: 0.036,
    rotation: -0.9,
    phase: 1.8,
    speed: 0.00007,
  },
  {
    color: "rgba(255, 183, 137, 0.74)",
    x: 0.62,
    y: 0.17,
    rx: 0.088,
    ry: 0.028,
    rotation: -0.78,
    phase: 2.3,
    speed: 0.00008,
  },
  {
    color: "rgba(255, 190, 145, 0.62)",
    x: 0.76,
    y: 0.27,
    rx: 0.078,
    ry: 0.022,
    rotation: -0.76,
    phase: 3.1,
    speed: 0.00009,
  },
  {
    color: "rgba(255, 184, 138, 0.6)",
    x: 0.91,
    y: 0.32,
    rx: 0.05,
    ry: 0.018,
    rotation: -0.7,
    phase: 3.8,
    speed: 0.00007,
  },
  {
    color: "rgba(255, 177, 130, 0.72)",
    x: 0.28,
    y: 0.47,
    rx: 0.086,
    ry: 0.025,
    rotation: -0.86,
    phase: 4.4,
    speed: 0.00008,
  },
  {
    color: "rgba(255, 186, 140, 0.78)",
    x: 0.42,
    y: 0.48,
    rx: 0.105,
    ry: 0.032,
    rotation: -0.84,
    phase: 5.0,
    speed: 0.00008,
  },
  {
    color: "rgba(255, 177, 130, 0.8)",
    x: 0.58,
    y: 0.43,
    rx: 0.12,
    ry: 0.036,
    rotation: -0.88,
    phase: 5.6,
    speed: 0.00007,
  },
  {
    color: "rgba(255, 188, 143, 0.72)",
    x: 0.7,
    y: 0.45,
    rx: 0.072,
    ry: 0.023,
    rotation: -0.76,
    phase: 6.3,
    speed: 0.00009,
  },
  {
    color: "rgba(255, 182, 136, 0.62)",
    x: 0.84,
    y: 0.55,
    rx: 0.062,
    ry: 0.02,
    rotation: -0.72,
    phase: 7.1,
    speed: 0.00008,
  },
  {
    color: "rgba(255, 169, 125, 0.64)",
    x: 0.18,
    y: 0.7,
    rx: 0.065,
    ry: 0.023,
    rotation: -0.86,
    phase: 7.8,
    speed: 0.00009,
  },
  {
    color: "rgba(255, 188, 142, 0.74)",
    x: 0.34,
    y: 0.7,
    rx: 0.092,
    ry: 0.03,
    rotation: -0.84,
    phase: 8.4,
    speed: 0.00008,
  },
  {
    color: "rgba(255, 178, 131, 0.78)",
    x: 0.49,
    y: 0.76,
    rx: 0.11,
    ry: 0.034,
    rotation: -0.84,
    phase: 9.0,
    speed: 0.00007,
  },
  {
    color: "rgba(255, 190, 146, 0.68)",
    x: 0.64,
    y: 0.72,
    rx: 0.085,
    ry: 0.028,
    rotation: -0.78,
    phase: 9.8,
    speed: 0.00008,
  },
  {
    color: "rgba(255, 184, 138, 0.62)",
    x: 0.78,
    y: 0.83,
    rx: 0.11,
    ry: 0.034,
    rotation: -0.78,
    phase: 10.5,
    speed: 0.00007,
  },
  {
    color: "rgba(255, 196, 152, 0.56)",
    x: 0.94,
    y: 0.83,
    rx: 0.07,
    ry: 0.024,
    rotation: -0.7,
    phase: 11.4,
    speed: 0.00008,
  },
];

function drawBackground(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  motion: MotionState,
) {
  const shortSide = Math.min(width, height);
  const parallaxX = motion.x * width * 0.036;
  const parallaxY = motion.y * height * 0.028;
  const scrollShift = motion.scroll * height * 0.08;

  context.clearRect(0, 0, width, height);

  const base = context.createLinearGradient(
    parallaxX * -0.7,
    parallaxY * -0.7,
    width + parallaxX,
    height + parallaxY,
  );
  base.addColorStop(0, "#c77971");
  base.addColorStop(0.42, "#d48778");
  base.addColorStop(0.76, "#cf8277");
  base.addColorStop(1, "#bd7871");
  context.fillStyle = base;
  context.fillRect(0, 0, width, height);

  const light = context.createRadialGradient(
    width * 0.5 + parallaxX * 0.4,
    height * 0.36 + parallaxY * 0.35 - scrollShift * 0.25,
    shortSide * 0.05,
    width * 0.5 + parallaxX * 0.4,
    height * 0.36 + parallaxY * 0.35 - scrollShift * 0.25,
    shortSide * 0.76,
  );
  light.addColorStop(0, "rgba(254, 249, 237, 0.035)");
  light.addColorStop(0.54, "rgba(255, 194, 146, 0.045)");
  light.addColorStop(1, "rgba(254, 249, 237, 0)");
  context.fillStyle = light;
  context.fillRect(0, 0, width, height);

  context.save();
  context.globalCompositeOperation = "source-over";
  context.filter = `blur(${Math.max(10, shortSide * 0.014)}px)`;

  for (const wash of washes) {
    const drift = Math.sin(time * wash.speed + wash.phase);
    const crossDrift = Math.cos(time * wash.speed * 0.7 + wash.phase);
    const x =
      width * wash.x + drift * width * 0.026 + parallaxX * (0.35 + wash.x);
    const y =
      height * wash.y +
      crossDrift * height * 0.024 +
      parallaxY * (0.45 + wash.y) -
      scrollShift * (0.18 + wash.y * 0.22);
    const rotation = wash.rotation + drift * 0.07;

    context.save();
    context.translate(x, y);
    context.rotate(rotation);

    context.fillStyle = wash.color;
    context.beginPath();
    context.ellipse(0, 0, width * wash.rx, height * wash.ry, 0, 0, TAU);
    context.fill();

    context.fillStyle = "rgba(255, 220, 178, 0.18)";
    context.beginPath();
    context.ellipse(
      shortSide * 0.01,
      shortSide * -0.004,
      width * wash.rx * 0.68,
      height * wash.ry * 0.72,
      0,
      0,
      TAU,
    );
    context.fill();

    context.restore();
  }

  context.restore();

  context.save();
  context.globalCompositeOperation = "source-over";
  context.filter = `blur(${Math.max(5, shortSide * 0.0065)}px)`;

  for (const streak of streaks) {
    const drift = Math.sin(time * streak.speed + streak.phase);
    const crossDrift = Math.cos(time * streak.speed * 0.7 + streak.phase);
    const x =
      width * streak.x + drift * width * 0.014 + parallaxX * (0.2 + streak.x);
    const y =
      height * streak.y +
      crossDrift * height * 0.014 +
      parallaxY * (0.26 + streak.y) -
      scrollShift * (0.12 + streak.y * 0.14);
    const rotation = streak.rotation + drift * 0.05;

    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.fillStyle = streak.color;
    context.beginPath();
    context.ellipse(
      0,
      0,
      width * streak.rx * 1.24,
      height * streak.ry * 1.16,
      0,
      0,
      TAU,
    );
    context.fill();

    context.fillStyle = "rgba(255, 223, 181, 0.22)";
    context.beginPath();
    context.ellipse(
      shortSide * 0.008,
      0,
      width * streak.rx * 0.62,
      height * streak.ry * 0.62,
      0,
      0,
      TAU,
    );
    context.fill();
    context.restore();
  }

  context.restore();

  const vignette = context.createRadialGradient(
    width * 0.5 + parallaxX * 0.16,
    height * 0.46 + parallaxY * 0.14,
    shortSide * 0.22,
    width * 0.5 + parallaxX * 0.16,
    height * 0.46 + parallaxY * 0.14,
    shortSide * 0.9,
  );
  vignette.addColorStop(0, "rgba(93, 82, 75, 0)");
  vignette.addColorStop(0.78, "rgba(93, 82, 75, 0.14)");
  vignette.addColorStop(1, "rgba(93, 82, 75, 0.28)");
  context.fillStyle = vignette;
  context.fillRect(0, 0, width, height);
}

export function WatercolorHeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", {alpha: false});

    if (!canvas || !context) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let canvasWidth = 0;
    let canvasHeight = 0;
    const motion: MotionState = {x: 0, y: 0, scroll: 0};
    let pointerX = 0;
    let pointerY = 0;
    let scrollProgress = 0;

    const updatePointer = (event: PointerEvent) => {
      pointerX = (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      pointerY = (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    };

    const updateScroll = () => {
      const hero = canvas.closest("[data-home-hero]") as HTMLElement | null;
      const rect = (hero ?? canvas).getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight);
      scrollProgress = Math.min(1, Math.max(0, -rect.top / distance));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvasWidth = Math.max(1, rect.width);
      canvasHeight = Math.max(1, rect.height);
      const resolution = Math.max(
        0.5,
        Math.min(1.15, window.devicePixelRatio * 0.58),
      );

      canvas.width = Math.round(canvasWidth * resolution);
      canvas.height = Math.round(canvasHeight * resolution);
      context.setTransform(resolution, 0, 0, resolution, 0, 0);
      updateScroll();
      drawBackground(context, canvasWidth, canvasHeight, 0, motion);
    };

    const render = (time: number) => {
      motion.x += (pointerX - motion.x) * 0.055;
      motion.y += (pointerY - motion.y) * 0.055;
      motion.scroll += (scrollProgress - motion.scroll) * 0.05;
      drawBackground(context, canvasWidth, canvasHeight, time, motion);

      if (!mediaQuery.matches && document.visibilityState === "visible") {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const start = () => {
      window.cancelAnimationFrame(animationFrame);

      if (mediaQuery.matches || document.visibilityState !== "visible") {
        drawBackground(context, canvasWidth, canvasHeight, 0, {
          x: 0,
          y: 0,
          scroll: 0,
        });
        return;
      }

      animationFrame = window.requestAnimationFrame(render);
    };

    const observer = new ResizeObserver(() => {
      resize();
      start();
    });

    resize();
    observer.observe(canvas);
    mediaQuery.addEventListener("change", start);
    document.addEventListener("visibilitychange", start);
    window.addEventListener("pointermove", updatePointer, {passive: true});
    window.addEventListener("scroll", updateScroll, {passive: true});
    start();

    return () => {
      observer.disconnect();
      mediaQuery.removeEventListener("change", start);
      document.removeEventListener("visibilitychange", start);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("scroll", updateScroll);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <div className="watercolor-hero-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="watercolor-hero-canvas" />
    </div>
  );
}
