import { NextRequest, NextResponse } from "next/server";
import { sql } from "@vercel/postgres"; // o pg/supabase client

export async function GET(req: NextRequest) {
  const origin = req.nextUrl.searchParams.get("origin") ?? "";
  const destination = req.nextUrl.searchParams.get("destination") ?? "";
  const date = req.nextUrl.searchParams.get("date"); // "2025-10-02"

  // 1) Ruta
  const { rows: routes } = await sql`
    SELECT * FROM routes
    WHERE lower(origin)=lower(${origin}) AND lower(destination)=lower(${destination})
      AND status='ACTIVE'
    LIMIT 1;
  `;
  if (routes.length === 0) return NextResponse.json({ departures: [] });

  const route = routes[0];

  // 2) Generar/asegurar salidas (puedes precargarlas por CRON)
  const { rows: deps } = await sql`
    SELECT d.*, 
      (SELECT count(*) FROM inventory i 
         WHERE i.departure_id=d.id AND i.status='FREE') as free_seats
    FROM departures d
    WHERE d.route_id=${route.id} AND d.date=${date}
    ORDER BY d.time ASC;
  `;

  return NextResponse.json({
    route,
    departures: deps.map((d) => ({
      id: d.id,
      time: d.time,              // "05:00:00"
      free: Number(d.free_seats)||0,
      capacity: d.capacity,
      price: route.price_cop,
      duration_minutes: route.duration_minutes,
    })),
  });
}
