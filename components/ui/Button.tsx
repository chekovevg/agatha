import type {AnchorHTMLAttributes, ButtonHTMLAttributes} from "react";

type ButtonVariant = "primary" | "secondary" | "plain";

const variants: Record<ButtonVariant, string> = {
  primary:
    "border-[var(--line)] bg-[var(--accent)] text-[var(--ink)] shadow-[4px_4px_0_var(--line)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--line)]",
  secondary:
    "border-[var(--line)] bg-white text-[var(--ink)] hover:-translate-y-0.5",
  plain: "border-transparent bg-transparent text-[var(--ink)] underline-offset-4 hover:underline",
};

const base =
  "inline-flex min-h-11 items-center justify-center rounded-md border-2 px-5 py-2.5 text-sm font-black transition focus-visible:outline-2";

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
