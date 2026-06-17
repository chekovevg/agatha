import type {AnchorHTMLAttributes} from "react";

import {ButtonLink} from "@/components/ui/Button";

export function SplitLinkButton({
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <ButtonLink variant="split" {...props} />;
}
