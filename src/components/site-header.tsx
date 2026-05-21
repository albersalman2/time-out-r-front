import Link from "next/link";
import { restaurant } from "@/lib/menu";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#10100f]/95 text-white backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-md border-2 border-[#f25a1d] text-lg font-black text-[#f25a1d]">
            TO
          </span>
          <span>
            <span className="block text-xl font-black uppercase">{restaurant.name}</span>
            <span className="block text-xs uppercase text-[#ffcf8c]">{restaurant.tagline}</span>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={`tel:${restaurant.phone.replaceAll(" ", "")}`}
            className="rounded-md bg-[#f25a1d] px-4 py-2 text-sm font-black text-[#10100f] transition hover:bg-[#ffcf8c]"
          >
            {restaurant.phone}
          </a>
        </nav>
      </div>
    </header>
  );
}
