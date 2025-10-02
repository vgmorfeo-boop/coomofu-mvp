import Link from "next/link";

export type TripCardProps = {
  id: string;
  origin: string;
  destination: string;
  date: string;
  departTime: string;
  durationMin: number;
  price: number;
  availableSeats: number;
  passengers: number;
};

function fmtMoney(v: number) {
  return v.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
}

export default function TripCard(props: TripCardProps) {
  const { id, origin, destination, date, departTime, durationMin, price, availableSeats, passengers } = props;

  return (
    <div className="card flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex-1">
        <div className="text-xs uppercase tracking-wide text-slate-400">
          {new Date(date + "T00:00:00").toLocaleDateString("es-CO", { weekday: "long", day: "2-digit", month: "short" })}
        </div>
        <h3 className="text-2xl font-semibold mt-1">
          {origin} <span className="text-slate-500">→</span> {destination}
        </h3>
        <div className="mt-1 flex items-center gap-3 text-sm text-slate-400">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2 py-1">
            ⏱ {Math.round(durationMin/60)}h {durationMin%60}m
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2 py-1">
            🕒 {departTime}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2 py-1">
            💺 {availableSeats} disp.
          </span>
        </div>
      </div>

      <div className="text-center">
        <div className="text-xs text-slate-400">desde</div>
        <div className="text-3xl font-extrabold">{fmtMoney(price)}</div>
      </div>

      <Link
        href={`/trip/${id}?date=${encodeURIComponent(date)}&passengers=${passengers}`}
        className="btn btn-primary w-full md:w-auto"
      >
        Elegir asientos
      </Link>
    </div>
  );
}
