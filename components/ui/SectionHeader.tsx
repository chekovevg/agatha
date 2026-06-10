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
        <p className="mb-4 text-sm font-black uppercase text-[var(--leaf)]">
          {label}
        </p>
      ) : null}
      <h2 className="text-3xl font-black leading-tight text-[var(--ink)] sm:text-5xl">
        {title}
      </h2>
      {intro ? (
        <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{intro}</p>
      ) : null}
    </div>
  );
}
