import Link from "next/link";
import { event } from "@/lib/event";

// Schmaler Hinweis-Streifen ganz oben – verweist auf die Deutsch-Griechische Nacht.
export function EventBanner() {
  return (
    <Link
      href="/deutsch-griechische-nacht"
      className="group block bg-bordeaux-dark text-cream-dark hover:bg-bordeaux transition-colors"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-4 py-2 text-center text-xs sm:text-sm">
        <span className="text-gold-light">★</span>
        <span className="font-medium tracking-wide">
          {event.title} – {event.date}.
        </span>
        <span className="hidden sm:inline opacity-90">
          Jetzt online reservieren
        </span>
        <span className="underline-offset-4 group-hover:underline">→</span>
      </div>
    </Link>
  );
}
