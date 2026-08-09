import {cn} from "@/lib/utils";

type TabMenuItem = {
  active: boolean;
  href: string;
  label: string;
};

export function TabMenu({
  ariaLabel,
  items,
}: {
  ariaLabel: string;
  items: TabMenuItem[];
}) {
  return (
    <nav
      aria-label={ariaLabel}
      data-testid="booking-tab-menu"
      className="flex w-[366px] max-w-full items-center justify-center rounded-[5px] bg-[#f7f1e4] p-3"
    >
      <div className="flex w-full items-center justify-center">
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            aria-current={item.active ? "page" : undefined}
            className={cn(
              "flex h-[38px] min-w-0 shrink items-center justify-center whitespace-nowrap rounded-[3px] px-[30px] font-ui text-[16px] font-normal leading-none tracking-[-0.21px] focus-visible:outline-2 max-[400px]:px-[27px]",
              item.active ? "bg-[var(--background)]" : "bg-transparent",
            )}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
