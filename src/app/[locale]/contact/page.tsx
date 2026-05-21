import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { restaurant } from "@/lib/menu";

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
    title: t.contact.title,
    description: t.contact.description,
  };
}

export default async function ContactPage({ params }: PageProps) {
  const locale = await getLocale(params);
  const t = getDictionary(locale);

  return (
    <>
      <section className="bg-[#10100f] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase text-[#ffcf8c]">{t.contact.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-black uppercase">{t.contact.heading}</h1>
        </div>
      </section>

      <section className="bg-[#f7f2e8] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-md border border-[#eadfcb] bg-white p-6">
            <p className="text-sm font-black uppercase text-[#f25a1d]">{t.common.details}</p>
            <h2 className="mt-3 text-3xl font-black text-[#10100f]">{restaurant.address}</h2>
            <a
              className="mt-5 inline-flex rounded-md bg-[#f25a1d] px-5 py-3 text-sm font-black text-[#10100f] transition hover:bg-[#ffcf8c]"
              href={`tel:${restaurant.phone.replaceAll(" ", "")}`}
            >
              {t.common.call} {restaurant.phone}
            </a>
          </div>
          <div className="rounded-md border border-[#eadfcb] bg-white p-6">
            <p className="text-sm font-black uppercase text-[#f25a1d]">{t.contact.weekly}</p>
            <div className="mt-4 grid gap-4">
              {t.offers.map((offer) => (
                <article key={offer.day} className="border-l-4 border-[#f25a1d] pl-4">
                  <p className="text-sm font-black uppercase text-[#6c6255]">{offer.day}</p>
                  <h2 className="text-xl font-black text-[#10100f]">{offer.title}</h2>
                  <p className="mt-1 text-sm text-[#6c6255]">{offer.items.join(" · ")}</p>
                </article>
              ))}
            </div>
            <p className="mt-5 text-xs font-semibold text-[#6c6255]">{t.contact.disclaimer}</p>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-7xl">
          <Link
            className="inline-flex rounded-md bg-[#10100f] px-5 py-3 text-sm font-black text-white transition hover:bg-[#2b2a28]"
            href={`/${locale}/menu`}
          >
            {t.common.browseMenu}
          </Link>
        </div>
      </section>
    </>
  );
}
