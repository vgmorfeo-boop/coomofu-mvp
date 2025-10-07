"use client";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TicketPage() {
  const router = useRouter();
  const { id } = useParams();
  const searchParams = useSearchParams();
  const selectedHour = searchParams.get("hour");

  const [route, setRoute] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("routes");
    if (saved) {
      const allRoutes = JSON.parse(saved);
      const found = allRoutes.find((r: any) => r.id.toString() === id);
      setRoute(found);
    }
  }, [id]);

  const toggleSeat = (n: number) => {
    if (selectedSeats.includes(n)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== n));
    } else {
      setSelectedSeats([...selectedSeats, n]);
    }
  };

  const handleConfirm = () => {
    if (selectedSeats.length === 0) {
      alert("Por favor selecciona al menos un asiento.");
      return;
    }
    alert(
      `✅ Compra confirmada\nRuta: ${route.origin} → ${route.destination}\nHora: ${selectedHour}\nAsientos: ${selectedSeats.join(
        ", "
      )}`
    );
    router.push("/search");
  };

  if (!route)
    return (
      <main className="p-6 text-center text-gray-600">
        Cargando información...
      </main>
    );

  return (
    <main className="min-h-screen bg-white text-gray-900 p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-2">
        Selecciona tus asientos
      </h1>
      <p className="text-gray-600 mb-4">
        {route.origin} → {route.destination} · {selectedHour}
      </p>

      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto mb-6">
        {Array.from({ length: 20 }).map((_, i) => {
          const n = i + 1;
          const selected = selectedSeats.includes(n);
          return (
            <button
              key={n}
              onClick={() => toggleSeat(n)}
              className={`border rounded-lg py-3 text-center font-semibold ${
                selected
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-green-100"
              }`}
            >
              {n}
            </button>
          );
        })}
      </div>

      <div className="text-center">
        <button
          onClick={handleConfirm}
          className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-md"
        >
          Confirmar compra
        </button>
      </div>
    </main>
  );
}
