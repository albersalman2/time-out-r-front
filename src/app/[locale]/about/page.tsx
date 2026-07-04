import type { Metadata } from "next";
import Image from "next/image";
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
    title: t.about.title,
    description: t.about.description,
  };
}

export default async function AboutPage({ params }: PageProps) {
  const locale = await getLocale(params);
  const t = getDictionary(locale);

  return (
    <>
      <section className="bg-[#10100f] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase text-[#ffcf8c]">{t.about.eyebrow}</p>
            <h1 className="mt-3 text-5xl font-black uppercase">{restaurant.name}</h1>
            <p className="mt-5 text-lg leading-8 text-white/78">{t.about.copy}</p>
            <Link
              className="mt-8 inline-flex rounded-md bg-[#f25a1d] px-5 py-3 text-sm font-black text-[#10100f] transition hover:bg-[#ffcf8c]"
              href={`/${locale}/menu`}
            >
              {t.common.openMenu}
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
          {t.about.cards.map(([title, copy]) => (
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
