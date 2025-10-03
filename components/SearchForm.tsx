'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchForm() {
  const router = useRouter();

  const [origin, setOrigin] = useState('Bogotá');
  const [destination, setDestination] = useState('Girardot');
  const [date, setDate] = useState<string>(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [passengers, setPassengers] = useState<number>(1);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams({
      origin,
      destination,
      date,
      passengers: String(passengers),
    }).toString();
    router.push(`/search?${q}`);
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-4xl space-y-4 md:space-y-0 md:grid md:grid-cols-4 md:gap-4">
      {/* Origen */}
      <input
        className="input"
        placeholder="Origen"
        value={origin}
        onChange={(e) => setOrigin(e.target.value)}
      />

      {/* Destino */}
      <input
        className="input"
        placeholder="Destino"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />

      {/* Fecha */}
      <input
        type="date"
        className="input"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* Pasajeros (SELECT, confiable en móvil) */}
      <select
        className="input"
        aria-label="Pasajeros"
        value={passengers}
        onChange={(e) => setPassengers(Number(e.target.value))}
      >
        {[1,2,3,4,5,6].map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>

      {/* Botón */}
      <div className="md:col-span-4">
        <button type="submit" className="btn btn-primary w-full">Buscar buses</button>
      </div>
    </form>
  );
}
