import {defineRouting} from "next-intl/routing";
import {createNavigation} from "next-intl/navigation";

export const locales = ["en", "de", "ru"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
