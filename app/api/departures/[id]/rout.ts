import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { sql } from "@vercel/postgres";

const redis = Redis.fromEnv(); // UPSTASH_REDIS_REST_URL/TOKEN

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const departureId = params.id;
  const { seats, holdSeconds = 300 } = await req.json(); // ["S01","S02"]

  // Intenta bloquear cada asiento con SETNX-like y TTL
  const locked: string[] = [];
  for (const seat of seats) {
    const key = `lock:${departureId}:${seat}`;
    const ok = await redis.set(key, "1", { nx: true, ex: holdSeconds });
    if (ok) locked.push(seat);
  }

  // Refleja en BD el LOCK (opcional, para auditoría)
  if (locked.length) {
    await sql`
      UPDATE inventory 
      SET status='LOCKED', locked_until=now() + make_interval(secs => ${holdSeconds})
      WHERE departure_id=${departureId} AND seat_code = ANY(${locked});
    `;
  }

  return NextResponse.json({ locked });
}
