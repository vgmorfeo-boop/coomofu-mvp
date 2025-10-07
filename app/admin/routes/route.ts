
import { NextResponse } from "next/server";
import { Pool } from "pg";

/**
 * IMPORTANTE:
 * Debes tener en .env.local:
 *   DATABASE_URL=postgresql://postgres:TU_PASSWORD@aws-1-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require
 * (Ya lo probaste con /api/db-check OK)
 */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true, // con Supabase pooler, basta con true
});

type RoutePayload = {
  origin: string;
  destination: string;
  durationMinutes: number;   // ej: 270 (4h30m)
  priceCop: number;          // ej: 28000
  frequencyMinutes: number;  // ej: 60
  firstHour: number;         // ej: 5  (05:00)
  lastHour: number;          // ej: 21 (21:00)
  status?: "ACTIVE" | "INACTIVE";
};

// ---------- GET: lista de rutas ----------
export async function GET() {
  try {
    const client = await pool.connect();
    const q = `
      SELECT
        id,
        origin,
        destination,
        duration_minutes   AS "durationMinutes",
        price_cop          AS "priceCop",
        frequency_minutes  AS "frequencyMinutes",
        first_hour         AS "firstHour",
        last_hour          AS "lastHour",
        status,
        created_at
      FROM routes
      ORDER BY origin, destination;
    `;
    const r = await client.query(q);
    client.release();

    return NextResponse.json({ ok: true, routes: r.rows });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "DB_ERROR", details: [String(err?.message ?? err)] },
      { status: 500 }
    );
  }
}

// ---------- POST: crear ruta ----------
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<RoutePayload>;

    // Validación mínima
    const required = ["origin", "destination", "durationMinutes", "priceCop", "frequencyMinutes", "firstHour", "lastHour"] as const;
    for (const k of required) {
      if (
        body[k] === undefined ||
        body[k] === null ||
        (typeof body[k] === "string" && body[k]!.toString().trim() === "")
      ) {
        return NextResponse.json(
          { ok: false, error: "VALIDATION_ERROR", details: [`Falta el campo: ${k}`] },
          { status: 400 }
        );
      }
    }

    const payload: RoutePayload = {
      origin: String(body.origin).trim().toUpperCase(),
      destination: String(body.destination).trim().toUpperCase(),
      durationMinutes: Number(body.durationMinutes),
      priceCop: Number(body.priceCop),
      frequencyMinutes: Number(body.frequencyMinutes),
      firstHour: Number(body.firstHour),
      lastHour: Number(body.lastHour),
      status: (body.status as RoutePayload["status"]) ?? "ACTIVE",
    };

    // Reglas simples
    if (payload.firstHour < 0 || payload.firstHour > 23) {
      return NextResponse.json(
        { ok: false, error: "VALIDATION_ERROR", details: ["firstHour debe estar entre 0 y 23"] },
        { status: 400 }
      );
    }
    if (payload.lastHour < 0 || payload.lastHour > 23 || payload.lastHour < payload.firstHour) {
      return NextResponse.json(
        { ok: false, error: "VALIDATION_ERROR", details: ["lastHour debe estar entre 0 y 23 y >= firstHour"] },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    const q = `
      INSERT INTO routes
        (origin, destination, duration_minutes, price_cop, frequency_minutes, first_hour, last_hour, status)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING
        id,
        origin,
        destination,
        duration_minutes   AS "durationMinutes",
        price_cop          AS "priceCop",
        frequency_minutes  AS "frequencyMinutes",
        first_hour         AS "firstHour",
        last_hour          AS "lastHour",
        status,
        created_at;
    `;
    const params = [
      payload.origin,
      payload.destination,
      payload.durationMinutes,
      payload.priceCop,
      payload.frequencyMinutes,
      payload.firstHour,
      payload.lastHour,
      payload.status,
    ];

    const r = await client.query(q, params);
    client.release();

    return NextResponse.json({ ok: true, route: r.rows[0] }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "DB_ERROR", details: [String(err?.message ?? err)] },
      { status: 500 }
    );
  }
}
