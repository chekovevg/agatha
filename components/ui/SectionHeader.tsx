export function SectionHeader({
  label,
  title,
  intro,
}: {
  label?: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="max-w-3xl">
      {label ? (
        <p className="font-ui mb-4 text-xs font-medium tracking-[0.06em] text-[var(--muted)]">
          {label}
        </p>
      ) : null}
      <h2 className="font-display text-3xl font-normal leading-[1.08] text-[var(--ink)] sm:text-5xl">
        {title}
      </h2>
      {intro ? (
        <p className="mt-5 max-w-[720px] text-base leading-7 text-[var(--muted)] sm:text-lg sm:leading-8">
          {intro}
        </p>
      ) : null}
    </div>
  );
}
