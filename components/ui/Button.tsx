import type {AnchorHTMLAttributes, ButtonHTMLAttributes} from "react";

import {cn, isExternalHref} from "@/lib/utils";

type ButtonVariant = "primary" | "accent" | "secondary" | "plain";
type ButtonLinkVariant = ButtonVariant | "split";

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)]",
  accent:
    "border-transparent bg-[var(--ink)] text-[var(--parchment-white)] hover:bg-[var(--paper)] hover:text-[var(--ink)]",
  secondary:
    "border-[var(--line)] bg-transparent text-[var(--ink)] hover:bg-[var(--paper)]",
  plain:
    "border-transparent bg-transparent text-[var(--ink)] underline-offset-4 hover:underline",
};

const base =
  "mai-ui inline-flex h-12 flex-nowrap items-center justify-center rounded-[var(--radius-control)] border px-[42px] transition-[color,background-color] duration-[600ms] ease-[var(--alias-easeOutCubic)] focus-visible:outline-2";

export function ButtonLink({
  variant = "primary",
  className = "",
  href,
  rel,
  target,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {variant?: ButtonLinkVariant}) {
  const isExternal = typeof href === "string" && isExternalHref(href);
  const resolvedTarget = target ?? (isExternal ? "_blank" : undefined);
  const resolvedRel = rel ?? (isExternal ? "noreferrer" : undefined);

  if (variant === "split") {
    return (
      <a
        className={cn("split-link-button mai-ui focus-visible:outline-2", className)}
        href={href}
        rel={resolvedRel}
        target={resolvedTarget}
        {...props}
      />
    );
  }

  return (
    <a
      className={cn(base, variants[variant], className)}
      href={href}
      rel={resolvedRel}
      target={resolvedTarget}
      {...props}
    />
  );
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {variant?: ButtonVariant}) {
  return (
    <button className={cn(base, variants[variant], className)} {...props} />
  );
}
