import Link from "next/link";
import { restaurant } from "@/lib/menu";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#10100f] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-2xl font-black uppercase text-[#ffcf8c]">{restaurant.name}</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/70">{restaurant.tagline}</p>
        </div>
        <div>
          <p className="text-sm font-black uppercase text-[#f25a1d]">Visit</p>
          <p className="mt-3 text-sm text-white/75">{restaurant.address}</p>
          <a className="mt-2 block text-sm text-white/75 hover:text-white" href={`tel:${restaurant.phone.replaceAll(" ", "")}`}>
            {restaurant.phone}
          </a>
        </div>
        <div>
          <p className="text-sm font-black uppercase text-[#f25a1d]">Explore</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-white/75">
            <Link className="hover:text-white" href="/menu">Full menu</Link>
            <Link className="hover:text-white" href="/about">About Time Out</Link>
            <Link className="hover:text-white" href="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
