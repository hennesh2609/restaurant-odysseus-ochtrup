"use client";

import { useEffect, useRef } from "react";

/*
  Hero-Hintergrundbild, das beim Herunterscrollen sanft heranzoomt
  (Ken-Burns-/Parallax-Effekt). Respektiert "prefers-reduced-motion".
*/
export function HeroZoom({ image }: { image: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const h = window.innerHeight || 1;
      const progress = Math.min(Math.max(y / h, 0), 1);
      // Zoom 1 → 1.22, dazu ein Hauch Aufhellung beim Scrollen
      const scale = 1 + progress * 0.22;
      el.style.transform = `scale(${scale})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="absolute inset-0 bg-cover bg-center will-change-transform"
      style={{ backgroundImage: `url(${image})`, transformOrigin: "center" }}
    />
  );
}
