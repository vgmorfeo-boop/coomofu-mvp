// app/search/page.tsx
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Fuerza render dinámico (evita el intento de export estático)
export const dynamic = 'force-dynamic';

function SearchResults() {
  const params = useSearchParams();
  const origin = params.get('origin') ?? '';
  const destination = params.get('destination') ?? '';
  const date = params.get('date') ?? '';
  const passengers = Number(params.get('passengers') ?? '1');

  // Aquí arma tus resultados como ya lo tenías (mock/trips filtrados, etc.)
  // Por ahora dejo una UI mínima de ejemplo:
  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-semibold">
        Resultados: {origin || '—'} → {destination || '—'} ({date || '—'}) · Pasajeros: {passengers}
      </h1>

      {/* Ejemplo: lista de “viajes” */}
      <div className="space-y-4">
        {[{ id: 'T-BOG-GIR-0700', time: '07:00', price: 28000 }].map((trip) => (
          <div key={trip.id} className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <div className="font-medium">{origin} → {destination}</div>
              <div className="text-sm text-slate-500">Sale {trip.time}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-lg font-semibold">$ {trip.price.toLocaleString('es-CO')}</div>
              <Link
                href={`/trip/${trip.id}?date=${encodeURIComponent(date)}&passengers=${passengers}`}
                className="btn btn-primary"
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

export default function Page() {
  return (
    <Suspense fallback={<div className="max-w-5xl mx-auto p-6">Cargando resultados…</div>}>
      <SearchResults />
    </Suspense>
  );
}
