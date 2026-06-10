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
      ? "bg-[#edf3df]"
      : tone === "white"
        ? "bg-white"
        : "bg-[var(--paper)]";

  return (
    <section id={id} className={`${toneClass} border-t-2 border-[var(--line)]`}>
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        {children}
      </div>
    </section>
  );
}
