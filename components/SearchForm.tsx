"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { stations } from "@/lib/data/trips";

export default function SearchForm() {
  const router = useRouter();
  const [origin, setOrigin] = useState("Bogotá");
  const [destination, setDestination] = useState("Girardot");
  const [date, setDate] = useState<string>(() => {
    const d = new Date();
    const iso = d.toISOString().slice(0, 10);
    return iso;
  });
  const [passengers, setPassengers] = useState(1);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      origin, destination, date, passengers: String(passengers),
    });
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form onSubmit={onSubmit} className="card grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label className="block text-xs mb-2 text-slate-400">Origen</label>
        <select value={origin} onChange={e => setOrigin(e.target.value)} className="w-full rounded-xl bg-slate-900 border border-slate-800 p-3">
          {stations.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs mb-2 text-slate-400">Destino</label>
        <select value={destination} onChange={e => setDestination(e.target.value)} className="w-full rounded-xl bg-slate-900 border border-slate-800 p-3">
          {stations.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs mb-2 text-slate-400">Fecha</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full rounded-xl bg-slate-900 border border-slate-800 p-3" />
      </div>
      <div>
        <label className="block text-xs mb-2 text-slate-400">Pasajeros</label>
        <input type="number" min={1} max={6} value={passengers} onChange={e => setPassengers(Number(e.target.value))} className="w-full rounded-xl bg-slate-900 border border-slate-800 p-3" />
      </div>
      <div className="md:col-span-4">
        <button className="btn btn-primary w-full md:w-auto">Buscar buses</button>
      </div>
    </form>
  );
}
