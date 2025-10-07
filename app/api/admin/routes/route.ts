// app/api/admin/routes/route.ts

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import { Pool } from "pg";

// Usa SIEMPRE el Pooler de Supabase en Vercel (puerto 6543) y define DATABASE_URL en Vercel
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Con el Pooler basta con true; evita problemas de certificados en Vercel
  ssl: true,
});

// Validador muy simple para números
function toInt(v: unknown, def?: number) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : def;
}

/**
 * GET /api/admin/routes
 * Lista las rutas guardadas
 */
export async function GET() {
  try {
    const client = await pool.connect();
    try {
      const sql = `
        SELECT id, origin, destination,
               duration_minutes AS "durationMinutes",
               price_cop        AS "priceCop",
               frequency_minutes AS "frequencyMinutes",
               first_hour       AS "firstHour",
               last_hour        AS "lastHour",
               status
        FROM routes
        ORDER BY origin, destination
      `;
      const { rows } = await client.query(sql);
      return NextResponse.json({ ok: true, data: rows });
    } finally {
      client.release();
    }
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "DB_ERROR", details: [String(err?.message ?? err)] },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/routes
 * Crea una nueva ruta
 * Body JSON esperado:
 * {
 *   "origin": "Bogotá",
 *   "destination": "Girardot",
 *   "durationMinutes": 300,
 *   "priceCop": 28000,
 *   "frequencyMinutes": 60,
 *   "firstHour": 5,
 *   "lastHour": 21,
 *   "status": "ACTIVE"
 * }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const origin = String(body?.origin ?? "").trim();
    const destination = String(body?.destination ?? "").trim();

    const durationMinutes   = toInt(body?.durationMinutes);
    const priceCop          = toInt(body?.priceCop);
    const frequencyMinutes  = toInt(body?.frequencyMinutes);
    const firstHour         = toInt(body?.firstHour);
    const lastHour          = toInt(body?.lastHour);
    const status            = String(body?.status ?? "ACTIVE").trim() || "ACTIVE";

    // Validaciones mínimas
    if (!origin || !destination) {
      return NextResponse.json(
        { ok: false, error: "VALIDATION_ERROR", details: ["origin y destination son requeridos"] },
        { status: 400 }
      );
    }
    if (
      durationMinutes == null || priceCop == null || frequencyMinutes == null ||
      firstHour == null || lastHour == null
    ) {
      return NextResponse.json(
        { ok: false, error: "VALIDATION_ERROR", details: ["Campos numéricos inválidos o faltantes"] },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const insertSQL = `
        INSERT INTO routes
          (origin, destination, duration_minutes, price_cop,
           frequency_minutes, first_hour, last_hour, status)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING id
      `;
      const values = [
        origin,
        destination,
        durationMinutes,
        priceCop,
        frequencyMinutes,
        firstHour,
        lastHour,
        status,
      ];

      const { rows } = await client.query(insertSQL, values);
      return NextResponse.json({ ok: true, id: rows[0]?.id ?? null }, { status: 201 });
    } finally {
      client.release();
    }
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "DB_ERROR", details: [String(err?.message ?? err)] },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/routes?id=UUID
 * Borra una ruta por id (opcional para tu admin)
 */
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { ok: false, error: "VALIDATION_ERROR", details: ["id es requerido"] },
        { status: 400 }
      );
    }

    const client = await pool.connect();
    try {
      const { rowCount } = await client.query(`DELETE FROM routes WHERE id = $1`, [id]);
      return NextResponse.json({ ok: true, deleted: rowCount });
    } finally {
      client.release();
    }
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "DB_ERROR", details: [String(err?.message ?? err)] },
      { status: 500 }
    );
  }
}
