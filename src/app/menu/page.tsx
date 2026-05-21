import Image from "next/image";
import { MenuSection } from "@/components/menu-section";
import { allMenuSections, menuSourcePages, offers } from "@/lib/menu";

export const metadata = {
  title: "Menu | Time Out",
  description: "Full Time Out menu with kebab, broodjes, dürüms, schotels, pasta, pizza, snacks, drinks and offers.",
};

export default function MenuPage() {
  return (
    <>
      <section className="bg-[#10100f] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase text-[#ffcf8c]">Full menu</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-black uppercase">Every item from the Time Out menu.</h1>
          <div className="mt-8 flex flex-wrap gap-2">
            {allMenuSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="rounded-md border border-white/15 px-3 py-2 text-sm font-semibold text-white/80 transition hover:border-[#f25a1d] hover:text-white"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f25a1d] text-[#10100f]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
          {offers.map((offer) => (
            <article key={offer.day} className="border-l-4 border-[#10100f] pl-4">
              <p className="text-sm font-black uppercase">{offer.day}</p>
              <h2 className="mt-1 text-2xl font-black">{offer.title}</h2>
              <p className="mt-2 text-sm font-semibold">{offer.items.join(" · ")}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#f7f2e8] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
          {allMenuSections.map((section) => (
            <MenuSection key={section.id} section={section} />
          ))}
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase text-[#f25a1d]">Printed menu reference</p>
            <h2 className="mt-3 text-4xl font-black text-[#10100f]">Source pages from the supplied PDF.</h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {menuSourcePages.map((page) => (
              <Image
                key={page.src}
                src={page.src}
                alt={page.alt}
                width={620}
                height={880}
                className="w-full rounded-md border border-[#eadfcb] bg-[#10100f]"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
