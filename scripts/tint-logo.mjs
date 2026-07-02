import sharp from "sharp";

// Erzeugt eine cremefarbene Variante des transparenten Logos (für dunklen Header).
const src = "public/images/odysseus-schiff-logo.png";
const out = "public/images/odysseus-logo-cream.png";

const base = sharp(src).ensureAlpha();
const meta = await base.metadata();
const width = meta.width;
const height = meta.height;

// Alpha-Kanal (Silhouette) extrahieren
const alphaRaw = await base.clone().extractChannel("alpha").raw().toBuffer();

// Vollflächig creme
const solidPng = await sharp({
  create: { width, height, channels: 3, background: { r: 245, g: 234, b: 216 } },
})
  .png()
  .toBuffer();

// Creme + Original-Alpha => cremefarbenes Logo mit gleicher Form
await sharp(solidPng)
  .joinChannel(alphaRaw, { raw: { width, height, channels: 1 } })
  .png()
  .toFile(out);

const m = await sharp(out).metadata();
console.log(`OK -> ${out} (${m.width}x${m.height}, hasAlpha=${m.hasAlpha})`);
