// lib/data/trips.ts
export type Trip = {
  id: string;                // p.ej. T-BOG-GIR-0700
  origin: string;            // "Bogotá"
  destination: string;       // "Girardot"
  date: string;              // "2025-10-02"
  departure: string;         // "07:00"
  duration: string;          // "4h 30m"
  price: number;             // 28000
  seats: number;             // 12..36 (disponibles)
};

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

function slugCity(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase()
    .slice(0, 3);
}

/**
 * Genera un ID estable tipo: T-BOG-GIR-0700
 */
export function makeTripId(origin: string, destination: string, hhmm: string) {
  return `T-${slugCity(origin)}-${slugCity(destination)}-${hhmm.replace(":", "")}`;
}

/**
 * Genera horarios entre startHour y endHour, cada stepMinutes
 */
function generateTimeSlots(
  startHour = 5,
  endHour = 21,
  stepMinutes = 60
): string[] {
  const res: string[] = [];
  let minutes = startHour * 60;
  const last = endHour * 60;

  while (minutes <= last) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    res.push(`${pad(h)}:${pad(m)}`);
    minutes += stepMinutes;
  }
  return res;
}

/**
 * Precio base “bonito” + ajuste por hora para variar un poco.
 */
function computePrice(base = 28000, hhmm: string) {
  const hour = parseInt(hhmm.slice(0, 2), 10);
  // Ej: mañana más barato, tarde sube un poco
  const delta =
    hour < 8 ? -2000 : hour < 12 ? 0 : hour < 18 ? 3000 : 1000;
  return Math.max(20000, base + delta);
}

/**
 * Asientos disponibles pseudoaleatorios pero estables por (ruta+fecha+hora)
 */
function stableSeats(origin: string, dest: string, date: string, hhmm: string) {
  const seedStr = `${origin}-${dest}-${date}-${hhmm}`;
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash * 31 + seedStr.charCodeAt(i)) | 0;
  }
  // 18..36
  return 18 + Math.abs(hash % 19);
}

/**
 * Devuelve una lista “amplia” de viajes para mostrar en /search
 * - Por defecto: cada 60 minutos de 05:00 a 21:00
 */
export function listTrips(
  origin: string,
  destination: string,
  date: string,
  opts?: {
    startHour?: number;
    endHour?: number;
    stepMinutes?: number;
  }
): Trip[] {
  const { startHour = 5, endHour = 21, stepMinutes = 60 } = opts || {};
  const times = generateTimeSlots(startHour, endHour, stepMinutes);

  const duration = "4h 30m";
  return times.map((hhmm) => {
    const id = makeTripId(origin, destination, hhmm);
    return {
      id,
      origin,
      destination,
      date,
      departure: hhmm,
      duration,
      price: computePrice(28000, hhmm),
      seats: stableSeats(origin, destination, date, hhmm),
    };
  });
}

/**
 * Reconstruye un Trip a partir de un id + fecha (útil en /trip/[id])
 * Soporta ID tipo: T-BOG-GIR-0700
 */
export function getTripById(id: string, date: string): Trip | null {
  const m = id.match(/^T-([A-Z]{3})-([A-Z]{3})-(\d{4})$/);
  if (!m) return null;

  const [, o3, d3, hhmmRaw] = m;
  const hhmm = `${hhmmRaw.slice(0, 2)}:${hhmmRaw.slice(2)}`;

  // Nota: Si quieres nombres “bonitos” en base a las siglas, puedes mapear aquí:
  // Por simplicidad, dejamos las siglas tal cual; ajusta si quieres nombres completos.
  const origin = o3;
  const destination = d3;

  return {
    id,
    origin,
    destination,
    date,
    departure: hhmm,
    duration: "4h 30m",
    price: computePrice(28000, hhmm),
    seats: stableSeats(origin, destination, date, hhmm),
  };
}
