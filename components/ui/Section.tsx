export function Section({
  id,
  children,
  tone = "paper",
}: {
  id?: string;
  children: React.ReactNode;
  tone?: "paper" | "white" | "green";
}) {
  const toneClass =
    tone === "green"
      ? "bg-[var(--paper)]"
      : tone === "white"
        ? "bg-white"
        : "bg-[var(--background)]";

  return (
    <section id={id} className={`${toneClass} border-t border-[var(--line)]`}>
      <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 lg:py-24">
        {children}
      </div>
    </section>
  );
}
