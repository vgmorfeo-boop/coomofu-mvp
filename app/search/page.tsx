"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const TRIPS = [
  { id: "T-BOG-GIR-0700", origin: "Bogotá", destination: "Girardot", duration: "4h 30m", time: "07:00", price: 28000, seats: 32 },
  { id: "T-BOG-GIR-0900", origin: "Bogotá", destination: "Girardot", duration: "4h 30m", time: "09:00", price: 28000, seats: 31 },
  { id: "T-BOG-GIR-1300", origin: "Bogotá", destination: "Girardot", duration: "4h 30m", time: "13:00", price: 28000, seats: 32 },
];

export default function SearchPage() {
  const sp = useSearchParams();
  const router = useRouter();

  const origin = sp.get("origin") || "Bogotá";
  const destination = sp.get("destination") || "Girardot";
  const date = sp.get("date") || "2025-10-02";
  const p = Number(sp.get("passengers") || 1);
  const [passengers, setPassengers] = useState(Math.max(1, p));

  function updatePassengers(next: number) {
    const q = new URLSearchParams({
      origin, destination, date, passengers: String(next),
    });
    router.replace(`/search?${q.toString()}`);
    setPassengers(next);
  }

  const trips = useMemo(() => TRIPS.filter(t => t.origin===origin && t.destination===destination), [origin, destination]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">
          Resultados: {origin} → {destination} ({date})
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Pasajeros</span>
          <div className="flex items-center rounded-lg border border-slate-300">
            <button className="px-3 py-1" onClick={()=>updatePassengers(Math.max(1, passengers-1))}>−</button>
            <div className="px-3 py-1 min-w-[2.5rem] text-center">{passengers}</div>
            <button className="px-3 py-1" onClick={()=>updatePassengers(Math.min(6, passengers+1))}>+</button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {trips.map((trip) => (
          <div key={trip.id} className="card flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900">{trip.origin} → {trip.destination}</p>
              <p className="text-sm text-slate-500">{trip.duration} · {trip.time} · {trip.seats} disp.</p>
            </div>

            <div className="text-right">
              <p className="font-bold text-lg text-slate-900">${trip.price.toLocaleString("es-CO")}</p>
              <Link
                href={`/trip/${trip.id}?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&date=${date}&passengers=${passengers}`}
                className="btn btn-primary mt-2"
              >
                Elegir asientos
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
