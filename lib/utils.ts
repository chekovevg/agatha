import {clsx, type ClassValue} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isExternalHref(href: string) {
  return /^https?:\/\//.test(href);
}

export function getExternalLinkProps(href: string) {
  return isExternalHref(href)
    ? {target: "_blank", rel: "noreferrer"}
    : {};
}
