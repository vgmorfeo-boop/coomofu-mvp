export const stations = [
  "Bogotá",
  "Funza",
  "Mosquera",
  "La Mesa",
  "Tocaima",
  "Girardot",
  "Madrid",
] as const;

export type Station = typeof stations[number];

export type Trip = {
  id: string;
  origin: Station;
  destination: Station;
  date: string; // YYYY-MM-DD
  departTime: string; // HH:mm
  durationMin: number;
  price: number; // COP
  totalSeats: number;
  takenSeats: number[]; // seat numbers
};

// Simple demo dataset for the next 7 days
function addDays(d: Date, days: number) {
  const copy = new Date(d.getTime());
  copy.setDate(copy.getDate() + days);
  return copy.toISOString().slice(0, 10);
}

const today = new Date();
const d0 = addDays(today, 0);
const d1 = addDays(today, 1);
const d2 = addDays(today, 2);
const d3 = addDays(today, 3);

export const trips: Trip[] = [
  { id: "T-BOG-GIR-0700", origin: "Bogotá", destination: "Girardot", date: d0, departTime: "07:00", durationMin: 210, price: 28000, totalSeats: 40, takenSeats: [1,2,3,8,10,16,22,33] },
  { id: "T-BOG-GIR-0900", origin: "Bogotá", destination: "Girardot", date: d0, departTime: "09:00", durationMin: 210, price: 28000, totalSeats: 40, takenSeats: [4,5,6,9,13,17,24,27,31] },
  { id: "T-BOG-GIR-1300", origin: "Bogotá", destination: "Girardot", date: d0, departTime: "13:00", durationMin: 210, price: 28000, totalSeats: 40, takenSeats: [2,7,12,14,20,21,29,37] },

  { id: "T-FUN-GIR-0800", origin: "Funza", destination: "Girardot", date: d0, departTime: "08:00", durationMin: 195, price: 25000, totalSeats: 36, takenSeats: [3,5,7,9,11,13,15,18,22,36] },
  { id: "T-FUN-GIR-1100", origin: "Funza", destination: "Girardot", date: d0, departTime: "11:00", durationMin: 195, price: 25000, totalSeats: 36, takenSeats: [1,2,4,6,8,12,16,20,24,28,32] },

  { id: "T-BOG-LAM-0700", origin: "Bogotá", destination: "La Mesa", date: d0, departTime: "07:00", durationMin: 140, price: 18000, totalSeats: 30, takenSeats: [1,4,8,12,16,20,24,28] },
  { id: "T-BOG-LAM-1000", origin: "Bogotá", destination: "La Mesa", date: d0, departTime: "10:00", durationMin: 140, price: 18000, totalSeats: 30, takenSeats: [3,6,9,15,18,21,27] },

  // Add trips for next days
  { id: "T-BOG-GIR-0700-D1", origin: "Bogotá", destination: "Girardot", date: d1, departTime: "07:00", durationMin: 210, price: 28000, totalSeats: 40, takenSeats: [1,2,3,8,9,12,16,20,27,33] },
  { id: "T-BOG-GIR-0900-D1", origin: "Bogotá", destination: "Girardot", date: d1, departTime: "09:00", durationMin: 210, price: 28000, totalSeats: 40, takenSeats: [5,6,7,9,13,15,17,24,31] },

  { id: "T-FUN-GIR-0800-D2", origin: "Funza", destination: "Girardot", date: d2, departTime: "08:00", durationMin: 195, price: 25000, totalSeats: 36, takenSeats: [2,4,6,8,10,12,14,16,18,20,34] },

  { id: "T-BOG-TOC-0630-D3", origin: "Bogotá", destination: "Tocaima", date: d3, departTime: "06:30", durationMin: 180, price: 23000, totalSeats: 32, takenSeats: [1,2,3,30,31,32] },
];

export function searchTrips(origin: string, destination: string, date: string) {
  return trips
    .filter(t => t.origin === origin && t.destination === destination && t.date === date)
    .sort((a, b) => a.departTime.localeCompare(b.departTime));
}

export function getTripById(id: string) {
  return trips.find(t => t.id === id) || null;
}
