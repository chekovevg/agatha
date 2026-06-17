import type {AnchorHTMLAttributes, ButtonHTMLAttributes} from "react";

import {cn} from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "plain";
type ButtonLinkVariant = ButtonVariant | "split";

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-transparent bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--paper)]",
  secondary:
    "border-[var(--line)] bg-transparent text-[var(--ink)] hover:bg-[var(--paper)]",
  plain:
    "border-transparent bg-transparent text-[var(--ink)] underline-offset-4 hover:underline",
};

const base =
  "mai-ui inline-flex h-[3em] flex-nowrap items-center justify-center rounded-[var(--radius-control)] border px-[3em] py-[1em] transition-[color,background-color] duration-[600ms] ease-[var(--alias-easeOutCubic)] focus-visible:outline-2";

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {variant?: ButtonLinkVariant}) {
  if (variant === "split") {
    return (
      <a
        className={cn("split-link-button mai-ui focus-visible:outline-2", className)}
        {...props}
      />
    );
  }

  return <a className={cn(base, variants[variant], className)} {...props} />;
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
