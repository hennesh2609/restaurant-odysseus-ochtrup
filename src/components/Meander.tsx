// Griechisches Mäandermuster ("Greek Key") – als durchgehend verbundenes Band.
// Greift das Motiv aus dem Odysseus-Schriftzug/Logo auf.
//
// Geometrie eines Kachel-Elements (Breite 24, Höhe 20):
//   Hauptlinie (durchgehend, verbindet alle Kacheln):
//     M0,16 v-12 h16 v12 h8   -> endet bei (24,16) = Start der nächsten Kachel
//   Innen-Spirale (der "Schlüssel"):
//     M16,8 h-10 v4 h6
const TILE = 24;
const KEY_PATH = "M0,16 v-12 h16 v12 h8 M16,8 h-10 v4 h6";

/*
  Durchgehendes Mäander-Band (für Übergänge, Footer-Kante etc.).
  Farbe über die Text-Farbe der Klasse steuerbar (currentColor).
*/
export function GreekKey({
  className = "",
  height = 20,
  strokeWidth = 2,
  idSuffix = "default",
}: {
  className?: string;
  height?: number;
  strokeWidth?: number;
  idSuffix?: string;
}) {
  const id = `greekkey-${idSuffix}`;
  const scale = height / 20;

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ height, lineHeight: 0 }}
    >
      <svg width="100%" height={height} role="presentation">
        <defs>
          <pattern
            id={id}
            x="0"
            y="0"
            width={TILE * scale}
            height={height}
            patternUnits="userSpaceOnUse"
            patternTransform={`scale(${scale})`}
          >
            <path
              d={KEY_PATH}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}

// Rückwärtskompatibler Name – verweist auf das verbundene Band.
export function MeanderStrip({ className = "" }: { className?: string }) {
  return (
    <GreekKey
      className={`w-full text-gold ${className}`}
      height={18}
      idSuffix="strip"
    />
  );
}

/*
  Inline-Trennlinie für Überschriften – nachempfunden dem Divider aus dem
  Odysseus-Logo: zwei lange, schlanke Speerspitzen und in der Mitte ein
  verbundenes Rauten-Zickzack. Farbe über die Text-Farbe steuerbar.
*/
export function Meander({
  className = "",
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  // Verbundenes Rauten-Zickzack in der Mitte
  const diamonds = [86, 98, 110, 122, 134]
    .map((c) => `M${c - 6},10 L${c},5 L${c + 6},10 L${c},15 Z`)
    .join(" ");

  return (
    <div
      className={`flex items-center justify-center gap-3 ${className}`}
      aria-hidden="true"
      style={{ color }}
    >
      <span className="h-px flex-1 max-w-[90px] bg-current opacity-50" />
      <svg
        width="220"
        height="20"
        viewBox="0 0 220 20"
        fill="currentColor"
        className="shrink-0"
      >
        {/* linke Speerspitze (lange, schlanke Raute) */}
        <path d="M6,10 L44,6.4 L74,10 L44,13.6 Z" />
        {/* rechtes Pendant */}
        <path d="M214,10 L176,6.4 L146,10 L176,13.6 Z" />
        {/* verbundenes Rauten-Zickzack in der Mitte */}
        <path d={diamonds} />
      </svg>
      <span className="h-px flex-1 max-w-[90px] bg-current opacity-50" />
    </div>
  );
}
