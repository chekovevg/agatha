export function TrustStrip({items}: {items: {title: string; text: string}[]}) {
  return (
    <section className="border-y-2 border-[var(--line)] bg-white">
      <div className="mx-auto grid max-w-7xl gap-0 px-5 sm:px-8 md:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="border-b-2 border-[var(--line)] py-6 md:border-b-0 md:border-r-2 md:px-5 last:md:border-r-0"
          >
            <h2 className="text-lg font-black">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
