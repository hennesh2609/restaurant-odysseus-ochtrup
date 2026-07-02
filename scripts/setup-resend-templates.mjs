// Legt die E-Mail-Templates in Resend an (oder aktualisiert sie) und schreibt
// die Template-IDs nach src/lib/resend-template-ids.json.
//
// Aufruf:  RESEND_API_KEY=re_xxx node scripts/setup-resend-templates.mjs

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { TEMPLATES } from "../src/lib/mail-templates.mjs";

const API = "https://api.resend.com";
const KEY = process.env.RESEND_API_KEY;
if (!KEY) {
  console.error("Fehlt: RESEND_API_KEY (als Umgebungsvariable setzen).");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
};

async function api(method, path, body) {
  const res = await fetch(API + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  return { ok: res.ok, status: res.status, json };
}

async function findByAlias(alias) {
  const { json } = await api("GET", "/templates");
  return (json.data || []).find((t) => t.alias === alias) || null;
}

async function publish(id) {
  // Verschiedene mögliche Endpunkte durchprobieren (Resend-API variiert).
  for (const attempt of [
    ["POST", `/templates/${id}/publish`, undefined],
    ["PATCH", `/templates/${id}`, { status: "published" }],
    ["PUT", `/templates/${id}`, { status: "published" }],
  ]) {
    const r = await api(...attempt);
    if (r.ok) return `published via ${attempt[0]} ${attempt[1]}`;
  }
  return "publish: kein Endpunkt akzeptiert (ggf. im Dashboard veröffentlichen)";
}

const ids = {};

for (const t of TEMPLATES) {
  const existing = await findByAlias(t.alias);
  const payload = {
    name: t.name,
    alias: t.alias,
    subject: t.subject,
    html: t.html,
    variables: Object.keys(t.sample).map((key) => ({ key, type: "string" })),
  };

  let id;
  if (existing) {
    // Update versuchen (PATCH, sonst PUT)
    let r = await api("PATCH", `/templates/${existing.id}`, payload);
    if (!r.ok) r = await api("PUT", `/templates/${existing.id}`, payload);
    id = existing.id;
    console.log(`~ ${t.alias}: aktualisiert (${r.status})`);
  } else {
    const r = await api("POST", "/templates", payload);
    if (!r.ok) {
      console.error(`✗ ${t.alias}: FEHLER`, r.status, JSON.stringify(r.json));
      continue;
    }
    id = r.json.id;
    console.log(`+ ${t.alias}: angelegt (id ${id})`);
  }

  const pub = await publish(id);
  console.log(`  ${pub}`);
  ids[t.key] = id;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "..", "src", "lib", "resend-template-ids.json");
writeFileSync(outPath, JSON.stringify(ids, null, 2) + "\n");
console.log("\nIDs geschrieben nach src/lib/resend-template-ids.json:");
console.log(JSON.stringify(ids, null, 2));
