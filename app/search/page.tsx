"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

// Tipos simples para lo que guardamos en /admin/routes (localStorage)
type Route = {
  id: string;
  origin: string;
  destination: string;
  duration: string;     // ej: "5 H" o "4h 30m"
  price: number;        // ej: 28000
  firstHour: number;    // ej: 5  -> 05:00
  lastHour: number;     // ej: 21 -> 21:00
  frequency: number;    // ej: 60 (minutos)
};

// Normaliza texto para comparar (sin tildes, minúsculas, trim)
const norm = (s: string) =>
  s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

type Props = {
  searchParams?: {
    origin?: string;
    destination?: string;
    date?: string;
    passengers?: string;
  };
};

export default function SearchPage({ searchParams = {} }: Props) {
  // Leemos lo que viene en la URL
  const originQP = searchParams.origin ?? "";
  const destinationQP = searchParams.destination ?? "";
  const dateQP = searchParams.date ?? "";
  const passengersQP = searchParams.passengers ?? "1";

  // Estado interno (para fallback si entran sin query params)
  const [routes, setRoutes] = useState<Route[]>([]);
  const [results, setResults] = useState<Route[]>([]);
  const [hasQuery, setHasQuery] = useState<boolean>(false);

  // Para fallback: un mini formulario si no vienen parámetros
  const [form, setForm] = useState({
    origin: "",
    destination: "",
  });

  // Cargar rutas configuradas en el admin
  useEffect(() => {
    const saved = localStorage.getItem("routes");
    if (saved) {
      setRoutes(JSON.parse(saved));
    }
  }, []);

  // ¿Vienen parámetros de búsqueda? Si sí, dispara la búsqueda automática
  useEffect(() => {
    const has =
      (originQP?.length ?? 0) > 0 && (destinationQP?.length ?? 0) > 0;
    setHasQuery(has);
  }, [originQP, destinationQP]);

  // Filtro central: encuentra rutas que coinciden con origen/destino
  const runSearch = (origin: string, destination: string) => {
    const qOrigin = norm(origin);
    const qDest = norm(destination);

    const matches = routes.filter((r) => {
      const ro = norm(r.origin);
      const rd = norm(r.destination);
      return ro === qOrigin && rd === qDest;
    });

    setResults(matches);
  };

  // Al tener query params, dispara búsqueda automática
  useEffect(() => {
    if (hasQuery) runSearch(originQP, destinationQP);
  }, [hasQuery, originQP, destinationQP, routes]);

  // Para fallback (sin query params)
  const handleManualSearch = () => {
    if (!form.origin || !form.destination) {
      alert("Ingresa Origen y Destino para buscar.");
      return;
    }
    runSearch(form.origin, form.destination);
  };

  // Genera array de horas en formato "HH:MM" desde firstHour a lastHour cada X minutos
  const buildHours = (first: number, last: number, freq: number) => {
    const hours: string[] = [];
    // de HH:00 a HH:00 (full hours); si quieres granularidad exacta por frecuencia, ajusta aquí
    for (let h = first; h <= last; h++) {
      // Si la frecuencia no es 60, metemos intervalos (0, freq, 2*freq, ...)
      if (freq !== 60) {
        for (let m = 0; m < 60; m += freq) {
          const hh = `${h}`.padStart(2, "0");
          const mm = `${m}`.padStart(2, "0");
          hours.push(`${hh}:${mm}`);
        }
      } else {
        hours.push(`${String(h).padStart(2, "0")}:00`);
      }
    }
    return hours;
  };

  // Resumen superior (solo si vienen query params)
  const Summary = useMemo(() => {
    if (!hasQuery) return null;
    return (
      <div className="mb-6 rounded-xl border bg-gray-50 p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-700">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow">
            <span className="font-semibold text-gray-900">Origen:</span>{" "}
            {originQP}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow">
            <span className="font-semibold text-gray-900">Destino:</span>{" "}
            {destinationQP}
          </span>
          {dateQP && (
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow">
              <span className="font-semibold text-gray-900">Fecha:</span>{" "}
              {dateQP}
            </span>
          )}
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow">
            <span className="font-semibold text-gray-900">Pasajeros:</span>{" "}
            {passengersQP}
          </span>
        </div>
      </div>
    );
  }, [hasQuery, originQP, destinationQP, dateQP, passengersQP]);

  return (
    <main className="min-h-screen bg-white p-6 text-gray-800">
      <h1 className="mb-2 text-3xl font-bold text-green-700">Resultados</h1>
      <p className="mb-6 text-gray-500">
        Elige tu ruta, selecciona un horario y continúa a elegir asientos.
      </p>

      {/* Resumen de la búsqueda si vienen query params */}
      {Summary}

      {/* Fallback: si NO vienen params, muestro un pequeño formulario para buscar */}
      {!hasQuery && (
        <div className="mb-8 rounded-2xl bg-gray-50 p-5 shadow-md">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Origen
              </label>
              <input
                className="w-full rounded-md border px-3 py-2"
                placeholder="Ejemplo: Bogotá"
                value={form.origin}
                onChange={(e) =>
                  setForm((f) => ({ ...f, origin: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Destino
              </label>
              <input
                className="w-full rounded-md border px-3 py-2"
                placeholder="Ejemplo: Girardot"
                value={form.destination}
                onChange={(e) =>
                  setForm((f) => ({ ...f, destination: e.target.value }))
                }
              />
            </div>
          </div>
          <button
            onClick={handleManualSearch}
            className="mt-4 rounded-md bg-green-700 px-5 py-2 font-semibold text-white hover:bg-green-800"
          >
            Buscar buses
          </button>
        </div>
      )}

      {/* Lista vertical de resultados */}
      <section>
        <h2 className="mb-3 text-2xl font-bold text-green-700">
          Resultados disponibles
        </h2>

        {results.length === 0 ? (
          <p className="italic text-gray-500">
            No hay rutas disponibles para esta búsqueda.
          </p>
        ) : (
          <ul className="space-y-4">
            {results.map((r) => {
              const first = Number(r.firstHour ?? 5);
              const last = Number(r.lastHour ?? 21);
              const freq = Number(r.frequency ?? 60);
              const hours = buildHours(first, last, freq);

              return (
                <li
                  key={r.id}
                  className="rounded-xl border bg-gray-50 p-4 shadow-sm"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">
                      {r.origin} <span className="text-gray-500">→</span>{" "}
                      {r.destination}
                    </h3>
                    <span className="text-sm text-gray-500">ID: {r.id}</span>
                  </div>

                  <div className="mb-3 flex flex-wrap items-center gap-4 text-sm text-gray-700">
                    <span className="inline-flex items-center gap-2">
                      ⏱️ <strong>{r.duration || "—"}</strong>
                    </span>
                    <span className="inline-flex items-center gap-2">
                      💰 <strong>${r.price?.toLocaleString("es-CO")}</strong>
                    </span>
                    <span className="inline-flex items-center gap-2">
                      🕔 Primer bus{" "}
                      <strong>{String(first).padStart(2, "0")}:00</strong>
                    </span>
                    <span className="inline-flex items-center gap-2">
                      🌙 Último{" "}
                      <strong>{String(last).padStart(2, "0")}:00</strong>
                    </span>
                    <span className="inline-flex items-center gap-2">
                      🔁 Frecuencia{" "}
                      <strong>
                        {freq} min
                      </strong>
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {hours.map((h, i) => (
                      <Link
                        key={i}
                        href={`/ticket/${encodeURIComponent(
                          r.id
                        )}?hour=${encodeURIComponent(h)}${
                          dateQP ? `&date=${encodeURIComponent(dateQP)}` : ""
                        }&passengers=${encodeURIComponent(passengersQP)}`}
                        className="rounded-md bg-green-100 px-2 py-1 text-xs text-green-800 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                      >
                        {h}
                      </Link>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
