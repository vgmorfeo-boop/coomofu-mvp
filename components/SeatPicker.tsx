"use client";

import { useEffect, useState } from "react";

type Props = {
  totalSeats: number;
  taken?: number[];
  passengers: number;
  onChange?(seats: number[]): void;
};

export default function SeatPicker({ totalSeats, taken = [], passengers, onChange }: Props) {
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => { onChange?.(selected); }, [selected, onChange]);
  useEffect(() => { setSelected(prev => prev.slice(0, passengers)); }, [passengers]);

  function toggle(n: number) {
    if (taken.includes(n)) return;
    let next = selected.includes(n) ? selected.filter(s => s !== n) : [...selected, n];
    if (next.length > passengers) next = next.slice(0, passengers);
    setSelected(next);
  }

  const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);

  return (
    <div className="card">
      <div className="grid grid-cols-4 gap-3">
        {seats.map((n) => {
          const isTaken = taken.includes(n);
          const isSel = selected.includes(n);
          return (
            <button
              key={n}
              onClick={() => toggle(n)}
              disabled={isTaken}
              className={[
                "h-12 rounded-lg border text-sm font-medium",
                isTaken
                  ? "bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed"
                  : isSel
                  ? "bg-[#166534] border-[#166534] text-white"
                  : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
              ].join(" ")}
            >
              {n}
            </button>
          );
        })}
      </div>
      <div className="mt-3 text-sm text-slate-600">
        Ocupados en gris · Seleccionados en verde · {passengers} asiento(s) requerido(s).
      </div>
    </div>
  );
}
