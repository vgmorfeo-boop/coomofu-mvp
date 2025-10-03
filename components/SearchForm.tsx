'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchForm() {
  const router = useRouter();

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState<number>(1);

  // hoy como mínimo
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const minDate = `${yyyy}-${mm}-${dd}`;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const qs = new URLSearchParams({
      origin: origin || '',
      destination: destination || '',
      date: date || '',
      passengers: String(passengers),
    });
    router.push(`/search?${qs.toString()}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto grid w-full max-w-5xl gap-4 rounded-2xl border border-slate-200 bg-white/90 p-4 sm:grid-cols-2 lg:grid-cols-5"
    >
      {/* Origen */}
      <input
        aria-label="Origen"
        placeholder="Origen"
        className="h-11 w-full rounded-xl border border-slate-300 px-3 outline-none focus:border-coomofu-blue"
        value={origin}
        onChange={(e) => setOrigin(e.target.value)}
      />

      {/* Destino */}
      <input
        aria-label="Destino"
        placeholder="Destino"
        className="h-11 w-full rounded-xl border border-slate-300 px-3 outline-none focus:border-coomofu-blue"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />

      {/* Fecha */}
      <input
        type="date"
        aria-label="Fecha"
        className="h-11 w-full rounded-xl border border-slate-300 px-3 outline-none focus:border-coomofu-blue"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        min={minDate}
      />

      {/* Pasajeros — SELECT nativo (mejor en móvil) */}
      <select
        aria-label="Pasajeros"
        className="h-11 w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-3 outline-none focus:border-coomofu-blue"
        value={passengers}
        onChange={(e) => setPassengers(Number(e.target.value))}
      >
        {[1,2,3,4,5,6,7,8,9,10].map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>

      {/* Botón */}
      <button
        type="submit"
        className="h-11 w-full rounded-xl bg-[#166534] text-white transition hover:opacity-95 lg:col-span-1 sm:col-span-2"
      >
        Buscar buses
      </button>
    </form>
  );
}
