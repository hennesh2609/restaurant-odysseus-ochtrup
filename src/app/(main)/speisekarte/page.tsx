import type { Metadata } from "next";
import Link from "next/link";
import { menu } from "@/lib/menu";
import { Meander } from "@/components/Meander";
import { MenuNav } from "@/components/MenuNav";

export const metadata: Metadata = {
  title: "Speisekarte",
  description:
    "Die komplette Speisekarte des Restaurant Odysseus in Ochtrup – griechische Vorspeisen, Spezialitäten vom Grill, Lamm, Fisch, Pizza und mehr.",
};

export default function SpeisekartePage() {
  return (
    <>
      {/* Kopf */}
      <section className="bg-bordeaux-dark text-cream">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-24">
          <p className="font-serif text-lg italic text-gold-light">
            Kalí órexi – Guten Appetit
          </p>
          <h1 className="mt-3 font-display text-4xl tracking-wide sm:text-5xl">
            SPEISEKARTE
          </h1>
          <Meander className="mt-6 text-gold-light" />
          <p className="mx-auto mt-6 max-w-xl text-cream/80">
            Von herzhaften Vorspeisen über Spezialitäten vom Grill bis zu
            süßen Nachspeisen – entdecken Sie die ganze Vielfalt der
            griechischen Küche.
          </p>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <MenuNav categories={menu} />

          <div className="space-y-16">
            {menu.map((cat) => (
              <div key={cat.id} id={cat.id} className="scroll-mt-32">
                <div className="mb-2 flex items-baseline gap-4">
                  <h2 className="font-serif text-3xl font-semibold text-bordeaux">
                    {cat.title}
                  </h2>
                  <span className="h-px flex-1 bg-bordeaux/15" />
                </div>
                {cat.intro && (
                  <p className="mb-5 font-serif text-lg italic text-ink-soft">
                    {cat.intro}
                  </p>
                )}

                <ul className="divide-y divide-bordeaux/10">
                  {cat.items.map((item, i) => (
                    <li key={`${cat.id}-${i}`} className="py-4">
                      <div className="flex items-baseline justify-between gap-4">
                        <h3 className="font-medium text-ink">
                          {item.no && (
                            <span className="mr-2 text-sm text-bordeaux/60">
                              {item.no}
                            </span>
                          )}
                          {item.name}
                        </h3>
                        {item.price && (
                          <span className="whitespace-nowrap font-display text-sm text-bordeaux">
                            {item.price}
                          </span>
                        )}
                      </div>
                      {item.desc && (
                        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-ink-soft">
                          {item.desc}
                        </p>
                      )}
                      {item.variants && (
                        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
                          {item.variants.map((v) => (
                            <span
                              key={v.label}
                              className="text-sm text-ink-soft"
                            >
                              {v.label}:{" "}
                              <span className="font-display text-bordeaux">
                                {v.price}
                              </span>
                            </span>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

                {cat.note && (
                  <p className="mt-4 text-xs italic text-ink-soft/70">
                    {cat.note}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Hinweis & CTA */}
          <div className="mt-16 rounded-2xl bg-bordeaux/5 p-8 text-center">
            <p className="text-ink-soft">
              Alle Preise in Euro inkl. gesetzlicher MwSt. Änderungen und
              Druckfehler vorbehalten. Bei Fragen zu Allergenen und
              Zusatzstoffen sprechen Sie uns gerne an.
            </p>
            <Link
              href="/reservierung"
              className="mt-6 inline-block rounded-full bg-bordeaux px-8 py-3.5 text-sm font-semibold text-cream shadow-soft transition-all hover:bg-bordeaux-dark"
            >
              Tisch reservieren
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
