"use client";

import {useEffect, useState} from "react";

type VisualStyle = "soft" | "microsoft";

const styles: {label: string; value: VisualStyle}[] = [
  {label: "Soft", value: "soft"},
  {label: "MAI", value: "microsoft"},
];

function applyVisualStyle(style: VisualStyle) {
  document.documentElement.dataset.style = style;
  window.localStorage.setItem("agathe-visual-style", style);
}

export function StyleSwitcher() {
  const [style, setStyle] = useState<VisualStyle>(() => {
    if (typeof window === "undefined") {
      return "soft";
    }

    return window.localStorage.getItem("agathe-visual-style") === "microsoft"
      ? "microsoft"
      : "soft";
  });

  useEffect(() => {
    applyVisualStyle(style);
  }, [style]);

  return (
    <div
      aria-label="Visual style"
      className="font-ui flex rounded-[var(--radius-control)] border border-[var(--line)] bg-[var(--paper)] p-1 text-[10px] font-medium uppercase tracking-[0.06em] shadow-[var(--shadow-inset)]"
      role="group"
    >
      {styles.map((item) => (
        <button
          key={item.value}
          aria-pressed={style === item.value}
          className={`rounded-[var(--radius-control)] px-3 py-1.5 transition ${
            style === item.value
              ? "bg-[var(--card)] text-[var(--ink)] shadow-[var(--shadow-inset)]"
              : "text-[var(--muted)] hover:text-[var(--ink)]"
          }`}
          type="button"
          onClick={() => {
            setStyle(item.value);
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
