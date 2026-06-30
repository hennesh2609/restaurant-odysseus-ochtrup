// Zentrale Stammdaten des Restaurants – an einer Stelle pflegbar.

export const restaurant = {
  name: "Restaurant Odysseus",
  tagline: "Griechische Gastfreundschaft in Ochtrup",
  owner: "Nikolaos Smyridis",
  street: "Kniepenkamp 1",
  zip: "48607",
  city: "Ochtrup",
  country: "Deutschland",
  phone: "02553 1204",
  phoneHref: "+4925531204",
  fax: "02553 977175",
  email: "info@odysseus-ochtrup.de",
  mapsQuery: "Restaurant Odysseus, Kniepenkamp 1, 48607 Ochtrup",
} as const;

export type OpeningHour = {
  days: string;
  time: string;
  note?: string;
  closed?: boolean;
};

export const openingHours: OpeningHour[] = [
  { days: "Montag & Dienstag", time: "Ruhetag", note: "außer an Feiertagen", closed: true },
  { days: "Mittwoch – Samstag", time: "17:30 – 23:00 Uhr" },
  { days: "Sonntag & Feiertage", time: "12:00 – 14:30 & 17:30 – 23:00 Uhr" },
];

// Kurzfassung für die Reservierungs-Logik (Wochentag 0=So ... 6=Sa)
export const openDays = [0, 3, 4, 5, 6]; // So, Mi, Do, Fr, Sa (Mo/Di Ruhetag)
