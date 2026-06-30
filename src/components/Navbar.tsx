"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "Start" },
  { href: "/speisekarte", label: "Speisekarte" },
  { href: "/deutsch-griechische-nacht", label: "Griechische Nacht" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menü beim Seitenwechsel schließen
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream/95 backdrop-blur shadow-[0_4px_24px_-12px_rgba(86,20,20,0.35)]"
          : "bg-cream/80 backdrop-blur-sm"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3" aria-label="Zur Startseite">
          <Image
            src="/images/odysseus-text.png"
            alt="Restaurant Odysseus"
            width={1125}
            height={288}
            priority
            className="h-7 w-auto sm:h-8"
          />
          <span className="sr-only">Restaurant Odysseus</span>
        </Link>

        {/* Desktop-Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active =
              l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-bordeaux/10 text-bordeaux"
                    : "text-ink-soft hover:bg-bordeaux/5 hover:text-bordeaux"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/reservierung"
            className="ml-2 rounded-full bg-bordeaux px-5 py-2 text-sm font-semibold text-cream shadow-soft transition-all hover:bg-bordeaux-dark hover:shadow-card"
          >
            Tisch reservieren
          </Link>
        </div>

        {/* Mobile-Toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-bordeaux md:hidden"
          aria-label="Menü öffnen"
          aria-expanded={open}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            {open ? (
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile-Menü */}
      {open && (
        <div className="border-t border-bordeaux/10 bg-cream md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-4 py-3 text-base font-medium text-ink-soft hover:bg-bordeaux/5 hover:text-bordeaux"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/reservierung"
              className="mt-2 rounded-lg bg-bordeaux px-4 py-3 text-center text-base font-semibold text-cream"
            >
              Tisch reservieren
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
