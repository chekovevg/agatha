import Image from "next/image";
import type {AnchorHTMLAttributes} from "react";

import {cn} from "@/lib/utils";

export function SplitLinkButton({
  children,
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        "group inline-flex items-center gap-[2px] text-[14px] font-normal tracking-[-0.21px] text-[var(--parchment-white)] transition-colors duration-300 focus-visible:outline-2",
        className,
      )}
      {...props}
    >
      <span className="font-ui flex h-12 items-center justify-center whitespace-nowrap rounded-full bg-[#5c524c] px-[42px] text-[#fef9ee] transition-colors duration-300 group-hover:bg-[#f6ecda] group-hover:text-[#5c524c]">
        {children}
      </span>
      <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-[2px] bg-[#5c524c] transition-[background-color,border-radius] duration-300 group-hover:rounded-full group-hover:bg-[#f6ecda]">
        <Image
          src="/icons/arrow-narrow-right-dark.svg"
          alt=""
          aria-hidden="true"
          width={18}
          height={18}
          className="absolute h-[18px] w-[18px] opacity-100 transition-opacity duration-300 group-hover:opacity-0"
        />
        <Image
          src="/icons/arrow-narrow-right-light.svg"
          alt=""
          aria-hidden="true"
          width={18}
          height={18}
          className="absolute h-[18px] w-[18px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </span>
    </a>
  );
}
