import { defineType, defineField, defineArrayMember } from "sanity";

export const eventInfo = defineType({
  name: "eventInfo",
  title: "Event – Deutsch-Griechische Nacht",
  type: "document",
  icon: () => "🎵",
  fields: [
    defineField({ name: "title", title: "Event-Titel", type: "string" }),
    defineField({ name: "edition", title: "Ausgabe (z. B. \"Die 3. Ochtruper\")", type: "string" }),
    defineField({ name: "presentedBy", title: "Präsentiert von", type: "string" }),
    defineField({ name: "date", title: "Datum (Anzeigetext, z. B. \"Samstag, 22. August 2026\")", type: "string" }),
    defineField({ name: "dateISO", title: "Datum (ISO, z. B. \"2026-08-22\")", type: "string" }),
    defineField({ name: "time", title: "Uhrzeit (z. B. \"ab 18:00 Uhr\")", type: "string" }),
    defineField({ name: "admission", title: "Eintritt", type: "string" }),
    defineField({ name: "location", title: "Veranstaltungsort", type: "string" }),
    defineField({ name: "phone", title: "Telefon für Reservierungen", type: "string" }),
    defineField({ name: "subtitle", title: "Kurzbeschreibung", type: "text", rows: 3 }),
    defineField({ name: "note", title: "Hinweis (z. B. Reservierungshinweis)", type: "text", rows: 3 }),
    defineField({
      name: "band",
      title: "Live-Band",
      type: "object",
      fields: [
        defineField({ name: "name", title: "Name", type: "string" }),
        defineField({ name: "genre", title: "Genre", type: "string" }),
      ],
    }),
    defineField({
      name: "highlights",
      title: "Highlights (Bulletpoints auf der Event-Seite)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "icon", title: "Icon-Schlüssel", type: "string" }),
            defineField({ name: "title", title: "Überschrift", type: "string" }),
            defineField({ name: "text", title: "Text", type: "string" }),
          ],
          preview: { select: { title: "title", subtitle: "text" } },
        }),
      ],
    }),
    defineField({
      name: "sponsors",
      title: "Sponsoren",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
  ],
  preview: { select: { title: "title", subtitle: "date" } },
});
