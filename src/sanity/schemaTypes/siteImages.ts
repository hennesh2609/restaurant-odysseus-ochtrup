import { defineType, defineField } from "sanity";

export const siteImages = defineType({
  name: "siteImages",
  title: "Bilder",
  type: "document",
  icon: () => "🖼️",
  fields: [
    defineField({
      name: "hero",
      title: "Hero-Bild (Startseite Hintergrund)",
      type: "image",
      options: { hotspot: true },
      description: "Großes Bild ganz oben auf der Startseite.",
    }),
    defineField({
      name: "exterior",
      title: "Außenansicht des Restaurants",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "table",
      title: "Innenansicht / Tischbild",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "event",
      title: "Event-Bild",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: { select: {}, prepare: () => ({ title: "Website-Bilder" }) },
});
