export default function ConfirmPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const raw = (searchParams.data as string | undefined) || "";
  let data: any = null;
  try { data = JSON.parse(raw); } catch {}

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold">¡Solicitud registrada (Demo)!</h2>
        <p className="text-slate-300 mt-2">
          Esta es una confirmación de demostración. En la versión real, aquí se generaría el tiquete y el QR.
        </p>
      </div>

      {data && (
        <div className="card text-sm space-y-2">
          <div className="text-slate-400">Resumen</div>
          <div>Viaje: <b>{data.tripId}</b> · Fecha: <b>{data.date}</b></div>
          <div>Asientos: <b>{(data.seats || []).join(", ")}</b> · Pasajeros: <b>{data.passengers}</b></div>
          <div>Total: <b>{(data.total || 0).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })}</b></div>
          <div className="mt-2 text-slate-400">Pasajeros:</div>
          <ul className="list-disc pl-5">
            {(data.paxs || []).map((p: any, i: number) => (
              <li key={i}>{p.nombre} · CC {p.documento} · {p.telefono} · {p.email}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
