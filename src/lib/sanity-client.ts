import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export function isSanityConfigured(): boolean {
  return Boolean(projectId && projectId !== "nicht-gesetzt");
}

export const sanityClient = createClient({
  projectId: projectId || "dummy",
  dataset,
  apiVersion: "2024-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}

// Typed fetch helper – returns null when Sanity is not configured.
export async function sanityFetch<T>(query: string, params?: Record<string, unknown>): Promise<T | null> {
  if (!isSanityConfigured()) return null;
  try {
    return await sanityClient.fetch<T>(query, params ?? {});
  } catch {
    return null;
  }
}
