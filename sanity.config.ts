import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemaTypes";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "nicht-gesetzt";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  projectId,
  dataset,
  basePath: "/studio",
  title: "Odysseus Ochtrup",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Inhalt")
          .items([
            S.listItem()
              .title("Speisekarte")
              .child(
                S.documentTypeList("menuCategory")
                  .title("Kategorien")
                  .defaultOrdering([{ field: "displayOrder", direction: "asc" }])
              ),
            S.divider(),
            S.listItem()
              .title("Bilder")
              .id("siteImages")
              .child(
                S.document()
                  .schemaType("siteImages")
                  .documentId("siteImages")
                  .title("Website-Bilder")
              ),
            S.listItem()
              .title("Event – Deutsch-Griechische Nacht")
              .id("eventInfo")
              .child(
                S.document()
                  .schemaType("eventInfo")
                  .documentId("eventInfo")
                  .title("Event-Daten")
              ),
            S.listItem()
              .title("Restaurant-Einstellungen")
              .id("restaurantSettings")
              .child(
                S.document()
                  .schemaType("restaurantSettings")
                  .documentId("restaurantSettings")
                  .title("Öffnungszeiten & Kontakt")
              ),
          ]),
    }),
  ],

  schema: { types: schemaTypes },
});
