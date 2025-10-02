"use client";

import { useMemo, useState } from "react";

type Pax = { nombre: string; documento: string; telefono: string; email: string };

export default function CheckoutPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const id = String(searchParams.id || "");
  const origin = String(searchParams.origin || "Bogotá");
  const destination = String(searchParams.destination || "Girardot");
  const date = String(searchParams.date || "");
  const passengers = Math.max(1, Number(searchParams.passengers || 1));
  const seats = String(searchParams.seats || "").split(",").filter(Boolean).map(Number);

  const price = 28000;
  const total = price * passengers;

  const [paxs, setPaxs] = useState<Pax[]>(
    Array.from({ length: passengers }, () => ({ nombre: "", documento: "", telefono: "", email: "" }))
  );

  function setField(i: number, field: keyof Pax, value: string) {
    setPaxs(prev => prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)));
  }

  const allValid = useMemo(() =>
    paxs.every(p => p.nombre && p.documento && p.telefono && p.email.includes("@")) &&
    seats.length === passengers
  , [paxs, seats, passengers]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-900">Resumen de compra</h2>
        <p className="text-slate-600">{origin} → {destination} · {date} · Viaje: {id}</p>
        <p className="text-slate-600">Asientos: {seats.join(", ") || "—"} · Pasajeros: {passengers}</p>
        <p className="text-green-700 font-bold mt-2">Total: ${total.toLocaleString("es-CO")}</p>
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold">Datos de pasajeros</h3>
        {paxs.map((p, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input className="input" placeholder={`Nombre pasajero ${i+1}`} value={p.nombre} onChange={e=>setField(i,"nombre",e.target.value)} />
            <input className="input" placeholder="Documento" value={p.documento} onChange={e=>setField(i,"documento",e.target.value)} />
            <input className="input" placeholder="Teléfono" value={p.telefono} onChange={e=>setField(i,"telefono",e.target.value)} />
            <input className="input" placeholder="Email" value={p.email} onChange={e=>setField(i,"email",e.target.value)} />
          </div>
        ))}
        <p className="text-xs text-slate-500">* Demo: los datos no se envían a ningún servicio.</p>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-3">Medios de pago (Demo)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="btn btn-primary opacity-60 cursor-not-allowed">PSE</button>
          <button className="btn btn-primary opacity-60 cursor-not-allowed">Tarjeta</button>
          <button className="btn btn-primary opacity-60 cursor-not-allowed">Nequi</button>
          <button className="btn btn-primary opacity-60 cursor-not-allowed">Daviplata</button>
        </div>
        <p className="text-xs text-slate-500 mt-3">* En producción se integra pasarela (e.g., PlacetoPay/Wompi) y QR de tiquete.</p>
      </div>

      <button disabled={!allValid} className="btn btn-primary w-full disabled:opacity-50">
        Confirmar (Demo)
      </button>
    </div>
  );
}
