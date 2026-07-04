"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminLogoutButton } from "@/components/admin-logout-button";
import { restaurant } from "@/lib/menu";

const navigation = [
  { href: "/admin/orders", label: "Orders", description: "Live kitchen queue" },
  { href: "/admin/menu", label: "Menu", description: "Items and prices" },
  { href: "/nl/menu", label: "Customer menu", description: "Online ordering page" },
];

function NavLink({ href, label, description }: (typeof navigation)[number]) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/nl/menu" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`block rounded-md border px-4 py-3 transition ${
        isActive
          ? "border-[#f25a1d] bg-[#f25a1d] text-[#10100f]"
          : "border-white/10 bg-white/[0.04] text-white hover:border-white/25 hover:bg-white/10"
      }`}
    >
      <span className="block text-sm font-black uppercase">{label}</span>
      <span className={`mt-1 block text-xs font-semibold ${isActive ? "text-[#10100f]/75" : "text-white/55"}`}>
        {description}
      </span>
    </Link>
  );
}

function Logo() {
  return (
    <Link href="/admin/orders" className="flex items-center gap-3">
      <span className="grid size-12 shrink-0 place-items-center rounded-md border-2 border-[#f25a1d] bg-[#f25a1d] text-lg font-black text-[#10100f]">
        TO
      </span>
      <span className="min-w-0">
        <span className="block text-xl font-black uppercase leading-6 text-white">{restaurant.name}</span>
        <span className="block truncate text-xs font-black uppercase text-[#ffcf8c]">Restaurant dashboard</span>
      </span>
    </Link>
  );
}

export function AdminSidebar() {
  return (
    <>
      <aside className="hidden min-h-screen border-r border-white/10 bg-[#10100f] text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div className="border-b border-white/10 px-5 py-5">
          <Logo />
        </div>

        <nav className="flex-1 space-y-2 px-4 py-5" aria-label="Dashboard navigation">
          {navigation.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>

        <div className="border-t border-white/10 px-5 py-5">
          <p className="text-xs font-black uppercase text-[#f25a1d]">Visit</p>
          <p className="mt-2 text-sm font-semibold text-white/70">{restaurant.address}</p>
          <a className="mt-2 block text-sm font-black text-white" href={`tel:${restaurant.phone.replaceAll(" ", "")}`}>
            {restaurant.phone}
          </a>
          <AdminLogoutButton />
        </div>
      </aside>

      <header className="border-b border-white/10 bg-[#10100f] px-4 py-4 text-white lg:hidden">
        <Logo />
        <nav className="mobile-scrollbar mt-4 flex gap-2 overflow-x-auto" aria-label="Dashboard navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-md border border-white/15 px-3 py-2 text-sm font-black text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}
