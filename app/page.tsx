"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [origin, setOrigin] = useState("Bogotá");
  const [destination, setDestination] = useState("Girardot");
  const [date, setDate] = useState("2025-10-02");
  const [passengers, setPassengers] = useState(1);

  function goSearch() {
    const q = new URLSearchParams({
      origin,
      destination,
      date,
      passengers: String(passengers),
    });
    router.push(`/search?${q.toString()}`);
  }

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-12">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900">
          Compra tus <span className="text-coomofu-blue">tiquetes</span> intermunicipales
        </h1>
        <p className="mt-3 text-slate-600">
          Elige tu ruta, selecciona varios asientos y confirma tu viaje. Sin filas.
        </p>
      </section>

      {/* Buscador */}
      <section className="card max-w-3xl mx-auto space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input value={origin} onChange={e=>setOrigin(e.target.value)} placeholder="Origen" className="input" />
          <input value={destination} onChange={e=>setDestination(e.target.value)} placeholder="Destino" className="input" />
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="input" />
          <input type="number" min={1} max={6} value={passengers} onChange={e=>setPassengers(Math.max(1, Number(e.target.value||1)))} placeholder="Pasajeros" className="input" />
        </div>
        <button onClick={goSearch} className="btn btn-primary w-full">Buscar buses</button>
      </section>
    </div>
  );
}
