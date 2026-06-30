// Vollständige Speisekarte des Restaurant Odysseus.
// Übernommen von der bisherigen Website – Preise & Beschreibungen 1:1.

export type MenuItem = {
  no?: string;
  name: string;
  desc?: string;
  price?: string; // einfacher Preis, z.B. "17,50 €"
  variants?: { label: string; price: string }[]; // z.B. Platten für 2/3/4 Personen
};

export type MenuCategory = {
  id: string;
  title: string;
  intro?: string;
  note?: string; // Hinweis am Ende der Kategorie
  items: MenuItem[];
};

export const menu: MenuCategory[] = [
  {
    id: "vorspeisen",
    title: "Vorspeisen",
    note: "Zu allen Vorspeisen reichen wir Brot.",
    items: [
      { no: "496", name: "Brötchen mit hausgemachter Knoblauchkräuterbutter", price: "5,00 €" },
      { no: "5", name: "Gefüllte Kartoffel", desc: "überbacken mit Fetakäse aus dem Backofen", price: "8,10 €" },
      { no: "6", name: "Schnecken", desc: "mit Röstzwiebeln und Pfeffersauce", price: "12,50 €" },
      { no: "7", name: "Gebratene Zucchini mit Tzatziki", price: "10,50 €" },
      { no: "510", name: "Gebratene Champignons", desc: "mit Knoblauch und Petersilie", price: "9,50 €" },
      { no: "8", name: "Octapus gegrillt", price: "18,00 €" },
      { no: "9", name: "Gebratene Auberginen mit Tzatziki", price: "10,50 €" },
      { no: "10", name: "Tzatziki", price: "7,00 €" },
      { no: "11", name: "Octapus Röst", desc: "mit Zwiebeln und Knoblauch", price: "18,60 €" },
      { no: "12", name: "Saganaki", desc: "gebackener Fetakäse paniert", price: "8,80 €" },
      { no: "13", name: "Saganaki pikant", desc: "Fetakäse mit Tomaten und Zwiebeln aus dem Backofen", price: "9,80 €" },
      { no: "14", name: "Dicke Bohnen griechischer Art", price: "8,50 €" },
      { no: "15", name: "Gegrillte Paprikaschoten mit Knoblauch", price: "7,80 €" },
      { no: "16", name: "Gegrillte Peperoni mit Knoblauch", price: "6,80 €" },
      { no: "17", name: "Kalamarakia pikant", desc: "mit Tomatensauce", price: "9,90 €" },
      {
        no: "18",
        name: "Meses – verschiedene kalte Vorspeisen",
        variants: [
          { label: "für 1 Person", price: "15,00 €" },
          { label: "für 2 Personen", price: "26,00 €" },
        ],
      },
      { no: "19", name: "Dolmadakia", desc: "mit Reis gefüllte Weinblätter, dazu Tzatziki", price: "7,80 €" },
      { no: "20", name: "4 Käsesorten", desc: "mit Tomaten und Paprika im Keramiktopf, pikant gewürzt", price: "17,00 €" },
    ],
  },
  {
    id: "salate",
    title: "Salate",
    items: [
      { no: "1", name: "Griechischer Bauernsalat", desc: "Tomaten, Gurken, Blattsalat, Zwiebeln, Peperoni, Oliven, Fetakäse mit Olivenöl", price: "12,80 €" },
      { no: "2", name: "Gemischter Salat", desc: "Krautsalat, Blattsalat, Tomaten, Gurken, Oliven, Peperoni, Paprika, Fetakäse", price: "13,20 €" },
      { no: "3", name: "Chefsalat", desc: "Blattsalat, Tomaten, Gurken, Ei, Käse und Schinken", price: "12,80 €" },
      { no: "4", name: "Thunfischsalat", desc: "Thunfisch, Blattsalat, Tomaten, Gurken, Käse und Ei", price: "13,20 €" },
      { no: "120", name: "Gyros Salat", desc: "Tomaten, Gurken, Blattsalat, Zwiebeln, Peperoni, Oliven, Fetakäse mit Olivenöl und Gyros", price: "17,00 €" },
    ],
  },
  {
    id: "suppen",
    title: "Suppen",
    items: [
      { no: "21", name: "Griechische Bohnensuppe", price: "6,30 €" },
      { no: "22", name: "Gulaschsuppe", price: "6,30 €" },
      { no: "23", name: "Hühnersuppe", price: "6,30 €" },
      { no: "24", name: "Zwiebelsuppe", desc: "mit Käse und Brot überbacken", price: "6,30 €" },
      { no: "89", name: "Tomatensuppe", price: "6,30 €" },
    ],
  },
  {
    id: "vom-grill",
    title: "Vom Grill",
    note: "Zu diesen Gerichten reichen wir Reis, Pommes & Salat vom Buffet. * = konservierter Schwarzwälder Schinken.",
    items: [
      { no: "25", name: "Gyros", desc: "Schweinefleisch pikant gewürzt, dazu Tzatziki", price: "17,50 €" },
      { no: "26", name: "Gyros Spezial", desc: "Schweinefleisch in pikanter Metaxasahnesauce, mit Käse überbacken", price: "18,50 €" },
      { no: "27", name: "Souvlaki", desc: "2 Spieße vom Schwein", price: "16,50 €" },
      { no: "29", name: "Leber vom Schwein", desc: "mit Röstzwiebeln", price: "14,80 €" },
      { no: "30", name: "Bifteki", desc: "Hacksteak mit Fetakäse gefüllt", price: "17,80 €" },
      { no: "31", name: "Mixed Grill", desc: "1 Souvlaki, 1 Bifteki, 1 Lammkotelett und Gyros", price: "19,20 €" },
      { no: "35", name: "Gyros mit Schweineleber", price: "15,50 €" },
      { no: "38", name: "Paros-Teller", desc: "Gyros und 1 Souvlaki (Fleischspieß)", price: "15,80 €" },
      { no: "39", name: "Kos-Teller", desc: "Gyros und 2 Bifteki mit Fetakäse gefüllt", price: "18,80 €" },
      { no: "40", name: "Santorini-Teller", desc: "Gyros und 2 Souvlaki (Fleischspieße)", price: "17,90 €" },
      { no: "41", name: "Grill-Teller", desc: "1 Kotelett vom Schwein, 1 Souvlaki, 1 Bifteki und Gyros", price: "19,80 €" },
      { no: "42", name: "Sokrates-Teller", desc: "2 Steaks vom Schwein, 2 Lammkoteletts, 2 Bifteki", price: "20,30 €" },
      { no: "43", name: "Ouzo-Teller", desc: "1 Souvlaki, 2 Bifteki und Gyros", price: "19,80 €" },
      { no: "44", name: "Helena-Teller", desc: "1 Souvlaki, 1 Bifteki und Gyros", price: "18,50 €" },
      { no: "46", name: "Odysseus-Spezialteller", desc: "1 Steak vom Schwein, 1 Kotelett vom Schwein, 1 Souvlaki, 1 Lammkotelett, 1 Scheibe Leber, 1 Bifteki, Gyros und Tzatziki", price: "26,00 €" },
      { no: "47", name: "Achilles-Teller", desc: "1 Steak vom Schwein, 1 Lammkotelett, 1 Souvlaki, 1 Scheibe Leber und 1 Bifteki", price: "20,00 €" },
      { no: "50", name: "Dionysos-Teller", desc: "1 Steak vom Schwein, 1 Kotelett vom Schwein, Gyros, 3 Dolmadakia, dazu Tzatziki", price: "19,80 €" },
      { no: "95", name: "Rhodos-Teller", desc: "1 Schweinefilet gefüllt mit Fetakäse und Schinken *", price: "23,00 €" },
    ],
  },
  {
    id: "neu-aus-griechenland",
    title: "NEU aus Griechenland",
    note: "Zu diesen Gerichten reichen wir Reis, Pommes & Salat vom Buffet.",
    items: [
      { no: "345", name: "Saftiges Tomahawk Kotelett vom Schwein", desc: "nach original griechischer Art – das Fleisch kommt direkt aus der Region Drama in Griechenland", price: "19,20 €" },
    ],
  },
  {
    id: "spezialitaeten-des-hauses",
    title: "Spezialitäten des Hauses",
    note: "Zu diesen Gerichten reichen wir Reis, Pommes & Salat vom Buffet.",
    items: [
      { no: "52", name: "Dorf-Teller", desc: "1 Bauernspieß, 1 Stück Filet und Gyros, dazu Tzatziki", price: "19,90 €" },
      { no: "55", name: "Berg-Teller", desc: "2 Bauernspieße, dazu Tzatziki", price: "17,50 €" },
      { no: "56", name: "Bauern-Teller", desc: "2 Bauernspieße, 1 Scheibe Leber und Gyros, dazu Tzatziki", price: "21,00 €" },
      { no: "28", name: "Korfu-Teller", desc: "1 Bauernspieß und Gyros, dazu Tzatziki", price: "18,00 €" },
      { no: "36", name: "Zeus-Teller", desc: "1 Bauernspieß mit Schweinekotelett, Gyros, dazu Tzatziki", price: "19,50 €" },
      { no: "150", name: "Spezial Spieß", desc: "Schweinefiletmedaillons mit Auberginen, Tomaten und Käse", price: "23,50 €" },
      { no: "151", name: "Filetteller", desc: "2 Stück Lammfilets, 1 Stück Schweinefilet, 1 Stück Rinderfilet", price: "28,00 €" },
      { no: "54", name: "1 Filetspieß vom Schwein, mit Gyros", price: "19,90 €" },
      { no: "152", name: "Steakteller", desc: "Lammhüftsteak, argentinisches Rumpsteak und Schweinesteak", price: "27,00 €" },
    ],
  },
  {
    id: "hausgemachte-sauce",
    title: "Spezialitäten mit hausgemachter Sauce",
    note: "Zu diesen Gerichten reichen wir Reis, Pommes & Salat vom Buffet.",
    items: [
      { no: "37", name: "Aristoteles-Teller", desc: "2 gefüllte Schweinefleischbällchen mit Champignons, Schinken und Käse, mit Champignonsauce", price: "18,20 €" },
      { no: "51", name: "Aris-Teller", desc: "1 gefülltes Schweinefleischbällchen mit Champignons, Schinken, Käse, 1 gefülltes Schnitzel mit Käse in Metaxasauce", price: "18,00 €" },
      { no: "32", name: "Aphroditis-Teller", desc: "Schweinefilet mit Kräutersauce", price: "20,00 €" },
      { no: "98", name: "Zorbas-Teller", desc: "Schweinefilet mit Champignon- und Pfifferlingssauce", price: "20,30 €" },
      { no: "99", name: "Olympos-Teller", desc: "3 Schweinesteaks mit Champignon- und Pfifferlingssauce", price: "18,50 €" },
    ],
  },
  {
    id: "pfaennchen",
    title: "Pfännchen Gerichte",
    note: "Zu diesen Gerichten reichen wir Reis, Pommes & Salat vom Buffet. Zusatzstoffe: 1 = Farbstoff, 4 = Geschmacksverstärker.",
    items: [
      { no: "87", name: "Pfännchen Plaka", desc: "3 Schweinesteakmedaillons mit Roquefortsauce", price: "22,40 €" },
      { no: "88", name: "Pfännchen Athos", desc: "Schweinefilet mit Roquefortsauce", price: "23,50 €" },
      { no: "90", name: "Pfännchen Kreta", desc: "Rinderfilet mit Roquefortsauce", price: "28,50 €" },
      { no: "190", name: "Pfännchen Kreta", desc: "Rinderfilet mit Roquefortsauce und Pflaumen", price: "29,80 €" },
      { no: "91", name: "Pfännchen Joannina", desc: "Schweinefilet mit Weinsauce", price: "22,80 €" },
      { no: "191", name: "Pfännchen Joannina", desc: "Schweinefilet mit Weinsauce und Pflaumen", price: "23,80 €" },
      { no: "92", name: "Pfännchen Korfu", desc: "3 Schweinesteakmedaillons mit Weinsauce", price: "22,00 €" },
      { no: "96", name: "Pfännchen Athen", desc: "3 Schweinesteakmedaillons mit Champignonsauce", price: "21,50 €" },
      { no: "97", name: "Pfännchen Thassos", desc: "Schweinefilet im Pfännchen mit Sauce Béarnaise 1,4", price: "23,50 €" },
      { no: "100", name: "Pfännchen Hellas", desc: "Rinderfilet mit Metaxasauce", price: "29,50 €" },
      { no: "136", name: "Pfännchen Apollo", desc: "Lammfilet mit Weinsauce", price: "26,50 €" },
      { no: "156", name: "Pfännchen Rosmarin", desc: "Lammfilet mit Rosmarinsauce", price: "26,50 €" },
    ],
  },
  {
    id: "schnitzel",
    title: "Schnitzel",
    intro: "vom Schwein",
    note: "Zu diesen Gerichten reichen wir Reis, Pommes & Salat vom Buffet.",
    items: [
      { no: "102", name: "Zwiebelschnitzel", price: "17,30 €" },
      { no: "103", name: "Käse-Rahmschnitzel", price: "18,80 €" },
      { no: "105", name: "Schnitzel paniert", price: "16,30 €" },
      { no: "206", name: "Schweinesteak vom Grill", price: "17,00 €" },
      { no: "207", name: "Schweinesteak vom Grill", desc: "gefüllt mit Käse und Schinken", price: "18,00 €" },
      { no: "141", name: "Metaxaschnitzel", price: "18,30 €" },
    ],
  },
  {
    id: "gefluegel",
    title: "Geflügel",
    note: "Zu diesen Gerichten reichen wir Reis, Pommes & Salat vom Buffet.",
    items: [
      { no: "137", name: "Zwei Hähnchenbrustfilets gegrillt", desc: "mit Kräuterbutter", price: "17,80 €" },
      { no: "138", name: "Zwei Hähnchenbrustfilets gegrillt", desc: "mit Sauce Hollandaise (mit pflanzlichen Fetten, evtl. Farbstoff)", price: "18,10 €" },
    ],
  },
  {
    id: "lamm",
    title: "Lamm",
    note: "Zu diesen Gerichten reichen wir Reis, Pommes & Salat vom Buffet.",
    items: [
      { no: "45", name: "Samos-Teller", desc: "Lammkoteletts (6 Stück)", price: "26,20 €" },
      { no: "48", name: "Serres-Teller", desc: "Lammhüftsteaks", price: "29,00 €" },
      { no: "53", name: "Lammteller", desc: "2 Lammkoteletts, 1 Lammfilet und 2 Lammhüftsteaks", price: "28,00 €" },
    ],
  },
  {
    id: "vom-rind",
    title: "Vom Rind",
    note: "Zu diesen Gerichten reichen wir Reis, Pommes & Salat vom Buffet.",
    items: [
      { no: "153", name: "Rinderfiletsteak mit Pfeffersauce", price: "34,00 €" },
      { no: "154", name: "Rinderfiletsteak mit Kräuterbutter", price: "34,00 €" },
      { no: "33", name: "Delphi-Teller", desc: "Argentinisches Rumpsteak mit Röstzwiebeln", price: "29,00 €" },
      { no: "34", name: "Thessaloniki-Teller", desc: "Argentinisches Rumpsteak mit Pfeffersauce", price: "29,00 €" },
      { no: "94", name: "Anastasia-Teller", desc: "Argentinisches Rumpsteak mit Champignon- und Pfifferlingssauce", price: "29,00 €" },
    ],
  },
  {
    id: "backofen",
    title: "Spezialitäten aus dem Backofen",
    items: [
      { no: "62", name: "Lammfleisch mit Spaghetti", price: "21,50 €" },
      { no: "63", name: "Lammfleisch mit grünen Bohnen", price: "21,50 €" },
      { no: "65", name: "Lammfleisch mit großen Bohnen", price: "21,50 €" },
      { no: "66", name: "Juwezi", desc: "Rindfleisch mit Reisnudeln überbacken mit Fetakäse", price: "21,50 €" },
      { no: "67", name: "Rindfleisch mit Spaghetti", price: "21,50 €" },
      { no: "68", name: "Rindfleisch mit grünen Bohnen", price: "21,50 €" },
      { no: "70", name: "Rindfleisch mit großen Bohnen", price: "21,50 €" },
    ],
  },
  {
    id: "fisch",
    title: "Fisch",
    intro: "Fragen Sie nach speziellen Fischgerichten.",
    items: [
      { no: "72", name: "Garides (Garnelen, 6 Stück) vom Grill", desc: "mit Knoblauch, dazu Folienkartoffel mit Tzatziki und Salat", price: "25,20 €" },
      { no: "73", name: "2 Scampispieße", desc: "dazu Folienkartoffel mit Tzatziki und Salat", price: "21,00 €" },
      { no: "74", name: "Kalamaris (Tintenfischringe)", desc: "mit Tzatziki und Salat", price: "19,20 €" },
      { no: "75", name: "Ganze Kalamaris", desc: "mit Tzatziki und Salat", price: "20,20 €" },
    ],
  },
  {
    id: "pizza",
    title: "Hausgemachte Pizza",
    intro: "Alle Pizzen mit Tomatensauce und Käse.",
    items: [
      { no: "110", name: "Pizza mit gekochtem Formvorderschinken, Ananas und Champignons", price: "11,80 €" },
      { no: "111", name: "Pizza mit Champignons", price: "10,00 €" },
      { no: "112", name: "Pizza mit Salami und Champignons", price: "10,30 €" },
      { no: "113", name: "Pizza mit Salami und Paprika", price: "10,30 €" },
      { no: "114", name: "Pizza mit gekochtem Formvorderschinken und Champignons", price: "10,30 €" },
      { no: "115", name: "Pizza mit gekochtem Formvorderschinken, Salami und Champignons", price: "11,00 €" },
      { no: "116", name: "Pizza mit Thunfisch, Zwiebeln und Champignons", price: "11,50 €" },
      { no: "117", name: "Pizza Vegetarisch", desc: "mit Oliven, Artischocken, Paprika, Zwiebeln und Champignons", price: "11,50 €" },
      { no: "118", name: "Pizza Margherita", price: "9,50 €" },
      { no: "119", name: "Pizza mit Gyros und Peperoni", price: "12,00 €" },
      { no: "128", name: "Bauernpizza", desc: "mit Fetakäse, Champignons und Paprika", price: "12,00 €" },
      { no: "145", name: "Pizza mit frischen Tomaten und Käse", price: "10,00 €" },
      { no: "146", name: "Pizza mit Gyros und Metaxa-Sauce", price: "14,00 €" },
    ],
  },
  {
    id: "platten",
    title: "Platten",
    intro: "Üppige Platten zum Teilen – als Beilage Reis und Pommes frites.",
    items: [
      {
        no: "58",
        name: "Odysseus-Platte",
        desc: "Vorspeise: Tzatziki, 2 gefüllte Bällchen mit Champignons, Schinken und Käse, 2 gefüllte Schweineschnitzel mit Käse, 2 kleine Steaks, Tortellini mit Champignonsauce",
        variants: [
          { label: "2 Personen", price: "49,00 €" },
          { label: "3 Personen", price: "73,00 €" },
          { label: "4 Personen", price: "96,00 €" },
        ],
      },
      {
        no: "59",
        name: "Makedonia-Platte",
        desc: "Vorspeise: Tzatziki, 2 Schweinekoteletts, 2 Lammkoteletts, 2 Bifteki (Hacksteaks), 2 Souvlaki, Gyros",
        variants: [
          { label: "2 Personen", price: "48,00 €" },
          { label: "3 Personen", price: "71,00 €" },
          { label: "4 Personen", price: "95,00 €" },
        ],
      },
      {
        no: "60",
        name: "Akropolis-Platte",
        desc: "Vorspeise: Tzatziki, 2 Bifteki (Hacksteaks), 2 Schweinesteaks, 2 Schweinefilets, Gyros, 2 Bauernspieße",
        variants: [
          { label: "2 Personen", price: "53,00 €" },
          { label: "3 Personen", price: "79,00 €" },
          { label: "4 Personen", price: "102,00 €" },
        ],
      },
    ],
  },
  {
    id: "nudelgerichte",
    title: "Nudelgerichte",
    items: [
      { no: "121", name: "Spaghetti Bolognese", price: "15,50 €" },
      { no: "122", name: "Penne de la Casa", desc: "Nudeln mit Champignonsauce, Bolognese und Käse überbacken", price: "16,50 €" },
      { no: "124", name: "Tortellini Speziale", desc: "Gefüllte Nudeln, Champignonsauce, Bolognese und Käse überbacken", price: "16,50 €" },
      { no: "125", name: "Griechische Reisnudeln", desc: "mit Metaxa-Sauce und Käse überbacken", price: "15,00 €" },
    ],
  },
  {
    id: "kinder-senioren",
    title: "Kinder- und Seniorenteller",
    items: [
      { no: "80", name: "Gyros mit Pommes frites und Salat", price: "12,30 €" },
      { no: "81", name: "2 Bifteki (Hacksteaks) mit Pommes frites und Salat", price: "11,20 €" },
      { no: "82", name: "Hähnchenbrustschnitzel (paniert) mit Pommes frites und Salat", price: "12,50 €" },
      { no: "83", name: "Spaghetti Bolognese", price: "7,90 €" },
      { no: "84", name: "Spaghetti mit Ketchup", price: "7,50 €" },
      { no: "85", name: "1 Souvlaki (Fleischspieß) mit Pommes frites und Salat", price: "10,00 €" },
      { no: "86", name: "2 kleine Schweinesteaks mit Pommes frites und Salat", price: "10,50 €" },
      { no: "155", name: "Hähnchenbrustfilet gegrillt mit Pommes frites und Salat", price: "12,30 €" },
    ],
  },
  {
    id: "beilagen-saucen",
    title: "Beilagen / Saucen",
    note: "Zusatzstoffe: 1 = Farbstoff, 4 = Geschmacksverstärker.",
    items: [
      { no: "106", name: "Pommes frites", price: "4,60 €" },
      { no: "107", name: "Djuwetschreis / Butterreis", price: "4,50 €" },
      { no: "108", name: "Potatoes", price: "4,60 €" },
      { no: "109", name: "Folienkartoffel mit Tzatziki", price: "6,10 €" },
      { no: "123", name: "Gebratenes Gemüse", price: "6,50 €" },
      { no: "129", name: "Sauce Béarnaise 1,4", price: "4,90 €" },
      { no: "130", name: "Metaxasauce", price: "4,90 €" },
      { no: "131", name: "Champignon- und Pfifferlingsauce", price: "4,90 €" },
      { no: "132", name: "Champignonsauce", price: "4,90 €" },
      { no: "133", name: "Pfeffersauce", price: "4,90 €" },
      { no: "134", name: "Sauce Hollandaise", price: "4,90 €" },
      { no: "135", name: "Kräutersauce", price: "4,90 €" },
    ],
  },
  {
    id: "nachspeisen",
    title: "Nachspeisen",
    note: "Des Weiteren führen wir verschiedene Eissorten.",
    items: [
      { no: "49", name: "Griechischer Joghurt mit Honig und Walnüssen", price: "6,50 €" },
    ],
  },
];

// Eine handverlesene Auswahl an Highlights für die Startseite.
export const highlights: MenuItem[] = [
  { no: "25", name: "Gyros", desc: "Schweinefleisch pikant gewürzt, dazu Tzatziki", price: "17,50 €" },
  { no: "30", name: "Bifteki", desc: "Hacksteak mit Fetakäse gefüllt", price: "17,80 €" },
  { no: "46", name: "Odysseus-Spezialteller", desc: "Das große Grillerlebnis – Steak, Souvlaki, Lammkotelett, Leber, Bifteki & Gyros", price: "26,00 €" },
  { no: "8", name: "Octapus gegrillt", desc: "Frisch vom Grill, mediterran gewürzt", price: "18,00 €" },
  { no: "1", name: "Griechischer Bauernsalat", desc: "Mit Fetakäse, Oliven und Olivenöl", price: "12,80 €" },
  { no: "49", name: "Griechischer Joghurt", desc: "Mit Honig und Walnüssen", price: "6,50 €" },
];
