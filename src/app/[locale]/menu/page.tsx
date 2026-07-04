import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { OnlineOrderFlow } from "@/components/online-order-flow";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { getLocalizedMenuSourcePages } from "@/lib/localized-menu";
import { listOrderMenuFromDatabase } from "@/lib/menu-store";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";

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
  const orderItems = await listOrderMenuFromDatabase(locale);
  const sourcePages = getLocalizedMenuSourcePages(locale);

  return (
    <>
      <section className="bg-[#10100f] px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase text-[#ffcf8c]">{t.menuPage.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-black uppercase">{t.menuPage.heading}</h1>
          <p className="mt-4 max-w-2xl text-base font-semibold text-white/75">
            Add items to the cart, choose pickup or delivery, and send the order to the kitchen dashboard.
          </p>
        </div>
      </section>

      <section className="bg-[#f25a1d] text-[#10100f]">
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

      <OnlineOrderFlow locale={locale} items={orderItems} />

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
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
