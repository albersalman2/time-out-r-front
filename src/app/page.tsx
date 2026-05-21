import Image from "next/image";
import Link from "next/link";
import { MenuSection } from "@/components/menu-section";
import { menuSections, offers, restaurant } from "@/lib/menu";

const featured = menuSections.filter((section) =>
  ["broodjes", "pastas", "schotels"].includes(section.id),
);

export default function Home() {
  return (
    <>
      <section className="relative min-h-[74vh] overflow-hidden bg-[#10100f] text-white">
        <Image
          src="/menu-source/page-1-large.jpg"
          alt="Time Out kebab pizza pasta snacks menu cover"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,16,15,0.96),rgba(16,16,15,0.58),rgba(16,16,15,0.16))]" />
        <div className="relative mx-auto flex min-h-[74vh] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase text-[#ffcf8c]">{restaurant.address}</p>
            <h1 className="mt-4 max-w-2xl text-5xl font-black uppercase leading-none text-white sm:text-7xl">
              {restaurant.name}
            </h1>
            <p className="mt-5 max-w-2xl text-xl font-semibold leading-8 text-white/86">
              {restaurant.tagline} with fresh broodjes, loaded kapsalons, grill schotels and pizza deals.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="rounded-md bg-[#f25a1d] px-5 py-3 text-sm font-black text-[#10100f] transition hover:bg-[#ffcf8c]" href="/menu">
                View full menu
              </Link>
              <a className="rounded-md border border-white/30 px-5 py-3 text-sm font-black text-white transition hover:bg-white hover:text-[#10100f]" href={`tel:${restaurant.phone.replaceAll(" ", "")}`}>
                Call {restaurant.phone}
              </a>
            </div>
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

      <section className="bg-[#f7f2e8] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase text-[#f25a1d]">Menu highlights</p>
            <h2 className="mt-3 text-4xl font-black text-[#10100f]">Fast service, full plates, clear prices.</h2>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {featured.map((section) => (
              <MenuSection key={section.id} section={{ ...section, items: section.items.slice(0, 5) }} />
            ))}
          </div>
          <Link className="mt-8 inline-flex rounded-md bg-[#10100f] px-5 py-3 text-sm font-black text-white transition hover:bg-[#2b2a28]" href="/menu">
            See every item
          </Link>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase text-[#f25a1d]">From the counter</p>
            <h2 className="mt-3 text-4xl font-black text-[#10100f]">Loaded plates, warm bread and pizza straight from the oven.</h2>
            <p className="mt-5 text-base leading-7 text-[#6c6255]">
              Choose a quick sandwich, a full grill schotel, a pasta, a kapsalon or a family pizza and call ahead for pickup at Rozenberg 9 in Mol.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Image className="rounded-md border border-[#eadfcb]" src="/menu-source/page-2-large.jpg" alt="Menu preview page with kebab and pasta" width={580} height={820} />
            <Image className="mt-8 rounded-md border border-[#eadfcb]" src="/menu-source/page-4-large.jpg" alt="Menu preview page with pizzas" width={580} height={820} />
          </div>
        </div>
      </section>
    </>
  );
}
