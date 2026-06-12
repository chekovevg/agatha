import type {AnchorHTMLAttributes, ButtonHTMLAttributes} from "react";

type ButtonVariant = "primary" | "secondary" | "plain";

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-[var(--ink)] bg-[var(--ink)] text-[var(--accent-foreground)] shadow-[var(--shadow-control)] hover:bg-[var(--muted)]",
  secondary:
    "border-[var(--line)] bg-[var(--card)] text-[var(--ink)] shadow-[var(--shadow-control)] hover:border-[var(--ink)]",
  plain:
    "border-transparent bg-transparent text-[var(--ink)] underline-offset-4 hover:underline",
};

const base =
  "font-ui inline-flex min-h-8 items-center justify-center rounded-[var(--radius-control)] border px-5 py-2 text-xs font-medium leading-none tracking-[0.03em] transition focus-visible:outline-2";

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {variant?: ButtonVariant}) {
  return <a className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {variant?: ButtonVariant}) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}
