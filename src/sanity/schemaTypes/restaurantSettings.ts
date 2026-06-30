import { defineType, defineField, defineArrayMember } from "sanity";

export const restaurantSettings = defineType({
  name: "restaurantSettings",
  title: "Restaurant-Einstellungen",
  type: "document",
  icon: () => "🏛️",
  fields: [
    defineField({
      name: "phone",
      title: "Telefon",
      type: "string",
    }),
    defineField({
      name: "email",
      title: "E-Mail",
      type: "string",
    }),
    defineField({
      name: "fax",
      title: "Fax",
      type: "string",
    }),
    defineField({
      name: "openingHours",
      title: "Öffnungszeiten",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "hour",
          fields: [
            defineField({ name: "days", title: "Tage", type: "string" }),
            defineField({ name: "time", title: "Uhrzeit / Text", type: "string" }),
            defineField({ name: "note", title: "Hinweis (optional)", type: "string" }),
            defineField({ name: "closed", title: "Ruhetag?", type: "boolean", initialValue: false }),
          ],
          preview: {
            select: { title: "days", subtitle: "time" },
          },
        }),
      ],
    }),
  ],
  preview: { select: { title: "phone" }, prepare: () => ({ title: "Restaurant-Einstellungen" }) },
});
