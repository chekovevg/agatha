export function TrustStrip({items}: {items: {title: string; text: string}[]}) {
  return (
    <section className="border-y border-[var(--line)] bg-white">
      <div className="mx-auto max-w-[1200px] px-5 py-6 sm:px-8">
        <div className="grid gap-3 rounded-[var(--radius-card)] bg-[var(--paper)] p-3 md:grid-cols-4">
          {items.map((item) => (
            <div key={item.title} className="rounded-[var(--radius-card)] bg-[var(--card)] p-5 shadow-[var(--shadow-inset)]">
              <h2 className="font-display text-base font-normal leading-6">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
