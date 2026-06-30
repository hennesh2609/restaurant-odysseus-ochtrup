import { defineType, defineField, defineArrayMember } from "sanity";

export const menuCategory = defineType({
  name: "menuCategory",
  title: "Speisekarte – Kategorie",
  type: "document",
  icon: () => "🍽️",
  fields: [
    defineField({
      name: "categoryId",
      title: "ID (Englisch, kein Leerzeichen)",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "Kategorienname",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "displayOrder",
      title: "Reihenfolge (1 = zuerst)",
      type: "number",
      initialValue: 99,
    }),
    defineField({
      name: "intro",
      title: "Einleitung (optional)",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "note",
      title: "Hinweis am Ende (optional)",
      type: "string",
    }),
    defineField({
      name: "items",
      title: "Gerichte",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "menuItem",
          fields: [
            defineField({ name: "no", title: "Nummer (optional)", type: "string" }),
            defineField({ name: "name", title: "Name", type: "string", validation: (r) => r.required() }),
            defineField({ name: "desc", title: "Beschreibung (optional)", type: "text", rows: 2 }),
            defineField({ name: "price", title: "Preis (z. B. \"12,50 €\")", type: "string" }),
            defineField({
              name: "variants",
              title: "Varianten / Portionsgrößen",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({ name: "label", title: "Bezeichnung (z. B. \"für 2 Personen\")", type: "string" }),
                    defineField({ name: "price", title: "Preis", type: "string" }),
                  ],
                  preview: { select: { title: "label", subtitle: "price" } },
                }),
              ],
            }),
            defineField({
              name: "highlight",
              title: "Auf der Startseite hervorheben?",
              type: "boolean",
              initialValue: false,
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "price" },
            prepare: ({ title, subtitle }) => ({
              title: title || "(kein Name)",
              subtitle: subtitle || "",
            }),
          },
        }),
      ],
    }),
  ],
  orderings: [
    { title: "Reihenfolge", name: "displayOrder", by: [{ field: "displayOrder", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "displayOrder" },
    prepare: ({ title, subtitle }) => ({ title, subtitle: `Position ${subtitle}` }),
  },
});
