import type { MenuSection as MenuSectionType } from "@/lib/menu";

function PriceList({
  price,
  prices,
}: {
  price?: string;
  prices?: { label: string; value: string }[];
}) {
  if (prices?.length) {
    return (
      <div className="flex flex-wrap justify-end gap-2 text-right text-sm font-black text-[#10100f]">
        {prices.map((item) => (
          <span key={`${item.label}-${item.value}`} className="rounded-md bg-[#ffcf8c] px-2 py-1">
            {item.label} {item.value}
          </span>
        ))}
      </div>
    );
  }

  if (!price) {
    return null;
  }

  return <span className="text-right text-sm font-black text-[#f25a1d]">{price}</span>;
}

export function MenuSection({ section }: { section: MenuSectionType }) {
  return (
<<<<<<< HEAD
    <section id={section.id} className="scroll-mt-28 rounded-md border border-[#eadfcb] bg-white p-5 shadow-sm">
=======
    <section id={section.id} className="scroll-mt-28 rounded-md border border-[#eadfcb] bg-white p-5 shadow-sm lg:scroll-mt-72">
>>>>>>> f513f9e6961e0d796b51bc51e6ebb17600076bd3
      <div className="border-b border-[#eadfcb] pb-4">
        <h2 className="text-2xl font-black text-[#10100f]">{section.title}</h2>
        {section.note ? <p className="mt-2 text-sm font-semibold text-[#6c6255]">{section.note}</p> : null}
      </div>
      <div className="mt-4 divide-y divide-[#eadfcb]">
        {section.items.map((item) => (
          <article key={`${section.id}-${item.name}-${item.price ?? item.prices?.[0]?.value}`} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-start">
            <div>
              <h3 className="font-black text-[#10100f]">{item.name}</h3>
              {item.description ? <p className="mt-1 text-sm leading-6 text-[#6c6255]">{item.description}</p> : null}
            </div>
            <PriceList price={item.price} prices={item.prices} />
          </article>
        ))}
      </div>
    </section>
  );
}
