import type { Metadata } from "next";
import { ReservationForm } from "@/components/ReservationForm";
import { Meander } from "@/components/Meander";
import { Reveal } from "@/components/Reveal";
import { event } from "@/lib/event";
import { img } from "@/lib/images";

export const metadata: Metadata = {
  title: "Deutsch-Griechische Nacht",
  description:
    "Die Deutsch-Griechische Nacht im Restaurant Odysseus Ochtrup – Live-Musik, Buffet und griechische Lebensfreude. Jetzt online reservieren.",
};

const icons: Record<string, string> = {
  music: "♪",
  food: "🍽",
  free: "★",
  location: "⚓",
};

export default function EventPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${img.event})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bordeaux-dark/90 to-ink/95" />
        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center text-cream md:py-32">
          <p className="font-serif text-base italic text-cream/80">
            {event.presentedBy}
          </p>
          <p className="mt-4 font-display text-sm tracking-[0.3em] text-gold-light">
            {event.edition.toUpperCase()}
          </p>
          <h1 className="mt-4 font-serif text-5xl font-bold leading-tight sm:text-6xl">
            {event.title}
          </h1>
          <Meander className="mt-6 text-gold-light" />
          <p className="mx-auto mt-6 max-w-xl font-serif text-xl text-cream/90">
            {event.subtitle}
          </p>
          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-x-8 gap-y-2 rounded-2xl border border-gold-light/30 bg-bordeaux/30 px-8 py-4 backdrop-blur-sm">
            <span className="font-display tracking-wide text-gold-light">
              {event.date}
            </span>
            <span className="hidden text-cream/40 sm:inline">·</span>
            <span className="text-cream/90">{event.time}</span>
            <span className="hidden text-cream/40 sm:inline">·</span>
            <span className="font-semibold text-gold-light">
              {event.admission}
            </span>
          </div>
          <p className="mt-4 text-cream/80">📍 {event.location}</p>
          <p className="mt-5 text-sm uppercase tracking-[0.2em] text-cream/70">
            Live on Stage
          </p>
          <p className="mt-1 font-serif text-2xl text-gold-light">
            {event.band.name}
          </p>
          <p className="text-sm text-cream/70">{event.band.genre}</p>
          <div className="mt-8">
            <a
              href="#reservieren"
              className="inline-block rounded-full bg-gold px-10 py-4 text-sm font-semibold text-bordeaux-dark shadow-card transition-all hover:bg-gold-light"
            >
              Jetzt Platz sichern
            </a>
          </div>
        </div>
      </section>

      {/* PROGRAMM */}
      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <Reveal className="text-center">
            <h2 className="font-serif text-4xl font-semibold text-ink sm:text-5xl">
              Das erwartet Sie
            </h2>
            <Meander className="mt-6 text-bordeaux/60" />
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {event.highlights.map((h, i) => (
              <Reveal key={h.title} delay={i * 80}>
                <div className="flex h-full flex-col items-center rounded-2xl border border-bordeaux/10 bg-cream p-8 text-center shadow-soft">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-bordeaux/10 text-2xl text-bordeaux">
                    {icons[h.icon] ?? "◆"}
                  </span>
                  <h3 className="mt-4 font-serif text-xl font-semibold text-bordeaux">
                    {h.title}
                  </h3>
                  <p className="mt-2 text-sm text-ink-soft">{h.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mx-auto mt-12 max-w-2xl rounded-2xl bg-bordeaux/5 p-6 text-center text-ink-soft">
            <p>{event.note}</p>
            <p className="mt-2 text-sm">
              Lieber telefonisch? Reservierungen auch unter{" "}
              <a
                href={`tel:${event.phone.replace(/\s/g, "")}`}
                className="font-semibold text-bordeaux hover:underline"
              >
                {event.phone}
              </a>
              .
            </p>
          </Reveal>

          {/* SPONSOREN */}
          <Reveal className="mt-16">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden>
                <div className="w-full border-t border-bordeaux/15" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-paper px-5 font-display text-xs tracking-[0.25em] text-bordeaux/50">
                  MIT FREUNDLICHER UNTERSTÜTZUNG VON
                </span>
              </div>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-12 sm:gap-20">
              <img
                src="/images/sponsoren/lbs-woltering.svg"
                alt="LBS Immobilien – Gebietsleitung Christoph Woltering"
                className="h-14 w-auto max-w-[160px] object-contain opacity-80 transition-opacity hover:opacity-100"
              />
              <img
                src="/images/sponsoren/krombacher.svg"
                alt="Krombacher"
                className="h-9 w-auto max-w-[200px] object-contain opacity-80 transition-opacity hover:opacity-100"
              />
              <img
                src="/images/sponsoren/getraenke-kock.png"
                alt="Getränke Kock"
                className="h-14 w-auto max-w-[160px] object-contain opacity-80 transition-opacity hover:opacity-100"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* RESERVIERUNG */}
      <section id="reservieren" className="scroll-mt-24 bg-bordeaux-dark">
        <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
          <div className="text-center text-cream">
            <p className="font-display text-sm tracking-[0.3em] text-gold-light">
              RESERVIERUNG
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold sm:text-5xl">
              Reservieren Sie für die Griechische Nacht
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-cream/80">
              Sichern Sie sich Ihre Plätze für {event.date}. Wir bestätigen Ihre
              Reservierung persönlich.
            </p>
          </div>

          <div className="mt-10 rounded-2xl border border-gold-light/20 bg-bordeaux/30 p-6 backdrop-blur-sm sm:p-8">
            <ReservationForm
              kind="event"
              fixedDate={event.dateISO}
              accent="cream"
            />
          </div>
        </div>
      </section>
    </>
  );
}
