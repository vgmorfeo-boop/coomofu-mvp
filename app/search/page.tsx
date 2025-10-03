// app/search/page.tsx
import { listTrips } from "@/lib/data/trips";
// ... (tus imports actuales)

export default function SearchPage({
  searchParams,
}: {
  searchParams: { origin?: string; destination?: string; date?: string; passengers?: string };
}) {
  const origin = searchParams.origin ?? "Bogotá";
  const destination = searchParams.destination ?? "Girardot";
  const date = searchParams.date ?? new Date().toISOString().slice(0, 10);
  const passengers = Number(searchParams.passengers ?? "1");

  // ⬇️ NUEVO: genera muchos horarios (cada 60 min 05:00–21:00)
  const trips = listTrips(origin, destination, date, {
    startHour: 5,
    endHour: 21,
    stepMinutes: 60,
  });

  // ...tu render actual (cards/lista). Ejemplo:
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">
        Resultados: {origin} → {destination} ({date})
      </h1>

      <div className="space-y-4">
        {trips.map((trip) => (
          // si usas un componente TripCard, deja lo tuyo:
          // <TripCard key={trip.id} trip={trip} passengers={passengers} />
          <div key={trip.id} className="rounded border p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">
                {origin} → {destination}
              </div>
              <div className="text-sm text-slate-600">
                Sale {trip.departure} · {trip.duration} · {trip.seats} disp.
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">
                ${trip.price.toLocaleString("es-CO")}
              </div>
              <a
                className="btn btn-primary inline-block mt-2"
                href={`/trip/${trip.id}?date=${date}&passengers=${passengers}`}
              >
                Elegir asientos
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
