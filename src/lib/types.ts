export type ReservationKind = "restaurant" | "event";

export type Reservation = {
  id: string;
  kind: ReservationKind;
  name: string;
  email: string;
  phone: string;
  date: string; // ISO-Datum (YYYY-MM-DD)
  time: string; // HH:MM (nur bei normaler Reservierung)
  guests: number;
  message?: string;
  createdAt: string; // ISO-Zeitstempel
  status: "neu" | "bestaetigt" | "abgesagt";
};

export type ReservationInput = Omit<Reservation, "id" | "createdAt" | "status">;
