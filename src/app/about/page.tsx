import Image from "next/image";
import Link from "next/link";
import { restaurant } from "@/lib/menu";

export const metadata = {
  title: "About | Time Out",
  description: "About Time Out in Mol and its kebab, pizza, pasta, snacks, grill and pita menu.",
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-[#10100f] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase text-[#ffcf8c]">About</p>
            <h1 className="mt-3 text-5xl font-black uppercase">{restaurant.name}</h1>
            <p className="mt-5 text-lg leading-8 text-white/78">
              A direct, counter-service food spot in Mol built around kebab, pizza, pasta, snacks, grill plates and pita.
            </p>
            <Link className="mt-8 inline-flex rounded-md bg-[#f25a1d] px-5 py-3 text-sm font-black text-[#10100f] transition hover:bg-[#ffcf8c]" href="/menu">
              Open the menu
            </Link>
          </div>
          <Image
            src="/menu-source/page-1-large.jpg"
            alt="Time Out printed menu cover"
            width={720}
            height={1000}
            className="max-h-[620px] w-full rounded-md border border-white/10 object-cover"
          />
        </div>
      </section>

      <section className="bg-[#f7f2e8] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {[
            ["Kebab & grill", "Broodjes, dürüms, kapsalon and schotels with clear small, large, normal and mega sizes."],
            ["Pizza & pasta", "Vegetarian, classic, chicken, kebab, fish, specials and kids pizzas plus a full pasta list."],
            ["Snacks & drinks", "Bakjes, chicken snacks, lookbroodjes, desserts, cold drinks and warm drinks."],
          ].map(([title, copy]) => (
            <article key={title} className="rounded-md border border-[#eadfcb] bg-white p-6">
              <h2 className="text-2xl font-black text-[#10100f]">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#6c6255]">{copy}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
