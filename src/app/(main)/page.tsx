import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { Meander, MeanderStrip } from "@/components/Meander";
import { HeroZoom } from "@/components/HeroZoom";
import { CookieMap } from "@/components/CookieMap";
import { highlights } from "@/lib/menu";
import { restaurant, openingHours } from "@/lib/restaurant";
import { event } from "@/lib/event";
import { img } from "@/lib/images";

export default function Home() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden">
        <HeroZoom image={img.hero} />
        {/* Verlauf für Lesbarkeit + sanfte Vignette an den Rändern */}
        <div className="absolute inset-0 bg-gradient-to-b from-bordeaux-dark/85 via-bordeaux-dark/70 to-ink/90" />
        <div className="absolute inset-0 [background:radial-gradient(120%_85%_at_50%_40%,transparent_45%,rgba(28,16,12,0.55)_100%)]" />

        <div className="relative z-10 mx-auto max-w-3xl px-6 py-24 text-center text-cream">
          <p className="font-serif text-lg italic tracking-wide text-gold-light">
            Καλώς ορίσατε · Herzlich willkommen
          </p>
          <Image
            src="/images/odysseus-text.png"
            alt="Odysseus"
            width={720}
            height={180}
            priority
            className="mx-auto mt-6 w-full max-w-xl drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)] [filter:brightness(0)_invert(1)]"
          />
          <p className="mx-auto mt-8 max-w-xl font-serif text-xl leading-relaxed text-cream/90 sm:text-2xl">
            Authentische griechische Küche, herzliche Gastfreundschaft und
            mediterrane Lebensfreude – mitten in Ochtrup.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/reservierung"
              className="w-full rounded-full bg-gold px-8 py-4 text-sm font-semibold text-bordeaux-dark shadow-card transition-all hover:bg-gold-light sm:w-auto"
            >
              Tisch reservieren
            </Link>
            <Link
              href="/speisekarte"
              className="w-full rounded-full border border-cream/40 px-8 py-4 text-sm font-semibold text-cream backdrop-blur-sm transition-all hover:border-cream hover:bg-cream/10 sm:w-auto"
            >
              Speisekarte ansehen
            </Link>
          </div>
        </div>

        {/* Scroll-Hinweis */}
        <a
          href="#willkommen"
          aria-label="Weiter scrollen"
          className="absolute bottom-9 left-1/2 z-10 -translate-x-1/2 text-gold-light/80 transition-colors hover:text-gold-light"
        >
          <span className="animate-scroll-hint block">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>

        {/* Branded-Übergang: goldenes Mäanderband auf dunklem Grund */}
        <div className="absolute inset-x-0 bottom-0 z-10">
          <MeanderStrip className="opacity-90" />
        </div>
      </section>

      {/* ---------- WILLKOMMEN ---------- */}
      <section id="willkommen" className="scroll-mt-20 bg-paper">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <Reveal>
            <p className="font-display text-sm tracking-[0.3em] text-bordeaux">
              UNSER HAUS
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              Ein Stück Griechenland
              <span className="block text-bordeaux">in Ochtrup</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              Seit vielen Jahren verwöhnen wir unsere Gäste mit den Klassikern
              der griechischen Küche – vom saftigen Gyros über frische
              Spezialitäten vom Grill bis zu hausgemachten Köstlichkeiten. Bei
              uns treffen sich Familien, Freunde und Genießer in gemütlicher,
              warmer Atmosphäre.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">
              Ob ein entspanntes Abendessen, eine Familienfeier oder unsere
              legendäre <strong>Deutsch-Griechische Nacht</strong> – wir heißen
              Sie herzlich willkommen. <em className="font-serif">Kalí órexi!</em>
            </p>
            <div className="mt-8 flex flex-wrap gap-8">
              <div>
                <p className="font-display text-3xl text-bordeaux">150+</p>
                <p className="text-sm text-ink-soft">Gerichte auf der Karte</p>
              </div>
              <div>
                <p className="font-display text-3xl text-bordeaux">100%</p>
                <p className="text-sm text-ink-soft">Griechische Gastfreundschaft</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative">
              <div
                className="aspect-[4/5] rounded-2xl bg-cover bg-center shadow-card"
                style={{ backgroundImage: `url(${img.table})` }}
              />
              <div className="absolute -bottom-6 -left-6 hidden rounded-xl bg-bordeaux px-6 py-5 text-cream shadow-card sm:block">
                <p className="font-display text-sm tracking-widest text-gold-light">
                  SEIT JEHER
                </p>
                <p className="font-serif text-xl">Mit Liebe zubereitet</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- HIGHLIGHTS ---------- */}
      <section className="bg-cream-dark">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <Reveal className="text-center">
            <p className="font-display text-sm tracking-[0.3em] text-bordeaux">
              BELIEBT BEI UNSEREN GÄSTEN
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-ink sm:text-5xl">
              Unsere Spezialitäten
            </h2>
            <Meander className="mt-6 text-bordeaux/60" />
          </Reveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((dish, i) => (
              <Reveal key={dish.no} delay={i * 80}>
                <article className="group flex h-full flex-col rounded-2xl border border-bordeaux/10 bg-cream p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-serif text-2xl font-semibold text-bordeaux">
                      {dish.name}
                    </h3>
                    <span className="whitespace-nowrap font-display text-sm text-ink">
                      {dish.price}
                    </span>
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                    {dish.desc}
                  </p>
                  <span className="mt-4 inline-block h-px w-12 bg-gold transition-all group-hover:w-20" />
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 text-center">
            <Link
              href="/speisekarte"
              className="inline-flex items-center gap-2 rounded-full bg-bordeaux px-8 py-4 text-sm font-semibold text-cream shadow-soft transition-all hover:bg-bordeaux-dark hover:shadow-card"
            >
              Zur kompletten Speisekarte
              <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- EVENT-TEASER ---------- */}
      <section className="relative overflow-hidden bg-bordeaux-dark text-cream">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${img.event})` }}
        />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <Reveal>
            <p className="font-display text-sm tracking-[0.3em] text-gold-light">
              {event.edition.toUpperCase()}
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight sm:text-5xl">
              {event.title}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-cream/85">
              {event.subtitle}
            </p>
            <ul className="mt-6 space-y-2 text-cream/85">
              {event.highlights.map((h) => (
                <li key={h.title} className="flex items-start gap-3">
                  <span className="mt-1 text-gold-light">◆</span>
                  <span>
                    <strong>{h.title}</strong> – {h.text}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link
                href="/deutsch-griechische-nacht"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-semibold text-bordeaux-dark shadow-card transition-all hover:bg-gold-light"
              >
                Mehr erfahren & reservieren
                <span aria-hidden>→</span>
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120} className="hidden md:block">
            <div className="rounded-2xl border border-gold-light/30 bg-bordeaux/40 p-8 backdrop-blur-sm">
              <p className="font-display tracking-widest text-gold-light">
                SAVE THE DATE
              </p>
              <p className="mt-4 font-serif text-3xl">{event.date}</p>
              <p className="mt-1 text-cream/80">{event.time}</p>
              <div className="my-6 h-px bg-cream/15" />
              <p className="text-sm text-cream/80">{event.note}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- ÖFFNUNGSZEITEN & KONTAKT ---------- */}
      <section className="bg-paper">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <Reveal>
            <p className="font-display text-sm tracking-[0.3em] text-bordeaux">
              ÖFFNUNGSZEITEN
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-ink sm:text-5xl">
              Wann wir für Sie da sind
            </h2>
            <ul className="mt-8 divide-y divide-bordeaux/10">
              {openingHours.map((h) => (
                <li
                  key={h.days}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <span className="font-medium text-ink">{h.days}</span>
                  <span
                    className={`text-right text-sm ${
                      h.closed ? "text-bordeaux" : "text-ink-soft"
                    }`}
                  >
                    {h.time}
                    {h.note ? (
                      <span className="block text-xs opacity-70">{h.note}</span>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-xl bg-bordeaux/5 p-5">
              <p className="text-sm text-ink-soft">
                Telefonisch erreichen Sie uns unter{" "}
                <a
                  href={`tel:${restaurant.phoneHref}`}
                  className="font-semibold text-bordeaux hover:underline"
                >
                  {restaurant.phone}
                </a>
                . Gerne nehmen wir auch Bestellungen zum Mitnehmen entgegen.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <p className="font-display text-sm tracking-[0.3em] text-bordeaux">
              SO FINDEN SIE UNS
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-ink sm:text-5xl">
              Mitten in Ochtrup
            </h2>
            <div className="mt-8 overflow-hidden rounded-2xl border border-bordeaux/10 shadow-soft">
              <div
                className="aspect-[16/10] bg-cover bg-center"
                style={{ backgroundImage: `url(${img.exterior})` }}
                role="img"
                aria-label="Außenansicht des Restaurant Odysseus in Ochtrup"
              />
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-bordeaux/10 shadow-soft">
              <CookieMap
                title="Standort Restaurant Odysseus"
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  restaurant.mapsQuery
                )}&output=embed`}
                className="h-72 w-full"
              />
            </div>
            <address className="mt-6 not-italic text-ink-soft">
              <p className="font-semibold text-ink">{restaurant.name}</p>
              <p>{restaurant.street}</p>
              <p>
                {restaurant.zip} {restaurant.city}
              </p>
            </address>
          </Reveal>
        </div>
      </section>

      {/* ---------- WIR SUCHEN DICH ---------- */}
      <section className="bg-cream-deep">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <Reveal>
              <p className="font-display text-sm tracking-[0.3em] text-bordeaux">
                WIR SUCHEN DICH
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold text-ink sm:text-4xl">
                Werde Teil unseres Teams
              </h2>
              <p className="mt-4 max-w-xl text-ink-soft">
                Wir suchen tatkräftige Unterstützung – zum Beispiel als Aushilfe
                im Service oder in der Küche. Lust, in herzlicher Atmosphäre
                mitzuarbeiten? Bewirb dich ganz unkompliziert über unser
                Kontaktformular – wir freuen uns auf dich!
              </p>
            </Reveal>
            <Reveal delay={120} className="md:justify-self-end">
              <Link
                href="/kontakt?betreff=bewerbung#kontaktformular"
                className="inline-block whitespace-nowrap rounded-full bg-bordeaux px-8 py-4 text-sm font-semibold text-cream shadow-soft transition-all hover:bg-bordeaux-dark hover:shadow-card"
              >
                Jetzt bewerben
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- RESERVIERUNGS-CTA ---------- */}
      <section className="bg-cream-dark">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-24">
          <Reveal>
            <Meander className="text-bordeaux/50" />
            <h2 className="mt-6 font-serif text-4xl font-semibold text-ink sm:text-5xl">
              Reservieren Sie Ihren Tisch
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">
              Sichern Sie sich Ihren Platz – ganz bequem online, rund um die Uhr.
              Wir freuen uns auf Ihren Besuch.
            </p>
            <Link
              href="/reservierung"
              className="mt-8 inline-block rounded-full bg-bordeaux px-10 py-4 text-sm font-semibold text-cream shadow-soft transition-all hover:bg-bordeaux-dark hover:shadow-card"
            >
              Jetzt reservieren
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
