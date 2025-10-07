// app/admin/routes/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type AdminRoute = {
  id: string;
  origin: string;
  destination: string;
  durationMinutes: number;
  priceCop: number;
  frequencyMinutes: number;
  firstHour: number; // 5 = 05:00
  lastHour: number;  // 21 = 21:00
};

export default function AdminRoutesPage() {
  // ------- UI state -------
  const [routes, setRoutes] = useState<AdminRoute[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  // ------- Form state -------
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(270); // 4h30m
  const [priceCop, setPriceCop] = useState(28000);
  const [frequencyMinutes, setFrequencyMinutes] = useState(60);
  const [firstHour, setFirstHour] = useState(5);
  const [lastHour, setLastHour] = useState(21);

  // Helpers para mostrar etiquetas
  const freqs = useMemo(() => [15, 20, 30, 40, 45, 60, 90, 120], []);
  const hours = useMemo(() => Array.from({ length: 24 }, (_, h) => h), []);

  // ------- Listar rutas (GET) -------
  const loadRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      setOkMsg(null);

      const r = await fetch("/api/admin/routes", { cache: "no-store" });
      const data = await r.json();

      if (!r.ok || !data?.ok) {
        throw new Error(data?.details?.[0] ?? "Error listando rutas");
      }
      setRoutes((data.routes ?? []) as AdminRoute[]);
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  };

  // ------- Crear ruta (POST) -------
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setOkMsg(null);

    try {
      // Validaciones simples
      if (!origin.trim() || !destination.trim()) {
        throw new Error("Origen y destino son obligatorios");
      }
      if (firstHour >= lastHour) {
        throw new Error("La hora inicial debe ser menor a la hora final");
      }

      const res = await fetch("/api/admin/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: origin.trim(),
          destination: destination.trim(),
          durationMinutes: Number(durationMinutes),
          priceCop: Number(priceCop),
          frequencyMinutes: Number(frequencyMinutes),
          firstHour: Number(firstHour),
          lastHour: Number(lastHour),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.details?.[0] ?? "Error creando la ruta");
      }

      setOkMsg("Ruta creada correctamente");
      // Limpia el formulario (opcional)
      // setOrigin(""); setDestination("");
      // Recarga la lista
      await loadRoutes();
    } catch (e: any) {
      setError(String(e?.message ?? e));
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadRoutes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Rutas & Horarios (Administrador)</h1>

      {/* Estado */}
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 text-red-700 p-3">
          {error}
        </div>
      )}
      {okMsg && (
        <div className="rounded-md bg-green-50 border border-green-200 text-green-700 p-3">
          {okMsg}
        </div>
      )}

      {/* Formulario crear ruta */}
      <form
        onSubmit={handleAdd}
        className="rounded-xl border p-4 grid md:grid-cols-2 gap-4 bg-white"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Origen</label>
          <input
            className="w-full border rounded-md px-3 py-2"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="BOGOTA"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Destino</label>
          <input
            className="w-full border rounded-md px-3 py-2"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="GIRARDOT"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Duración (min)
          </label>
          <input
            type="number"
            className="w-full border rounded-md px-3 py-2"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            min={10}
            step={5}
          />
          <p className="text-xs text-gray-500 mt-1">
            Ej: 270 = 4h 30m, 300 = 5h
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Precio (COP)</label>
          <input
            type="number"
            className="w-full border rounded-md px-3 py-2"
            value={priceCop}
            onChange={(e) => setPriceCop(Number(e.target.value))}
            min={0}
            step={500}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Frecuencia (min)
          </label>
          <select
            className="w-full border rounded-md px-3 py-2"
            value={frequencyMinutes}
            onChange={(e) => setFrequencyMinutes(Number(e.target.value))}
          >
            {freqs.map((f) => (
              <option key={f} value={f}>
                {f} min
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Primera hora
            </label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={firstHour}
              onChange={(e) => setFirstHour(Number(e.target.value))}
            >
              {hours.map((h) => (
                <option key={h} value={h}>
                  {String(h).padStart(2, "0")}:00
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Última hora
            </label>
            <select
              className="w-full border rounded-md px-3 py-2"
              value={lastHour}
              onChange={(e) => setLastHour(Number(e.target.value))}
            >
              {hours.map((h) => (
                <option key={h} value={h}>
                  {String(h).padStart(2, "0")}:00
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-md bg-green-700 text-white hover:bg-green-800 disabled:opacity-60"
          >
            {saving ? "Guardando..." : "Agregar ruta"}
          </button>
        </div>
      </form>

      {/* Listado de rutas configuradas */}
      <section className="rounded-xl border bg-white">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Rutas configuradas</h2>
        </div>

        <div className="divide-y">
          {loading && (
            <div className="p-4 text-gray-600">Cargando rutas...</div>
          )}

          {!loading && routes.length === 0 && (
            <div className="p-4 text-gray-600">Sin rutas aún.</div>
          )}

          {!loading &&
            routes.map((r) => (
              <div key={r.id} className="p-4 flex items-center gap-3">
                <div className="flex-1">
                  <p className="font-semibold">
                    {r.origin} → {r.destination}
                  </p>
                  <p className="text-sm text-gray-600">
                    ⏱ {Math.floor(r.durationMinutes / 60)}h{" "}
                    {r.durationMinutes % 60}m · 💰 ${r.priceCop.toLocaleString()} ·
                    🕔 Primer bus {String(r.firstHour).padStart(2, "0")}:00 → 🌙
                    Último {String(r.lastHour).padStart(2, "0")}:00 · ⏳ cada{" "}
                    {r.frequencyMinutes} min
                  </p>
                </div>
              </div>
            ))}
        </div>

        <div className="p-3 text-xs text-gray-500 border-t">
          * Una vez deployado en Vercel, los datos se guardan en tu Postgres
          (Supabase). En local, recuerda tener tu <code>.env.local</code> con
          <code> DATABASE_URL</code>.
        </div>
      </section>
    </main>
  );
}
