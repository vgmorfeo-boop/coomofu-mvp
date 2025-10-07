import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // clave en dev Windows
});

export async function GET() {
  try {
    const client = await pool.connect();
    const r = await client.query("SELECT 1 AS ok;");
    client.release();
    return NextResponse.json({ ok: true, result: r.rows[0] });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "DB_ERROR", details: [String(err?.message ?? err)] },
      { status: 500 }
    );
  }
}
