"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import SeatPicker from "@/components/SeatPicker";

export default function TripDetail({ params }: { params: { id: string } }) {
  const sp = useSearchParams();
  const router = useRouter();

  const origin = sp.get("origin") || "Bogotá";
  const destination = sp.get("destination") || "Girardot";
  const date = sp.get("date") || "2025-10-02";
  const passengers = Math.max(1, Number(sp.get("passengers") || 1));

  const trip = {
    id: params.id,
    origin,
    destination,
    departure: params.id.endsWith("0700") ? "07:00" : params.id.endsWith("0900") ? "09:00" : "13:00",
    duration: "4h 30m",
    price: 28000,
    seats: 32,
    taken: [10, 12, 19, 24],
  };

  const [selected, setSelected] = useState<number[]>([]);

  function goCheckout() {
    if (selected.length !== passengers) return;
    const q = new URLSearchParams({
      id: trip.id,
      origin,
      destination,
      date,
      passengers: String(passengers),
      seats: selected.join(","),
    });
    router.push(`/checkout?${q.toString()}`);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900">{trip.origin} → {trip.destination}</h2>
        <p className="text-slate-600">Sale {trip.departure} · {trip.duration} · Fecha {date}</p>
        <p className="text-slate-600">Pasajeros: {passengers}</p>
        <p className="text-green-700 font-bold mt-2">Precio: ${trip.price.toLocaleString("es-CO")}</p>
      </div>

      <SeatPicker totalSeats={trip.seats} taken={trip.taken} passengers={passengers} onChange={setSelected} />

      <button
        onClick={goCheckout}
        disabled={selected.length !== passengers}
        className="btn btn-primary w-full disabled:opacity-50"
      >
        Continuar con la compra
      </button>
      <p className="text-xs text-slate-500 text-center">
        Selecciona exactamente {passengers} asiento(s). Elegidos: {selected.join(", ") || "ninguno"}.
      </p>
    </div>
  );
}
