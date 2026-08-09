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
        <p className="mai-eyebrow mb-4 text-[var(--muted)]">
          {label}
        </p>
      ) : null}
      <h2 className="mai-h4 text-[var(--ink)]">
        {title}
      </h2>
      {intro ? (
        <p className="mai-body mt-5 max-w-[720px] text-[var(--muted)]">
          {intro}
        </p>
      ) : null}
    </div>
  );
}
