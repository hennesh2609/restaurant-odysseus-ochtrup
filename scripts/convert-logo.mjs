import sharp from "sharp";

const src = "Odysseus Schiff Logo transp.svg";
const out = "public/images/odysseus-schiff-logo.png";

// Hohe Dichte für scharfe Rasterisierung; auf sinnvolle Mailbreite skalieren.
const buf = await sharp(src, { density: 300 })
  .resize({ width: 640, withoutEnlargement: false })
  .png()
  .toBuffer();

await sharp(buf).toFile(out);
const meta = await sharp(out).metadata();
console.log(`OK -> ${out} (${meta.width}x${meta.height}, hasAlpha=${meta.hasAlpha})`);
