"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import type {ComponentProps} from "react";

export function FooterLink({href, ...props}: ComponentProps<typeof Link> & {href: string}) {
  const pathname = usePathname();

  return (
    <Link
      {...props}
      href={href}
      aria-current={pathname === href.split("?")[0] ? "page" : undefined}
    />
  );
}
