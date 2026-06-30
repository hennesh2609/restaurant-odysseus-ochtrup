"use client";

import { useEffect, useState } from "react";
import type { MenuCategory } from "@/lib/menu";

// Horizontale, sticky Kategorie-Navigation mit aktiver Hervorhebung.
export function MenuNav({ categories }: { categories: MenuCategory[] }) {
  const [active, setActive] = useState(categories[0]?.id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    categories.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [categories]);

  return (
    <div className="sticky top-[60px] z-30 -mx-4 mb-12 border-y border-bordeaux/10 bg-cream/95 backdrop-blur sm:top-[64px]">
      <div className="no-scrollbar flex gap-1 overflow-x-auto px-4 py-3">
        {categories.map((c) => (
          <a
            key={c.id}
            href={`#${c.id}`}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              active === c.id
                ? "bg-bordeaux text-cream"
                : "text-ink-soft hover:bg-bordeaux/10 hover:text-bordeaux"
            }`}
          >
            {c.title}
          </a>
        ))}
      </div>
    </div>
  );
}
