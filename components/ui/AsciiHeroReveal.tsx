"use client";

import {useEffect, useRef} from "react";

const asciiClusters = [
  {
    className: "ascii-hero-cluster ascii-hero-cluster-left",
    lines: [
      "scale: c d e f g a b",
      "  degree: 1 2 3 4 5",
      "  mode: ionian",
      "  interval: m3 -> P5",
      "  cadence: ii V I",
      "  tonic = c",
    ],
  },
  {
    className: "ascii-hero-cluster ascii-hero-cluster-low",
    lines: [
      "breath.support = steady",
      "  air -> tone",
      "  embouchure: open",
      "  vibrato: slow",
      "  dynamic: pp < mf",
      "  release: soft",
    ],
  },
  {
    className: "ascii-hero-cluster ascii-hero-cluster-right",
    lines: [
      "flute.register.high",
      "  octave_key: none",
      "  angle: 42deg",
      "  tongue: tu du",
      "  slur: legato",
      "  phrase: 4 bars",
    ],
  },
  {
    className: "ascii-hero-cluster ascii-hero-cluster-far",
    lines: [
      "circle:",
      " c g d a",
      " e b f#",
      "  key: g",
      "  one sharp",
      "  leading tone",
    ],
  },
  {
    className: "ascii-hero-cluster ascii-hero-cluster-top",
    lines: [
      "meter: 3/4",
      "  pulse: 1 2 3",
      "  tempo: andante",
      "  rest: quarter",
      "  pickup: eighth",
    ],
  },
  {
    className: "ascii-hero-cluster ascii-hero-cluster-mid",
    lines: [
      "fingering:",
      "  lh: 1 2 3",
      "  rh: 1 2 3",
      "  trill: a-b",
      "  balance: light",
    ],
  },
  {
    className: "ascii-hero-cluster ascii-hero-cluster-lower-right",
    lines: [
      "arpeggio: I iii V",
      "  root third fifth",
      "  inversion: 6",
      "  resolve -> tonic",
      "  listen first",
    ],
  },
  {
    className: "ascii-hero-cluster ascii-hero-cluster-edge",
    lines: [
      "tone color:",
      "  warm",
      "  clear",
      "  centered",
      "  no tension",
      "  air column",
    ],
  },
  {
    className: "ascii-hero-cluster ascii-hero-cluster-a",
    lines: [
      "major scale:",
      "  w w h w w w h",
      "  solfege: do re mi",
      "  leading tone -> do",
    ],
  },
  {
    className: "ascii-hero-cluster ascii-hero-cluster-b",
    lines: [
      "minor:",
      "  natural",
      "  harmonic: #7",
      "  melodic: #6 #7",
    ],
  },
  {
    className: "ascii-hero-cluster ascii-hero-cluster-c",
    lines: [
      "articulation:",
      "  tu tu du",
      "  staccato . . .",
      "  tenuto: ----",
    ],
  },
  {
    className: "ascii-hero-cluster ascii-hero-cluster-d",
    lines: [
      "recorder:",
      "  thumb: half",
      "  fork: f",
      "  low c: cover",
    ],
  },
  {
    className: "ascii-hero-cluster ascii-hero-cluster-e",
    lines: [
      "intervals:",
      "  m2 M2 m3 M3",
      "  P4 tritone P5",
      "  octave: 8va",
    ],
  },
  {
    className: "ascii-hero-cluster ascii-hero-cluster-f",
    lines: [
      "rhythm:",
      "  q q h",
      "  e e q q",
      "  syncopation",
    ],
  },
  {
    className: "ascii-hero-cluster ascii-hero-cluster-g",
    lines: [
      "flute tone:",
      "  aim air edge",
      "  aperture: small",
      "  jaw: free",
    ],
  },
  {
    className: "ascii-hero-cluster ascii-hero-cluster-h",
    lines: [
      "harmony:",
      "  I IV V I",
      "  ii6 V7 I",
      "  common tone",
    ],
  },
  {
    className: "ascii-hero-cluster ascii-hero-cluster-i",
    lines: [
      "ear training:",
      "  sing tonic",
      "  hear fifth",
      "  match pitch",
    ],
  },
  {
    className: "ascii-hero-cluster ascii-hero-cluster-j",
    lines: [
      "practice:",
      "  slow loop",
      "  one bar",
      "  then connect",
    ],
  },
  {
    className: "ascii-hero-cluster ascii-hero-cluster-k",
    lines: [
      "phrase mark:",
      "  breathe here",
      "  shape line",
      "  no rush",
    ],
  },
  {
    className: "ascii-hero-cluster ascii-hero-cluster-l",
    lines: [
      "ornaments:",
      "  trill",
      "  mordent",
      "  turn",
    ],
  },
  {
    className: "ascii-hero-cluster ascii-hero-cluster-m",
    lines: [
      "sight read:",
      "  key first",
      "  count rests",
      "  scan leaps",
    ],
  },
  {
    className: "ascii-hero-cluster ascii-hero-cluster-n",
    lines: [
      "ensemble:",
      "  listen left",
      "  blend",
      "  tune thirds",
    ],
  },
  {
    className: "ascii-hero-cluster ascii-hero-cluster-o",
    lines: [
      "breath plan:",
      "  inhale low",
      "  release ribs",
      "  quiet start",
    ],
  },
  {
    className: "ascii-hero-cluster ascii-hero-cluster-p",
    lines: [
      "note names:",
      "  a b c d e f g",
      "  ledger lines",
      "  clef: treble",
    ],
  },
];

export function AsciiHeroReveal() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const hero = layer?.closest("[data-home-hero]") as HTMLElement | null;

    if (!layer || !hero) {
      return;
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let targetX = -9999;
    let targetY = -9999;
    let currentX = targetX;
    let currentY = targetY;
    let targetStrength = 0;
    let currentStrength = 0;

    const render = () => {
      frame = 0;
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      currentStrength += (targetStrength - currentStrength) * 0.16;

      layer.style.setProperty("--ascii-x", `${currentX}px`);
      layer.style.setProperty("--ascii-y", `${currentY}px`);
      layer.style.setProperty("--ascii-strength", currentStrength.toFixed(3));

      if (
        Math.abs(targetX - currentX) > 0.5 ||
        Math.abs(targetY - currentY) > 0.5 ||
        Math.abs(targetStrength - currentStrength) > 0.01
      ) {
        frame = window.requestAnimationFrame(render);
      }
    };

    const requestRender = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(render);
      }
    };

    const updatePointer = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const isInside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;

      targetX = x;
      targetY = y;
      targetStrength = isInside ? 1 : 0;
      requestRender();
    };

    const hide = () => {
      targetStrength = motionQuery.matches ? 0.22 : 0;
      requestRender();
    };

    if (motionQuery.matches) {
      targetX = hero.clientWidth * 0.72;
      targetY = hero.clientHeight * 0.34;
      targetStrength = 0.22;
      requestRender();
    }

    window.addEventListener("pointermove", updatePointer, {passive: true});
    window.addEventListener("pointerleave", hide);
    motionQuery.addEventListener("change", hide);

    return () => {
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("pointerleave", hide);
      motionQuery.removeEventListener("change", hide);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={layerRef} className="ascii-hero-reveal" aria-hidden="true">
      {asciiClusters.map((cluster) => (
        <pre className={cluster.className} key={cluster.className}>
          {cluster.lines.map((line, index) => (
            <span key={`${cluster.className}-${index}`}>{line}</span>
          ))}
        </pre>
      ))}
    </div>
  );
}
