import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MenuSection } from "@/components/menu-section";
import { MobileMenuView } from "@/components/mobile-menu-view";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { getLocalizedMenuSections, getLocalizedMenuSourcePages } from "@/lib/localized-menu";

type PageProps = {
  params: Promise<{ locale: string }>;
};

async function getLocale(params: PageProps["params"]): Promise<Locale> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return locale;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = await getLocale(params);
  const t = getDictionary(locale);

  return {
    title: t.menuPage.title,
    description: t.menuPage.description,
  };
}

export default async function MenuPage({ params }: PageProps) {
  const locale = await getLocale(params);
  const t = getDictionary(locale);
  const sections = getLocalizedMenuSections(locale);
  const sourcePages = getLocalizedMenuSourcePages(locale);

  return (
    <>
      <MobileMenuView locale={locale} sections={sections} t={t} />

      <section className="hidden bg-[#10100f] px-4 py-16 text-white sm:px-6 lg:block lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase text-[#ffcf8c]">{t.menuPage.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-black uppercase">{t.menuPage.heading}</h1>
        </div>
      </section>

      <section className="sticky top-[77px] z-40 hidden border-y border-white/10 bg-[#10100f]/95 px-4 py-4 text-white backdrop-blur sm:px-6 lg:block lg:px-8">
        <nav aria-label={t.menuPage.eyebrow} className="mx-auto flex max-w-7xl flex-wrap gap-2">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded-md border border-white/15 px-3 py-2 text-sm font-semibold text-white/80 transition hover:border-[#f25a1d] hover:text-white"
            >
              {section.title}
            </a>
          ))}
        </nav>
      </section>

      <section className="hidden bg-[#f25a1d] text-[#10100f] lg:block">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
          {t.offers.map((offer) => (
            <article key={offer.day} className="border-l-4 border-[#10100f] pl-4">
              <p className="text-sm font-black uppercase">{offer.day}</p>
              <h2 className="mt-1 text-2xl font-black">{offer.title}</h2>
              <p className="mt-2 text-sm font-semibold">{offer.items.join(" · ")}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="hidden bg-[#f7f2e8] px-4 py-12 sm:px-6 lg:block lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2">
          {sections.map((section) => (
            <MenuSection key={section.id} section={section} />
          ))}
        </div>
      </section>

      <section className="hidden bg-white px-4 py-16 sm:px-6 lg:block lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase text-[#f25a1d]">{t.menuPage.sourceEyebrow}</p>
            <h2 className="mt-3 text-4xl font-black text-[#10100f]">{t.menuPage.sourceTitle}</h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {sourcePages.map((page) => (
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
